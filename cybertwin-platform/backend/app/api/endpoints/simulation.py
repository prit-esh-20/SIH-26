import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import User, Simulation
from app.core.simulation_engine import simulate_attack, simulate_counterfactual, SCENARIO_DEFS
from app.schemas.simulation import (
    ScenarioResponse,
    SimulationUserResponse,
    SimulationResponse,
    SimulationRequest,
    CounterfactualRequest
)

router = APIRouter()

SCENARIO_DESCRIPTIONS = {
    "credentialLeak": "An attacker obtains a valid user's credentials and uses them to move laterally through the network toward sensitive data.",
    "compromisedAdmin": "A privileged administrative account is compromised, giving the attacker broad reach across the internal network.",
    "malwareInfection": "Malware executes on an endpoint and attempts to spread toward servers.",
    "insiderThreat": "A legitimate user copies and exfiltrates sensitive records from internal systems.",
    "phishing": "A phishing campaign compromises a user session to pivot toward sensitive applications."
}

def _map_to_response(sim: Simulation) -> dict:
    """Maps a SQLAlchemy Simulation record to the camelCase dictionary expected by SimulationResponse."""
    scenario_name = "Threat Simulation"
    scenario_def = SCENARIO_DEFS.get(sim.scenario_id)
    if scenario_def:
        scenario_name = scenario_def["name"]

    risk = sim.risk_score
    if risk >= 90:
        severity = "critical"
    elif risk >= 70:
        severity = "high"
    elif risk >= 40:
        severity = "medium"
    else:
        severity = "low"

    control = sim.additional_control_id or "none"

    return {
        "id": sim.id,
        "scenarioId": sim.scenario_id,
        "scenarioName": scenario_name,
        "userName": sim.user.name if sim.user else "Fictional User",
        "userRole": sim.user.role if sim.user else "Guest",
        "mfa": sim.mfa_enabled,
        "control": control,
        "risk": risk,
        "blastRadius": sim.blast_radius,
        "criticalAssets": sim.critical_assets,
        "records": sim.records,
        "blockedAt": sim.blocked_at,
        "severity": severity,
        "path": sim.path_json,
        "graphContext": sim.context_json,
        "note": sim.note
    }

@router.get("/simulation/scenarios", response_model=list[ScenarioResponse])
def get_scenarios():
    scenarios = []
    for sc_id, sc_val in SCENARIO_DEFS.items():
        scenarios.append({
            "id": sc_id,
            "name": sc_val["name"],
            "description": SCENARIO_DESCRIPTIONS.get(sc_id, "Threat simulation scenario.")
        })
    return scenarios

@router.get("/simulation/users", response_model=list[SimulationUserResponse])
def get_simulation_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/simulations", response_model=list[SimulationResponse])
def get_simulation_history(db: Session = Depends(get_db)):
    simulations = db.query(Simulation).order_by(Simulation.created_at.desc()).all()
    return [_map_to_response(sim) for sim in simulations]

@router.get("/simulations/{id}", response_model=SimulationResponse)
def get_simulation_detail(id: str, db: Session = Depends(get_db)):
    sim = db.query(Simulation).filter(Simulation.id == id).first()
    if not sim:
        raise HTTPException(status_code=404, detail=f"Simulation with ID '{id}' not found")
    return _map_to_response(sim)

@router.post("/simulations", response_model=SimulationResponse)
def run_simulation(request: SimulationRequest, db: Session = Depends(get_db)):
    if request.scenario_id not in SCENARIO_DEFS:
        raise HTTPException(status_code=404, detail=f"Scenario with ID '{request.scenario_id}' not found")

    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID '{request.user_id}' not found")

    sim_id = f"SIM-{random.randint(100000, 999999)}"
    result = simulate_attack(
        scenario_id=request.scenario_id,
        user=user,
        mfa_enabled=request.mfa,
        control=request.control
    )
    result["id"] = sim_id

    db_sim = Simulation(
        id=sim_id,
        organization_id="org-apexfin",
        scenario_id=request.scenario_id,
        user_id=request.user_id,
        mfa_enabled=request.mfa,
        additional_control_id=None if request.control == "none" else request.control,
        is_counterfactual=False,
        parent_simulation_id=None,
        risk_score=result["risk"],
        blast_radius=result["blastRadius"],
        critical_assets=result["criticalAssets"],
        records=result["records"],
        blocked_at=result["blockedAt"],
        path_json=result["path"],
        context_json=result["graphContext"],
        note=result["note"]
    )

    try:
        db.add(db_sim)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database transaction failed: {e}")

    db.refresh(db_sim)
    return _map_to_response(db_sim)

@router.post("/simulations/counterfactual", response_model=SimulationResponse)
def run_counterfactual_simulation(request: CounterfactualRequest, db: Session = Depends(get_db)):
    if request.scenario_id not in SCENARIO_DEFS:
        raise HTTPException(status_code=404, detail=f"Scenario with ID '{request.scenario_id}' not found")

    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID '{request.user_id}' not found")

    # Find matching parent simulation
    parent_sim = db.query(Simulation).filter(
        Simulation.scenario_id == request.scenario_id,
        Simulation.user_id == request.user_id,
        Simulation.mfa_enabled == request.mfa,
        Simulation.additional_control_id == (None if request.control == "none" else request.control),
        Simulation.is_counterfactual == False
    ).order_by(Simulation.created_at.desc()).first()

    parent_id = parent_sim.id if parent_sim else None

    sim_id = f"SIM-{random.randint(100000, 999999)}"
    result = simulate_counterfactual(
        scenario_id=request.scenario_id,
        user=user,
        mfa_enabled=request.mfa,
        control=request.control,
        control_id=request.control_id
    )
    result["id"] = sim_id

    db_sim = Simulation(
        id=sim_id,
        organization_id="org-apexfin",
        scenario_id=request.scenario_id,
        user_id=request.user_id,
        mfa_enabled=result["mfa"],
        additional_control_id=None if result["control"] == "none" else result["control"],
        is_counterfactual=True,
        parent_simulation_id=parent_id,
        risk_score=result["risk"],
        blast_radius=result["blastRadius"],
        critical_assets=result["criticalAssets"],
        records=result["records"],
        blocked_at=result["blockedAt"],
        path_json=result["path"],
        context_json=result["graphContext"],
        note=result["note"]
    )

    try:
        db.add(db_sim)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database transaction failed: {e}")

    db.refresh(db_sim)
    return _map_to_response(db_sim)

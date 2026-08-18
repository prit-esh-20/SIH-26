import random
import httpx
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import User, Simulation, BlockchainEvidence
from app.core.simulation_engine import simulate_attack, simulate_counterfactual, SCENARIO_DEFS
from app.schemas.simulation import (
    ScenarioResponse,
    SimulationUserResponse,
    SimulationResponse,
    SimulationRequest,
    CounterfactualRequest
)
from app.api.endpoints.ml import USER_BEHAVIORAL_PROFILES, DEFAULT_BEHAVIOR

router = APIRouter()

def _record_to_blockchain(sim_id: str, scenario_id: str, user_id: str, db: Session, risk_val: int):
    profile = USER_BEHAVIORAL_PROFILES.get(user_id, DEFAULT_BEHAVIOR)
    ml_payload = {
        "user_id": user_id,
        **profile
    }

    ml_res = None
    try:
        with httpx.Client() as client:
            ml_response = client.post("http://127.0.0.1:8001/predict", json=ml_payload, timeout=5.0)
            if ml_response.status_code == 200:
                ml_res = ml_response.json()
            else:
                print(f"Blockchain audit skipped for simulation {sim_id} because ML prediction service was unavailable.")
                return
    except Exception as e:
        print(f"Blockchain audit skipped for simulation {sim_id} because ML prediction service was unavailable.")
        return

    if not ml_res:
        print(f"Blockchain audit skipped for simulation {sim_id} because ML prediction service was unavailable.")
        return

    try:
        with httpx.Client() as client:
            bc_response = client.post("http://127.0.0.1:8002/record", json=ml_res, timeout=5.0)
            if bc_response.status_code == 200:
                bc_data = bc_response.json()
                timestamp_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M UTC")

                try:
                    db_bc = BlockchainEvidence(
                        simulation_id=sim_id,
                        event=f"{ml_res['risk_level']} Risk Event",
                        timestamp=timestamp_str,
                        integrity="Verified",
                        hash=bc_data.get("eventId", ""),
                        ledger="Confirmed",
                        block=0,
                        description=f"Transaction hash: {bc_data.get('transactionHash', '')}"
                    )
                    db.add(db_bc)
                    db.commit()
                    print(f"Successfully recorded simulation {sim_id} on blockchain.")
                except Exception as db_err:
                    db.rollback()
                    print(f"Database write failed for blockchain evidence mapping for simulation {sim_id}: {db_err}")
            else:
                print(f"Blockchain wrapper returned error status {bc_response.status_code}: {bc_response.text}")
    except Exception as e:
        print(f"Blockchain record failed for simulation {sim_id}: {e}")

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

    _record_to_blockchain(sim_id, request.scenario_id, request.user_id, db, result["risk"])

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

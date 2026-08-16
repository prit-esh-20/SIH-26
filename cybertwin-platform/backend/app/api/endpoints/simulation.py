import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import User
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
    return result

@router.post("/simulations/counterfactual", response_model=SimulationResponse)
def run_counterfactual_simulation(request: CounterfactualRequest, db: Session = Depends(get_db)):
    if request.scenario_id not in SCENARIO_DEFS:
        raise HTTPException(status_code=404, detail=f"Scenario with ID '{request.scenario_id}' not found")

    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID '{request.user_id}' not found")

    sim_id = f"SIM-{random.randint(100000, 999999)}"
    result = simulate_counterfactual(
        scenario_id=request.scenario_id,
        user=user,
        mfa_enabled=request.mfa,
        control=request.control,
        control_id=request.control_id
    )
    result["id"] = sim_id
    return result

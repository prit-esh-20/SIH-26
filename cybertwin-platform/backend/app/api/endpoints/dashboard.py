from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Asset, SecurityControl
from app.schemas.dashboard import DashboardKpiResponse

router = APIRouter()

@router.get("/kpis", response_model=list[DashboardKpiResponse])
def get_kpis(db: Session = Depends(get_db)):
    # 1. Overall Risk calculation
    reductions = {
        "mfa": 6,
        "endpointProtection": 3,
        "networkSegmentation": 2,
        "leastPrivilege": 2,
        "passwordPolicy": 1,
        "vpnAuthentication": 3,
    }
    
    base_score = 83
    controls_in_db = db.query(SecurityControl).all()
    
    if not controls_in_db:
        # Fallback default: all except MFA enabled
        subtraction = (
            reductions["endpointProtection"]
            + reductions["networkSegmentation"]
            + reductions["leastPrivilege"]
            + reductions["passwordPolicy"]
            + reductions["vpnAuthentication"]
        )
        mfa_enabled = False
    else:
        subtraction = 0
        mfa_enabled = False
        for c in controls_in_db:
            if c.id == "mfa":
                mfa_enabled = c.enabled
            if c.enabled:
                subtraction += reductions.get(c.id, 0)
                
    score = max(0, base_score - subtraction)
    
    if score >= 90:
        status = "Critical"
        status_tone = "critical"
    elif score >= 70:
        status = "High"
        status_tone = "high"
    elif score >= 40:
        status = "Medium"
        status_tone = "warning"
    else:
        status = "Low"
        status_tone = "low"
        
    overall_risk_kpi = {
        "id": "overall-risk",
        "label": "Overall Risk",
        "value": score,
        "unit": "/ 100",
        "status": status,
        "status_tone": status_tone,
    }
    
    # 2. Assets count calculation
    assets_count = db.query(Asset).count()
    assets_kpi = {
        "id": "assets",
        "label": "Assets",
        "value": assets_count,
        "unit": "",
        "status": "Monitored",
        "status_tone": "info",
    }
    
    # 3. Critical Assets calculation
    total_critical = db.query(Asset).filter(Asset.criticality == "Critical").count()
    exposed = 1 if mfa_enabled else 3
    protected = max(0, total_critical - exposed)
    
    critical_assets_kpi = {
        "id": "critical-assets",
        "label": "Critical Assets",
        "value": total_critical,
        "unit": "",
        "status": f"Protected: {protected}",
        "status_tone": "success",
    }
    
    # 4. Attack Paths
    # TODO: This is temporary placeholder data and must later be replaced by the attack-path/simulation module.
    attack_paths_kpi = {
        "id": "attack-paths",
        "label": "Attack Paths",
        "value": 14,
        "unit": "",
        "status": "High-risk: 5",
        "status_tone": "warning",
    }
    
    return [overall_risk_kpi, assets_kpi, critical_assets_kpi, attack_paths_kpi]

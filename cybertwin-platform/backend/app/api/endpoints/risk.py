from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import SecurityControl, Asset
from app.schemas.risk import (
    AttackPathResponse,
    TopRiskResponse,
    CategoryResponse,
    RiskOverviewResponse,
    SecurityEventResponse
)

router = APIRouter()

STATIC_ATTACK_PATHS = [
    {
        "id": "path-credential",
        "name": "Credential Leak",
        "path": ["Finance Analyst", "VPN", "Finance Server", "Finance DB"],
        "risk": "High",
        "impact": "Critical",
        "description": "Stolen user credentials reach the Finance database segment."
    },
    {
        "id": "path-admin",
        "name": "Compromised Admin Account",
        "path": ["Admin", "VPN", "Internal Network", "Domain Controller"],
        "risk": "Critical",
        "impact": "Critical",
        "description": "A privileged account grants access to domain infrastructure."
    },
    {
        "id": "path-insider",
        "name": "Insider Data Exfiltration",
        "path": ["HR Manager", "HR Server", "HR Database"],
        "risk": "Medium",
        "impact": "High",
        "description": "Elevated HR access is used to copy personnel records."
    },
    {
        "id": "path-phishing",
        "name": "Phishing Pivot",
        "path": ["User", "Web Server", "Application Server"],
        "risk": "Medium",
        "impact": "High",
        "description": "A compromised session pivots toward internal applications."
    }
]

SECURITY_EVENTS = [
    { "id": 1, "time": "10:42", "event": "Credential leak simulated", "severity": "High", "status": "Simulated" },
    { "id": 2, "time": "10:15", "event": "MFA control enabled", "severity": "Info", "status": "Applied" },
    { "id": 3, "time": "09:58", "event": "Critical asset exposed", "severity": "Critical", "status": "Open" },
    { "id": 4, "time": "09:30", "event": "Attack path blocked", "severity": "Info", "status": "Blocked" },
    { "id": 5, "time": "09:12", "event": "Risk score recalculated", "severity": "Info", "status": "Completed" }
]

CATEGORIES_DEFS = {
    "identity": {
        "name": "Identity Risk",
        "base": 70,
        "deductions": {"passwordPolicy": 2, "vpnAuthentication": 4, "mfa": 4},
        "explanation": "Credential-based access to critical systems relies on weak or missing second-factor authentication.",
        "affectedAssets": ["VPN Gateway", "Web Server"],
        "attackPath": "User → VPN → Finance Server",
        "reason": "MFA is disabled for the Finance Analyst role and password hygiene is uneven.",
        "recommendation": "Enable MFA for all VPN and privileged access.",
        "topRisk": {
            "name": "Credential Exposure",
            "base_score": 86,
            "affectedAssets": ["Finance Server", "Finance Database"],
            "attackPath": "Rahul Sharma → Rahul-Laptop → VPN → Finance Server → Finance Database",
            "reason": "A single leaked credential reaches the Finance segment end-to-end.",
            "recommendedControl": "Enable MFA for VPN access.",
            "control_key": "mfa"
        }
    },
    "network": {
        "name": "Network Risk",
        "base": 88,
        "deductions": {"vpnAuthentication": 5, "networkSegmentation": 5},
        "explanation": "Public-facing gateways are reachable from the internet and internal segments allow broad lateral movement.",
        "affectedAssets": ["Internet Gateway", "VPN Gateway", "Internal Network"],
        "attackPath": "Internet → VPN → Internal Network",
        "reason": "Segmentation exists but the Finance segment remains reachable from user zones.",
        "recommendation": "Enforce strict segmentation between user and critical segments.",
        "topRisk": {
            "name": "Lateral Movement",
            "base_score": 78,
            "affectedAssets": ["VPN Gateway", "Internal Network"],
            "attackPath": "VPN Gateway → Internal Network → Finance Server",
            "reason": "Compromised user sessions can traverse the network without restriction.",
            "recommendedControl": "Add segment-level access rules on the VPN gateway.",
            "control_key": "networkSegmentation"
        }
    },
    "endpoint": {
        "name": "Endpoint Risk",
        "base": 72,
        "deductions": {"endpointProtection": 3},
        "explanation": "Managed devices vary in patch state and several laptops remain out of compliance.",
        "affectedAssets": ["All managed devices"],
        "attackPath": "Device → Corporate Network",
        "reason": "Multiple devices are flagged 'needs review' with outdated operating systems.",
        "recommendation": "Bring all devices to compliance before allowing data access.",
        "topRisk": {
            "name": "Unpatched Endpoint",
            "base_score": 69,
            "affectedAssets": ["Aditya-Laptop", "Ananya-Laptop"],
            "attackPath": "Device → VPN → Internal Network",
            "reason": "Outdated endpoints are a common malware entry point.",
            "recommendedControl": "Enforce patch policy on all managed devices.",
            "control_key": "endpointProtection"
        }
    },
    "application": {
        "name": "Application Risk",
        "base": 64,
        "deductions": {"endpointProtection": 3},
        "explanation": "Application servers host customer data and are reachable from the web tier.",
        "affectedAssets": ["Web Server", "Application Server"],
        "attackPath": "Web Server → Application Server",
        "reason": "The web tier can reach the application server without additional checks.",
        "recommendation": "Apply per-application authentication between tiers.",
        "topRisk": {
            "name": "Web-to-App Pivot",
            "base_score": 61,
            "affectedAssets": ["Web Server", "Application Server"],
            "attackPath": "User → Web Server → Application Server",
            "reason": "A compromised web session can reach application data.",
            "recommendedControl": "Authenticate inter-tier traffic.",
            "control_key": "endpointProtection"
        }
    },
    "data": {
        "name": "Data Risk",
        "base": 85,
        "deductions": {"networkSegmentation": 3},
        "explanation": "Critical financial assets are reachable through the current attack path.",
        "affectedAssets": ["Finance Database", "Finance Server"],
        "attackPath": "Finance Server → Finance Database",
        "reason": "Financial records sit behind the Finance Server with no data-level control.",
        "recommendation": "Apply data-level access controls and encryption.",
        "topRisk": {
            "name": "Sensitive Data Exposure",
            "base_score": 82,
            "affectedAssets": ["Finance Database"],
            "attackPath": "Finance Server → Finance Database",
            "reason": "25,000 financial records are exposed in the credential leak simulation.",
            "recommendedControl": "Enable MFA to block the path at the VPN.",
            "control_key": "networkSegmentation"
        }
    },
    "privilege": {
        "name": "Privilege Risk",
        "base": 75,
        "deductions": {"leastPrivilege": 4},
        "explanation": "Several roles hold broader access than their function requires.",
        "affectedAssets": ["Finance Database", "HR Database"],
        "attackPath": "Role → Data Asset",
        "reason": "Finance analysts retain write access to the full database.",
        "recommendation": "Reduce role access to minimum required permissions.",
        "topRisk": {
            "name": "Excessive Privilege",
            "base_score": 71,
            "affectedAssets": ["Finance Database", "HR Database"],
            "attackPath": "Finance Analyst → Finance Database",
            "reason": "The Finance Analyst role can read the full financial dataset.",
            "recommendedControl": "Apply least privilege to the Finance Analyst role.",
            "control_key": "leastPrivilege"
        }
    }
}

def _get_control_map(db: Session) -> dict:
    controls = db.query(SecurityControl).all()
    if not controls:
        return {
            "mfa": False,
            "endpointProtection": True,
            "networkSegmentation": True,
            "leastPrivilege": True,
            "passwordPolicy": True,
            "vpnAuthentication": True
        }
    return {c.id: c.enabled for c in controls}

def _get_category_response(cat_id: str, cat_def: dict, control_map: dict) -> dict:
    base = cat_def["base"]
    deduction = sum(amount for cid, amount in cat_def["deductions"].items() if control_map.get(cid, False))
    score = max(0, base - deduction)

    if score >= 90:
        severity = "critical"
    elif score >= 70:
        severity = "high"
    elif score >= 40:
        severity = "medium"
    else:
        severity = "low"

    tr_def = cat_def["topRisk"]
    tr_control = tr_def["control_key"]
    tr_base = tr_def["base_score"]
    
    if control_map.get(tr_control, False):
        tr_score = tr_base - 12
    else:
        tr_score = tr_base
    tr_score = min(100, max(score, tr_score))

    if tr_score >= 90:
        tr_severity = "critical"
    elif tr_score >= 70:
        tr_severity = "high"
    elif tr_score >= 40:
        tr_severity = "medium"
    else:
        tr_severity = "low"

    return {
        "id": cat_id,
        "name": cat_def["name"],
        "score": score,
        "severity": severity,
        "explanation": cat_def["explanation"],
        "affectedAssets": cat_def["affectedAssets"],
        "attackPath": cat_def["attackPath"],
        "reason": cat_def["reason"],
        "recommendation": cat_def["recommendation"],
        "topRisk": {
            "name": tr_def["name"],
            "severity": tr_severity,
            "score": tr_score,
            "affectedAssets": tr_def["affectedAssets"],
            "attackPath": tr_def["attackPath"],
            "reason": tr_def["reason"],
            "recommendedControl": tr_def["recommendedControl"]
        }
    }

@router.get("/risk", response_model=RiskOverviewResponse)
def get_risk_overview(db: Session = Depends(get_db)):
    control_map = _get_control_map(db)

    # 1. Posture overall risk
    reductions = {
        "mfa": 6,
        "endpointProtection": 3,
        "networkSegmentation": 2,
        "leastPrivilege": 2,
        "passwordPolicy": 1,
        "vpnAuthentication": 3,
    }
    red_sum = sum(reductions[cid] for cid in reductions if control_map.get(cid, False))
    overall_risk = max(0, 83 - red_sum)

    if overall_risk >= 90:
        severity = "critical"
    elif overall_risk >= 70:
        severity = "high"
    elif overall_risk >= 40:
        severity = "medium"
    else:
        severity = "low"

    # 2. Blast radius
    blast_reductions = {
        "mfa": 6,
        "endpointProtection": 2,
        "networkSegmentation": 3,
        "leastPrivilege": 2,
        "passwordPolicy": 1,
        "vpnAuthentication": 3,
    }
    blast_sum = sum(blast_reductions[cid] for cid in blast_reductions if control_map.get(cid, False))
    blast_radius = max(0, 69 - blast_sum)

    # 3. Critical assets protection
    total_critical = db.query(Asset).filter(Asset.criticality == "Critical").count()
    if total_critical == 0:
        total_critical = 12

    mfa_enabled = control_map.get("mfa", False)
    exposed = 1 if mfa_enabled else 3
    protected_critical = max(0, total_critical - exposed)

    # 4. Categories list
    categories = []
    for cat_id, cat_def in CATEGORIES_DEFS.items():
        categories.append(_get_category_response(cat_id, cat_def, control_map))

    return {
        "overallRisk": overall_risk,
        "severity": severity,
        "blastRadius": blast_radius,
        "criticalAssets": total_critical,
        "protectedCritical": protected_critical,
        "attackSurface": 128,
        "categories": categories
    }

@router.get("/risk/attack-paths", response_model=list[AttackPathResponse])
def get_attack_paths():
    return STATIC_ATTACK_PATHS

@router.get("/risk/categories", response_model=list[CategoryResponse])
def get_risk_categories(db: Session = Depends(get_db)):
    control_map = _get_control_map(db)
    categories = []
    for cat_id, cat_def in CATEGORIES_DEFS.items():
        categories.append(_get_category_response(cat_id, cat_def, control_map))
    return categories

@router.get("/risk/events", response_model=list[SecurityEventResponse])
def get_security_events():
    return SECURITY_EVENTS

@router.get("/risk/{id}", response_model=CategoryResponse)
def get_category_detail(id: str, db: Session = Depends(get_db)):
    if id not in CATEGORIES_DEFS:
        raise HTTPException(status_code=404, detail=f"Category with ID '{id}' not found")
    
    control_map = _get_control_map(db)
    return _get_category_response(id, CATEGORIES_DEFS[id], control_map)

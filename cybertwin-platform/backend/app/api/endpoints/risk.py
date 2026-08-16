from fastapi import APIRouter
from app.schemas.risk import AttackPathResponse

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

@router.get("/risk/attack-paths", response_model=list[AttackPathResponse])
def get_attack_paths():
    return STATIC_ATTACK_PATHS

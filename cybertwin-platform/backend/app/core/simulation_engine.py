import math
from typing import Any, Dict, List, Optional, Union

# Define exact scenario configurations
SCENARIO_DEFS = {
    "credentialLeak": {
        "id": "credentialLeak",
        "name": "Credential Leak",
        "primaryUser": "user-rahul",
        "baseline": {"risk": 86, "blastRadius": 72, "criticalAssets": 4, "records": 25000, "blockedAt": None},
        "mfaOn": {"risk": 21, "blastRadius": 8, "criticalAssets": 0, "records": 0, "blockedAt": "VPN Gateway"},
        "controls": {
            "endpointProtection": {"risk": 52, "blastRadius": 40, "criticalAssets": 2, "records": 10000, "blockedAt": "Finance Server"},
            "networkSegmentation": {"risk": 45, "blastRadius": 30, "criticalAssets": 1, "records": 8000, "blockedAt": "Finance Server"},
            "leastPrivilege": {"risk": 58, "blastRadius": 45, "criticalAssets": 2, "records": 12000, "blockedAt": None},
            "passwordPolicy": {"risk": 62, "blastRadius": 48, "criticalAssets": 2, "records": 14000, "blockedAt": None},
            "vpnAuthentication": {"risk": 55, "blastRadius": 38, "criticalAssets": 2, "records": 9000, "blockedAt": "VPN Gateway"},
        },
        "path": [
            {"id": "node-user", "label": "Rahul Sharma", "type": "user"},
            {"id": "node-laptop", "label": "Rahul-Laptop", "type": "device"},
            {"id": "node-vpn", "label": "VPN Gateway", "type": "network"},
            {"id": "node-fin-server", "label": "Finance Server", "type": "server", "critical": True},
            {"id": "node-fin-db", "label": "Finance Database", "type": "database", "critical": True},
            {"id": "node-data", "label": "Financial Records", "type": "data", "critical": True},
        ],
        "context": [
            {"id": "node-hr-server", "label": "HR Server", "type": "server"},
            {"id": "node-hr-db", "label": "HR Database", "type": "database", "critical": True},
            {"id": "node-backup", "label": "Backup Storage", "type": "storage", "critical": True},
        ]
    },
    "compromisedAdmin": {
        "id": "compromisedAdmin",
        "name": "Compromised Admin Account",
        "primaryUser": "user-neha",
        "baseline": {"risk": 94, "blastRadius": 85, "criticalAssets": 5, "records": 25000, "blockedAt": None},
        "mfaOn": {"risk": 44, "blastRadius": 30, "criticalAssets": 2, "records": 8000, "blockedAt": "Internal Network"},
        "controls": {
            "endpointProtection": {"risk": 62, "blastRadius": 45, "criticalAssets": 3, "records": 12000, "blockedAt": "Domain Controller"},
            "networkSegmentation": {"risk": 58, "blastRadius": 42, "criticalAssets": 3, "records": 10000, "blockedAt": "Domain Controller"},
            "leastPrivilege": {"risk": 70, "blastRadius": 55, "criticalAssets": 4, "records": 16000, "blockedAt": None},
            "passwordPolicy": {"risk": 66, "blastRadius": 50, "criticalAssets": 4, "records": 15000, "blockedAt": None},
            "vpnAuthentication": {"risk": 49, "blastRadius": 35, "criticalAssets": 2, "records": 9000, "blockedAt": "Internal Network"},
        },
        "path": [
            {"id": "node-user", "label": "Neha Kapoor", "type": "user"},
            {"id": "node-admin-laptop", "label": "Admin-Laptop", "type": "device"},
            {"id": "node-vpn", "label": "VPN Gateway", "type": "network"},
            {"id": "node-internal", "label": "Internal Network", "type": "network", "critical": True},
            {"id": "node-dc", "label": "Domain Controller", "type": "server", "critical": True},
        ],
        "context": [
            {"id": "node-fin-db", "label": "Finance Database", "type": "database", "critical": True},
            {"id": "node-hr-db", "label": "HR Database", "type": "database", "critical": True},
            {"id": "node-backup", "label": "Backup Storage", "type": "storage", "critical": True},
        ]
    },
    "malwareInfection": {
        "id": "malwareInfection",
        "name": "Malware Infection",
        "primaryUser": "user-arjun",
        "baseline": {"risk": 68, "blastRadius": 45, "criticalAssets": 2, "records": 8000, "blockedAt": None},
        "mfaOn": {"risk": 58, "blastRadius": 38, "criticalAssets": 2, "records": 7000, "blockedAt": None},
        "controls": {
            "endpointProtection": {"risk": 33, "blastRadius": 15, "criticalAssets": 0, "records": 0, "blockedAt": "Arjun-Laptop"},
            "networkSegmentation": {"risk": 41, "blastRadius": 25, "criticalAssets": 1, "records": 3000, "blockedAt": "Application Server"},
            "leastPrivilege": {"risk": 44, "blastRadius": 28, "criticalAssets": 1, "records": 2000, "blockedAt": "HR Database"},
            "passwordPolicy": {"risk": 55, "blastRadius": 35, "criticalAssets": 1, "records": 5000, "blockedAt": None},
            "vpnAuthentication": {"risk": 56, "blastRadius": 36, "criticalAssets": 1, "records": 6000, "blockedAt": None},
        },
        "path": [
            {"id": "node-user", "label": "Arjun Rao", "type": "user"},
            {"id": "node-arjun-laptop", "label": "Arjun-Laptop", "type": "device"},
            {"id": "node-app", "label": "Application Server", "type": "server", "critical": True},
            {"id": "node-hr-db", "label": "HR Database", "type": "database", "critical": True},
            {"id": "node-data", "label": "Employee Records", "type": "data", "critical": True},
        ],
        "context": [
            {"id": "node-vpn", "label": "VPN Gateway", "type": "network"},
            {"id": "node-web", "label": "Web Server", "type": "server"},
            {"id": "node-fin-db", "label": "Finance Database", "type": "database", "critical": True},
        ]
    },
    "insiderThreat": {
        "id": "insiderThreat",
        "name": "Insider Threat",
        "primaryUser": "user-priya",
        "baseline": {"risk": 74, "blastRadius": 55, "criticalAssets": 3, "records": 12000, "blockedAt": None},
        "mfaOn": {"risk": 66, "blastRadius": 48, "criticalAssets": 2, "records": 10000, "blockedAt": None},
        "controls": {
            "endpointProtection": {"risk": 63, "blastRadius": 44, "criticalAssets": 2, "records": 9000, "blockedAt": None},
            "networkSegmentation": {"risk": 52, "blastRadius": 34, "criticalAssets": 2, "records": 6000, "blockedAt": "HR Database"},
            "leastPrivilege": {"risk": 38, "blastRadius": 22, "criticalAssets": 1, "records": 4000, "blockedAt": "HR Database"},
            "passwordPolicy": {"risk": 58, "blastRadius": 40, "criticalAssets": 2, "records": 8000, "blockedAt": None},
            "vpnAuthentication": {"risk": 60, "blastRadius": 42, "criticalAssets": 2, "records": 8500, "blockedAt": None},
        },
        "path": [
            {"id": "node-user", "label": "Priya Mehta", "type": "user"},
            {"id": "node-priya-laptop", "label": "Priya-Laptop", "type": "device"},
            {"id": "node-hr-server", "label": "HR Server", "type": "server"},
            {"id": "node-hr-db", "label": "HR Database", "type": "database", "critical": True},
            {"id": "node-data", "label": "Employee Records", "type": "data", "critical": True},
        ],
        "context": [
            {"id": "node-vpn", "label": "VPN Gateway", "type": "network"},
            {"id": "node-app", "label": "Application Server", "type": "server", "critical": True},
            {"id": "node-fin-db", "label": "Finance Database", "type": "database", "critical": True},
        ]
    },
    "phishing": {
        "id": "phishing",
        "name": "Phishing Compromise",
        "primaryUser": "user-rahul",
        "baseline": {"risk": 61, "blastRadius": 38, "criticalAssets": 1, "records": 5000, "blockedAt": None},
        "mfaOn": {"risk": 12, "blastRadius": 4, "criticalAssets": 0, "records": 0, "blockedAt": "VPN Gateway"},
        "controls": {
            "endpointProtection": {"risk": 44, "blastRadius": 26, "criticalAssets": 1, "records": 2500, "blockedAt": "Application Server"},
            "networkSegmentation": {"risk": 40, "blastRadius": 22, "criticalAssets": 0, "records": 1500, "blockedAt": "Application Server"},
            "leastPrivilege": {"risk": 36, "blastRadius": 20, "criticalAssets": 0, "records": 1200, "blockedAt": "Finance Database"},
            "passwordPolicy": {"risk": 46, "blastRadius": 28, "criticalAssets": 1, "records": 3000, "blockedAt": None},
            "vpnAuthentication": {"risk": 33, "blastRadius": 16, "criticalAssets": 0, "records": 900, "blockedAt": "VPN Gateway"},
        },
        "path": [
            {"id": "node-user", "label": "Rahul Sharma", "type": "user"},
            {"id": "node-laptop", "label": "Rahul-Laptop", "type": "device"},
            {"id": "node-vpn", "label": "VPN Gateway", "type": "network"},
            {"id": "node-web", "label": "Web Server", "type": "server"},
            {"id": "node-app", "label": "Application Server", "type": "server", "critical": True},
            {"id": "node-fin-db", "label": "Finance Database", "type": "database", "critical": True},
            {"id": "node-data", "label": "Financial Records", "type": "data", "critical": True},
        ],
        "context": [
            {"id": "node-hr-server", "label": "HR Server", "type": "server"},
            {"id": "node-hr-db", "label": "HR Database", "type": "database", "critical": True},
            {"id": "node-backup", "label": "Backup Storage", "type": "storage", "critical": True},
        ]
    }
}

USER_FACTORS = {
    "Critical": 1.1,
    "High": 1.0,
    "Medium": 0.9,
    "Low": 0.75
}

MFA_EXTRA_REDUCTION = {
    "endpointProtection": 0.35,
    "networkSegmentation": 0.45,
    "leastPrivilege": 0.25,
    "passwordPolicy": 0.15,
    "vpnAuthentication": 0.20,
    "none": 0.0
}


def _js_round(value: float) -> int:
    """Replicates JavaScript's Math.round behavior exactly."""
    return math.floor(value + 0.5)


def _get_user_attribute(user: Any, attr: str) -> Optional[str]:
    """Helper to retrieve attribute or key from user dictionary or object."""
    if isinstance(user, dict):
        val = user.get(attr)
        if val is None:
            # check camelCase fallback
            if attr == "access_level":
                val = user.get("accessLevel")
        return val
    else:
        val = getattr(user, attr, None)
        if val is None:
            if attr == "access_level":
                val = getattr(user, "accessLevel", None)
        return val


def _apply_extra_reduction(base_outcome: Dict[str, Any], control: str) -> Dict[str, Any]:
    """Applies extra MFA reductions to base outcome metrics."""
    factor = MFA_EXTRA_REDUCTION.get(control, 0.0)
    if factor == 0.0:
        return base_outcome

    multiplier = 1.0 - factor
    return {
        "risk": max(0, _js_round(base_outcome["risk"] * multiplier)),
        "blastRadius": max(0, _js_round(base_outcome["blastRadius"] * multiplier)),
        "criticalAssets": max(0, _js_round(base_outcome["criticalAssets"] * multiplier)),
        "records": max(0, _js_round(base_outcome["records"] * multiplier)),
        "blockedAt": base_outcome["blockedAt"]
    }


def _build_path(path_nodes: List[Dict[str, Any]], blocked_at: Optional[str]) -> List[Dict[str, Any]]:
    """Builds node compromise states based on blocked location."""
    blocked_index = -1
    if blocked_at:
        for idx, node in enumerate(path_nodes):
            if node["label"] == blocked_at:
                blocked_index = idx
                break

    output_path = []
    for idx, node in enumerate(path_nodes):
        blocked = (idx == blocked_index)
        compromised = (not blocked) and (blocked_index == -1 or idx < blocked_index)
        
        node_copy = node.copy()
        node_copy["compromised"] = compromised
        node_copy["blocked"] = blocked
        output_path.append(node_copy)
        
    return output_path


def simulate_attack(
    scenario_id: str,
    user: Any,
    mfa_enabled: bool,
    control: str = "none"
) -> Dict[str, Any]:
    """
    Executes a deterministic threat simulation attack.
    
    :param scenario_id: The ID of the scenario (e.g. credentialLeak)
    :param user: Dictionary or ORM object with user fields (id, name, role, access_level)
    :param mfa_enabled: Boolean flag showing if MFA is enabled
    :param control: Additional security control ID string
    :return: Dictionary containing the structured simulation result
    """
    scenario_def = SCENARIO_DEFS.get(scenario_id)
    if not scenario_def:
        raise ValueError(f"Unknown scenario ID: '{scenario_id}'")

    user_id = _get_user_attribute(user, "id")
    user_name = _get_user_attribute(user, "name") or "Fictional User"
    user_role = _get_user_attribute(user, "role") or "Guest"
    access_level = _get_user_attribute(user, "access_level") or "High"

    # Step 1: Access Level risk scaling factor
    if user_id == scenario_def["primaryUser"]:
        factor = 1.0
    else:
        factor = USER_FACTORS.get(access_level, 1.0)

    # Step 2: Base config calculation
    mfa_on = bool(mfa_enabled)
    additional_control = control or "none"

    if mfa_on:
        base = scenario_def["mfaOn"]
        base = _apply_extra_reduction(base, additional_control)
    elif additional_control == "mfa":
        base = scenario_def["mfaOn"]
    elif additional_control != "none" and additional_control in scenario_def["controls"]:
        base = scenario_def["controls"][additional_control]
    else:
        base = scenario_def["baseline"]

    # Step 3: Scale metrics by User Factor and round
    risk = max(0, _js_round(base["risk"] * factor))
    blast_radius = max(0, _js_round(base["blastRadius"] * factor))
    critical_assets = max(0, _js_round(base["criticalAssets"] * factor))
    records = max(0, _js_round(base["records"] * factor))
    blocked_at = base["blockedAt"]

    # Step 4: Severity calculation
    if risk >= 90:
        severity = "critical"
    elif risk >= 70:
        severity = "high"
    elif risk >= 40:
        severity = "medium"
    else:
        severity = "low"

    # Step 5: Path building
    path = _build_path(scenario_def["path"], blocked_at)
    graph_context = scenario_def["context"]

    # Step 6: Simulation note
    if blocked_at:
        note = f"Attack path blocked at {blocked_at}."
    else:
        note = "Attack path reached its target. No control stopped the movement."

    # Map control key label representation consistent with audit contract
    result_control = additional_control
    if mfa_on:
        result_control = additional_control
    elif additional_control == "mfa":
        result_control = "mfa"

    return {
        "scenarioId": scenario_def["id"],
        "scenarioName": scenario_def["name"],
        "userName": user_name,
        "userRole": user_role,
        "mfa": mfa_on,
        "control": result_control,
        "risk": risk,
        "blastRadius": blast_radius,
        "criticalAssets": critical_assets,
        "records": records,
        "blockedAt": blocked_at,
        "severity": severity,
        "path": path,
        "graphContext": graph_context,
        "note": note
    }


def simulate_counterfactual(
    scenario_id: str,
    user: Any,
    mfa_enabled: bool,
    control: str,
    control_id: str = "mfa"
) -> Dict[str, Any]:
    """
    Executes a counterfactual simulation.
    
    :param scenario_id: The ID of the scenario
    :param user: User object or dictionary
    :param mfa_enabled: Boolean showing if baseline MFA is enabled
    :param control: Additional security control in current run
    :param control_id: The target control ID applied in counterfactual scenario
    :return: Updated simulation result dictionary
    """
    applied_control = control_id or "mfa"
    
    # If the counterfactual control is MFA, turn MFA on and clear additional control.
    # Otherwise keep MFA as is and set additional control to control_id.
    if applied_control == "mfa":
        next_mfa = True
        next_control = "none" if mfa_enabled else control
    else:
        next_mfa = bool(mfa_enabled)
        next_control = applied_control

    return simulate_attack(
        scenario_id=scenario_id,
        user=user,
        mfa_enabled=next_mfa,
        control=next_control
    )

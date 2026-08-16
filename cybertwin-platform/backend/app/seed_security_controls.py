import sys
import os

# Add parent directory of 'app' to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal
from app.models.models import SecurityControl, Organization

CONTROLS_DATA = [
    {
        "id": "mfa",
        "name": "Multi-Factor Authentication",
        "short_name": "MFA",
        "description": "Requires a second authentication factor at network entry points.",
        "status": "Disabled",
        "impact": "High",
        "risk_reduction": 65,
        "affected_assets": ["VPN Gateway", "Web Server", "Application Server"],
        "default_enabled": False,
        "enabled": False
    },
    {
        "id": "endpointProtection",
        "name": "Endpoint Protection",
        "short_name": "EDR",
        "description": "Endpoint detection and response covering all managed devices.",
        "status": "Enabled",
        "impact": "High",
        "risk_reduction": 34,
        "affected_assets": ["All endpoint devices"],
        "default_enabled": True,
        "enabled": True
    },
    {
        "id": "networkSegmentation",
        "name": "Network Segmentation",
        "short_name": "Segmentation",
        "description": "Isolates business-critical segments from general network traffic.",
        "status": "Enabled",
        "impact": "Medium",
        "risk_reduction": 41,
        "affected_assets": ["Finance Server", "Finance Database", "HR Server", "HR Database"],
        "default_enabled": True,
        "enabled": True
    },
    {
        "id": "leastPrivilege",
        "name": "Least Privilege",
        "short_name": "Least Privilege",
        "description": "Restricts data access to the minimum required by each role.",
        "status": "Enabled",
        "impact": "Medium",
        "risk_reduction": 28,
        "affected_assets": ["Finance Database", "HR Database", "Application Server"],
        "default_enabled": True,
        "enabled": True
    },
    {
        "id": "passwordPolicy",
        "name": "Password Policy",
        "short_name": "Password Policy",
        "description": "Enforces strong, rotated passwords across the organization.",
        "status": "Enabled",
        "impact": "Medium",
        "risk_reduction": 24,
        "affected_assets": ["VPN Gateway", "Email Server"],
        "default_enabled": True,
        "enabled": True
    },
    {
        "id": "vpnAuthentication",
        "name": "VPN Authentication",
        "short_name": "VPN Auth",
        "description": "Validates device posture and identity before remote access.",
        "status": "Enabled",
        "impact": "High",
        "risk_reduction": 46,
        "affected_assets": ["VPN Gateway"],
        "default_enabled": True,
        "enabled": True
    }
]

def seed_security_controls():
    db = SessionLocal()
    try:
        # Verify organization exists to satisfy FK constraint
        org = db.query(Organization).filter(Organization.id == "org-apexfin").first()
        if not org:
            print("ERROR: Organization 'org-apexfin' not found in database. Seed organization first.")
            return

        seeded_count = 0
        skipped_count = 0
        for item in CONTROLS_DATA:
            existing = db.query(SecurityControl).filter(SecurityControl.id == item["id"]).first()
            if existing:
                skipped_count += 1
                continue

            control = SecurityControl(
                id=item["id"],
                organization_id="org-apexfin",
                name=item["name"],
                short_name=item["short_name"],
                description=item["description"],
                status=item["status"],
                impact=item["impact"],
                risk_reduction=item["risk_reduction"],
                affected_assets=item["affected_assets"],
                default_enabled=item["default_enabled"],
                enabled=item["enabled"]
            )
            db.add(control)
            seeded_count += 1

        if seeded_count > 0:
            db.commit()
            print(f"SUCCESS: Seeded {seeded_count} security control records. Skipped {skipped_count} pre-existing records.")
        else:
            print(f"INFO: All {skipped_count} security controls already exist. Skipping seed.")
    except Exception as e:
        db.rollback()
        print(f"ERROR: Seeding security controls failed: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_security_controls()

import sys
import os

# Add parent directory of 'app' to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal
from app.models.models import User, Organization

USERS_DATA = [
    {
        "id": "user-rahul",
        "name": "Rahul Sharma",
        "department": "Finance",
        "role": "Finance Analyst",
        "device_name": "Rahul-Laptop",
        "access_level": "Medium",
        "mfa": "Disabled",
        "risk": "High",
        "status": "Active"
    },
    {
        "id": "user-priya",
        "name": "Priya Mehta",
        "department": "HR",
        "role": "HR Manager",
        "device_name": "Priya-Laptop",
        "access_level": "High",
        "mfa": "Enabled",
        "risk": "Medium",
        "status": "Active"
    },
    {
        "id": "user-arjun",
        "name": "Arjun Rao",
        "department": "Engineering",
        "role": "Software Engineer",
        "device_name": "Arjun-Laptop",
        "access_level": "Medium",
        "mfa": "Enabled",
        "risk": "Low",
        "status": "Active"
    },
    {
        "id": "user-neha",
        "name": "Neha Kapoor",
        "department": "IT",
        "role": "System Administrator",
        "device_name": "Admin-Laptop",
        "access_level": "Critical",
        "mfa": "Enabled",
        "risk": "High",
        "status": "Active"
    },
    {
        "id": "user-vikram",
        "name": "Vikram Singh",
        "department": "Finance",
        "role": "Senior Finance Analyst",
        "device_name": "Vikram-Laptop",
        "access_level": "High",
        "mfa": "Enabled",
        "risk": "Medium",
        "status": "Active"
    },
    {
        "id": "user-ananya",
        "name": "Ananya Iyer",
        "department": "HR",
        "role": "HR Executive",
        "device_name": "Ananya-Laptop",
        "access_level": "Medium",
        "mfa": "Disabled",
        "risk": "Low",
        "status": "Active"
    },
    {
        "id": "user-karan",
        "name": "Karan Malhotra",
        "department": "Engineering",
        "role": "DevOps Engineer",
        "device_name": "Karan-Laptop",
        "access_level": "High",
        "mfa": "Enabled",
        "risk": "High",
        "status": "Active"
    },
    {
        "id": "user-sneha",
        "name": "Sneha Reddy",
        "department": "IT",
        "role": "Security Analyst",
        "device_name": "Sneha-Laptop",
        "access_level": "High",
        "mfa": "Enabled",
        "risk": "Medium",
        "status": "Active"
    },
    {
        "id": "user-aditya",
        "name": "Aditya Nair",
        "department": "Finance",
        "role": "Finance Manager",
        "device_name": "Aditya-Laptop",
        "access_level": "High",
        "mfa": "Enabled",
        "risk": "Medium",
        "status": "Active"
    },
    {
        "id": "user-meera",
        "name": "Meera Joshi",
        "department": "HR",
        "role": "Payroll Specialist",
        "device_name": "Meera-Laptop",
        "access_level": "High",
        "mfa": "Disabled",
        "risk": "Medium",
        "status": "Active"
    },
    {
        "id": "user-rohan",
        "name": "Rohan Desai",
        "department": "Engineering",
        "role": "Backend Engineer",
        "device_name": "Rohan-Laptop",
        "access_level": "Medium",
        "mfa": "Enabled",
        "risk": "Low",
        "status": "Active"
    },
    {
        "id": "user-tanvi",
        "name": "Tanvi Kulkarni",
        "department": "IT",
        "role": "Database Administrator",
        "device_name": "Tanvi-Laptop",
        "access_level": "Critical",
        "mfa": "Enabled",
        "risk": "High",
        "status": "Active"
    }
]

def seed_users():
    db = SessionLocal()
    try:
        # Verify organization exists to satisfy FK constraint
        org = db.query(Organization).filter(Organization.id == "org-apexfin").first()
        if not org:
            print("ERROR: Organization 'org-apexfin' not found in database. Seed organization first.")
            return

        seeded_count = 0
        skipped_count = 0
        for user_item in USERS_DATA:
            # Check if user already exists
            existing_user = db.query(User).filter(User.id == user_item["id"]).first()
            if existing_user:
                skipped_count += 1
                continue
            
            # Create user record
            user = User(
                id=user_item["id"],
                organization_id="org-apexfin",
                name=user_item["name"],
                department=user_item["department"],
                role=user_item["role"],
                device_name=user_item["device_name"],
                access_level=user_item["access_level"],
                mfa=user_item["mfa"],
                risk=user_item["risk"],
                status=user_item["status"]
            )
            db.add(user)
            seeded_count += 1
            
        if seeded_count > 0:
            db.commit()
            print(f"SUCCESS: Seeded {seeded_count} user records. Skipped {skipped_count} pre-existing records.")
        else:
            print(f"INFO: All {skipped_count} users already exist. Skipping seed.")
    except Exception as e:
        db.rollback()
        print(f"ERROR: Seeding users failed: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()

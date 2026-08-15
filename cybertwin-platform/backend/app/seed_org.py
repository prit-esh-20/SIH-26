import sys
import os

# Add parent directory of 'app' to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal
from app.models.models import Organization

def seed_organization():
    db = SessionLocal()
    try:
        # Check if the organization already exists
        existing_org = db.query(Organization).filter(Organization.id == "org-apexfin").first()
        if existing_org:
            print("INFO: Organization 'org-apexfin' already exists in the database. Skipping insert.")
            return
        
        # Create organization record
        org = Organization(
            id="org-apexfin",
            name="ApexFin Technologies",
            industry="Financial Services",
            environment="Simulation",
            twin_status="Synchronized",
            description="A synthetic mid-size financial services organization modeled as a digital twin. All users, devices and assets are fictional and generated for demonstration purposes.",
            departments=["Finance", "HR", "Engineering", "IT"]
        )
        
        db.add(org)
        db.commit()
        print("SUCCESS: Idempotent seeding of 'org-apexfin' completed.")
    except Exception as e:
        db.rollback()
        print(f"ERROR: Seeding failed: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_organization()

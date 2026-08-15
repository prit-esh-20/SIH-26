from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Organization, User
from app.schemas.organization import OrganizationResponse, UserResponse

router = APIRouter()

@router.get("/organization", response_model=OrganizationResponse)
def get_organization(db: Session = Depends(get_db)):
    org = db.query(Organization).filter(Organization.id == "org-apexfin").first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org

@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

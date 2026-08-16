from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Organization, User, Device, Asset, DataAsset
from app.schemas.organization import OrganizationResponse, UserResponse, DeviceResponse, AssetResponse, DataAssetResponse

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


@router.get("/devices", response_model=list[DeviceResponse])
def get_devices(db: Session = Depends(get_db)):
    return db.query(Device).all()


@router.get("/assets", response_model=list[AssetResponse])
def get_assets(db: Session = Depends(get_db)):
    return db.query(Asset).all()


@router.get("/data-assets", response_model=list[DataAssetResponse])
def get_data_assets(db: Session = Depends(get_db)):
    return db.query(DataAsset).all()

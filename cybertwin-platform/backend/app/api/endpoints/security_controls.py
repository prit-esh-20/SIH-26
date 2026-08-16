from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import SecurityControl
from app.schemas.security_control import SecurityControlResponse, ToggleRequest

router = APIRouter()

@router.get("", response_model=list[SecurityControlResponse])
def get_security_controls(db: Session = Depends(get_db)):
    return db.query(SecurityControl).all()

@router.post("/{id}/toggle", response_model=list[SecurityControlResponse])
def toggle_security_control(
    id: str,
    request: ToggleRequest = Body(default=None),
    db: Session = Depends(get_db)
):
    control = db.query(SecurityControl).filter(SecurityControl.id == id).first()
    if not control:
        raise HTTPException(status_code=404, detail=f"Security control with ID '{id}' not found")

    if request is not None and request.enabled is not None:
        control.enabled = request.enabled
    else:
        control.enabled = not control.enabled

    control.status = "Enabled" if control.enabled else "Disabled"
    db.commit()

    return db.query(SecurityControl).all()

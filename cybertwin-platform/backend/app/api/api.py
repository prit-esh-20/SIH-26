from fastapi import APIRouter
from app.api.endpoints import organization, dashboard, security_controls

api_router = APIRouter()
api_router.include_router(organization.router, tags=["organization"])
api_router.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["dashboard"]
)
api_router.include_router(
    security_controls.router,
    prefix="/security-controls",
    tags=["security-controls"]
)

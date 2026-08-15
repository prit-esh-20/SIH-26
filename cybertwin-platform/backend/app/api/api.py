from fastapi import APIRouter
from app.api.endpoints import organization

api_router = APIRouter()
api_router.include_router(organization.router, tags=["organization"])

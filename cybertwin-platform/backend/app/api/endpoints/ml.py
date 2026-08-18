import asyncio
import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import User
from app.schemas.ml import UserRiskResponse

router = APIRouter()

# ------------------------------------------------------------
# Stable deterministic demo behavioral profiles for Elytron users
# used to feed the independently trained ML model since User table does not store telemetry.
# ------------------------------------------------------------
USER_BEHAVIORAL_PROFILES = {
    "user-rahul": {
        "failed_logins": 4,
        "login_hour": 2,
        "new_devices": 1,
        "downloads_per_day": 132,
        "external_shares": 3,
        "sensitive_file_access": 9,
        "privilege_requests": 1
    },
    "user-neha": {
        "failed_logins": 10,
        "login_hour": 3,
        "new_devices": 2,
        "downloads_per_day": 82,
        "external_shares": 8,
        "sensitive_file_access": 15,
        "privilege_requests": 4
    },
    "user-karan": {
        "failed_logins": 1,
        "login_hour": 14,
        "new_devices": 0,
        "downloads_per_day": 64,
        "external_shares": 1,
        "sensitive_file_access": 2,
        "privilege_requests": 0
    },
    "user-tanvi": {
        "failed_logins": 2,
        "login_hour": 22,
        "new_devices": 1,
        "downloads_per_day": 71,
        "external_shares": 4,
        "sensitive_file_access": 8,
        "privilege_requests": 1
    },
    "user-priya": {
        "failed_logins": 0,
        "login_hour": 10,
        "new_devices": 0,
        "downloads_per_day": 15,
        "external_shares": 0,
        "sensitive_file_access": 1,
        "privilege_requests": 0
    },
    "user-arjun": {
        "failed_logins": 1,
        "login_hour": 11,
        "new_devices": 0,
        "downloads_per_day": 20,
        "external_shares": 1,
        "sensitive_file_access": 0,
        "privilege_requests": 0
    },
    "user-vikram": {
        "failed_logins": 0,
        "login_hour": 9,
        "new_devices": 0,
        "downloads_per_day": 35,
        "external_shares": 2,
        "sensitive_file_access": 4,
        "privilege_requests": 1
    },
    "user-ananya": {
        "failed_logins": 0,
        "login_hour": 10,
        "new_devices": 0,
        "downloads_per_day": 12,
        "external_shares": 0,
        "sensitive_file_access": 1,
        "privilege_requests": 0
    },
    "user-sneha": {
        "failed_logins": 1,
        "login_hour": 9,
        "new_devices": 1,
        "downloads_per_day": 18,
        "external_shares": 0,
        "sensitive_file_access": 3,
        "privilege_requests": 0
    },
    "user-aditya": {
        "failed_logins": 2,
        "login_hour": 8,
        "new_devices": 0,
        "downloads_per_day": 40,
        "external_shares": 1,
        "sensitive_file_access": 2,
        "privilege_requests": 1
    },
    "user-meera": {
        "failed_logins": 0,
        "login_hour": 10,
        "new_devices": 0,
        "downloads_per_day": 10,
        "external_shares": 0,
        "sensitive_file_access": 1,
        "privilege_requests": 0
    },
    "user-rohan": {
        "failed_logins": 1,
        "login_hour": 13,
        "new_devices": 0,
        "downloads_per_day": 25,
        "external_shares": 1,
        "sensitive_file_access": 2,
        "privilege_requests": 0
    }
}

DEFAULT_BEHAVIOR = {
    "failed_logins": 0,
    "login_hour": 10,
    "new_devices": 0,
    "downloads_per_day": 10,
    "external_shares": 0,
    "sensitive_file_access": 1,
    "privilege_requests": 0
}

async def _predict_user_risk(client: httpx.AsyncClient, user: User, payload: dict) -> dict:
    try:
        response = await client.post("http://127.0.0.1:8001/predict", json=payload, timeout=5.0)
    except (httpx.ConnectError, httpx.ConnectTimeout):
        raise HTTPException(status_code=503, detail="ML service unavailable")
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Unexpected response from ML service: {e}")

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Unexpected response from ML service")

    try:
        pred = response.json()
        return {
            "userId": user.id,
            "user": user.name,
            "score": pred["risk_score"],
            "level": pred["risk_level"].title(),
            "confidence": pred["risk_probability"],
            "signals": pred["top_reasons"]
        }
    except Exception:
        raise HTTPException(status_code=502, detail="Unexpected response from ML service")

@router.get("/ml/user-risk", response_model=list[UserRiskResponse])
async def get_all_user_risks(db: Session = Depends(get_db)):
    users = db.query(User).all()
    if not users:
        return []

    async with httpx.AsyncClient() as client:
        tasks = []
        for user in users:
            profile = USER_BEHAVIORAL_PROFILES.get(user.id, DEFAULT_BEHAVIOR)
            payload = {
                "user_id": user.id,
                **profile
            }
            tasks.append(_predict_user_risk(client, user, payload))
        
        try:
            results = await asyncio.gather(*tasks)
            return results
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Unexpected ML evaluation error: {e}")

@router.get("/ml/user-risk/{userId}", response_model=UserRiskResponse)
async def get_user_risk(userId: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID '{userId}' not found")

    profile = USER_BEHAVIORAL_PROFILES.get(user.id, DEFAULT_BEHAVIOR)
    payload = {
        "user_id": user.id,
        **profile
    }

    async with httpx.AsyncClient() as client:
        return await _predict_user_risk(client, user, payload)

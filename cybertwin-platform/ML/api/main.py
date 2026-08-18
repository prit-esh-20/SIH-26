from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


# ============================================================
# LOAD MODELS
# ============================================================

risk_model = joblib.load(
    MODEL_DIR / "risk_model.joblib"
)

anomaly_model = joblib.load(
    MODEL_DIR / "anomaly_model.joblib"
)

model_config = joblib.load(
    MODEL_DIR / "model_config.joblib"
)


# ============================================================
# SHAP EXPLAINER
# ============================================================

shap_explainer = shap.TreeExplainer(
    risk_model
)


# ============================================================
# CONFIGURATION
# ============================================================

RAW_FEATURES = model_config["features"]

FINAL_THRESHOLD = model_config["risk_threshold"]

ANOMALY_THRESHOLD = model_config["anomaly_threshold"]


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="CyberTwin ML API",
    description=(
        "Behavioral cybersecurity risk, "
        "anomaly detection, and explainability API"
    ),
    version="1.1.0"
)


# ============================================================
# INPUT SCHEMA
# ============================================================

class UserBehavior(BaseModel):

    user_id: str = Field(
        ...,
        description="Unique identifier of the user"
    )

    failed_logins: int = Field(
        ...,
        ge=0,
        description="Number of failed login attempts"
    )

    login_hour: int = Field(
        ...,
        ge=0,
        le=23,
        description="Hour of login from 0 to 23"
    )

    new_devices: int = Field(
        ...,
        ge=0,
        description="Number of newly observed devices"
    )

    downloads_per_day: int = Field(
        ...,
        ge=0,
        description="Number of downloads per day"
    )

    external_shares: int = Field(
        ...,
        ge=0,
        description="Number of external file shares"
    )

    sensitive_file_access: int = Field(
        ...,
        ge=0,
        description="Number of sensitive file accesses"
    )

    privilege_requests: int = Field(
        ...,
        ge=0,
        description="Number of privilege requests"
    )


# ============================================================
# RISK LEVEL
# ============================================================

def get_risk_level(
    risk_score: float
) -> str:

    if risk_score <= 30:
        return "LOW"

    elif risk_score <= 60:
        return "MEDIUM"

    elif risk_score <= 80:
        return "HIGH"

    else:
        return "CRITICAL"


# ============================================================
# ANOMALY SCORE
# ============================================================

def calculate_anomaly_score(
    model,
    X
) -> float:

    # Isolation Forest's score_samples():
    # higher = more normal
    #
    # We invert the score so:
    # higher = more anomalous

    return float(
        -model.score_samples(X)[0]
    )


# ============================================================
# SHAP EXPLANATION
# ============================================================

def generate_reasons(
    explanation: pd.DataFrame,
    top_n: int = 3
):

    top_features = explanation.head(top_n)

    reasons = []

    for _, row in top_features.iterrows():

        feature = row["feature"]
        value = row["value"]
        impact = row["shap_value"]

        # ----------------------------------------------------
        # Positive SHAP contribution
        # ----------------------------------------------------

        if impact > 0:

            if feature == "failed_logins":
                reason = (
                    f"{int(value)} failed login attempts "
                    f"increased risk"
                )

            elif feature == "login_hour":
                reason = (
                    f"Login at hour {int(value)} "
                    f"increased risk"
                )

            elif feature == "new_devices":
                reason = (
                    f"{int(value)} new device(s) "
                    f"increased risk"
                )

            elif feature == "downloads_per_day":
                reason = (
                    f"{int(value)} daily downloads "
                    f"increased risk"
                )

            elif feature == "external_shares":
                reason = (
                    f"{int(value)} external shares "
                    f"increased risk"
                )

            elif feature == "sensitive_file_access":
                reason = (
                    f"{int(value)} sensitive file accesses "
                    f"increased risk"
                )

            elif feature == "privilege_requests":
                reason = (
                    f"{int(value)} privilege requests "
                    f"increased risk"
                )

            else:
                reason = (
                    f"{feature} increased risk"
                )

        # ----------------------------------------------------
        # Negative SHAP contribution
        # ----------------------------------------------------

        else:

            if feature == "failed_logins":
                reason = (
                    f"Failed-login activity was relatively low"
                )

            elif feature == "login_hour":
                reason = (
                    f"Login timing was relatively normal"
                )

            elif feature == "new_devices":
                reason = (
                    f"New-device activity was relatively low"
                )

            elif feature == "downloads_per_day":
                reason = (
                    f"Download activity was relatively normal"
                )

            elif feature == "external_shares":
                reason = (
                    f"External sharing activity was relatively low"
                )

            elif feature == "sensitive_file_access":
                reason = (
                    f"Sensitive-file access was relatively low"
                )

            elif feature == "privilege_requests":
                reason = (
                    f"Privilege-request activity was relatively low"
                )

            else:
                reason = (
                    f"{feature} did not significantly increase risk"
                )

        reasons.append(reason)

    return reasons


# ============================================================
# SHAP VALUES FOR ONE USER
# ============================================================

def get_shap_explanation(
    input_data: pd.DataFrame
):

    shap_result = shap_explainer.shap_values(
        input_data
    )

    shap_array = np.asarray(
        shap_result
    )

    # Current SHAP format:
    # (samples, features, classes)
    #
    # Class 0 = Normal
    # Class 1 = Risky

    if shap_array.ndim == 3:

        shap_values_user = (
            shap_array[0, :, 1]
        )

    elif shap_array.ndim == 2:

        shap_values_user = (
            shap_array[0]
        )

    else:

        raise ValueError(
            f"Unexpected SHAP shape: "
            f"{shap_array.shape}"
        )

    explanation = pd.DataFrame({
        "feature": RAW_FEATURES,
        "value": input_data.iloc[0].values,
        "shap_value": shap_values_user
    })

    explanation["absolute_impact"] = (
        explanation["shap_value"].abs()
    )

    explanation = explanation.sort_values(
        "absolute_impact",
        ascending=False
    )

    return explanation


# ============================================================
# HEALTH ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {
        "service": "CyberTwin ML API",
        "status": "running",
        "version": "1.1.0",
        "capabilities": [
            "behavioral_risk_prediction",
            "anomaly_detection",
            "shap_explainability"
        ]
    }


# ============================================================
# MODEL INFORMATION
# ============================================================

@app.get("/model-info")
def model_info():

    return {
        "risk_model": "Random Forest",
        "anomaly_model": "Isolation Forest",
        "explainability": "SHAP",
        "risk_threshold": FINAL_THRESHOLD,
        "anomaly_threshold": ANOMALY_THRESHOLD,
        "features": RAW_FEATURES
    }


# ============================================================
# PREDICTION ENDPOINT
# ============================================================

@app.post("/predict")
def predict_behavior(
    behavior: UserBehavior
):

    try:

        # ----------------------------------------------------
        # Convert request to DataFrame
        # ----------------------------------------------------

        input_data = pd.DataFrame([
            {
                feature: getattr(
                    behavior,
                    feature
                )
                for feature in RAW_FEATURES
            }
        ])

        # ----------------------------------------------------
        # Risk prediction
        # ----------------------------------------------------

        risk_probability = float(
            risk_model.predict_proba(
                input_data
            )[0, 1]
        )

        risk_score = (
            risk_probability * 100
        )

        risk_level = get_risk_level(
            risk_score
        )

        is_risky = (
            risk_probability >= FINAL_THRESHOLD
        )

        # ----------------------------------------------------
        # Anomaly detection
        # ----------------------------------------------------

        anomaly_score = calculate_anomaly_score(
            anomaly_model,
            input_data
        )

        is_anomalous = (
            anomaly_score >= ANOMALY_THRESHOLD
        )

        # ----------------------------------------------------
        # SHAP explanation
        # ----------------------------------------------------

        explanation = get_shap_explanation(
            input_data
        )

        top_reasons = generate_reasons(
            explanation,
            top_n=3
        )

        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return {
            "user_id": behavior.user_id,

            "risk_probability": round(
                risk_probability,
                4
            ),

            "risk_score": round(
                risk_score,
                2
            ),

            "risk_level": risk_level,

            "is_risky": bool(
                is_risky
            ),

            "anomaly_score": round(
                anomaly_score,
                4
            ),

            "is_anomalous": bool(
                is_anomalous
            ),

            "top_reasons": top_reasons
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
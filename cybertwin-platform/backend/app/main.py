from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router

app = FastAPI(
    title="CyberTwin Backend API",
    description="FastAPI Backend for the CyberTwin platform",
    version="0.1.0"
)

# CORS configurations for the Vite React frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register central API endpoints with config prefix (default '/api')
app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/")
def read_root():
    return {"status": "online", "message": "CyberTwin API is running"}

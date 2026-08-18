import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import BlockchainEvidence

router = APIRouter()

@router.get("/blockchain/evidence/{simulationId}")
async def get_blockchain_evidence(simulationId: str, db: Session = Depends(get_db)):
    # 1. Look up the simulation mapping record in our local database
    evidence = db.query(BlockchainEvidence).filter(
        BlockchainEvidence.simulation_id == simulationId
    ).first()

    if not evidence:
        raise HTTPException(
            status_code=404,
            detail=f"Blockchain evidence not found for simulation '{simulationId}'"
        )

    # 2. Call the independent Express wrapper on port 8002 to fetch raw on-chain data
    async with httpx.AsyncClient() as client:
        try:
            # The 'hash' column stores the actual on-chain eventId
            url = f"http://127.0.0.1:8002/evidence/{evidence.hash}"
            response = await client.get(url, timeout=10.0)
        except (httpx.ConnectError, httpx.ConnectTimeout):
            raise HTTPException(
                status_code=503,
                detail="Blockchain service unavailable"
            )
        except httpx.HTTPError as e:
            raise HTTPException(
                status_code=502,
                detail=f"Failed to communicate with blockchain service: {e}"
            )

        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail=f"Evidence event '{evidence.hash}' not found on-chain"
            )
        elif response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail="Unexpected response from blockchain service"
            )

        # 3. Map values back to match the frontend contract
        data = response.json()

        # Override the eventId back to the requested simulationId
        data["simulationId"] = simulationId

        return data

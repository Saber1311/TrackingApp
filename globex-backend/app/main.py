# app/main.py

from fastapi import FastAPI
from app.fedex_client import get_fedex_token
from app.tracking_routes import router as tracking_router

app = FastAPI(title="Globex Tracking Backend")

@app.get("/api/test-auth")
async def test_auth():
    token = await get_fedex_token()
    return {"access_token": token}

app.include_router(tracking_router)

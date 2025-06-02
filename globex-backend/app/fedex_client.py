# app/fedex_client.py

import os
import httpx
from dotenv import load_dotenv

load_dotenv()

FEDEX_CLIENT_ID = os.getenv("FEDEX_CLIENT_ID")
FEDEX_CLIENT_SECRET = os.getenv("FEDEX_CLIENT_SECRET")
FEDEX_BASE_URL = os.getenv("FEDEX_BASE_URL", "https://apis-sandbox.fedex.com")

_token_cache = {
    "access_token": None,
    "expires_in": 0,
}

async def get_fedex_token():
    """
    Authentifie l'app auprès de FedEx et retourne un access_token OAuth2
    """
    if _token_cache["access_token"]:
        return _token_cache["access_token"]

    url = f"{FEDEX_BASE_URL}/oauth/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "client_credentials",
        "client_id": FEDEX_CLIENT_ID,
        "client_secret": FEDEX_CLIENT_SECRET
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=data, headers=headers)
        response.raise_for_status()
        token_data = response.json()

        _token_cache["access_token"] = token_data["access_token"]
        _token_cache["expires_in"] = token_data["expires_in"]

        return token_data["access_token"]

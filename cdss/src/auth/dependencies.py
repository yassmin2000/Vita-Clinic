from fastapi import Depends, HTTPException, Request
from fastapi.security import APIKeyHeader

from src.config import Config

API_KEY_NAME = "X-API-KEY"
api_key_header = APIKeyHeader(name=API_KEY_NAME)


class ApiKeyHeader(APIKeyHeader):
    def __init__(self, name: str = API_KEY_NAME, auto_error: bool = True):
        super().__init__(name=name, auto_error=auto_error)

    async def __call__(self, request: Request) -> str:
        api_key = await super().__call__(request)
        if api_key == Config.API_KEY:
            return api_key
        raise HTTPException(status_code=403, detail="Invalid API Key")

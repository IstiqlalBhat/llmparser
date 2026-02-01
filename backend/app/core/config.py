import os
from pathlib import Path
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "PO Management System"
    GEMINI_API_KEY: str
    GEMINI_MODEL_NAME: str = "gemini-2.0-flash"
    # Allow all origins for local development/mobile testing
    CORS_ORIGINS: list[str] = ["*"]

    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str

    class Config:
        # Try multiple possible .env locations, but don't fail if none exist
        # Railway injects env vars directly, no .env file needed
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

@lru_cache()
def get_settings():
    return Settings()

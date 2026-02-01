import os
from pathlib import Path
from pydantic_settings import BaseSettings
from functools import lru_cache

# Get the project root (parent of backend folder)
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "PO Management System"
    GEMINI_API_KEY: str
    GEMINI_MODEL_NAME: str = "gemini-2.0-flash"
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # PostgreSQL / Supabase Database Settings
    DATABASE_URL: str  # Required: postgresql://user:pass@host:port/db
    DATABASE_POOL_MIN: int = 2
    DATABASE_POOL_MAX: int = 10
    
    class Config:
        env_file = str(PROJECT_ROOT / ".env")

@lru_cache()
def get_settings():
    return Settings()


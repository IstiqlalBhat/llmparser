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
    # Allow all origins for local development/mobile testing
    CORS_ORIGINS: list[str] = ["*"]
    
    # Supabase Configuration
    # Using NEXT_PUBLIC_SUPABASE_URL for compatibility with frontend
    NEXT_PUBLIC_SUPABASE_URL: str
    # Service role key for backend operations (full database access)
    SUPABASE_SERVICE_ROLE_KEY: str
    
    class Config:
        env_file = str(PROJECT_ROOT / ".env")
        extra = "ignore"  # Ignore extra env vars like NEXT_PUBLIC_SUPABASE_ANON_KEY

@lru_cache()
def get_settings():
    return Settings()


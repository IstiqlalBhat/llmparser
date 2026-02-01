from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import orders
from app.core.config import get_settings
from app.services.db import db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Initializes database connection pool on startup and closes on shutdown.
    """
    # Startup: Initialize database connection pool
    await db.connect(
        database_url=settings.DATABASE_URL,
        min_size=settings.DATABASE_POOL_MIN,
        max_size=settings.DATABASE_POOL_MAX,
    )
    yield
    # Shutdown: Close database connection pool
    await db.disconnect()


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orders.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "PO Management System API"}


@app.get("/health")
async def health():
    """Health check endpoint - verifies API and database connectivity."""
    try:
        # Quick DB check - get connection from pool
        async with db.acquire():
            pass
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}

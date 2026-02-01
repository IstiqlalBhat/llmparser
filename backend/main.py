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
    Initializes Supabase client on startup and cleans up on shutdown.
    """
    # Startup: Initialize Supabase client
    db.connect(
        supabase_url=settings.NEXT_PUBLIC_SUPABASE_URL,
        supabase_key=settings.SUPABASE_SERVICE_ROLE_KEY,
    )
    yield
    # Shutdown: Cleanup
    db.disconnect()


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
    """Health check endpoint - verifies API and Supabase connectivity."""
    try:
        # Quick DB check - try to fetch from table
        db.client.table('purchase_orders').select('po_id').limit(1).execute()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}

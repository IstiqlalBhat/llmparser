from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import orders
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(title=settings.PROJECT_NAME)

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
    return {"status": "healthy"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routes import orders

load_dotenv()

app = FastAPI(title="Interview API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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

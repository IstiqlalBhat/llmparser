"""
Database Layer - PostgreSQL Wrapper
Provides the same interface as the original InMemoryDB for backward compatibility.
All methods are now async to support asyncpg.
"""

from typing import List, Optional
from app.schemas import PurchaseOrder, OrderStatus
from app.services.db_postgres import db_postgres

# Re-export the PostgreSQL database instance
# Routes will use this as: from app.services.db import db
db = db_postgres

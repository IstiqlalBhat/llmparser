"""
Database Layer - Supabase Wrapper
Provides the same interface as the original PostgreSQL DB for backward compatibility.
All methods are async for API consistency.
"""

from typing import List, Optional
from app.schemas import PurchaseOrder, OrderStatus
from app.services.db_supabase import db_supabase

# Re-export the Supabase database instance
# Routes will use this as: from app.services.db import db
db = db_supabase

"""
Async PostgreSQL Database Service
Using asyncpg for high-performance async database operations.

Features:
- Connection pooling (configurable min/max connections)
- Prepared statements (automatic query plan caching)
- Type conversion for PostgreSQL ENUM types
- Compatible with Supabase (uses their PgBouncer pooler endpoint)
"""

import asyncpg
from typing import List, Optional, Tuple
from contextlib import asynccontextmanager
from app.schemas import PurchaseOrder, OrderStatus


class PostgresDB:
    """Async PostgreSQL database service with connection pooling."""
    
    def __init__(self):
        self._pool: Optional[asyncpg.Pool] = None
    
    async def connect(self, database_url: str, min_size: int = 2, max_size: int = 10):
        """
        Initialize the connection pool.
        
        Args:
            database_url: PostgreSQL connection string
            min_size: Minimum number of connections in pool
            max_size: Maximum number of connections in pool
        """
        self._pool = await asyncpg.create_pool(
            database_url,
            min_size=min_size,
            max_size=max_size,
            # Statement cache for prepared statement reuse
            statement_cache_size=100,
            # Command timeout in seconds
            command_timeout=60,
        )
    
    async def disconnect(self):
        """Close all connections in the pool."""
        if self._pool:
            await self._pool.close()
            self._pool = None
    
    @asynccontextmanager
    async def acquire(self):
        """Acquire a connection from the pool."""
        if not self._pool:
            raise RuntimeError("Database pool not initialized. Call connect() first.")
        async with self._pool.acquire() as connection:
            yield connection
    
    def _row_to_order(self, row: asyncpg.Record) -> PurchaseOrder:
        """Convert a database row to a PurchaseOrder object."""
        return PurchaseOrder(
            id=row['po_id'],
            supplier=row['supplier'],
            items=row['items'],
            expected_date=row['expected_date'],
            status=OrderStatus(row['status']),
            last_updated=row['updated_at'].strftime("%b %d, %Y") if row['updated_at'] else "Unknown",
            additional_context=row['additional_context']
        )
    
    async def get_all(self) -> List[PurchaseOrder]:
        """Retrieve all purchase orders, ordered by most recent first."""
        async with self.acquire() as conn:
            rows = await conn.fetch("""
                SELECT po_id, supplier, items, expected_date, status, 
                       additional_context, created_at, updated_at
                FROM purchase_orders
                ORDER BY updated_at DESC
            """)
            return [self._row_to_order(row) for row in rows]
    
    async def get_by_id(self, po_id: str) -> Optional[PurchaseOrder]:
        """Retrieve a single order by PO ID."""
        async with self.acquire() as conn:
            row = await conn.fetchrow("""
                SELECT po_id, supplier, items, expected_date, status,
                       additional_context, created_at, updated_at
                FROM purchase_orders
                WHERE po_id = $1
            """, po_id)
            return self._row_to_order(row) if row else None
    
    async def add(self, order: PurchaseOrder) -> PurchaseOrder:
        """
        Add or update a purchase order (upsert).
        Uses ON CONFLICT to handle duplicates efficiently.
        """
        async with self.acquire() as conn:
            row = await conn.fetchrow("""
                INSERT INTO purchase_orders 
                    (po_id, supplier, items, expected_date, status, additional_context)
                VALUES ($1, $2, $3, $4, $5::order_status, $6)
                ON CONFLICT (po_id) DO UPDATE SET
                    supplier = EXCLUDED.supplier,
                    items = EXCLUDED.items,
                    expected_date = EXCLUDED.expected_date,
                    status = EXCLUDED.status,
                    additional_context = EXCLUDED.additional_context,
                    updated_at = NOW()
                RETURNING po_id, supplier, items, expected_date, status,
                          additional_context, created_at, updated_at
            """, 
                order.id,
                order.supplier,
                order.items,
                order.expected_date,
                order.status.value,
                order.additional_context
            )
            return self._row_to_order(row)
    
    async def update_status(self, po_id: str, status: OrderStatus) -> Optional[PurchaseOrder]:
        """Update the status of an existing order."""
        async with self.acquire() as conn:
            row = await conn.fetchrow("""
                UPDATE purchase_orders
                SET status = $2::order_status
                WHERE po_id = $1
                RETURNING po_id, supplier, items, expected_date, status,
                          additional_context, created_at, updated_at
            """, po_id, status.value)
            return self._row_to_order(row) if row else None
    
    async def delete(self, po_id: str) -> bool:
        """Delete a single order by PO ID."""
        async with self.acquire() as conn:
            result = await conn.execute("""
                DELETE FROM purchase_orders WHERE po_id = $1
            """, po_id)
            # Result is like "DELETE 1" or "DELETE 0"
            return result.split()[-1] == '1'
    
    async def delete_many(self, po_ids: List[str]) -> int:
        """Delete multiple orders by PO IDs."""
        if not po_ids:
            return 0
        async with self.acquire() as conn:
            result = await conn.execute("""
                DELETE FROM purchase_orders WHERE po_id = ANY($1)
            """, po_ids)
            # Result is like "DELETE 5"
            return int(result.split()[-1])
    
    async def search_items(self, query: str) -> List[PurchaseOrder]:
        """
        Search orders by items description using trigram similarity.
        Uses the GIN index for fast text search.
        """
        async with self.acquire() as conn:
            rows = await conn.fetch("""
                SELECT po_id, supplier, items, expected_date, status,
                       additional_context, created_at, updated_at
                FROM purchase_orders
                WHERE items ILIKE $1
                ORDER BY updated_at DESC
            """, f"%{query}%")
            return [self._row_to_order(row) for row in rows]


# Global database instance
db_postgres = PostgresDB()

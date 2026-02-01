"""
Supabase Database Service
Using the official supabase-py client for database operations.

Features:
- Simple REST-based queries (no connection pooling needed)
- Type-safe query builder
- Compatible with Supabase Row Level Security (RLS)
"""

from typing import List, Optional
from supabase import create_client, Client
from app.schemas import PurchaseOrder, OrderStatus
from datetime import datetime


class SupabaseDB:
    """Supabase database service."""
    
    def __init__(self):
        self._client: Optional[Client] = None
    
    def connect(self, supabase_url: str, supabase_key: str):
        """
        Initialize the Supabase client.
        
        Args:
            supabase_url: Your Supabase project URL
            supabase_key: Your Supabase service role key (for backend)
        """
        self._client = create_client(supabase_url, supabase_key)
    
    def disconnect(self):
        """Cleanup (no-op for REST-based client)."""
        self._client = None
    
    @property
    def client(self) -> Client:
        """Get the Supabase client."""
        if not self._client:
            raise RuntimeError("Supabase client not initialized. Call connect() first.")
        return self._client
    
    def _row_to_order(self, row: dict) -> PurchaseOrder:
        """Convert a database row to a PurchaseOrder object."""
        # Format dates for display
        expected_date_str = None
        if row.get('expected_date'):
            try:
                # Parse ISO date and format for display
                dt = datetime.fromisoformat(row['expected_date'].replace('Z', '+00:00'))
                expected_date_str = dt.strftime("%b %d, %Y")
            except (ValueError, AttributeError):
                expected_date_str = row['expected_date']
        
        updated_at_str = "Unknown"
        if row.get('updated_at'):
            try:
                dt = datetime.fromisoformat(row['updated_at'].replace('Z', '+00:00'))
                updated_at_str = dt.strftime("%b %d, %Y")
            except (ValueError, AttributeError):
                updated_at_str = str(row['updated_at'])
        
        return PurchaseOrder(
            id=row['po_id'],
            supplier=row.get('supplier', 'Unknown Supplier'),
            items=row.get('items', 'Items not specified'),
            expected_date=expected_date_str,
            status=OrderStatus(row['status']) if row.get('status') else OrderStatus.ON_TRACK,
            last_updated=updated_at_str,
            additional_context=row.get('additional_context')
        )
    
    async def get_all(self) -> List[PurchaseOrder]:
        """Retrieve all purchase orders, ordered by most recent first."""
        response = self.client.table('purchase_orders') \
            .select('*') \
            .order('updated_at', desc=True) \
            .execute()
        
        return [self._row_to_order(row) for row in response.data]
    
    async def get_by_id(self, po_id: str) -> Optional[PurchaseOrder]:
        """Retrieve a single order by PO ID."""
        response = self.client.table('purchase_orders') \
            .select('*') \
            .eq('po_id', po_id) \
            .execute()
        
        if response.data:
            return self._row_to_order(response.data[0])
        return None
    
    async def add(self, order: PurchaseOrder) -> PurchaseOrder:
        """
        Add or update a purchase order (upsert).
        """
        data = {
            'po_id': order.id,
            'supplier': order.supplier,
            'items': order.items,
            'expected_date': order.expected_date,
            'status': order.status.value,
            'additional_context': order.additional_context
        }
        
        response = self.client.table('purchase_orders') \
            .upsert(data, on_conflict='po_id') \
            .execute()
        
        if response.data:
            return self._row_to_order(response.data[0])
        
        # If upsert didn't return data, fetch the record
        return await self.get_by_id(order.id) or order
    
    async def update_status(self, po_id: str, status: OrderStatus) -> Optional[PurchaseOrder]:
        """Update the status of an existing order."""
        response = self.client.table('purchase_orders') \
            .update({'status': status.value}) \
            .eq('po_id', po_id) \
            .execute()
        
        if response.data:
            return self._row_to_order(response.data[0])
        return None
    
    async def delete(self, po_id: str) -> bool:
        """Delete a single order by PO ID."""
        response = self.client.table('purchase_orders') \
            .delete() \
            .eq('po_id', po_id) \
            .execute()
        
        return len(response.data) > 0
    
    async def delete_many(self, po_ids: List[str]) -> int:
        """Delete multiple orders by PO IDs."""
        if not po_ids:
            return 0
        
        response = self.client.table('purchase_orders') \
            .delete() \
            .in_('po_id', po_ids) \
            .execute()
        
        return len(response.data)
    
    async def search_items(self, query: str) -> List[PurchaseOrder]:
        """
        Search orders by items description using ILIKE.
        """
        response = self.client.table('purchase_orders') \
            .select('*') \
            .ilike('items', f'%{query}%') \
            .order('updated_at', desc=True) \
            .execute()
        
        return [self._row_to_order(row) for row in response.data]


# Global database instance
db_supabase = SupabaseDB()

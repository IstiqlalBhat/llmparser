from typing import List, Optional
from app.schemas import PurchaseOrder, OrderStatus

class InMemoryDB:
    def __init__(self):
        self._orders: List[PurchaseOrder] = []

    def get_all(self) -> List[PurchaseOrder]:
        return self._orders

    def get_by_id(self, po_id: str) -> Optional[PurchaseOrder]:
        for order in self._orders:
            if order.id == po_id:
                return order
        return None

    def add(self, order: PurchaseOrder) -> PurchaseOrder:
        # Check if exists, update if so (simple upsert logic for this demo)
        existing = self.get_by_id(order.id)
        if existing:
            self._orders.remove(existing)
        self._orders.append(order)
        return order

    def update_status(self, po_id: str, status: OrderStatus) -> Optional[PurchaseOrder]:
        order = self.get_by_id(po_id)
        if order:
            order.status = status
            # In a real app we'd update last_updated here too
            return order
        return None

db = InMemoryDB()

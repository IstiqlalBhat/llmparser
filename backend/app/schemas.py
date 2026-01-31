from datetime import date
from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum

class OrderStatus(str, Enum):
    ON_TRACK = "On Track"
    PRODUCT_DELAYS = "Product Delays"
    SHIPPED = "Shipped"
    SHIPMENT_DELAY = "Shipment Delay"

class PurchaseOrder(BaseModel):
    id: str = Field(description="The unique PO identifier (e.g., PO-45821)")
    supplier: str = Field(description="Name of the supplier")
    items: str = Field(description="Description of items ordered")
    expected_date: Optional[str] = Field(None, description="Expected delivery/ship date (e.g., Jan 15, 2024)")
    status: OrderStatus = Field(description="Current status of the order")
    last_updated: str = Field(description="Date of last update (e.g., Jan 2, 2024)")

class EmailParsingRequest(BaseModel):
    email_text: str

class EmailParsingResponse(BaseModel):
    parsed_data: List[PurchaseOrder]
    errors: List[str] = Field(default_factory=list, description="List of errors for emails that failed to parse")

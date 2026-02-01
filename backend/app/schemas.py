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
    supplier: str = Field(default="Unknown Supplier", description="Name of the supplier")
    items: str = Field(default="Items not specified", description="Description of items ordered")
    expected_date: Optional[str] = Field(None, description="Expected delivery/ship date (e.g., Jan 15, 2024)")
    status: OrderStatus = Field(default=OrderStatus.ON_TRACK, description="Current status of the order")
    last_updated: str = Field(default="Unknown", description="Date of last update (e.g., Jan 2, 2024)")
    additional_context: Optional[str] = Field(None, description="Additional context like delay reasons, date changes, special notes")

class EmailParsingRequest(BaseModel):
    email_text: str

class EmailParsingResponse(BaseModel):
    parsed_data: List[PurchaseOrder]
    errors: List[str] = Field(default_factory=list, description="List of errors for emails that failed to parse")
    existing_ids: List[str] = Field(default_factory=list, description="List of PO IDs that already exist in the database")

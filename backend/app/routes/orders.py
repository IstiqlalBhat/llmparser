from fastapi import APIRouter, HTTPException, Body
from typing import List
from app.schemas import PurchaseOrder, EmailParsingRequest, EmailParsingResponse, OrderStatus
from app.services.db import db
from app.services.gemini_service import parse_email_with_gemini

router = APIRouter()


@router.get("/orders", response_model=List[PurchaseOrder])
async def get_orders():
    return await db.get_all()


@router.post("/orders", response_model=PurchaseOrder)
async def create_order(order: PurchaseOrder):
    return await db.add(order)


@router.post("/orders/parse", response_model=EmailParsingResponse)
async def parse_email(request: EmailParsingRequest):
    try:
        parsed_orders, errors = await parse_email_with_gemini(request.email_text)

        # If no orders were parsed and we have errors, it's a failure
        if not parsed_orders and errors:
            raise HTTPException(status_code=400, detail="; ".join(errors))

        return EmailParsingResponse(parsed_data=parsed_orders, errors=errors)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/orders/{po_id}/status", response_model=PurchaseOrder)
async def update_status(po_id: str, status: OrderStatus):
    updated = await db.update_status(po_id, status)
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated


@router.delete("/orders/{po_id}")
async def delete_order(po_id: str):
    deleted = await db.delete(po_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": f"Order {po_id} deleted successfully"}


@router.post("/orders/delete-many")
async def delete_many_orders(po_ids: List[str] = Body(...)):
    deleted_count = await db.delete_many(po_ids)
    return {"message": f"{deleted_count} order(s) deleted successfully", "deleted_count": deleted_count}

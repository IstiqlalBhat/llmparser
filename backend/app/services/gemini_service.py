import os
import json
import google.generativeai as genai
from typing import List, Tuple
from app.schemas import PurchaseOrder
from app.core.config import get_settings

settings = get_settings()

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel(settings.GEMINI_MODEL_NAME)

PROMPT_TEMPLATE = """
You are an intelligent Purchase Order extraction assistant.
The user may paste one or multiple emails. Your job is to identify each separate email/PO and extract information from ALL of them.

For EACH email/purchase order found, extract:
- id: The PO number (e.g. PO-1234, GT-001).
- supplier: The name of the supplier.
- items: A summary string of items and quantities.
- expected_date: The expected delivery or ship date found in the email. Format cleanly (e.g. "Jan 15, 2024").
- status: One of the following EXACT values: "On Track", "Product Delays", "Shipped", "Shipment Delay".
- last_updated: The date of the email or today's date if not found. Format cleanly.

IMPORTANT:
- Look for email separators like "From:", "Subject:", "---", blank lines between emails, or other indicators of multiple messages.
- If you find multiple POs/emails, return an array with ALL of them.
- If there's only one email, still return an array with one element.

Email Content:
\"\"\"{email_text}\"\"\"

Return ONLY a valid JSON array of objects. Example format:
[
  {{"id": "PO-1234", "supplier": "Acme Corp", "items": "100x Widget A", "expected_date": "Jan 15, 2024", "status": "On Track", "last_updated": "Jan 10, 2024"}},
  {{"id": "PO-5678", "supplier": "Beta Inc", "items": "50x Gadget B", "expected_date": "Jan 20, 2024", "status": "Shipped", "last_updated": "Jan 12, 2024"}}
]

Do not include markdown formatting like ```json. Return ONLY the JSON array.
"""

async def parse_email_with_gemini(email_text: str) -> Tuple[List[PurchaseOrder], List[str]]:
    """
    Parse one or multiple emails and return a list of PurchaseOrders.
    Returns a tuple of (parsed_orders, errors).
    """
    if not settings.GEMINI_API_KEY:
        raise Exception("GEMINI_API_KEY is not set")

    try:
        response = model.generate_content(
            PROMPT_TEMPLATE.format(email_text=email_text),
            generation_config={"thinking_level": "low"}
        )
    except Exception as e:
        print(f"Error with thinking model/param: {e}. Retrying without config.")
        response = model.generate_content(PROMPT_TEMPLATE.format(email_text=email_text))

    parsed_orders: List[PurchaseOrder] = []
    errors: List[str] = []

    try:
        # Clean response if it contains markdown code blocks
        text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)

        # Ensure we have a list
        if isinstance(data, dict):
            data = [data]

        # Parse each order
        for i, order_data in enumerate(data):
            try:
                parsed_orders.append(PurchaseOrder(**order_data))
            except Exception as e:
                errors.append(f"Failed to parse order {i+1}: {str(e)}")

        if not parsed_orders and not errors:
            errors.append("No purchase orders found in the provided text.")

    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        print(f"Raw response: {response.text}")
        errors.append(f"Failed to parse AI response as JSON: {str(e)}")
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        try:
            print(f"Raw response: {response.text}")
        except:
            pass
        errors.append(f"Failed to extract PO details: {str(e)}")

    return parsed_orders, errors

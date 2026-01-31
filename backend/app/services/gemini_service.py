import os
import json
import google.generativeai as genai
from app.schemas import PurchaseOrder
from app.core.config import get_settings

settings = get_settings()

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

# User requested gemini-3-flash-preview
model = genai.GenerativeModel(settings.GEMINI_MODEL_NAME)

PROMPT_TEMPLATE = """
You are an intelligent Purchase Order extraction assistant.
Extract the following information from the email text below and return it as a JSON object:

- id: The PO number (e.g. PO-1234, GT-001).
- supplier: The name of the supplier.
- items: A summary string of items and quantities.
- expected_date: The expected delivery or ship date found in the email. Format cleanly (e.g. "Jan 15, 2024").
- status: One of the following EXACT values: "On Track", "Product Delays", "Shipped", "Shipment Delay".
- last_updated: The date of the email or today's date if not found. Format cleanly.

Email Content:
"{email_text}"

Return ONLY valid JSON. Do not include markdown formatting like ```json.
"""

async def parse_email_with_gemini(email_text: str) -> PurchaseOrder:
    if not settings.GEMINI_API_KEY:
        raise Exception("GEMINI_API_KEY is not set")
    
    try:
        # User requested thinking_level parameter
        response = model.generate_content(
            PROMPT_TEMPLATE.format(email_text=email_text),
            generation_config={"thinking_level": "low"}
        )
    except Exception as e:
        print(f"Error with thinking model/param: {e}. Retrying without config.")
        response = model.generate_content(PROMPT_TEMPLATE.format(email_text=email_text))
    
    try:
        # Clean response if it contains markdown code blocks
        text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        return PurchaseOrder(**data)
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        try:
            print(f"Raw response: {response.text}")
        except:
            pass
        raise ValueError("Failed to extract PO details from email.")

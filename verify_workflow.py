import requests
import json
import sys

BASE_URL = "http://localhost:8000/api"

SAMPLE_EMAIL = """
Subject: PO Update - PO-45821

Hi,

Your order PO-45821 from Acme Supplies is on track.

Expected ship date: Jan 15, 2024
Items: 500x Widget A, 200x Widget B

Thanks,
Acme Supplies Team
"""

def test_workflow():
    print("1. Testing Email Parsing...")
    parse_resp = requests.post(f"{BASE_URL}/orders/parse", json={"email_text": SAMPLE_EMAIL})
    if parse_resp.status_code != 200:
        print(f"FAILED: Parse failed with {parse_resp.status_code}")
        print(parse_resp.text)
        sys.exit(1)
    
    parsed_data = parse_resp.json()["parsed_data"]
    print(f"SUCCESS: Parsed PO {parsed_data['id']} from {parsed_data['supplier']}")
    print(json.dumps(parsed_data, indent=2))

    # Validate parsing
    if parsed_data["id"] != "PO-45821" or parsed_data["supplier"] != "Acme Supplies":
        print("FAILED: Parsed data does not match expected values")
        sys.exit(1)

    print("\n2. Testing Save Order...")
    save_resp = requests.post(f"{BASE_URL}/orders", json=parsed_data)
    if save_resp.status_code != 200:
        print(f"FAILED: Save failed with {save_resp.status_code}")
        sys.exit(1)
    print("SUCCESS: Order saved.")

    print("\n3. Testing List Orders...")
    list_resp = requests.get(f"{BASE_URL}/orders")
    orders = list_resp.json()
    if len(orders) != 1 or orders[0]["id"] != "PO-45821":
        print("FAILED: Order not found in list")
        sys.exit(1)
    print(f"SUCCESS: Found {len(orders)} order(s).")

    print("\n4. Testing Update Status...")
    update_resp = requests.patch(f"{BASE_URL}/orders/PO-45821/status?status=Shipped")
    if update_resp.status_code != 200:
        print(f"FAILED: Update failed with {update_resp.status_code}")
        sys.exit(1)
    
    updated_order = update_resp.json()
    if updated_order["status"] != "Shipped":
        print(f"FAILED: Status not updated. Got {updated_order['status']}")
        sys.exit(1)
    print("SUCCESS: Status updated to 'Shipped'.")

    print("\n5. Final Verification...")
    final_list = requests.get(f"{BASE_URL}/orders").json()
    if final_list[0]["status"] != "Shipped":
        print("FAILED: Final list check failed")
        sys.exit(1)
    
    print("\nALL CHECKS PASSED!")

if __name__ == "__main__":
    test_workflow()

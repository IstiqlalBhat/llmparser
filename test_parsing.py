import re
import requests
import json
import time

import os

API_URL = "http://localhost:8000/api/orders/parse"
TEST_FILE = os.path.join(os.path.dirname(__file__), "test_emails.md")

def extract_test_cases(filename):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    # Split by "### [Number]. [Title]"
    # Regex to find headers like "### 1. Standard Format"
    # We will split the content and associate each block with its title
    sections = re.split(r'### \d+\. ', content)
    
    # The first section is frontmatter/intro, skip it
    test_cases = []
    
    # Match the title from the previous split which consumes the "### N. " part
    # But re.split consumes the delimiter.
    # Let's iterate and extract manually for better control.
    
    lines = content.split('\n')
    current_title = None
    current_email_lines = []
    in_code_block = False
    
    for line in lines:
        if line.strip().startswith("### "):
            # Save previous case if exists
            if current_title and current_email_lines:
                test_cases.append({
                    "title": current_title,
                    "email": "\n".join(current_email_lines).strip()
                })
            
            current_title = line.strip().replace("### ", "")
            current_email_lines = []
            in_code_block = False
        
        elif line.strip().startswith("```"):
            in_code_block = not in_code_block
            continue # Don't include the backticks
            
        elif in_code_block:
            current_email_lines.append(line)

    # Add last one
    if current_title and current_email_lines:
         test_cases.append({
            "title": current_title,
            "email": "\n".join(current_email_lines).strip()
        })
        
    return test_cases

def test_parsing():
    cases = extract_test_cases(TEST_FILE)
    print(f"Found {len(cases)} test cases. Running in parallel...")
    
    print(f"Found {len(cases)} test cases.")
    
    success_count = 0
    failure_details = []

    for i, case in enumerate(cases):
        print(f"Testing {i+1}/{len(cases)}: {case['title']}...", end=" ", flush=True)
        
        try:
            payload = {"email_text": case["email"]}
            response = requests.post(API_URL, json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                parsed_orders = data.get("parsed_data", [])
                
                # Success criteria: At least one order parsed
                if parsed_orders and len(parsed_orders) > 0:
                    print("PASS")
                    success_count += 1
                else:
                    print("FAIL (No data parsed)")
                    failure_details.append({
                        "case": case["title"],
                        "reason": "No orders returned",
                        "response": data
                    })
            else:
                print(f"FAIL (Status {response.status_code})")
                failure_details.append({
                     "case": case["title"],
                     "reason": f"HTTP {response.status_code}",
                     "response": response.text
                })
                
        except Exception as e:
            print(f"FAIL (Exception)")
            failure_details.append({
                "case": case["title"],
                "reason": str(e),
                "response": "N/A"
            })
        
        # Rate limit to avoid hitting 429s
        time.sleep(2)

    print("\n" + "="*50)
    print(f"Results: {success_count}/{len(cases)} Passed")
    success_rate = (success_count / len(cases)) * 100
    print(f"Success Rate: {success_rate:.2f}%")
    print("="*50)

    if failure_details:
        print("\nFailures:")
        for fd in failure_details:
            print(f"- {fd['case']}: {fd['reason']}")
            
    if success_rate < 98:
        print("\nWARNING: Success rate is below 98%.")
        exit(1)
    else:
        print("\nSUCCESS: Target met!")
        exit(0)

if __name__ == "__main__":
    test_parsing()

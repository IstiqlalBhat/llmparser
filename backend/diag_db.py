"""
Database Diagnostics - Supabase Connection Checker
Tests connectivity to Supabase and verifies the purchase_orders table.
"""

import os
from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client

# Load env from root
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)


def check_db():
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    if not supabase_url or not supabase_key:
        print("[X] Missing Supabase credentials in .env")
        print(f"  NEXT_PUBLIC_SUPABASE_URL: {'set' if supabase_url else 'MISSING'}")
        print(f"  SUPABASE_SERVICE_ROLE_KEY: {'set' if supabase_key else 'MISSING'}")
        return

    print(f"Connecting to: {supabase_url}")

    try:
        client = create_client(supabase_url, supabase_key)
        print("[OK] Supabase client initialized!")

        # Test connection by querying the table
        response = client.table('purchase_orders').select('po_id').limit(1).execute()
        print("[OK] Connected to Supabase!")

        # Count records
        count_response = client.table('purchase_orders').select('*', count='exact').execute()
        record_count = count_response.count if count_response.count is not None else len(count_response.data)
        print(f"[OK] purchase_orders table has {record_count} records")

        # Show sample record if any exist
        if count_response.data:
            sample = count_response.data[0]
            print(f"\n  Sample record:")
            print(f"    po_id: {sample.get('po_id')}")
            print(f"    supplier: {sample.get('supplier')}")
            print(f"    status: {sample.get('status')}")
            print(f"    updated_at: {sample.get('updated_at')}")

        print("\n[OK] All checks passed! Database is ready.")

    except Exception as e:
        print(f"[X] Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    check_db()

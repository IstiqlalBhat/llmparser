import os
import asyncio
import asyncpg
from dotenv import load_dotenv
from pathlib import Path

# Load env from root
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

async def check_db():
    print(f"Connecting to: {os.getenv('DATABASE_URL')}")
    try:
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        print("Connected!")
        
        rows = await conn.fetch("SELECT * FROM purchase_orders")
        print(f"Total orders: {len(rows)}")
        
        for row in rows:
            print(f"\nOrder: {row['po_id']}")
            for key in row.keys():
                print(f"  {key}: {row[key]} ({type(row[key])})")
        
        await conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_db())

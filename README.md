# Purchase Order Management System

A full-stack application for managing Purchase Orders (POs) from supplier emails using AI-powered parsing.

## Features

- **AI-Powered Email Parsing** - Paste supplier emails and extract PO details automatically using Gemini AI
- **Manual Order Entry** - Create and edit orders manually when automatic parsing fails
- **Status Tracking** - Track orders through: On Track, Product Delays, Shipped, Shipment Delay
- **Search & Filter** - Find orders by PO ID, supplier, or status
- **Real-time Updates** - Update PO status manually as orders progress
- **PostgreSQL Database** - Production-ready with optimized indexes for fast retrieval

## Project Structure

```
lumari_interview-main/
├── .env                    # Environment variables (create from .env.example)
├── .env.example            # Environment template
├── README.md
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── core/           # Configuration
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic (Gemini AI, database)
│   │   └── schemas.py      # Pydantic models
│   ├── database/           # SQL schema and reset scripts
│   │   ├── schema.sql      # PostgreSQL schema with indexes
│   │   └── reset.sql       # Database reset script
│   ├── main.py             # App entrypoint
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities
│   └── types/              # TypeScript types
└── tests/                  # Test files
    ├── test_emails.md      # Sample email test cases
    ├── test_parsing.py     # Parsing benchmark script
    └── verify_workflow.py  # E2E workflow verification
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Python, FastAPI, uvicorn, asyncpg
- **AI**: Google Gemini API for email parsing
- **Database**: PostgreSQL (Supabase compatible)

## Environment Setup

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Edit `.env` and configure:

```env
# Gemini API Key (required)
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL Database (required)
# For Supabase: Use the Transaction pooler connection string (port 6543)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

> **Note:** Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/)

## Database Setup

### Using Supabase (Recommended)

1. Create a new project at [supabase.com](https://supabase.com)

2. Go to **Project Settings > Database** and copy the connection string (use "Transaction pooler" mode for best performance with PgBouncer)

3. Run the schema in the Supabase SQL Editor:
   - Open `backend/database/schema.sql`
   - Paste and run in **SQL Editor > New Query**

### Local PostgreSQL

1. Create a database:
```bash
createdb po_management
```

2. Run the schema:
```bash
psql -d po_management -f backend/database/schema.sql
```

## Running the Application

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

## Database Performance

The schema includes optimized indexes for fast retrieval:

| Index | Purpose |
|-------|---------|
| `po_id` (unique) | O(log n) lookups by PO ID |
| `status` | Fast "show all Shipped" queries |
| `supplier` | Fast supplier filtering |
| `(status, supplier)` | Combined filter optimization |
| `items` (GIN trigram) | Fast text search with `LIKE '%widget%'` |
| `created_at`, `updated_at` | Fast ordering by date |

### Reset Database

To reset the database (drops all data):

```bash
psql -d po_management -f backend/database/reset.sql
```

Or in Supabase SQL Editor, paste and run `reset.sql`.

## Sample Email Formats

The system handles various email formats:

```
Subject: PO Update - PO-45821

Hi,

Your order PO-45821 from Acme Supplies is on track.

Expected ship date: Jan 15, 2024
Items: 500x Widget A, 200x Widget B

Thanks,
Acme Supplies Team
```

```
From: logistics@globaltech.com
Subject: Shipment Notification

Purchase Order: GT2024-0012
Status: SHIPPED
Tracking: 1Z999AA10123456784
Ship Date: 2024-01-10

Items included:
- 100 units Model X
- 50 units Model Y

GlobalTech Logistics
```

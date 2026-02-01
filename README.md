# Purchase Order Management System

A full-stack application for managing Purchase Orders (POs) from supplier emails using AI-powered parsing.

## Features

- **AI-Powered Email Parsing** - Paste supplier emails and extract PO details automatically using Gemini AI
- **Manual Order Entry** - Create and edit orders manually when automatic parsing fails
- **Status Tracking** - Track orders through: On Track, Product Delays, Shipped, Shipment Delay
- **Search & Filter** - Find orders by PO ID, supplier, or status
- **Real-time Updates** - Update PO status manually as orders progress

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
- **Backend**: Python, FastAPI, uvicorn
- **AI**: Google Gemini API for email parsing
- **Database**: In-memory (for simplicity)

## Environment Setup

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

> **Note:** Get your API key from [Google AI Studio](https://aistudio.google.com/)

## Installation

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## Running the Application

### Start Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```

Backend runs on http://localhost:8000

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on http://localhost:3000

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

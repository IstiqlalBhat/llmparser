# Interview Challenge: Purchase Order Management System

Build a simple but functional PO (Purchase Order) management system that helps track orders from suppliers.

## Problem Statement

You receive emails from various suppliers with PO updates. You need a system to:
1. Parse and store PO information from pasted emails
2. Track PO status throughout the fulfillment lifecycle
3. Monitor delays and issues

## Requirements

### Core Features

1. **Email Parsing**
   - Paste supplier emails into a text area
   - Extract PO ID, supplier name, items, dates, and status information
   - Handle multiple email formats gracefully

2. **PO Status Tracking**
   - Track each PO with one of these statuses:
     - `On Track` - Order is progressing normally
     - `Product Delays` - Manufacturing/production issues
     - `Shipped` - Order has been dispatched
     - `Shipment Delay` - Logistics/shipping issues

3. **PO Management**
   - View all POs in a dashboard
   - Filter/search by PO ID, supplier, or status
   - Update PO status manually

### Example Dashboard Table

Your PO dashboard should display data similar to this:

| PO ID | Supplier | Items | Expected Date | Status | Last Updated |
|-------|----------|-------|---------------|--------|--------------|
| PO-45821 | Acme Supplies | 500x Widget A, 200x Widget B | Jan 15, 2024 | On Track | Jan 2, 2024 |
| GT2024-0012 | GlobalTech Logistics | 100x Model X, 50x Model Y | Jan 10, 2024 | Shipped | Jan 10, 2024 |
| PO12345 | MegaCorp International | 300x Component Z | Feb 5, 2024 | Product Delays | Jan 8, 2024 |
| PO-8821 | FastShip Co | 1000x Parts Kit | Jan 20, 2024 | Shipment Delay | Jan 18, 2024 |
| PO-2024-001 | TechParts Inc | 100x Circuit Board | Feb 10, 2024 | On Track | Jan 5, 2024 |


## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Python, FastAPI, uvicorn
- **Database**: in-memory for simplicity or local

## Sample Email Formats

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

```
URGENT: Production Delay - PO12345

Due to material shortages, we're experiencing delays on PO12345.

Original delivery: Jan 20
Revised delivery: Feb 5

Supplier: MegaCorp International
```


## Setup

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

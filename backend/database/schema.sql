-- ============================================================================
-- Purchase Order Management System - PostgreSQL Schema
-- Optimized for high performance with strategic indexing
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- For trigram text search

-- ============================================================================
-- ENUM TYPES
-- ============================================================================
-- Using ENUM for status is more efficient than VARCHAR for comparisons
-- and ensures data integrity at the database level

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'On Track',
        'Product Delays',
        'Shipped',
        'Shipment Delay'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS purchase_orders (
    -- Internal primary key: SERIAL for fast auto-increment inserts
    -- Using internal_id allows po_id to be mutable if business needs change
    internal_id         SERIAL PRIMARY KEY,
    
    -- Business identifier (user-facing PO ID like "PO-45821", "GT2024-0012")
    -- UNIQUE constraint automatically creates a B-Tree index
    po_id               VARCHAR(100) NOT NULL UNIQUE,
    
    -- Supplier information
    -- Indexed for fast filtering by supplier
    supplier            VARCHAR(255) NOT NULL DEFAULT 'Unknown Supplier',
    
    -- Items description (can be long, hence TEXT)
    -- GIN trigram index for fast LIKE '%keyword%' searches
    items               TEXT NOT NULL DEFAULT 'Items not specified',
    
    -- Expected delivery/ship date as parsed from email
    -- Stored as VARCHAR since format varies (e.g., "Jan 15, 2024", "2024-01-15")
    expected_date       VARCHAR(100),
    
    -- Order status with ENUM type
    -- Indexed for fast status filtering
    status              order_status NOT NULL DEFAULT 'On Track',
    
    -- Additional context (delay reasons, notes, etc.)
    additional_context  TEXT,
    
    -- Audit timestamps for tracking changes
    -- DEFAULT NOW() for automatic timestamping
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index on status: Fast filtering by order status
-- Example: "Show all shipped orders"
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status 
    ON purchase_orders(status);

-- Index on supplier: Fast filtering by supplier name
-- Example: "Show all orders from Acme Supplies"
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier 
    ON purchase_orders(supplier);

-- Composite index on (status, supplier): Optimized for combined filters
-- Example: "Show all shipped orders from Acme Supplies"
-- Order matters: status first (more selective) for this use case
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status_supplier 
    ON purchase_orders(status, supplier);

-- GIN trigram index on items: Fast text search with LIKE '%keyword%'
-- Example: "Find orders containing 'Widget A'"
-- This enables efficient substring matching without full table scan
CREATE INDEX IF NOT EXISTS idx_purchase_orders_items_trgm 
    ON purchase_orders USING GIN (items gin_trgm_ops);

-- Index on created_at: Fast ordering by creation date (for recent orders)
CREATE INDEX IF NOT EXISTS idx_purchase_orders_created_at 
    ON purchase_orders(created_at DESC);

-- Index on updated_at: Fast ordering by last update
CREATE INDEX IF NOT EXISTS idx_purchase_orders_updated_at 
    ON purchase_orders(updated_at DESC);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on any row modification
DROP TRIGGER IF EXISTS trigger_update_purchase_orders_timestamp ON purchase_orders;
CREATE TRIGGER trigger_update_purchase_orders_timestamp
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE purchase_orders IS 'Stores purchase order information parsed from supplier emails';
COMMENT ON COLUMN purchase_orders.internal_id IS 'Auto-increment internal ID for fast joins';
COMMENT ON COLUMN purchase_orders.po_id IS 'Business-facing PO identifier (e.g., PO-45821)';
COMMENT ON COLUMN purchase_orders.status IS 'Current order status: On Track, Product Delays, Shipped, Shipment Delay';
COMMENT ON COLUMN purchase_orders.items IS 'Description of items in the order (supports text search)';

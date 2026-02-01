-- ============================================================================
-- Purchase Order Management System - Database Reset Script
-- WARNING: This will DELETE ALL DATA and recreate the schema
-- ============================================================================

-- Drop triggers first (depends on functions)
DROP TRIGGER IF EXISTS trigger_update_purchase_orders_timestamp ON purchase_orders;

-- Drop tables (CASCADE handles dependent objects)
DROP TABLE IF EXISTS purchase_orders CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS order_status CASCADE;

-- ============================================================================
-- Recreate everything from schema.sql
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create ENUM type
CREATE TYPE order_status AS ENUM (
    'On Track',
    'Product Delays',
    'Shipped',
    'Shipment Delay'
);

-- Create main table
CREATE TABLE purchase_orders (
    internal_id         SERIAL PRIMARY KEY,
    po_id               VARCHAR(100) NOT NULL UNIQUE,
    supplier            VARCHAR(255) NOT NULL DEFAULT 'Unknown Supplier',
    items               TEXT NOT NULL DEFAULT 'Items not specified',
    expected_date       VARCHAR(100),
    status              order_status NOT NULL DEFAULT 'On Track',
    additional_context  TEXT,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier);
CREATE INDEX idx_purchase_orders_status_supplier ON purchase_orders(status, supplier);
CREATE INDEX idx_purchase_orders_items_trgm ON purchase_orders USING GIN (items gin_trgm_ops);
CREATE INDEX idx_purchase_orders_created_at ON purchase_orders(created_at DESC);
CREATE INDEX idx_purchase_orders_updated_at ON purchase_orders(updated_at DESC);

-- Create auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_purchase_orders_timestamp
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Confirmation message
DO $$ BEGIN
    RAISE NOTICE 'Database reset complete. All tables and indexes recreated.';
END $$;

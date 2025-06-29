-- Initialize database with extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products_product USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders_order(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments_payment(status); 
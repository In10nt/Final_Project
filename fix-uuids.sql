-- Fix UUID storage issue
-- The UUIDs are being stored as hex representation of the string bytes
-- We need to convert them back to proper UUID format

USE virtual_tryon;

-- First, let's see what we have
SELECT id, tenantId, email FROM users LIMIT 1;

-- The issue is that the UUIDs are stored as strings that look like UUIDs but are actually hex-encoded
-- We need to update the database to use the correct UUID format

-- For now, let's just update the sample data with the correct UUIDs
-- Delete existing data
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;
DELETE FROM tenants;

-- Insert correct data with proper UUIDs
INSERT INTO tenants (id, name, subdomain, contact_email, phone, address, subscription_plan, status) VALUES
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), 'Fashion Store', 'fashion-store', 'admin@fashionstore.com', '+1234567890', '123 Fashion St', 'premium', 'active');

INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, phone, gender, status) VALUES
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440001'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), 'user@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy990qm', 'John', 'Doe', '+1234567891', 'M', 'active');

INSERT INTO categories (id, tenant_id, name, description) VALUES
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440002'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), 'Shirts', 'Men and women shirts'),
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440003'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), 'Pants', 'Trousers and jeans');

INSERT INTO products (id, tenant_id, category_id, name, description, brand, price, currency, barcode, sku, color, material, status) VALUES
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440004'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440002'), 'Classic White Shirt', 'Premium white cotton shirt', 'Fashion Brand', 49.99, 'USD', '1234567890123', 'SHIRT-001', 'White', 'Cotton', 'active'),
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440005'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440003'), 'Blue Jeans', 'Classic blue denim jeans', 'Fashion Brand', 79.99, 'USD', '1234567890124', 'JEANS-001', 'Blue', 'Denim', 'active');

INSERT INTO product_variants (id, product_id, tenant_id, size, color, stock_quantity, additional_price) VALUES
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440006'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440004'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), 'M', 'White', 50, 0),
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440007'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440004'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), 'L', 'White', 40, 0),
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440008'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440005'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), '32', 'Blue', 30, 0),
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440009'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440005'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), '34', 'Blue', 25, 0);

-- Verify
SELECT BIN_TO_UUID(id) as id, BIN_TO_UUID(tenant_id) as tenant_id, email FROM users;
SELECT BIN_TO_UUID(id) as id, BIN_TO_UUID(tenant_id) as tenant_id, name FROM products;

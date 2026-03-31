USE virtual_tryon;

-- ========================================
-- COMPLETE DATABASE SETUP
-- Fashion Boutique Shop
-- ========================================

SET SQL_SAFE_UPDATES = 0;

-- Clean everything
TRUNCATE TABLE body_profiles;
TRUNCATE TABLE products;
TRUNCATE TABLE users;
TRUNCATE TABLE tenant_admins;

-- ========================================
-- STEP 1: CREATE ADMIN
-- Email: admin@example.com
-- Password: admin123
-- Tenant ID: 550e8400-e29b-41d4-a716-446655440099
-- ========================================

INSERT INTO tenant_admins (id, tenant_id, email, password_hash, first_name, last_name, created_at)
VALUES (
    '2f06ee50-2cc1-11f1-8011-00155da62f2d',
    '550e8400-e29b-41d4-a716-446655440099',
    'admin@example.com',
    '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
    'Admin',
    'User',
    NOW()
);

INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, user_type, status, created_at, updated_at)
VALUES (
    '2f06ee50-2cc1-11f1-8011-00155da62f2d',
    '550e8400-e29b-41d4-a716-446655440099',
    'admin@example.com',
    '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
    'Admin',
    'User',
    'ADMIN',
    'active',
    NOW(),
    NOW()
);

-- ========================================
-- STEP 2: CREATE PRODUCTS (Same tenant as admin)
-- All products belong to tenant: 550e8400-e29b-41d4-a716-446655440099
-- ========================================

INSERT INTO products (id, tenant_id, name, description, price, brand, color, material, sku, barcode, status, created_at, updated_at)
VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440099', 
 'Classic White Shirt', 'A timeless white shirt perfect for any occasion', 49.99, 
 'Fashion Boutique', 'White', 'Cotton', 'WS001', '1234567890001', 'active', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440099', 
 'Blue Denim Jeans', 'Comfortable blue denim jeans with modern fit', 79.99, 
 'Fashion Boutique', 'Blue', 'Denim', 'BJ001', '1234567890002', 'active', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440099', 
 'Summer Dress', 'Light and breezy summer dress', 89.99, 
 'Fashion Boutique', 'Pink', 'Cotton Blend', 'SD001', '1234567890003', 'active', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440099', 
 'Black Leather Jacket', 'Stylish black leather jacket', 199.99, 
 'Fashion Boutique', 'Black', 'Leather', 'LJ001', '1234567890004', 'active', NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440099', 
 'Red T-Shirt', 'Casual red t-shirt for everyday wear', 29.99, 
 'Fashion Boutique', 'Red', 'Cotton', 'RT001', '1234567890005', 'active', NOW(), NOW());

-- ========================================
-- STEP 3: CREATE CUSTOMERS
-- Password for all: customer123
-- Each customer has their own tenant_id (self-tenant)
-- ========================================

INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, phone, date_of_birth, gender, user_type, status, created_at, updated_at)
VALUES
('3a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', '3a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
 'sarah.johnson@email.com', '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
 'Sarah', 'Johnson', '555-0101', '1995-03-15', 'Female', 'CUSTOMER', 'active', NOW(), NOW()),

('4b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e', '4b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
 'mike.davis@email.com', '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
 'Mike', 'Davis', '555-0102', '1988-07-22', 'Male', 'CUSTOMER', 'active', NOW(), NOW()),

('5c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f', '5c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
 'emily.chen@email.com', '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
 'Emily', 'Chen', '555-0103', '1992-11-08', 'Female', 'CUSTOMER', 'active', NOW(), NOW());

SET SQL_SAFE_UPDATES = 1;

-- ========================================
-- VERIFICATION
-- ========================================

SELECT '================================================' as '';
SELECT 'SETUP COMPLETE - Fashion Boutique' as '';
SELECT '================================================' as '';

SELECT 'ADMIN ACCOUNT:' as '';
SELECT email, first_name, tenant_id FROM tenant_admins;

SELECT 'PRODUCTS (Admin will see these):' as '';
SELECT name, price, brand, tenant_id FROM products ORDER BY name;

SELECT 'CUSTOMERS:' as '';
SELECT email, first_name, last_name, user_type FROM users WHERE user_type = 'CUSTOMER' ORDER BY first_name;

SELECT '================================================' as '';
SELECT 'LOGIN CREDENTIALS' as '';
SELECT '================================================' as '';
SELECT 'Admin Dashboard (http://localhost:3002):' as '';
SELECT '  Email: admin@example.com' as '';
SELECT '  Password: admin123' as '';
SELECT '' as '';
SELECT 'Customer Store (http://localhost:3001):' as '';
SELECT '  sarah.johnson@email.com / customer123' as '';
SELECT '  mike.davis@email.com / customer123' as '';
SELECT '  emily.chen@email.com / customer123' as '';
SELECT '================================================' as '';

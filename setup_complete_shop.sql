USE virtual_tryon;

-- Clean up existing data first
SET SQL_SAFE_UPDATES = 0;
DELETE FROM body_profiles;
DELETE FROM products;
DELETE FROM users;
DELETE FROM tenant_admins;
DELETE FROM tenants;
SET SQL_SAFE_UPDATES = 1;

-- ========================================
-- 1. CREATE TENANT (Shop/Company)
-- ========================================
INSERT INTO tenants (id, name, domain, status, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440099',
    'Fashion Boutique',
    'fashionboutique.com',
    'active',
    NOW(),
    NOW()
);

-- ========================================
-- 2. CREATE ADMIN for this shop
-- ========================================
-- Password: admin123 (BCrypt hash)
INSERT INTO tenant_admins (id, tenant_id, email, password_hash, first_name, last_name, role, status, created_at, updated_at)
VALUES (
    '2f06ee50-2cc1-11f1-8011-00155da62f2d',
    '550e8400-e29b-41d4-a716-446655440099',
    'admin@fashionboutique.com',
    '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
    'John',
    'Admin',
    'admin',
    'active',
    NOW(),
    NOW()
);

-- Also add to users table for compatibility
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, user_type, status, created_at, updated_at)
VALUES (
    '2f06ee50-2cc1-11f1-8011-00155da62f2d',
    '550e8400-e29b-41d4-a716-446655440099',
    'admin@fashionboutique.com',
    '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
    'John',
    'Admin',
    'ADMIN',
    'active',
    NOW(),
    NOW()
);

-- ========================================
-- 3. CREATE PRODUCTS for this shop
-- ========================================
INSERT INTO products (id, tenant_id, name, description, price, category, brand, color, material, image_url, sku, barcode, stock_quantity, status, created_at, updated_at)
VALUES
-- Product 1: White Shirt
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440099', 
 'Classic White Shirt', 'A timeless white shirt perfect for any occasion', 49.99, 
 'Shirts', 'Fashion Boutique', 'White', 'Cotton', 
 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Shirt', 
 'WS001', '1234567890001', 100, 'active', NOW(), NOW()),

-- Product 2: Blue Jeans
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440099', 
 'Blue Denim Jeans', 'Comfortable blue denim jeans with modern fit', 79.99, 
 'Pants', 'Fashion Boutique', 'Blue', 'Denim', 
 'https://via.placeholder.com/300x400/4169e1/ffffff?text=Blue+Jeans', 
 'BJ001', '1234567890002', 80, 'active', NOW(), NOW()),

-- Product 3: Summer Dress
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440099', 
 'Summer Dress', 'Light and breezy summer dress', 89.99, 
 'Dresses', 'Fashion Boutique', 'Pink', 'Cotton Blend', 
 'https://via.placeholder.com/300x400/ff69b4/ffffff?text=Summer+Dress', 
 'SD001', '1234567890003', 50, 'active', NOW(), NOW()),

-- Product 4: Leather Jacket
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440099', 
 'Black Leather Jacket', 'Stylish black leather jacket', 199.99, 
 'Jackets', 'Fashion Boutique', 'Black', 'Leather', 
 'https://via.placeholder.com/300x400/000000/ffffff?text=Leather+Jacket', 
 'LJ001', '1234567890004', 30, 'active', NOW(), NOW()),

-- Product 5: Red T-Shirt
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440099', 
 'Red T-Shirt', 'Casual red t-shirt for everyday wear', 29.99, 
 'T-Shirts', 'Fashion Boutique', 'Red', 'Cotton', 
 'https://via.placeholder.com/300x400/ff0000/ffffff?text=Red+T-Shirt', 
 'RT001', '1234567890005', 150, 'active', NOW(), NOW());

-- ========================================
-- 4. CREATE CUSTOMERS for this shop
-- ========================================
-- Customer 1: Sarah Johnson
-- Password: customer123
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, phone, date_of_birth, gender, user_type, status, created_at, updated_at)
VALUES (
    '3a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
    '3a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
    'sarah.johnson@email.com',
    '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
    'Sarah',
    'Johnson',
    '555-0101',
    '1995-03-15',
    'Female',
    'CUSTOMER',
    'active',
    NOW(),
    NOW()
);

-- Customer 2: Mike Davis
-- Password: customer123
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, phone, date_of_birth, gender, user_type, status, created_at, updated_at)
VALUES (
    '4b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
    '4b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
    'mike.davis@email.com',
    '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
    'Mike',
    'Davis',
    '555-0102',
    '1988-07-22',
    'Male',
    'CUSTOMER',
    'active',
    NOW(),
    NOW()
);

-- Customer 3: Emily Chen
-- Password: customer123
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, phone, date_of_birth, gender, user_type, status, created_at, updated_at)
VALUES (
    '5c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
    '5c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
    'emily.chen@email.com',
    '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
    'Emily',
    'Chen',
    '555-0103',
    '1992-11-08',
    'Female',
    'CUSTOMER',
    'active',
    NOW(),
    NOW()
);

-- ========================================
-- VERIFICATION
-- ========================================
SELECT '========================================' as '';
SELECT 'SETUP COMPLETE!' as '';
SELECT '========================================' as '';

SELECT 'Tenant (Shop):' as Info;
SELECT id, name, domain, status FROM tenants;

SELECT 'Admin:' as Info;
SELECT id, tenant_id, email, first_name, last_name FROM tenant_admins;

SELECT 'Products:' as Info;
SELECT id, tenant_id, name, price, brand FROM products;

SELECT 'Customers:' as Info;
SELECT id, email, first_name, last_name, user_type FROM users WHERE user_type = 'CUSTOMER';

SELECT '========================================' as '';
SELECT 'LOGIN CREDENTIALS:' as '';
SELECT '========================================' as '';
SELECT 'Admin Login:' as '';
SELECT '  Email: admin@fashionboutique.com' as '';
SELECT '  Password: admin123' as '';
SELECT '' as '';
SELECT 'Customer Logins (all use password: customer123):' as '';
SELECT '  1. sarah.johnson@email.com' as '';
SELECT '  2. mike.davis@email.com' as '';
SELECT '  3. emily.chen@email.com' as '';

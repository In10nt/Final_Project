-- Virtual Try-On Database Queries
-- Use these queries to explore your database

-- ================================
-- BASIC TABLE INFORMATION
-- ================================

-- List all tables
\dt

-- Show table structure
\d products
\d users
\d tenants
\d body_profiles

-- ================================
-- VIEW DATA
-- ================================

-- View all products
SELECT 
    id,
    name,
    brand,
    price,
    color,
    material,
    sku,
    barcode,
    model_3d_url,
    image_url,
    status
FROM products
ORDER BY name;

-- View all users
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    tenant_id
FROM users;

-- View all tenants (stores)
SELECT 
    id,
    name,
    subdomain,
    contact_email,
    status
FROM tenants;

-- View body profiles
SELECT 
    id,
    user_id,
    height,
    weight,
    chest,
    waist,
    hip,
    body_shape,
    skin_tone,
    created_at
FROM body_profiles;

-- ================================
-- ANALYTICS QUERIES
-- ================================

-- Count products by brand
SELECT 
    brand,
    COUNT(*) as product_count,
    AVG(price) as avg_price
FROM products 
GROUP BY brand
ORDER BY product_count DESC;

-- Count products by color
SELECT 
    color,
    COUNT(*) as count
FROM products 
GROUP BY color
ORDER BY count DESC;

-- Count users by role
SELECT 
    role,
    COUNT(*) as user_count
FROM users 
GROUP BY role;

-- Products with 3D models
SELECT 
    name,
    brand,
    price,
    model_3d_url
FROM products 
WHERE model_3d_url IS NOT NULL;

-- ================================
-- SEARCH QUERIES
-- ================================

-- Search products by name
SELECT * FROM products 
WHERE name ILIKE '%dress%';

-- Search products by price range
SELECT * FROM products 
WHERE price BETWEEN 50 AND 200
ORDER BY price;

-- Search products by brand
SELECT * FROM products 
WHERE brand = 'Nike'
ORDER BY name;

-- ================================
-- INSERT SAMPLE DATA
-- ================================

-- Add a new product
INSERT INTO products (
    id,
    tenant_id,
    name,
    description,
    brand,
    price,
    currency,
    barcode,
    sku,
    color,
    material,
    status,
    model_3d_url,
    image_url
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM tenants LIMIT 1),
    'Sample Dress',
    'Beautiful sample dress for testing',
    'Sample Brand',
    99.99,
    'USD',
    '1234567890999',
    'SAMPLE-DRESS-001',
    'Blue',
    'Cotton',
    'active',
    'https://example.com/dress.glb',
    'https://example.com/dress.jpg'
);

-- Add a new user
INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    first_name,
    last_name,
    role
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM tenants LIMIT 1),
    'newuser@demo.com',
    '$2a$10$example.hash.here',
    'New',
    'User',
    'customer'
);

-- ================================
-- UPDATE QUERIES
-- ================================

-- Update product price
UPDATE products 
SET price = 149.99 
WHERE sku = 'SAMPLE-DRESS-001';

-- Update product with 3D model
UPDATE products 
SET model_3d_url = 'https://example.com/new-model.glb'
WHERE id = 'your-product-id-here';

-- ================================
-- DELETE QUERIES (USE WITH CAUTION)
-- ================================

-- Delete a specific product
-- DELETE FROM products WHERE sku = 'SAMPLE-DRESS-001';

-- Delete products by brand
-- DELETE FROM products WHERE brand = 'Test Brand';

-- ================================
-- ADVANCED QUERIES
-- ================================

-- Products with their tenant information
SELECT 
    p.name as product_name,
    p.brand,
    p.price,
    t.name as store_name,
    t.subdomain
FROM products p
JOIN tenants t ON p.tenant_id = t.id
ORDER BY t.name, p.name;

-- Users with their body profiles
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    bp.height,
    bp.weight,
    bp.body_shape,
    bp.skin_tone
FROM users u
LEFT JOIN body_profiles bp ON u.id = bp.user_id
WHERE u.role = 'customer';

-- Count of products per tenant
SELECT 
    t.name as store_name,
    COUNT(p.id) as product_count,
    AVG(p.price) as avg_price
FROM tenants t
LEFT JOIN products p ON t.id = p.tenant_id
GROUP BY t.id, t.name
ORDER BY product_count DESC;

-- ================================
-- DATABASE MAINTENANCE
-- ================================

-- Check database size
SELECT 
    pg_size_pretty(pg_database_size('virtual_tryon_db')) as database_size;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Show active connections
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start
FROM pg_stat_activity 
WHERE datname = 'virtual_tryon_db';
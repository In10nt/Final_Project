-- ============================================
-- DIAGNOSTIC: Check Classic White Shirt Status
-- ============================================

USE virtual_tryon;

-- 1. Check if the product exists
SELECT '=== CHECKING IF PRODUCT EXISTS ===' AS Status;
SELECT id, name, status, model3d_url, image_url, price, brand
FROM products 
WHERE name = 'Classic White Shirt';

-- 2. Check all products to see what's in the database
SELECT '=== ALL PRODUCTS IN DATABASE ===' AS Status;
SELECT id, name, status, model3d_url, image_url
FROM products
ORDER BY name;

-- 3. Count total products
SELECT '=== PRODUCT COUNT ===' AS Status;
SELECT COUNT(*) as total_products FROM products;

-- 4. Check for products with 'inactive' status
SELECT '=== INACTIVE PRODUCTS ===' AS Status;
SELECT id, name, status
FROM products
WHERE status != 'active';

-- ============================================
-- FIX: Ensure Classic White Shirt is active and has correct data
-- ============================================

-- Update Classic White Shirt to ensure it's active
UPDATE products 
SET 
    status = 'active',
    model3d_url = '/uploads/models/shirt_fitted.obj',
    image_url = 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Shirt'
WHERE name = 'Classic White Shirt';

-- Verify the update
SELECT '=== AFTER UPDATE ===' AS Status;
SELECT id, name, status, model3d_url, image_url, price
FROM products 
WHERE name = 'Classic White Shirt';

SELECT '=== FIX COMPLETE ===' AS Status;

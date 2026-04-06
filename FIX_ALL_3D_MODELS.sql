-- Fix all 3D model URLs for products
-- Run this script to ensure correct FITTED models are assigned

-- First, check current state
SELECT id, name, model3d_url 
FROM products 
WHERE name IN ('Classic White Shirt', 'Blue Denim Jeans', 'Black Formal Suit')
ORDER BY name;

-- Update Classic White Shirt to use FITTED shirt
UPDATE products 
SET model3d_url = '/uploads/models/shirt_fitted.obj'
WHERE name = 'Classic White Shirt';

-- Update Blue Denim Jeans to use FITTED pants
UPDATE products 
SET model3d_url = '/uploads/models/pant_fitted.obj'
WHERE name = 'Blue Denim Jeans';

-- Update Black Formal Suit to use suit (no fitted version yet)
UPDATE products 
SET model3d_url = '/uploads/models/suit.obj'
WHERE name = 'Black Formal Suit';

-- Verify the updates
SELECT id, name, model3d_url 
FROM products 
WHERE name IN ('Classic White Shirt', 'Blue Denim Jeans', 'Black Formal Suit')
ORDER BY name;

-- Show all products with 3D models
SELECT id, name, color, model3d_url 
FROM products 
WHERE model3d_url IS NOT NULL
ORDER BY name;

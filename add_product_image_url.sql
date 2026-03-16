-- Add image_url column to products table
USE virtual_tryon;

ALTER TABLE products 
ADD COLUMN image_url TEXT;

-- Update existing products with placeholder images
UPDATE products 
SET image_url = CASE 
    WHEN name LIKE '%shirt%' OR name LIKE '%Shirt%' THEN 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Shirt'
    WHEN name LIKE '%jean%' OR name LIKE '%Jean%' OR name LIKE '%denim%' THEN 'https://via.placeholder.com/300x400/4169e1/ffffff?text=Blue+Jeans'
    ELSE CONCAT('https://via.placeholder.com/300x400/cccccc/333333?text=', REPLACE(name, ' ', '+'))
END
WHERE image_url IS NULL;

-- Verify the changes
SELECT BIN_TO_UUID(id) as id, name, price, color, material, image_url FROM products;
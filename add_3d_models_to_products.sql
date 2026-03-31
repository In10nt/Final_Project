USE virtual_tryon;

-- Add columns if they don't exist (MySQL doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN)
-- Check and add model3d_url column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'virtual_tryon' 
AND TABLE_NAME = 'products' 
AND COLUMN_NAME = 'model3d_url';

SET @query = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN model3d_url TEXT AFTER material', 
    'SELECT "Column model3d_url already exists" as message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add image_url column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'virtual_tryon' 
AND TABLE_NAME = 'products' 
AND COLUMN_NAME = 'image_url';

SET @query = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN image_url TEXT AFTER material', 
    'SELECT "Column image_url already exists" as message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Disable safe update mode temporarily
SET SQL_SAFE_UPDATES = 0;

-- Update products with 3D model URLs
UPDATE products SET model3d_url = '/uploads/models/shirt.obj' WHERE name LIKE '%Shirt%';
UPDATE products SET model3d_url = '/uploads/models/pant.obj' WHERE name LIKE '%Jeans%' OR name LIKE '%Pant%';
UPDATE products SET model3d_url = '/uploads/models/suit.obj' WHERE name LIKE '%Jacket%' OR name LIKE '%Suit%';
UPDATE products SET model3d_url = '/uploads/models/shirt.obj' WHERE name LIKE '%T-Shirt%';
UPDATE products SET model3d_url = '/uploads/models/suit.obj' WHERE name LIKE '%Dress%';

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Verify
SELECT 'Products with 3D models:' as Status;
SELECT id, name, model3d_url FROM products;

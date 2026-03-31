USE virtual_tryon;

-- Step 1: Check current products
SELECT 
    id,
    name,
    color,
    material,
    model3d_url,
    image_url
FROM products
ORDER BY name;

-- Step 2: Add columns (MySQL 8.0+ syntax)
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'virtual_tryon' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'model3d_url');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN model3d_url TEXT AFTER material', 
    'SELECT "model3d_url column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'virtual_tryon' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'image_url');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN image_url TEXT AFTER material', 
    'SELECT "image_url column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 3: Show products again to confirm columns added
SELECT 
    id,
    name,
    color,
    material,
    model3d_url,
    image_url
FROM products
ORDER BY name;

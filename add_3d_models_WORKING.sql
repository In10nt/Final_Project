USE virtual_tryon;

-- Step 1: Add columns if they don't exist
-- Check and add model3d_url column
SET @dbname = 'virtual_tryon';
SET @tablename = 'products';
SET @columnname = 'model3d_url';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 'Column model3d_url already exists' AS msg;",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " TEXT;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add image_url column
SET @columnname = 'image_url';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 'Column image_url already exists' AS msg;",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " TEXT;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 2: Show current products
SELECT 'Current Products:' AS Status;
SELECT id, name, color, material, model3d_url, image_url FROM products;

-- Step 3: Update products with 3D model URLs using ID (safe mode compatible)
-- First, let's get the product IDs and update them one by one

-- For products with 'Shirt' in name
UPDATE products 
SET model3d_url = '/uploads/models/shirt.obj' 
WHERE id IN (SELECT id FROM (SELECT id FROM products WHERE name LIKE '%Shirt%') AS temp);

-- For products with 'Jeans' or 'Pant' in name
UPDATE products 
SET model3d_url = '/uploads/models/pant.obj' 
WHERE id IN (SELECT id FROM (SELECT id FROM products WHERE name LIKE '%Jeans%' OR name LIKE '%Pant%') AS temp);

-- For products with 'Jacket' or 'Suit' in name
UPDATE products 
SET model3d_url = '/uploads/models/suit.obj' 
WHERE id IN (SELECT id FROM (SELECT id FROM products WHERE name LIKE '%Jacket%' OR name LIKE '%Suit%') AS temp);

-- For products with 'T-Shirt' in name (if not already updated)
UPDATE products 
SET model3d_url = '/uploads/models/shirt.obj' 
WHERE id IN (SELECT id FROM (SELECT id FROM products WHERE name LIKE '%T-Shirt%' AND model3d_url IS NULL) AS temp);

-- For products with 'Dress' in name
UPDATE products 
SET model3d_url = '/uploads/models/suit.obj' 
WHERE id IN (SELECT id FROM (SELECT id FROM products WHERE name LIKE '%Dress%') AS temp);

-- Step 4: Verify the updates
SELECT 'Updated Products:' AS Status;
SELECT id, name, color, material, model3d_url, image_url FROM products;

-- Step 5: Show summary
SELECT 
    CASE 
        WHEN model3d_url IS NOT NULL THEN 'Has 3D Model'
        ELSE 'No 3D Model'
    END AS model_status,
    COUNT(*) AS count
FROM products
GROUP BY model_status;

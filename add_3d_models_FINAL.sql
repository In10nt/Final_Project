USE virtual_tryon;

-- Add columns (simple ALTER TABLE)
ALTER TABLE products ADD COLUMN model3d_url TEXT;
ALTER TABLE products ADD COLUMN image_url TEXT;

-- Show current products
SELECT id, name FROM products;

-- Update products by ID (you need to replace 'product-id-here' with actual IDs from above)
-- Example:
-- UPDATE products SET model3d_url = '/uploads/models/shirt.obj' WHERE id = 'actual-product-id';

-- Verify
SELECT id, name, model3d_url FROM products;

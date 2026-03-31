USE virtual_tryon;

-- First, let's see what products we have
SELECT id, name, model3d_url FROM products;

-- Add columns if they don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS model3d_url TEXT AFTER material;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT AFTER material;

-- Now update each product individually by ID
-- You'll need to replace the IDs below with your actual product IDs from the SELECT above

-- Example updates - replace with your actual product IDs:
-- UPDATE products SET model3d_url = '/uploads/models/shirt.obj' WHERE id = 'your-product-id-here';
-- UPDATE products SET model3d_url = '/uploads/models/pant.obj' WHERE id = 'your-product-id-here';
-- UPDATE products SET model3d_url = '/uploads/models/suit.obj' WHERE id = 'your-product-id-here';

-- Verify the updates
SELECT id, name, model3d_url, image_url FROM products;

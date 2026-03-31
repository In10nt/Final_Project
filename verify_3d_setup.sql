USE virtual_tryon;

-- Check if model3d_url column exists
SELECT 'Checking products table structure:' as Status;
DESCRIBE products;

-- Check if any products have 3D models
SELECT 'Products with 3D models:' as Status;
SELECT id, name, image_url, model3d_url FROM products;

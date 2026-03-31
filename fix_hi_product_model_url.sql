USE virtual_tryon;

-- Fix the "hi" product model URL
UPDATE products 
SET model3d_url = '/uploads/models/shirt.obj' 
WHERE name = 'hi' AND model3d_url = 'shirt.obj';

-- Verify
SELECT id, name, model3d_url FROM products WHERE name = 'hi';

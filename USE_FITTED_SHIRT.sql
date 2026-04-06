-- Use the fitted shirt model
UPDATE products 
SET model3d_url = '/uploads/models/shirt_fitted.obj'
WHERE name = 'Classic White Shirt';

-- Verify
SELECT name, model3d_url FROM products WHERE name = 'Classic White Shirt';

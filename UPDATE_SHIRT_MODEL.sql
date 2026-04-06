-- Update Classic White Shirt to use the fitted model
UPDATE products 
SET model3d_url = '/uploads/models/shirt_fitted.obj'
WHERE name = 'Classic White Shirt';

-- Update pants to use correct model
UPDATE products 
SET model3d_url = '/uploads/models/pant.obj'
WHERE name LIKE '%Jeans%' OR name LIKE '%Pant%';

-- Verify the updates
SELECT id, name, model3d_url 
FROM products 
WHERE model3d_url IS NOT NULL;

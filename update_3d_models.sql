USE virtual_tryon;

-- Show current products with their IDs
SELECT id, name, model3d_url FROM products;

-- Copy the IDs from above and run these UPDATE statements one by one:
-- Replace 'YOUR-PRODUCT-ID-HERE' with the actual ID from the SELECT above

-- Example for a shirt product:
-- UPDATE products SET model3d_url = '/uploads/models/shirt.obj' WHERE id = 'YOUR-PRODUCT-ID-HERE';

-- Example for a pants product:
-- UPDATE products SET model3d_url = '/uploads/models/pant.obj' WHERE id = 'YOUR-PRODUCT-ID-HERE';

-- Example for a suit product:
-- UPDATE products SET model3d_url = '/uploads/models/suit.obj' WHERE id = 'YOUR-PRODUCT-ID-HERE';

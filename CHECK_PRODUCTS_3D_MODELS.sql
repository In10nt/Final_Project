-- Check which products have 3D models
USE virtual_tryon;

SELECT 
    id,
    name,
    model3d_url,
    CASE 
        WHEN model3d_url IS NOT NULL AND model3d_url != '' THEN '✅ Has 3D Model'
        ELSE '❌ No 3D Model'
    END AS model_status
FROM products
ORDER BY name;

-- Show all product details
SELECT * FROM products;

USE virtual_tryon;

-- Check admin's tenant_id
SELECT 'Admin Info:' as Info;
SELECT id, tenant_id, email, user_type FROM users WHERE email = 'admin@example.com';

-- Check products' tenant_id
SELECT 'Products Info:' as Info;
SELECT id, tenant_id, name FROM products LIMIT 5;

-- Check if they match
SELECT 'Tenant Match Check:' as Info;
SELECT 
    (SELECT tenant_id FROM users WHERE email = 'admin@example.com') as admin_tenant_id,
    (SELECT DISTINCT tenant_id FROM products LIMIT 1) as products_tenant_id,
    CASE 
        WHEN (SELECT tenant_id FROM users WHERE email = 'admin@example.com') = (SELECT DISTINCT tenant_id FROM products LIMIT 1)
        THEN 'MATCH - Products will show'
        ELSE 'MISMATCH - Products will NOT show'
    END as status;

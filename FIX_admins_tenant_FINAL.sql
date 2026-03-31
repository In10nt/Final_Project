USE virtual_tryon;

-- Update admins table with correct tenant_id
UPDATE admins 
SET tenant_id = '550e8400-e29b-41d4-a716-446655440099'
WHERE email = 'admin@example.com';

-- Verify
SELECT 'Admin tenant_id after fix:' as Info;
SELECT id, tenant_id, LENGTH(tenant_id) as len, email FROM admins WHERE email = 'admin@example.com';

SELECT 'Products tenant_id:' as Info;
SELECT DISTINCT tenant_id, LENGTH(tenant_id) as len FROM products;

SELECT 'Match check:' as Info;
SELECT 
    CASE 
        WHEN (SELECT tenant_id FROM admins WHERE email = 'admin@example.com') = '550e8400-e29b-41d4-a716-446655440099'
        THEN 'SUCCESS - Admin will see products!'
        ELSE 'FAILED - Still mismatch'
    END as result;

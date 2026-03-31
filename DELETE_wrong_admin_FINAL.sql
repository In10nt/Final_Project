USE virtual_tryon;

-- Delete the admin with wrong tenant_id
DELETE FROM admins 
WHERE email = 'admin@example.com' 
AND tenant_id = '32663036-6237-3835-2d32-6363312d3131';

-- Verify only one admin remains with correct tenant_id
SELECT 'Remaining admin:' as Info;
SELECT id, tenant_id, LENGTH(tenant_id) as len, email FROM admins WHERE email = 'admin@example.com';

-- Verify it matches products
SELECT 'Verification:' as Info;
SELECT 
    a.tenant_id as admin_tenant,
    p.tenant_id as product_tenant,
    CASE WHEN a.tenant_id = p.tenant_id THEN 'MATCH - SUCCESS!' ELSE 'MISMATCH' END as status
FROM admins a
CROSS JOIN products p
WHERE a.email = 'admin@example.com'
LIMIT 1;

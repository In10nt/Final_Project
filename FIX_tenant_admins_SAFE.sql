USE virtual_tryon;

-- Disable safe mode temporarily
SET SQL_SAFE_UPDATES = 0;

-- Update tenant_admins with correct tenant_id
UPDATE tenant_admins 
SET tenant_id = '550e8400-e29b-41d4-a716-446655440099'
WHERE email = 'admin@example.com';

-- Re-enable safe mode
SET SQL_SAFE_UPDATES = 1;

-- Verify
SELECT 'After update:' as Info;
SELECT id, tenant_id, LENGTH(tenant_id) as len, email FROM tenant_admins WHERE email = 'admin@example.com';

SELECT 'Match check:' as Info;
SELECT 
    ta.tenant_id as admin_tenant,
    p.tenant_id as product_tenant,
    CASE WHEN ta.tenant_id = p.tenant_id THEN 'MATCH - SUCCESS!' ELSE 'MISMATCH' END as status
FROM tenant_admins ta
CROSS JOIN products p
WHERE ta.email = 'admin@example.com'
LIMIT 1;

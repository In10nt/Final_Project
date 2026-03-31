USE virtual_tryon;

SELECT 'Current Admin Tenant ID:' as Info;
SELECT id, tenant_id, email FROM users WHERE email = 'admin@example.com';

SELECT 'Current Products Tenant IDs:' as Info;
SELECT tenant_id, COUNT(*) as count FROM products GROUP BY tenant_id;

SELECT 'Match Check:' as Info;
SELECT 
    (SELECT tenant_id FROM users WHERE email = 'admin@example.com') as admin_tenant,
    (SELECT tenant_id FROM products LIMIT 1) as product_tenant,
    CASE 
        WHEN (SELECT tenant_id FROM users WHERE email = 'admin@example.com') = (SELECT tenant_id FROM products LIMIT 1)
        THEN 'MATCH'
        ELSE 'MISMATCH'
    END as status;

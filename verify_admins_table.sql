USE virtual_tryon;

SELECT 'Admins table data:' as Info;
SELECT id, tenant_id, LENGTH(tenant_id) as tenant_len, email FROM admins WHERE email = 'admin@example.com';

SELECT 'Products tenant_id:' as Info;
SELECT DISTINCT tenant_id, LENGTH(tenant_id) as tenant_len FROM products;

SELECT 'Expected tenant_id: 550e8400-e29b-41d4-a716-446655440099' as Info;

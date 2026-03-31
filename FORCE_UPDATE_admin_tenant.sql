USE virtual_tryon;

-- Force update admin tenant_id to match products
-- Admin tenant should be: 550e8400-e29b-41d4-a716-446655440099
-- Products tenant is: 550e8400-e29b-41d4-a716-446655440099

UPDATE users 
SET tenant_id = '550e8400-e29b-41d4-a716-446655440099'
WHERE email = 'admin@example.com';

-- Verify
SELECT 'Admin after update:' as Info, id, tenant_id, email FROM users WHERE email = 'admin@example.com';
SELECT 'Products tenant:' as Info, tenant_id, COUNT(*) FROM products GROUP BY tenant_id;

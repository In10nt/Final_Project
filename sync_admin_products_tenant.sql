USE virtual_tryon;

-- Get admin's tenant_id and update products to match
UPDATE products 
SET tenant_id = (SELECT tenant_id FROM users WHERE email = 'admin@example.com' LIMIT 1)
WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440099';

-- Verify the update
SELECT 'Products updated!' as Status;
SELECT COUNT(*) as ProductCount FROM products;
SELECT p.id, p.name, p.tenant_id, u.email as admin_email, u.tenant_id as admin_tenant_id
FROM products p
CROSS JOIN users u
WHERE u.email = 'admin@example.com'
LIMIT 5;

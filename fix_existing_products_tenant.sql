USE virtual_tryon;

-- Show current state
SELECT 'BEFORE UPDATE - Admin tenant_id:' as Info;
SELECT tenant_id FROM users WHERE email = 'admin@example.com';

SELECT 'BEFORE UPDATE - Products tenant_ids:' as Info;
SELECT id, tenant_id, name FROM products;

-- Update the 5 sample products to use admin's tenant_id
UPDATE products 
SET tenant_id = (SELECT tenant_id FROM users WHERE email = 'admin@example.com' LIMIT 1)
WHERE id IN (
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440014'
);

-- Show result
SELECT 'AFTER UPDATE - Products now match admin tenant:' as Info;
SELECT id, tenant_id, name FROM products;

SELECT 'Verification - All should match:' as Info;
SELECT 
    (SELECT tenant_id FROM users WHERE email = 'admin@example.com') as admin_tenant,
    COUNT(*) as matching_products
FROM products 
WHERE tenant_id = (SELECT tenant_id FROM users WHERE email = 'admin@example.com');

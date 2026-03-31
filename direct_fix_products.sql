USE virtual_tryon;

-- First, let's see what we have
SELECT 'Current Admin:' as Info;
SELECT id, tenant_id, email FROM users WHERE email = 'admin@example.com';

SELECT 'Current Products:' as Info;
SELECT id, tenant_id, name FROM products;

-- Update ALL products to use the admin's tenant_id
-- This will make them visible to the admin
UPDATE products p
CROSS JOIN users u
SET p.tenant_id = u.tenant_id
WHERE u.email = 'admin@example.com';

-- Verify the fix
SELECT 'After Update:' as Info;
SELECT p.id, p.tenant_id as product_tenant, u.tenant_id as admin_tenant, p.name
FROM products p
CROSS JOIN users u
WHERE u.email = 'admin@example.com'
LIMIT 5;

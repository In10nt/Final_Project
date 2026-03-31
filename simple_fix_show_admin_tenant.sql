USE virtual_tryon;

-- First, show me the admin's actual tenant_id
SELECT 'Admin Details:' as Step;
SELECT id, tenant_id, email, user_type FROM users WHERE email = 'admin@example.com';

-- Show all products
SELECT 'All Products:' as Step;
SELECT id, tenant_id, name FROM products;

-- Count products by tenant
SELECT 'Products by Tenant:' as Step;
SELECT tenant_id, COUNT(*) as count FROM products GROUP BY tenant_id;

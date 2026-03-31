USE virtual_tryon;

-- This script fixes the tenant_id mismatch between admin and products
-- After running this, admin will see all products in the dashboard

-- Step 1: Show current state
SELECT '=== BEFORE FIX ===' as Status;
SELECT 'Admin tenant_id:' as Info, tenant_id, email FROM users WHERE email = 'admin@example.com';
SELECT 'Products tenant_ids:' as Info, tenant_id, COUNT(*) as count FROM products GROUP BY tenant_id;

-- Step 2: Update admin's tenant_id to match products
-- Products have tenant_id: 550e8400-e29b-41d4-a716-446655440099
UPDATE users 
SET tenant_id = '550e8400-e29b-41d4-a716-446655440099'
WHERE email = 'admin@example.com';

-- Step 3: Verify the fix
SELECT '=== AFTER FIX ===' as Status;
SELECT 'Admin tenant_id:' as Info, tenant_id, email FROM users WHERE email = 'admin@example.com';

-- Step 4: Confirm they match
SELECT '=== VERIFICATION ===' as Status;
SELECT 
    u.tenant_id as admin_tenant_id,
    p.tenant_id as product_tenant_id,
    COUNT(p.id) as products_count,
    CASE 
        WHEN u.tenant_id = p.tenant_id THEN '✓ MATCH - Admin will see products!'
        ELSE '✗ MISMATCH - Admin will NOT see products'
    END as status
FROM users u
CROSS JOIN products p
WHERE u.email = 'admin@example.com'
GROUP BY u.tenant_id, p.tenant_id;

SELECT 'Fix complete! Refresh admin dashboard to see products.' as Message;

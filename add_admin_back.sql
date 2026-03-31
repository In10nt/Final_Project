USE virtual_tryon;

-- Add admin back to tenant_admins table
-- Password: admin123
INSERT INTO tenant_admins (id, tenant_id, email, password_hash, first_name, last_name, created_at)
VALUES (
    '2f06ee50-2cc1-11f1-8011-00155da62f2d',
    '550e8400-e29b-41d4-a716-446655440099',
    'admin@example.com',
    '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
    'Admin',
    'User',
    NOW()
);

-- Verify
SELECT 'Admin added:' as Info;
SELECT id, tenant_id, email, first_name FROM tenant_admins WHERE email = 'admin@example.com';

SELECT 'Login with: admin@example.com / admin123' as Credentials;

USE virtual_tryon;

-- Check if there's a separate admins table
SHOW TABLES LIKE '%admin%';

-- Check admin data
SELECT 'Admins table:' as Info;
SELECT * FROM admins WHERE email = 'admin@example.com';

-- Check users table for admin
SELECT 'Users table (admin):' as Info;
SELECT * FROM users WHERE email = 'admin@example.com';

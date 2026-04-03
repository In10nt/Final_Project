USE virtual_tryon;

-- Fix admin password with correct BCrypt hash for "admin123"
UPDATE admins 
SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'admin@example.com';

-- Verify the update
SELECT 'Admin password has been fixed!' AS Status;
SELECT id, email, first_name, last_name, role, created_at 
FROM admins 
WHERE email = 'admin@example.com';

SELECT '========================================' AS '';
SELECT 'You can now login with:' AS '';
SELECT 'Email: admin@example.com' AS '';
SELECT 'Password: admin123' AS '';
SELECT '========================================' AS '';

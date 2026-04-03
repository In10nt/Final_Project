USE virtual_tryon;

-- Fix admin password
-- Password: admin123
-- This is the correct BCrypt hash for "admin123"
UPDATE admins 
SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'admin@example.com';

-- Verify
SELECT 'Admin password updated' AS Status;
SELECT email, first_name, last_name, role FROM admins WHERE email = 'admin@example.com';
SELECT 'You can now login with: admin@example.com / admin123' AS Info;

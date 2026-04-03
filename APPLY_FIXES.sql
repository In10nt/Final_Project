USE virtual_tryon;

-- Add missing columns to users table
ALTER TABLE users ADD COLUMN date_of_birth DATE AFTER phone;
ALTER TABLE users ADD COLUMN gender VARCHAR(20) AFTER date_of_birth;

-- Fix admin password (BCrypt hash for 'admin123')
UPDATE admins 
SET password_hash = '.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'admin@example.com';

-- Verify
SELECT 'Database schema fixed' AS Status;
SELECT 'Admin password: admin123' AS Info;

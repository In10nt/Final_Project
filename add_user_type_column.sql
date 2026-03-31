-- Add user_type column to users table
USE virtual_tryon;

-- Add user_type column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS user_type VARCHAR(20) DEFAULT 'CUSTOMER';

-- Update existing users (admins) to have ADMIN type
UPDATE users 
SET user_type = 'ADMIN' 
WHERE email LIKE '%admin%' OR email IN (SELECT email FROM tenant_admins);

SELECT 'user_type column added successfully!' as Status;

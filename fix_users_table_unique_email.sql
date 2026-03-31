-- Add unique constraint on email column for global uniqueness
USE virtual_tryon;

-- First, check if there are any duplicate emails
SELECT email, COUNT(*) as count 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- If there are duplicates, you'll need to clean them up first
-- For now, let's add the unique constraint

-- Drop existing constraint if it exists
ALTER TABLE users DROP INDEX email;

-- Add unique constraint on email
ALTER TABLE users ADD UNIQUE INDEX idx_email_unique (email);

SELECT 'Unique email constraint added successfully!' as Status;

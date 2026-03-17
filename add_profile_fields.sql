-- Add missing fields to body_profiles table
USE virtual_tryon;

ALTER TABLE body_profiles 
ADD COLUMN gender VARCHAR(20),
ADD COLUMN nickname VARCHAR(100),
ADD COLUMN age INT,
ADD COLUMN hair_color VARCHAR(50),
ADD COLUMN eye_color VARCHAR(50);

-- Verify the changes
DESCRIBE body_profiles;
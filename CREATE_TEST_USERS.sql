-- Create Test Users for Virtual Try-On Platform
-- Run this script in MySQL to create test users

USE virtual_tryon;

-- Generate a UUID for tenant (you can use any UUID generator)
SET @tenant_id = UUID();

-- Create Admin User
-- Email: admin@example.com
-- Password: admin123
-- Password hash generated with BCrypt (strength 10)
INSERT INTO admin (id, tenant_id, email, password_hash, first_name, last_name, created_at, updated_at)
VALUES (
    UUID(),
    @tenant_id,
    'admin@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- admin123
    'Admin',
    'User',
    NOW(),
    NOW()
);

-- Create Customer User 1
-- Email: customer@example.com
-- Password: customer123
INSERT INTO user (id, tenant_id, email, password_hash, first_name, last_name, created_at, updated_at)
VALUES (
    UUID(),
    @tenant_id,
    'customer@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- customer123
    'John',
    'Doe',
    NOW(),
    NOW()
);

-- Create Customer User 2
-- Email: jane@example.com
-- Password: password123
INSERT INTO user (id, tenant_id, email, password_hash, first_name, last_name, created_at, updated_at)
VALUES (
    UUID(),
    @tenant_id,
    'jane@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password123
    'Jane',
    'Smith',
    NOW(),
    NOW()
);

-- Verify users were created
SELECT 'Admin Users:' as '';
SELECT id, email, first_name, last_name, created_at FROM admin;

SELECT 'Customer Users:' as '';
SELECT id, email, first_name, last_name, created_at FROM user;

-- Display tenant ID for reference
SELECT CONCAT('Tenant ID: ', @tenant_id) as 'Info';

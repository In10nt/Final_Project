-- Fix users table to use CHAR(36) for UUID columns
USE virtual_tryon;

-- Show current structure
DESCRIBE users;

-- Drop and recreate the users table with correct UUID column types
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    tenant_id CHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    user_type VARCHAR(20) DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_tenant_email (tenant_id, email),
    UNIQUE KEY idx_email_unique (email),
    INDEX idx_tenant (tenant_id),
    INDEX idx_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Re-insert the admin user
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, user_type, status)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440099',
    'admin@example.com',
    '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
    'Admin',
    'User',
    'ADMIN',
    'ACTIVE'
);

SELECT 'Users table recreated with correct UUID columns!' as Status;
DESCRIBE users;

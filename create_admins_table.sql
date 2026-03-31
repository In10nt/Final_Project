USE virtual_tryon;

-- Create admins table (same structure as users)
CREATE TABLE IF NOT EXISTS admins (
    id CHAR(36) NOT NULL PRIMARY KEY,
    tenant_id CHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tenant (tenant_id),
    INDEX idx_email (email)
);

-- Copy admin user from users table to admins table
INSERT INTO admins (id, tenant_id, email, password_hash, first_name, last_name, phone, status, created_at, updated_at)
SELECT id, tenant_id, email, password_hash, first_name, last_name, phone, status, created_at, updated_at
FROM users 
WHERE user_type = 'ADMIN'
ON DUPLICATE KEY UPDATE 
    tenant_id = VALUES(tenant_id),
    password_hash = VALUES(password_hash),
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    phone = VALUES(phone),
    status = VALUES(status);

-- Verify
SELECT 'Admins table created and populated:' as Info;
SELECT id, tenant_id, email, first_name, last_name FROM admins;

-- Verify tenant_id matches products
SELECT 'Tenant Match Check:' as Info;
SELECT 
    a.tenant_id as admin_tenant,
    p.tenant_id as product_tenant,
    CASE WHEN a.tenant_id = p.tenant_id THEN 'MATCH!' ELSE 'MISMATCH' END as status
FROM admins a
CROSS JOIN products p
WHERE a.email = 'admin@example.com'
LIMIT 1;

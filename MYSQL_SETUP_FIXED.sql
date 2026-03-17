-- Virtual Try-On Platform - MySQL Database Setup (FIXED UUID)
-- Run this script in MySQL Workbench

-- Drop existing database
DROP DATABASE IF EXISTS virtual_tryon;

-- Create Database
CREATE DATABASE IF NOT EXISTS virtual_tryon;
USE virtual_tryon;

-- Tenants table (shops)
CREATE TABLE tenants (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    subscription_plan VARCHAR(50) DEFAULT 'basic',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users table (customers)
CREATE TABLE users (
    id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_tenant_email (tenant_id, email),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Body profiles for virtual try-on
CREATE TABLE body_profiles (
    id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    tenant_id BINARY(16) NOT NULL,
    height_cm INT,
    weight_kg DECIMAL(5,2),
    chest_cm DECIMAL(5,2),
    waist_cm DECIMAL(5,2),
    hip_cm DECIMAL(5,2),
    shoulder_width_cm DECIMAL(5,2),
    body_shape VARCHAR(50),
    skin_tone VARCHAR(50),
    profile_image_url TEXT,
    body_landmarks JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_tenant_id (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product categories
CREATE TABLE categories (
    id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id BINARY(16),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products (clothing items)
CREATE TABLE products (
    id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    category_id BINARY(16),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(255),
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    barcode VARCHAR(255),
    sku VARCHAR(255),
    color VARCHAR(100),
    material VARCHAR(255),
    care_instructions TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_tenant_barcode (tenant_id, barcode),
    UNIQUE KEY unique_tenant_sku (tenant_id, sku),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product variants (sizes, colors)
CREATE TABLE product_variants (
    id BINARY(16) PRIMARY KEY,
    product_id BINARY(16) NOT NULL,
    tenant_id BINARY(16) NOT NULL,
    size VARCHAR(50),
    color VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    additional_price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_tenant_id (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Try-on sessions
CREATE TABLE try_on_sessions (
    id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    tenant_id BINARY(16) NOT NULL,
    product_id BINARY(16) NOT NULL,
    variant_id BINARY(16),
    session_duration_seconds INT,
    result_image_url TEXT,
    fit_feedback VARCHAR(50),
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Outfits (collections of products)
CREATE TABLE outfits (
    id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    tenant_id BINARY(16) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    outfit_image_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_tenant_id (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Outfit items
CREATE TABLE outfit_items (
    id BINARY(16) PRIMARY KEY,
    outfit_id BINARY(16) NOT NULL,
    product_id BINARY(16) NOT NULL,
    variant_id BINARY(16),
    position_index INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (outfit_id) REFERENCES outfits(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    INDEX idx_outfit_id (outfit_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Size recommendations from AI
CREATE TABLE size_recommendations (
    id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    tenant_id BINARY(16) NOT NULL,
    product_id BINARY(16) NOT NULL,
    recommended_size VARCHAR(20),
    confidence_score DECIMAL(3,2),
    reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analytics events
CREATE TABLE analytics_events (
    id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    user_id BINARY(16),
    event_type VARCHAR(100) NOT NULL,
    event_data JSON,
    session_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tenant admin users
CREATE TABLE tenant_admins (
    id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSON,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_tenant_admin_email (tenant_id, email),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data
INSERT INTO tenants (id, name, subdomain, contact_email, phone, address, subscription_plan, status) VALUES
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), 'Fashion Store', 'fashion-store', 'admin@fashionstore.com', '+1234567890', '123 Fashion St', 'premium', 'active');

INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, phone, gender, status) VALUES
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440001'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), 'user@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy990qm', 'John', 'Doe', '+1234567891', 'M', 'active');

INSERT INTO categories (id, tenant_id, name, description) VALUES
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440002'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), 'Shirts', 'Men and women shirts'),
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440003'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), 'Pants', 'Trousers and jeans');

INSERT INTO products (id, tenant_id, category_id, name, description, brand, price, currency, barcode, sku, color, material, status) VALUES
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440004'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440002'), 'Classic White Shirt', 'Premium white cotton shirt', 'Fashion Brand', 49.99, 'USD', '1234567890123', 'SHIRT-001', 'White', 'Cotton', 'active'),
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440005'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440003'), 'Blue Jeans', 'Classic blue denim jeans', 'Fashion Brand', 79.99, 'USD', '1234567890124', 'JEANS-001', 'Blue', 'Denim', 'active');

INSERT INTO product_variants (id, product_id, tenant_id, size, color, stock_quantity, additional_price) VALUES
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440006'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440004'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), 'M', 'White', 50, 0),
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440007'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440004'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), 'L', 'White', 40, 0),
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440008'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440005'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), '32', 'Blue', 30, 0),
(UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440009'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440005'), UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000'), '34', 'Blue', 25, 0);

-- Verify tables created
SHOW TABLES;
SELECT BIN_TO_UUID(id) as id, BIN_TO_UUID(tenant_id) as tenant_id, email FROM users;
SELECT BIN_TO_UUID(id) as id, BIN_TO_UUID(tenant_id) as tenant_id, name FROM products;

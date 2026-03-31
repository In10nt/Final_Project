USE virtual_tryon;

SELECT 'Checking current products...' as Status;
SELECT COUNT(*) as CurrentProductCount FROM products;

SELECT 'Backing up products...' as Status;
CREATE TEMPORARY TABLE products_backup AS SELECT * FROM products;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id CHAR(36) PRIMARY KEY,
    tenant_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100),
    color VARCHAR(50),
    material VARCHAR(100),
    image_url TEXT,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tenant (tenant_id),
    INDEX idx_category (category),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO products (id, tenant_id, name, description, price, category, brand, color, material, image_url, sku, barcode, stock_quantity, status, created_at, updated_at)
SELECT id, tenant_id, name, description, price, category, brand, color, material, image_url, sku, barcode, stock_quantity, status, created_at, updated_at
FROM products_backup;

DROP TEMPORARY TABLE products_backup;

SELECT 'Products table fixed!' as Status;
SELECT COUNT(*) as RestoredProductCount FROM products;
SELECT * FROM products LIMIT 5;

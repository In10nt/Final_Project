USE virtual_tryon;

INSERT INTO products (id, tenant_id, name, description, price, category, brand, color, material, image_url, sku, barcode, stock_quantity, status)
VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440099', 'Classic White Shirt', 'A timeless white shirt perfect for any occasion', 49.99, 'Shirts', 'Fashion Brand', 'White', 'Cotton', 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Shirt', 'WS001', '1234567890001', 100, 'active'),

('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440099', 'Blue Denim Jeans', 'Comfortable blue denim jeans with modern fit', 79.99, 'Pants', 'Fashion Brand', 'Blue', 'Denim', 'https://via.placeholder.com/300x400/4169e1/ffffff?text=Blue+Jeans', 'BJ001', '1234567890002', 80, 'active'),

('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440099', 'Summer Dress', 'Light and breezy summer dress', 89.99, 'Dresses', 'Fashion Brand', 'Pink', 'Cotton Blend', 'https://via.placeholder.com/300x400/ff69b4/ffffff?text=Summer+Dress', 'SD001', '1234567890003', 50, 'active'),

('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440099', 'Black Leather Jacket', 'Stylish black leather jacket', 199.99, 'Jackets', 'Fashion Brand', 'Black', 'Leather', 'https://via.placeholder.com/300x400/000000/ffffff?text=Leather+Jacket', 'LJ001', '1234567890004', 30, 'active'),

('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440099', 'Red T-Shirt', 'Casual red t-shirt for everyday wear', 29.99, 'T-Shirts', 'Fashion Brand', 'Red', 'Cotton', 'https://via.placeholder.com/300x400/ff0000/ffffff?text=Red+T-Shirt', 'RT001', '1234567890005', 150, 'active');

SELECT 'Sample products restored!' as Status;
SELECT COUNT(*) as ProductCount FROM products;
SELECT id, name, price, category FROM products;

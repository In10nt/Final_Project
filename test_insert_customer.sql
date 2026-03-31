USE virtual_tryon;

INSERT INTO users (
    id, 
    tenant_id, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    phone, 
    user_type, 
    status
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    'sarah@example.com',
    '$2a$10$zlj3X9FBGtZPmBJNOpwJY.EMmFuU.bXK7ZkZnx9Dgf0wTJVS6FETe',
    'Sarah',
    'Johnson',
    '1234567890',
    'CUSTOMER',
    'ACTIVE'
);

SELECT * FROM users WHERE email = 'sarah@example.com';

SELECT 'Test customer inserted successfully!' as Status;

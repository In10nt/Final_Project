# Login Credentials for Virtual Try-On Platform

## 🌐 Application URLs

- **Backend API:** http://localhost:8082
- **Admin Dashboard:** http://localhost:3002
- **Customer Store:** http://localhost:3001

## 👤 Test User Credentials

### Admin Login (Port 3002)
**URL:** http://localhost:3002

```
Email: admin@example.com
Password: admin123
```

### Customer Login (Port 3001)
**URL:** http://localhost:3001

**Customer 1:**
```
Email: customer@example.com
Password: customer123
```

**Customer 2:**
```
Email: jane@example.com
Password: password123
```

## 🔧 How to Create Users

### Option 1: Run SQL Script
```bash
mysql -u root -p virtual_tryon < CREATE_TEST_USERS.sql
```

### Option 2: Use API to Register

**Register Customer:**
```bash
curl -X POST http://localhost:8082/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "YOUR_TENANT_UUID",
    "email": "newuser@example.com",
    "password": "password123",
    "firstName": "New",
    "lastName": "User"
  }'
```

### Option 3: Manual SQL Insert

```sql
USE virtual_tryon;

-- Get or create tenant ID
SET @tenant_id = UUID();

-- Create customer user
INSERT INTO user (id, tenant_id, email, password_hash, first_name, last_name, created_at, updated_at)
VALUES (
    UUID(),
    @tenant_id,
    'your_email@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: customer123
    'First',
    'Last',
    NOW(),
    NOW()
);
```

## 🔐 Password Hashes (BCrypt)

For reference, here are pre-generated BCrypt hashes:

- `admin123` → `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`
- `customer123` → `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`
- `password123` → `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

## 📊 Database Tables

### Admin Table
```sql
CREATE TABLE admin (
    id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_tenant_email (tenant_id, email)
);
```

### User Table (Customers)
```sql
CREATE TABLE user (
    id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_tenant_email (tenant_id, email)
);
```

## 🚀 Quick Start

1. **Start Backend** (if not running):
   ```powershell
   cd backend
   $env:JWT_SECRET="b8fbb2a162bc9a9303440db43279c5252e2170c7a809c7acda2098b83a11ebb24862c87b2a4efe21ab33b3db034d66da102088f116f7ac710182f993ec85e83c"
   mvn spring-boot:run
   ```

2. **Create Test Users**:
   ```bash
   mysql -u root -p virtual_tryon < CREATE_TEST_USERS.sql
   ```

3. **Access Applications**:
   - Admin: http://localhost:3002
   - Customer: http://localhost:3001

4. **Login** with credentials above

## ⚠️ Important Notes

- **Tenant ID**: All users must belong to a tenant. The SQL script creates a single tenant for all test users.
- **Admin Authentication**: Currently throws `UnsupportedOperationException` - needs implementation in `AuthService.java`
- **Password Security**: These are test passwords. Use strong passwords in production.
- **Database**: Ensure MySQL is running and `virtual_tryon` database exists.

## 🔍 Verify Users Exist

```sql
USE virtual_tryon;

-- Check admin users
SELECT id, email, first_name, last_name FROM admin;

-- Check customer users
SELECT id, email, first_name, last_name FROM user;
```

## 🛠️ Troubleshooting

### Cannot Login
1. Verify user exists in database
2. Check password hash is correct
3. Ensure backend is running on port 8082
4. Check browser console for errors

### Admin Login Not Working
The `authenticateAdmin` method in `AuthService.java` needs to be implemented. Currently it throws:
```
UnsupportedOperationException: Admin authentication not yet implemented
```

You need to implement this method to query the `admin` table instead of `user` table.

### Database Connection Error
```bash
# Check MySQL is running
netstat -ano | Select-String ":3306"

# Verify database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'virtual_tryon';"
```

## 📝 Next Steps

1. Run the SQL script to create test users
2. Login to both applications
3. Test the functionality
4. Implement admin authentication if needed
5. Add more users as needed

---

**Status:** ✅ Applications Running
- Backend: http://localhost:8082 ✅
- Admin: http://localhost:3002 ✅
- Customer: http://localhost:3001 ✅

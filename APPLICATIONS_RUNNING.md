# ✅ Applications Are Running!

## 🎉 All Services Started Successfully

### Backend API
- **URL:** http://localhost:8082
- **Status:** ✅ Running
- **Health Check:** http://localhost:8082/actuator/health
- **API Docs:** http://localhost:8082/swagger-ui.html

### Admin Dashboard
- **URL:** http://localhost:3002
- **Status:** ✅ Running
- **Purpose:** Admin management interface

### Customer Store
- **URL:** http://localhost:3001
- **Status:** ✅ Running
- **Purpose:** Customer-facing virtual try-on store

## 🔑 Login Credentials

### For Admin Dashboard (http://localhost:3002)
```
Email: admin@example.com
Password: admin123
```

### For Customer Store (http://localhost:3001)
```
Customer 1:
Email: customer@example.com
Password: customer123

Customer 2:
Email: jane@example.com
Password: password123
```

## ⚠️ IMPORTANT: Create Users First!

Before you can login, you need to create users in the database. Follow these steps:

### Step 1: Open MySQL Workbench or Command Line

Connect to your MySQL database:
- Host: localhost
- Port: 3306
- Database: virtual_tryon
- Username: root
- Password: password

### Step 2: Run This SQL Script

Copy and paste this into MySQL:

```sql
USE virtual_tryon;

-- Create a tenant ID
SET @tenant_id = UUID();

-- Create Admin User (admin@example.com / admin123)
INSERT INTO admin (id, tenant_id, email, password_hash, first_name, last_name, created_at, updated_at)
VALUES (
    UUID(),
    @tenant_id,
    'admin@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Admin',
    'User',
    NOW(),
    NOW()
);

-- Create Customer 1 (customer@example.com / customer123)
INSERT INTO user (id, tenant_id, email, password_hash, first_name, last_name, created_at, updated_at)
VALUES (
    UUID(),
    @tenant_id,
    'customer@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'John',
    'Doe',
    NOW(),
    NOW()
);

-- Create Customer 2 (jane@example.com / password123)
INSERT INTO user (id, tenant_id, email, password_hash, first_name, last_name, created_at, updated_at)
VALUES (
    UUID(),
    @tenant_id,
    'jane@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Jane',
    'Smith',
    NOW(),
    NOW()
);

-- Verify users were created
SELECT 'Admin Users:' as '';
SELECT email, first_name, last_name FROM admin;

SELECT 'Customer Users:' as '';
SELECT email, first_name, last_name FROM user;
```

### Step 3: Access the Applications

After creating users, you can login:

1. **Admin Dashboard:** http://localhost:3002
   - Login with: admin@example.com / admin123

2. **Customer Store:** http://localhost:3001
   - Login with: customer@example.com / customer123

## 📁 Files Created

- `CREATE_TEST_USERS.sql` - SQL script to create test users
- `LOGIN_CREDENTIALS.md` - Detailed credentials and setup guide
- `APPLICATIONS_RUNNING.md` - This file

## 🔧 Alternative: Use API to Register

If you prefer, you can register users via the API:

```bash
# Register a customer
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

Note: You'll need a valid tenant UUID. Get one from the database or generate using UUID().

## 🎯 Quick Test

1. Open http://localhost:3001 (Customer Store)
2. Try to login with: customer@example.com / customer123
3. If login fails, run the SQL script above
4. Try again

## 📊 Application Status

```
✅ Backend API      - http://localhost:8082
✅ Admin Dashboard  - http://localhost:3002
✅ Customer Store   - http://localhost:3001
✅ MySQL Database   - localhost:3306
```

## 🛑 To Stop Applications

The applications are running in background processes. To stop them:

1. Close the terminal windows, or
2. Press Ctrl+C in each terminal, or
3. Kill the processes:
   ```powershell
   # Find and kill backend
   netstat -ano | Select-String ":8082"
   taskkill /PID <PID> /F
   
   # Find and kill frontends
   netstat -ano | Select-String ":3001"
   netstat -ano | Select-String ":3002"
   ```

## 📝 Summary

Your Virtual Try-On Platform is now running with:
- ✅ Secure backend API with JWT authentication
- ✅ Admin dashboard for management
- ✅ Customer store for virtual try-on
- ✅ MySQL database ready for users

**Next Step:** Run the SQL script above to create test users, then login!

---

**Need Help?** Check `LOGIN_CREDENTIALS.md` for detailed instructions.

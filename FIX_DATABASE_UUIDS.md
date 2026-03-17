# Fix Database UUID Issue

## Problem
The database was storing UUIDs as CHAR(36) strings, which caused them to be corrupted when retrieved by the Java application. The UUIDs were being stored as hex-encoded representations of the string bytes instead of proper binary UUIDs.

## Solution
Recreate the database with BINARY(16) UUID columns using the fixed SQL script.

## Steps to Fix

### 1. Run the Fixed SQL Script
Open MySQL Workbench and run the `MYSQL_SETUP_FIXED.sql` script:

```sql
-- This will:
-- 1. Drop the existing virtual_tryon database
-- 2. Create a new database with correct BINARY(16) UUID columns
-- 3. Insert sample data with proper UUIDs
```

### 2. Restart the Backend
After running the SQL script, restart the backend:

```bash
# Stop the current backend process
# Then restart it:
cd backend
mvn spring-boot:run
```

### 3. Test the Application
1. Open http://localhost:3002
2. Log in with:
   - Email: `user@example.com`
   - Password: `password`
3. Navigate to Products page - you should now see the 2 sample products
4. Navigate to Customers page - you should see the sample customer
5. Dashboard should show correct metrics

## What Changed
- Changed all UUID columns from `CHAR(36)` to `BINARY(16)`
- Used `UUID_TO_BIN()` function to convert UUID strings to binary format
- Used `BIN_TO_UUID()` function in verification queries to display UUIDs as strings

## Sample Data
After running the script, you'll have:
- **Tenant**: Fashion Store (ID: 550e8400-e29b-41d4-a716-446655440000)
- **User**: John Doe (user@example.com)
- **Products**: 
  - Classic White Shirt ($49.99)
  - Blue Jeans ($79.99)
- **Product Variants**: Multiple sizes for each product

## Verification
Run these queries to verify the data:

```sql
USE virtual_tryon;
SELECT BIN_TO_UUID(id) as id, BIN_TO_UUID(tenant_id) as tenant_id, email FROM users;
SELECT BIN_TO_UUID(id) as id, BIN_TO_UUID(tenant_id) as tenant_id, name FROM products;
```

All UUIDs should now display correctly as proper UUID format (e.g., `550e8400-e29b-41d4-a716-446655440000`).

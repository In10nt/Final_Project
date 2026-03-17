# Backend Configuration Guide

## Current Setup

### Backend Structure
- Framework: Spring Boot 3.2.0
- Java Version: 17
- Database: MySQL 8.0
- Port: 8082
- Build Tool: Maven

### Configuration Files Status
✅ `backend/src/main/resources/application.yml` - Configured
✅ `backend/pom.xml` - All dependencies present
✅ `.env` - Environment variables configured
✅ `.gitignore` - Properly configured

## Required Configuration Changes

### 1. Update application.yml to Use Environment Variables

The JWT secret is now configured to use environment variables. Current configuration:

```yaml
app:
  jwt:
    secret: ${JWT_SECRET:mySecretKey123456789012345678901234567890}
    expiration: ${JWT_EXPIRATION:86400000}
```

### 2. Set Environment Variables

Before running the backend, set these environment variables:

**Windows PowerShell:**
```powershell
$env:JWT_SECRET="b8fbb2a162bc9a9303440db43279c5252e2170c7a809c7acda2098b83a11ebb24862c87b2a4efe21ab33b3db034d66da102088f116f7ac710182f993ec85e83c"
$env:JWT_EXPIRATION="86400000"
$env:OPENAI_API_KEY="your_openai_api_key_here"
$env:AWS_ACCESS_KEY_ID="your_aws_access_key"
$env:AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
```

**Or use the .env file (requires dotenv support):**
The `.env` file is already configured with:
- JWT_SECRET (new secure key)
- Database credentials
- AWS credentials
- OpenAI API key

### 3. Database Configuration

**Current Settings:**
- Host: localhost
- Port: 3306
- Database: virtual_tryon
- Username: root
- Password: password

**Verify MySQL is running:**
```powershell
netstat -ano | Select-String ":3306"
```

**Create database if it doesn't exist:**
```sql
CREATE DATABASE IF NOT EXISTS virtual_tryon;
USE virtual_tryon;
```

The application will auto-create tables on startup (ddl-auto: update).

### 4. Port Configuration

Backend runs on port 8082 (not 8080) to avoid conflicts.

**Frontend configurations need to match:**
- Admin Frontend: Uses `REACT_APP_API_URL` or defaults to `http://localhost:8080`
- Customer Store: Uses `http://localhost:8082/api`

## Frontend Configuration Updates Needed

### 1. Admin Frontend (frontend/)

**Update `.env` file or create one:**
```env
REACT_APP_API_URL=http://localhost:8082
```

**Current apiService.js uses:**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
```

**This needs to be updated to:**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';
```

### 2. Customer Store (customer-store/)

**Already configured correctly:**
```javascript
const API_BASE_URL = 'http://localhost:8082/api';
```

## How to Run the Application

### Step 1: Start MySQL
MySQL is already running on port 3306 ✅

### Step 2: Build and Run Backend

```powershell
# Navigate to backend directory
cd backend

# Set environment variables
$env:JWT_SECRET="b8fbb2a162bc9a9303440db43279c5252e2170c7a809c7acda2098b83a11ebb24862c87b2a4efe21ab33b3db034d66da102088f116f7ac710182f993ec85e83c"

# Build the project
./mvnw clean install -DskipTests

# Run the application
./mvnw spring-boot:run
```

**Or run the JAR:**
```powershell
cd backend
./mvnw clean package -DskipTests
java -jar target/virtual-tryon-platform-1.0.0.jar
```

### Step 3: Start Admin Frontend

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies (if needed)
npm install

# Start the application
npm start
```

Runs on: http://localhost:3000

### Step 4: Start Customer Store

```powershell
# Navigate to customer-store directory
cd customer-store

# Install dependencies (if needed)
npm install

# Start the application
npm start
```

Runs on: http://localhost:3001

## Verification Steps

### 1. Check Backend is Running
```powershell
# Check if port 8082 is listening
netstat -ano | Select-String ":8082"

# Test health endpoint
curl http://localhost:8082/actuator/health
```

### 2. Check API Endpoints
- Health: http://localhost:8082/actuator/health
- API Docs: http://localhost:8082/swagger-ui.html
- Debug: http://localhost:8082/api/debug/test

### 3. Check Frontend Connections
- Admin: http://localhost:3000
- Customer Store: http://localhost:3001

## Common Issues and Solutions

### Issue 1: Port 8082 already in use
```powershell
# Find process using port 8082
netstat -ano | Select-String ":8082"

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue 2: Cannot connect to MySQL
- Verify MySQL is running
- Check credentials in application.yml
- Ensure database 'virtual_tryon' exists

### Issue 3: JWT token errors
- Ensure JWT_SECRET environment variable is set
- Check that the secret is at least 256 bits (32 characters)

### Issue 4: CORS errors
Backend SecurityConfig should allow:
- http://localhost:3000 (Admin)
- http://localhost:3001 (Customer Store)

## Files That Need Updates

### 1. frontend/src/services/apiService.js
Change line 3:
```javascript
// FROM:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// TO:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';
```

### 2. frontend/.env (create if doesn't exist)
```env
REACT_APP_API_URL=http://localhost:8082
```

### 3. customer-store/.env (create if doesn't exist)
```env
REACT_APP_API_URL=http://localhost:8082
```

## Next Steps

1. Update frontend API URL configuration
2. Set environment variables for backend
3. Build and run backend
4. Start both frontend applications
5. Test the complete flow

## Security Notes

- ✅ JWT secret is now secure (128 characters)
- ✅ .env file is in .gitignore
- ✅ Secrets removed from git history
- ⚠️ Remember to add real AWS and OpenAI keys before production
- ⚠️ Change database password for production

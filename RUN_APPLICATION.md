# How to Run the Application

## Prerequisites

1. **MySQL Server** - Must be running
2. **Node.js 18+** - For React frontend
3. **Java 17+** - For Spring Boot backend
4. **Maven** - For building backend

## Step 1: Setup Database

### In MySQL Workbench:
1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script → Select `MYSQL_SETUP.sql`
4. Click the lightning bolt icon to execute
5. Wait for completion

**Or via Command Line:**
```bash
mysql -u root -p < MYSQL_SETUP.sql
```

## Step 2: Start Backend (Spring Boot)

Open PowerShell/Command Prompt in the project root:

```bash
cd backend
mvn clean spring-boot:run
```

**Wait for message:**
```
Started VirtualTryOnApplication in X seconds
```

Backend will be available at: **http://localhost:8080**

## Step 3: Start Frontend (React)

Open a new PowerShell/Command Prompt in the project root:

```bash
cd frontend
npm install
npm start
```

**Wait for message:**
```
Compiled successfully!
```

Frontend will be available at: **http://localhost:3000**

## Step 4: Access the Application

Open your browser:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| API Docs | http://localhost:8080/swagger-ui.html |

## Step 5: Login

Use these credentials:
- **Email:** user@example.com
- **Password:** password

---

## Troubleshooting

### Backend won't start - Port 8080 in use

```bash
# Find process on port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Frontend won't start - Port 3000 in use

```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### MySQL connection error

1. Verify MySQL is running
2. Check credentials in `backend/src/main/resources/application.yml`
3. Verify database `virtual_tryon` exists

### Dependencies not installing

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

---

## Summary

**Terminal 1 - Backend:**
```bash
cd backend
mvn clean spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

**Then open:** http://localhost:3000

Done!

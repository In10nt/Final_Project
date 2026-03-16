# Backend Startup Guide

## Current Status
✅ MySQL is running on port 3306
✅ Configuration files updated with new JWT secret
✅ Environment variables configured
⏳ Backend needs to be started

## Prerequisites
1. MySQL running on localhost:3306 (✅ Already running)
2. Java 17 installed
3. Maven installed

## Start Backend

### Option 1: Using Maven (Recommended for Development)
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Option 2: Using Maven Wrapper
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### Option 3: Run JAR file
```bash
cd backend
mvn clean package
java -jar target/virtual-tryon-platform-1.0.0.jar
```

## Configuration Details

### Database Connection
- Host: localhost
- Port: 3306
- Database: virtual_tryon
- Username: root
- Password: password

### Backend Server
- Port: 8082
- Context Path: /
- Profile: default (for local) or docker (for containers)

### Environment Variables (from .env)
The backend will read these from your environment:
- JWT_SECRET: New secure key (128 chars)
- OPENAI_API_KEY: Your OpenAI API key
- AWS credentials: For S3 storage

## Verify Backend is Running

After starting, check:
1. Health endpoint: http://localhost:8082/actuator/health
2. API docs: http://localhost:8082/swagger-ui.html
3. Debug endpoint: http://localhost:8082/api/debug/test

## Common Issues

### Issue: Port 8082 already in use
Solution: Kill the process or change port in application.yml

### Issue: Cannot connect to MySQL
Solution: 
- Verify MySQL is running: `netstat -ano | Select-String ":3306"`
- Check credentials in application.yml
- Ensure database 'virtual_tryon' exists

### Issue: JWT secret not loaded
Solution: 
- Set environment variable: `$env:JWT_SECRET="your_secret_here"`
- Or it will use default from application.yml

## Database Setup

If database doesn't exist, create it:
```sql
CREATE DATABASE IF NOT EXISTS virtual_tryon;
USE virtual_tryon;
```

The application will auto-create tables on startup (ddl-auto: update).

## Next Steps

1. Start the backend using one of the options above
2. Verify it's running on port 8082
3. Test the health endpoint
4. Start your frontend application

# Start All Applications

## ✅ Backend is Built and Ready!

All compilation errors have been fixed. Your application is ready to run.

## Quick Start Commands

### 1. Start Backend (Terminal 1)
```powershell
cd backend
$env:JWT_SECRET="b8fbb2a162bc9a9303440db43279c5252e2170c7a809c7acda2098b83a11ebb24862c87b2a4efe21ab33b3db034d66da102088f116f7ac710182f993ec85e83c"
mvn spring-boot:run
```

Backend will start on: **http://localhost:8082**

### 2. Start Admin Frontend (Terminal 2)
```powershell
cd frontend
npm start
```

Admin will start on: **http://localhost:3000**

### 3. Start Customer Store (Terminal 3)
```powershell
cd customer-store
npm start
```

Customer Store will start on: **http://localhost:3001**

## Verify Backend is Running

Open browser or use curl:
```powershell
curl http://localhost:8082/actuator/health
```

Should return: `{"status":"UP"}`

## What Was Fixed

### Compilation Errors Fixed:
1. ✅ Added missing `countByTenantId()` methods to repositories
2. ✅ Added missing `findByTenantId()` method to UserRepository
3. ✅ Fixed JWT API to use correct methods for JJWT 0.12.3
4. ✅ Changed JWT dependencies scope from runtime to compile

### Configuration Updates:
1. ✅ Frontend API URL updated to port 8082
2. ✅ Customer Store API URL configured
3. ✅ Environment variables configured
4. ✅ All .env files created

## Application URLs

- **Backend API:** http://localhost:8082/api
- **Backend Health:** http://localhost:8082/actuator/health
- **Backend Swagger:** http://localhost:8082/swagger-ui.html
- **Admin Dashboard:** http://localhost:3000
- **Customer Store:** http://localhost:3001

## Database

- **Host:** localhost:3306
- **Database:** virtual_tryon
- **Username:** root
- **Password:** password

Tables will be auto-created on first run.

## Troubleshooting

### Port Already in Use
```powershell
# Find process
netstat -ano | Select-String ":8082"

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Frontend Not Connecting
- Check backend is running on port 8082
- Check .env files exist in frontend/ and customer-store/
- Verify REACT_APP_API_URL=http://localhost:8082

### Database Connection Error
- Verify MySQL is running: `netstat -ano | Select-String ":3306"`
- Check credentials in application.yml
- Ensure database 'virtual_tryon' exists

## Next Steps

1. Start all three applications
2. Access admin dashboard at http://localhost:3000
3. Access customer store at http://localhost:3001
4. Test API endpoints

Your application is fully configured and ready to run!

# 🚀 Virtual Try-On Platform - Quick Start Guide

## Prerequisites

Before starting, ensure you have installed:

- ✅ **Java 17** or higher
- ✅ **Maven 3.6+**
- ✅ **Node.js 16+** and **npm**
- ✅ **Python 3.8+**
- ✅ **MySQL 8.0+** (running on port 3306)

## 📦 First Time Setup

### 1. Install Dependencies

**Frontend (React):**
```bash
cd customer-store
npm install
cd ..
```

**AI Service (Python):**
```bash
cd ai-model
pip install -r requirements.txt
cd ..
```

**Backend (Spring Boot):**
Maven will automatically download dependencies on first run.

### 2. Configure Database

Make sure MySQL is running and create the database:
```sql
CREATE DATABASE virtual_tryon_db;
```

Update database credentials in `src/main/resources/application.properties` if needed.

## 🎯 Starting the Application

### Windows Users

**Start all applications:**
```bash
start-all.bat
```

**Stop all applications:**
```bash
stop-all.bat
```

### Linux/Mac Users

**Start all applications:**
```bash
chmod +x start-all.sh
./start-all.sh
```

**Stop all applications:**
```bash
chmod +x stop-all.sh
./stop-all.sh
```

## 🌐 Access the Applications

After starting (wait 30-60 seconds for all services to initialize):

| Service | URL | Port |
|---------|-----|------|
| **Customer Store** (Main App) | http://localhost:3001 | 3001 |
| **Backend API** | http://localhost:8082 | 8082 |
| **AI Service** | http://localhost:5000 | 5000 |
| **API Documentation** | http://localhost:8082/swagger-ui.html | 8082 |

## 📱 Manual Start (Alternative)

If you prefer to start each service manually:

### Terminal 1 - Backend
```bash
mvn spring-boot:run
```

### Terminal 2 - Frontend
```bash
cd customer-store
npm start
```

### Terminal 3 - AI Service
```bash
cd ai-model
python ai_service.py
```

## 🔍 Verify Services are Running

**Check Backend:**
```bash
curl http://localhost:8082/actuator/health
```

**Check Frontend:**
Open browser to http://localhost:3001

**Check AI Service:**
```bash
curl http://localhost:5000/health
```

## 🎨 Using the Application

1. **Open Customer Store:** http://localhost:3001
2. **Register/Login** as a customer
3. **Create Body Profile:**
   - Enter measurements manually
   - Or upload a photo for AI analysis
4. **Customize Avatar:**
   - Go to Avatar Customization page
   - Choose skin tone, hair color, eye color
   - Preview and save
5. **Virtual Try-On:**
   - Browse products
   - Click "Try On" to see clothes on your avatar
   - Rotate 360° and change colors

## ⚠️ Troubleshooting

### Port Already in Use

**Backend (8082):**
```bash
# Windows
netstat -ano | findstr :8082
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8082 | xargs kill -9
```

**Frontend (3001):**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

**AI Service (5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Database Connection Error

1. Verify MySQL is running
2. Check credentials in `application.properties`
3. Ensure database `virtual_tryon_db` exists

### Node Modules Error

```bash
cd customer-store
rm -rf node_modules package-lock.json
npm install
```

### Python Dependencies Error

```bash
cd ai-model
pip install --upgrade pip
pip install -r requirements.txt
```

## 📚 Additional Documentation

- **AI Features:** See `AI_FEATURES_SUMMARY.md`
- **Avatar System:** See `AVATAR_SYSTEM_STATUS.md`
- **API Documentation:** http://localhost:8082/swagger-ui.html (when backend is running)
- **Training Guide:** See `ai-model/TRAINING_GUIDE.md`

## 🆘 Need Help?

If you encounter issues:
1. Check all prerequisites are installed
2. Verify all ports are available
3. Check console logs in each terminal window
4. Ensure MySQL database is running
5. Try stopping all services and restarting

---

**Happy Virtual Try-On! 👔👗👕**

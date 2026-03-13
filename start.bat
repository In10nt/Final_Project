@echo off
echo 🚀 Starting Virtual Try-On Platform...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your configuration before continuing.
    echo    Especially set your AWS credentials if you want S3 integration.
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist logs mkdir logs
if not exist data\postgres mkdir data\postgres
if not exist data\redis mkdir data\redis

REM Build and start services
echo 🔨 Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

echo.
echo ✅ Platform is starting up!
echo.
echo 🌐 Access URLs:
echo    Admin Dashboard: http://localhost:3000
echo    Backend API: http://localhost:8080
echo    API Documentation: http://localhost:8080/swagger-ui.html
echo    AI Services: http://localhost:8000
echo    AI Documentation: http://localhost:8000/docs
echo.
echo 📊 Monitoring:
echo    Backend Health: http://localhost:8080/actuator/health
echo    AI Health: http://localhost:8000/health
echo.
echo 🔧 Development Commands:
echo    View logs: docker-compose logs -f [service_name]
echo    Stop services: docker-compose down
echo    Restart service: docker-compose restart [service_name]
echo.
echo 📱 Mobile App Development:
echo    cd mobile_app ^&^& flutter pub get ^&^& flutter run
echo.

REM Show running containers
echo 🐳 Running containers:
docker-compose ps

pause
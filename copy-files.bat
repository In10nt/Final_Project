@echo off
echo 📁 Creating directory structure and copying files...

REM Create backend directories
mkdir backend\src\main\resources\db\migration 2>nul
mkdir backend\src\test\java\com\virtualtryonsaas 2>nul

REM Create mobile app directories
mkdir mobile_app\android\app\src\main\res\drawable 2>nul
mkdir mobile_app\ios\Runner\Assets.xcassets 2>nul
mkdir mobile_app\assets\images 2>nul
mkdir mobile_app\assets\icons 2>nul

REM Create admin dashboard directories
mkdir admin_dashboard\public 2>nul
mkdir admin_dashboard\src\components\Layout 2>nul
mkdir admin_dashboard\src\pages 2>nul

REM Create AI services directories
mkdir ai_services\models 2>nul
mkdir ai_services\services 2>nul
mkdir ai_services\tests 2>nul

REM Create infrastructure directories
mkdir nginx 2>nul
mkdir logs 2>nul
mkdir data\postgres 2>nul
mkdir data\redis 2>nul

echo ✅ Directory structure created successfully!
echo.
echo 🚀 Ready to start the platform!
echo Run: start.bat
pause
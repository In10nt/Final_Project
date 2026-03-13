@echo off
echo Creating Virtual Try-On Platform project structure...

REM Create main directories
mkdir backend\src\main\java\com\virtualtryonsaas\config
mkdir backend\src\main\java\com\virtualtryonsaas\controller
mkdir backend\src\main\java\com\virtualtryonsaas\dto
mkdir backend\src\main\java\com\virtualtryonsaas\entity
mkdir backend\src\main\java\com\virtualtryonsaas\repository
mkdir backend\src\main\java\com\virtualtryonsaas\security
mkdir backend\src\main\java\com\virtualtryonsaas\service
mkdir backend\src\main\java\com\virtualtryonsaas\tenant
mkdir backend\src\main\resources

mkdir ai_services\models
mkdir ai_services\services

mkdir mobile_app\lib\providers
mkdir mobile_app\lib\screens\auth
mkdir mobile_app\lib\screens\home
mkdir mobile_app\lib\screens\profile
mkdir mobile_app\lib\screens\scanner
mkdir mobile_app\lib\screens\product
mkdir mobile_app\lib\screens\tryon
mkdir mobile_app\lib\services

mkdir admin_dashboard\src\contexts
mkdir admin_dashboard\src\components\Layout
mkdir admin_dashboard\src\pages
mkdir admin_dashboard\src\services

echo Project structure created!
echo.
echo Next steps:
echo 1. Copy all the files I provided into their respective directories
echo 2. Run: cp .env.example .env
echo 3. Edit .env file with your settings
echo 4. Run: start.bat
echo.
pause
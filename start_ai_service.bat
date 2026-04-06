@echo off
echo ========================================
echo Starting AI Virtual Try-On Service
echo ========================================
echo.

cd ai-model

echo Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo ========================================
echo Starting AI Service on port 5000...
echo ========================================
echo.
echo Press Ctrl+C to stop the service
echo.

python ai_service.py

pause

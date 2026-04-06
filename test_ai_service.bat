@echo off
echo ========================================
echo Testing AI Service
echo ========================================
echo.

cd ai-model

echo Running test suite...
python test_ai_service.py

echo.
pause

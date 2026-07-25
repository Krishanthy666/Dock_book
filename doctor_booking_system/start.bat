@echo off
title eDocBook - Doctor Booking System Startup
echo =============================================
echo Starting eDocBook - Doctor Booking System
echo =============================================

:: Get the directory of this script
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

:: Start FastAPI Backend in a separate window
echo Starting FastAPI Backend...
cd "%SCRIPT_DIR%backend"
if exist "venv\Scripts\activate.bat" (
    start "eDocBook Backend" cmd /k "call venv\Scripts\activate.bat && uvicorn main:app --host 127.0.0.1 --port 8000"
) else (
    start "eDocBook Backend" cmd /k "uvicorn main:app --host 127.0.0.1 --port 8000"
)

:: Start React Frontend
echo Starting React Frontend...
cd "%SCRIPT_DIR%frontend"
start "eDocBook Frontend" cmd /k "npm run dev"

echo ---------------------------------------------
echo Servers have been started in separate terminal windows.
echo - FastAPI Backend: http://127.0.0.1:8000
echo - React Frontend: http://localhost:5173
echo ---------------------------------------------
pause

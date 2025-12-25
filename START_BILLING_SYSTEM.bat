@echo off
REM =====================================================
REM ASHA HARDWARE BILLING SYSTEM - ONE-CLICK STARTUP
REM =====================================================
COLOR 0A
title ASHA Hardware Billing System - Starting...

echo.
echo ========================================================
echo        ASHA HARDWARE BILLING SYSTEM
echo        Starting Backend and Frontend...
echo ========================================================
echo.

REM Check if MySQL is running
echo [1/4] Checking MySQL service...
sc query MySQL80 | find "RUNNING" >nul
if errorlevel 1 (
    echo [WARNING] MySQL service is not running!
    echo Please start MySQL service manually or check installation.
    pause
    exit /b 1
)
echo [OK] MySQL is running

REM Start Backend (Spring Boot) in new window
echo.
echo [2/4] Starting Backend Server (Java Spring Boot)...
start "ASHA Hardware - Backend Server" cmd /k "cd /d "%~dp0backend" && mvnw.cmd spring-boot:run"
echo [OK] Backend starting on http://localhost:8080

REM Wait for backend to initialize (30 seconds)
echo.
echo [3/4] Waiting for backend to initialize (30 seconds)...
timeout /t 30 /nobreak >nul

REM Start Frontend (React) in new window
echo.
echo [4/4] Starting Frontend Application...
start "ASHA Hardware - Frontend" cmd /k "cd /d "%~dp0cashier-frontend" && npm run dev"
echo [OK] Frontend starting on http://localhost:5173

REM Wait for frontend to start (10 seconds)
echo.
echo Waiting for frontend to load (10 seconds)...
timeout /t 10 /nobreak >nul

REM Open Chrome browser
echo.
echo Opening browser...
start chrome http://localhost:5173

echo.
echo ========================================================
echo   BILLING SYSTEM IS READY!
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:5173
echo.
echo   Default Login Credentials:
echo   Username: user
echo   Password: 123
echo.
echo   DO NOT CLOSE THIS WINDOW!
echo   Close the Backend and Frontend windows to stop the system.
echo ========================================================
echo.

REM Keep this window open
pause

@echo off
REM =====================================================
REM ASHA HARDWARE BILLING SYSTEM - STOP ALL SERVICES
REM =====================================================
COLOR 0C
title ASHA Hardware Billing System - Stopping...

echo.
echo ========================================================
echo        STOPPING BILLING SYSTEM
echo ========================================================
echo.

echo Closing all Java processes (Backend)...
taskkill /F /IM java.exe /T 2>nul
if errorlevel 1 (
    echo No Java processes found
) else (
    echo Backend stopped successfully
)

echo.
echo Closing all Node processes (Frontend)...
taskkill /F /IM node.exe /T 2>nul
if errorlevel 1 (
    echo No Node processes found
) else (
    echo Frontend stopped successfully
)

echo.
echo ========================================================
echo   BILLING SYSTEM STOPPED
echo ========================================================
echo.
pause

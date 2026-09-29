@echo off
title Antigravity 2.0 Launcher
echo Starting Antigravity 2.0 Hackathon MVP...

echo [1/2] Booting FastAPI Backend...
start "Antigravity Backend" cmd /k "cd backend && python -m uvicorn main:app --reload"

echo [2/2] Booting Next.js Frontend...
start "Antigravity Frontend" cmd /k "cd frontend && set PATH=%%PATH%%;C:\Program Files\nodejs\ && npm.cmd run dev"

echo.
echo Both servers are booting up in separate windows! 
echo The frontend will be available at http://localhost:3000
echo You can safely close this launcher window.
pause

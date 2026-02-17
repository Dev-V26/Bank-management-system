@echo off
REM Start both backend and frontend in development mode (assumes npm install already done)

echo.
echo =================================
echo Starting MERN Bank Management App
echo =================================
echo.

REM Start backend in a new window
echo Starting Backend (Dev mode) on http://localhost:5000...
start cmd.exe /k "cd /d "%cd%\backend" && npm run dev || npm start"

REM Wait a moment for backend to start
timeout /t 2 /nobreak

REM Start frontend in a new window  
echo Starting Frontend (Vite) on http://localhost:3000...
start cmd.exe /k "cd /d "%cd%\frontend\client" && npm start"

echo.
echo =================================
echo Both servers starting in dev mode...
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo =================================
echo.
echo Close the command windows to stop the servers.

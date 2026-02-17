@echo off
REM Start both backend and frontend independently

echo.
echo =================================
echo Starting MERN Bank Management App
echo =================================
echo.

REM Start backend in a new window
echo Starting Backend on http://localhost:5000...
start cmd.exe /k "cd /d "%cd%\backend" && npm install && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend in a new window
echo Starting Frontend on http://localhost:3000...
start cmd.exe /k "cd /d "%cd%\frontend\client" && npm install && npm start"

echo.
echo =================================
echo Both servers starting...
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo =================================

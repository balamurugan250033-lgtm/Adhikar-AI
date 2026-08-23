@echo off
echo ==========================================
echo Starting Adhikar AI (FastAPI + React)
echo ==========================================

echo [1/2] Starting FastAPI Backend on port 8000...
start cmd /k "cd backend && uvicorn app.main:app --reload"

echo [2/2] Starting React Frontend on port 3000...
start cmd /k "cd frontend && npm start"

echo Both servers are launching in separate windows!
pause
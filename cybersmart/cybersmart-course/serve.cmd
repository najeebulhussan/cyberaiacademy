@echo off
REM Serve the Cyber Smart course locally and open it in the default browser.
where node >nul 2>nul || (echo Node.js is required for serve.cmd. You can also just double-click index.html. & pause & exit /b 1)
start "" http://localhost:8080
node "%~dp0serve.js" 8080

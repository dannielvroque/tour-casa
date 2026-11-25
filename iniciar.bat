@echo off
rem Abre o tour no navegador usando um servidor local (necessario para os panoramas 360).
cd /d "%~dp0"
start "" cmd /c "timeout /t 2 >nul & start http://localhost:8080"
python -m http.server 8080

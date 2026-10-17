@echo off
setlocal

cd /d "%~dp0"
set "PORT=8000"

echo Starting Thai Tarot at http://localhost:%PORT%
start "" "http://localhost:%PORT%"

where py >nul 2>&1
if %errorlevel% equ 0 (
    py -m http.server %PORT%
    goto :eof
)

where python >nul 2>&1
if %errorlevel% equ 0 (
    python -m http.server %PORT%
    goto :eof
)

echo.
echo Python was not found. Install Python or add it to PATH, then try again.
pause

# ====================================
# Nepa Health Website Startup Script
# ====================================

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Nepa Health - Starting All   " -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Check if node_modules exists, if not install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "`n[*] Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[X] Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[OK] Dependencies already installed" -ForegroundColor Green
}

# Start the development environment (backend + frontend)
Write-Host "`n[>] Starting Nepa Health application..." -ForegroundColor Yellow
Write-Host "   - Backend will run on: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   - Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan

npm run dev

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[X] Application failed to start" -ForegroundColor Red
    exit 1
}

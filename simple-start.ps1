Write-Host "🚀 Virtual Try-On Platform Startup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Step 1: Check Docker
Write-Host "Step 1: Checking Docker..." -ForegroundColor Yellow
$dockerRunning = $false

try {
    docker info 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker is running!" -ForegroundColor Green
        $dockerRunning = $true
    }
} catch {
    # Docker check failed
}

if (-not $dockerRunning) {
    Write-Host "❌ Docker is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start Docker Desktop:" -ForegroundColor Yellow
    Write-Host "1. Press Windows key and search 'Docker Desktop'" -ForegroundColor White
    Write-Host "2. Click on Docker Desktop to start it" -ForegroundColor White
    Write-Host "3. Wait for the whale icon to appear in system tray" -ForegroundColor White
    Write-Host "4. Run this script again: .\simple-start.ps1" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Create environment file
Write-Host ""
Write-Host "Step 2: Setting up environment..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Step 3: Start services
Write-Host ""
Write-Host "Step 3: Starting services..." -ForegroundColor Yellow
Write-Host "This may take a few minutes for the first time..." -ForegroundColor Gray

docker-compose up --build -d

# Step 4: Wait and check
Write-Host ""
Write-Host "Step 4: Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

Write-Host ""
Write-Host "🎉 Platform Started!" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Open these URLs in your browser:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Admin Dashboard:  http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API:      http://localhost:8080" -ForegroundColor White
Write-Host "   AI Services:      http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "📱 For Mobile App:" -ForegroundColor Cyan
Write-Host "   cd mobile_app" -ForegroundColor White
Write-Host "   flutter pub get" -ForegroundColor White
Write-Host "   flutter run" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Useful Commands:" -ForegroundColor Cyan
Write-Host "   View logs:        docker-compose logs -f" -ForegroundColor White
Write-Host "   Stop platform:    docker-compose down" -ForegroundColor White
Write-Host "   Restart:          docker-compose restart" -ForegroundColor White
Write-Host ""

# Show container status
Write-Host "📊 Container Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "✅ Setup Complete! Your Virtual Try-On platform is running." -ForegroundColor Green
Write-Host ""
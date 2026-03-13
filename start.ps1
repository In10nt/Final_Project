Write-Host "🚀 Starting Virtual Try-On Platform..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    Write-Host "1. Open Docker Desktop application" -ForegroundColor Yellow
    Write-Host "2. Wait for Docker to start (you'll see the whale icon in system tray)" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please edit .env file with your configuration if needed." -ForegroundColor Yellow
}

# Create necessary directories
Write-Host "📁 Creating necessary directories..." -ForegroundColor Yellow
$directories = @("logs", "data\postgres", "data\redis")
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Build and start services
Write-Host "🔨 Building and starting services..." -ForegroundColor Yellow
docker-compose up --build -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check service health
Write-Host "🔍 Checking service health..." -ForegroundColor Yellow

try {
    $backendHealth = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -TimeoutSec 5
    Write-Host "Backend: $($backendHealth.status)" -ForegroundColor Green
} catch {
    Write-Host "Backend: Not ready yet" -ForegroundColor Yellow
}

try {
    $aiHealth = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 5
    Write-Host "AI Services: $($aiHealth.status)" -ForegroundColor Green
} catch {
    Write-Host "AI Services: Not ready yet" -ForegroundColor Yellow
}

try {
    $adminResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "Admin Dashboard: Ready (Status: $($adminResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "Admin Dashboard: Not ready yet" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Platform is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "   Admin Dashboard: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8080" -ForegroundColor White
Write-Host "   API Documentation: http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "   AI Services: http://localhost:8000" -ForegroundColor White
Write-Host "   AI Documentation: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "📊 Monitoring:" -ForegroundColor Cyan
Write-Host "   Backend Health: http://localhost:8080/actuator/health" -ForegroundColor White
Write-Host "   AI Health: http://localhost:8000/health" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Development Commands:" -ForegroundColor Cyan
Write-Host "   View logs: docker-compose logs -f [service_name]" -ForegroundColor White
Write-Host "   Stop services: docker-compose down" -ForegroundColor White
Write-Host "   Restart service: docker-compose restart [service_name]" -ForegroundColor White
Write-Host ""
Write-Host "📱 Mobile App Development:" -ForegroundColor Cyan
Write-Host "   cd mobile_app && flutter pub get && flutter run" -ForegroundColor White
Write-Host ""

# Show running containers
Write-Host "🐳 Running containers:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "🎉 Setup complete! The platform is now running." -ForegroundColor Green
Read-Host "Press Enter to continue"
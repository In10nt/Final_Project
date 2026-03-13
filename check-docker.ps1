Write-Host "🔍 Checking Docker status..." -ForegroundColor Yellow

# Check if Docker command exists
try {
    docker --version 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $dockerVersion = docker --version
        Write-Host "✅ Docker is installed: $dockerVersion" -ForegroundColor Green
    } else {
        throw "Docker not found"
    }
} catch {
    Write-Host "❌ Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker daemon is running
try {
    docker info 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker daemon is running" -ForegroundColor Green
        
        # Show Docker info
        Write-Host ""
        Write-Host "📊 Docker System Info:" -ForegroundColor Cyan
        docker system df
        
        Write-Host ""
        Write-Host "🐳 Running containers:" -ForegroundColor Cyan
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    } else {
        throw "Docker not running"
    }
} catch {
    Write-Host "❌ Docker daemon is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start Docker:" -ForegroundColor Yellow
    Write-Host "1. Open Docker Desktop application" -ForegroundColor White
    Write-Host "2. Wait for the Docker whale icon to appear in your system tray" -ForegroundColor White
    Write-Host "3. The icon should be steady (not animated) when Docker is ready" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run: .\start.ps1" -ForegroundColor Green
}

Read-Host "Press Enter to continue"
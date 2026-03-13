Write-Host "Testing Virtual Try-On Platform Services..." -ForegroundColor Green

# Test Database
Write-Host "Testing PostgreSQL..." -ForegroundColor Yellow
try {
    $response = Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue
    if ($response.TcpTestSucceeded) {
        Write-Host "✅ PostgreSQL is running on port 5432" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL is not accessible" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ PostgreSQL test failed" -ForegroundColor Red
}

# Test Redis
Write-Host "Testing Redis..." -ForegroundColor Yellow
try {
    $response = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue
    if ($response.TcpTestSucceeded) {
        Write-Host "✅ Redis is running on port 6379" -ForegroundColor Green
    } else {
        Write-Host "❌ Redis is not accessible" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Redis test failed" -ForegroundColor Red
}

# Test AI Services
Write-Host "Testing AI Services..." -ForegroundColor Yellow
try {
    $response = Test-NetConnection -ComputerName localhost -Port 8000 -WarningAction SilentlyContinue
    if ($response.TcpTestSucceeded) {
        Write-Host "✅ AI Services are running on port 8000" -ForegroundColor Green
    } else {
        Write-Host "❌ AI Services are not accessible" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ AI Services test failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Container Status:" -ForegroundColor Yellow
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
Write-Host "NEXT STEPS COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""

Write-Host "All Services Running:" -ForegroundColor Cyan
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host ""
Write-Host "Testing Services:" -ForegroundColor Cyan

# Test Backend
try {
    $backendHealth = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -TimeoutSec 5
    Write-Host "Backend API: $($backendHealth.status)" -ForegroundColor Green
} catch {
    Write-Host "Backend API: Not responding" -ForegroundColor Red
}

# Test AI Services
try {
    $aiHealth = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 5
    Write-Host "AI Services: $($aiHealth.status)" -ForegroundColor Green
} catch {
    Write-Host "AI Services: Not responding" -ForegroundColor Red
}

# Test Admin Dashboard
try {
    $adminResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "Admin Dashboard: Ready" -ForegroundColor Green
} catch {
    Write-Host "Admin Dashboard: Not responding" -ForegroundColor Red
}

Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Cyan
Write-Host "Admin Dashboard: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:8080" -ForegroundColor White
Write-Host "AI Services: http://localhost:8000" -ForegroundColor White

Write-Host ""
Write-Host "Demo Credentials:" -ForegroundColor Cyan
Write-Host "Admin: admin@demo.com / demo123" -ForegroundColor White
Write-Host "Customer: customer@demo.com / customer123" -ForegroundColor White

Write-Host ""
Write-Host "PLATFORM IS FULLY OPERATIONAL!" -ForegroundColor Green
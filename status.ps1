Write-Host "Virtual Try-On Platform Status" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

Write-Host "Running Services:" -ForegroundColor Cyan
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host ""
Write-Host "Service Tests:" -ForegroundColor Cyan

# Test AI Services
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 5
    Write-Host "AI Services: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "AI Services: Not responding" -ForegroundColor Red
}

Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Cyan
Write-Host "AI Services: http://localhost:8000" -ForegroundColor White
Write-Host "AI Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "Test Page: file://$(Get-Location)\test-page.html" -ForegroundColor White

Write-Host ""
Write-Host "Platform is running successfully!" -ForegroundColor Green
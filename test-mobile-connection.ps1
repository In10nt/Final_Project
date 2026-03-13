Write-Host "MOBILE APP CONNECTION TEST" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Testing Backend Services..." -ForegroundColor Yellow

# Test Backend Health
try {
    $backendHealth = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -TimeoutSec 5
    Write-Host "   ✅ Backend API: $($backendHealth.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend API: Not responding" -ForegroundColor Red
    Write-Host "   Run: docker-compose -f docker-compose-working.yml up -d" -ForegroundColor Yellow
}

# Test AI Services
try {
    $aiHealth = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 5
    Write-Host "   ✅ AI Services: $($aiHealth.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ AI Services: Not responding" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testing Mobile App API Endpoints..." -ForegroundColor Yellow

# Test Login Endpoint
try {
    $loginData = @{
        email = "customer@demo.com"
        password = "customer123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 5
    Write-Host "   ✅ Authentication: Login successful" -ForegroundColor Green
    $token = $loginResponse.token
    
    # Test Products Endpoint
    $headers = @{ Authorization = "Bearer $token" }
    $products = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Headers $headers -TimeoutSec 5
    Write-Host "   ✅ Products API: $($products.content.Count) products available" -ForegroundColor Green
    
} catch {
    Write-Host "   ❌ Authentication: Failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Mobile App Options:" -ForegroundColor Yellow
Write-Host "   Option 1: Open mobile-web-demo/index.html in browser" -ForegroundColor White
Write-Host "   Option 2: Install Flutter SDK and run 'flutter run' in mobile_app/" -ForegroundColor White
Write-Host "   Option 3: Use browser dev tools to simulate mobile device" -ForegroundColor White

Write-Host ""
Write-Host "4. Demo Credentials:" -ForegroundColor Yellow
Write-Host "   Customer: customer@demo.com / customer123" -ForegroundColor White
Write-Host "   Admin: admin@demo.com / demo123" -ForegroundColor White

Write-Host ""
Write-Host "5. Access URLs:" -ForegroundColor Yellow
Write-Host "   Mobile Demo: file://$(Get-Location)/mobile-web-demo/index.html" -ForegroundColor White
Write-Host "   Admin Dashboard: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8080" -ForegroundColor White

Write-Host ""
if (Test-Path "mobile-web-demo/index.html") {
    Write-Host "READY TO TEST MOBILE APP! 🚀" -ForegroundColor Green
    Write-Host "Open mobile-web-demo/index.html to start testing immediately." -ForegroundColor Green
} else {
    Write-Host "Mobile demo file not found. Creating it now..." -ForegroundColor Yellow
}
# Compare products visible to admin vs customer

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COMPARING ADMIN vs CUSTOMER PRODUCTS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Get products as PUBLIC (customer view)
Write-Host "1. Fetching products as PUBLIC (Customer view)..." -ForegroundColor Yellow
$publicProducts = Invoke-RestMethod -Uri "http://localhost:8082/api/products" -Method Get
Write-Host "   Public products: $($publicProducts.totalElements)" -ForegroundColor Green
$publicProductNames = $publicProducts.content | ForEach-Object { $_.name }

# 2. Login as admin
Write-Host "`n2. Logging in as admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8082/api/auth/admin/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
Write-Host "   Admin logged in successfully" -ForegroundColor Green

# 3. Get products as ADMIN
Write-Host "`n3. Fetching products as ADMIN..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
$adminProducts = Invoke-RestMethod -Uri "http://localhost:8082/api/products" -Method Get -Headers $headers
Write-Host "   Admin products: $($adminProducts.totalElements)" -ForegroundColor Green
$adminProductNames = $adminProducts.content | ForEach-Object { $_.name }

# 4. Compare
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "COMPARISON RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Public (Customer) sees: $($publicProducts.totalElements) products" -ForegroundColor White
Write-Host "Admin sees: $($adminProducts.totalElements) products" -ForegroundColor White

Write-Host "`nPublic Products:" -ForegroundColor Yellow
$publicProductNames | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }

Write-Host "`nAdmin Products:" -ForegroundColor Yellow
$adminProductNames | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }

# Check if they match
Write-Host "`nAnalysis:" -ForegroundColor Cyan
if ($publicProducts.totalElements -eq $adminProducts.totalElements) {
    Write-Host "  Product counts MATCH" -ForegroundColor Green
} else {
    Write-Host "  Product counts DIFFER!" -ForegroundColor Red
    Write-Host "  Difference: $($publicProducts.totalElements - $adminProducts.totalElements) products" -ForegroundColor Yellow
}

# Find products only in public
$onlyInPublic = $publicProductNames | Where-Object { $_ -notin $adminProductNames }
if ($onlyInPublic) {
    Write-Host "`n  Products ONLY visible to customers:" -ForegroundColor Yellow
    $onlyInPublic | ForEach-Object { Write-Host "    - $_" -ForegroundColor White }
}

# Find products only in admin
$onlyInAdmin = $adminProductNames | Where-Object { $_ -notin $publicProductNames }
if ($onlyInAdmin) {
    Write-Host "`n  Products ONLY visible to admin:" -ForegroundColor Yellow
    $onlyInAdmin | ForEach-Object { Write-Host "    - $_" -ForegroundColor White }
}

if (-not $onlyInPublic -and -not $onlyInAdmin -and $publicProducts.totalElements -eq $adminProducts.totalElements) {
    Write-Host "`n  All products are IDENTICAL!" -ForegroundColor Green
}

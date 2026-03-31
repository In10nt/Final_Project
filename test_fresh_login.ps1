# Test with fresh admin login after tenant_id fix

Write-Host "Testing Admin Products After Tenant Fix..." -ForegroundColor Cyan

# Fresh login
$loginBody = @{
    email = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8082/api/auth/admin/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token

Write-Host "Admin logged in. Token tenant info:" -ForegroundColor Yellow
Write-Host "Token: $($token.Substring(0,50))..." -ForegroundColor Gray

# Fetch products
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$products = Invoke-RestMethod -Uri "http://localhost:8082/api/products" -Method Get -Headers $headers
Write-Host "`nProducts visible to admin: $($products.totalElements)" -ForegroundColor $(if($products.totalElements -gt 0){'Green'}else{'Red'})

if ($products.totalElements -gt 0) {
    Write-Host "`nProduct List:" -ForegroundColor Green
    $products.content | ForEach-Object {
        Write-Host "  - $($_.name) (Price: $($_.price))" -ForegroundColor White
    }
} else {
    Write-Host "`nNo products visible. Checking backend logs..." -ForegroundColor Yellow
}

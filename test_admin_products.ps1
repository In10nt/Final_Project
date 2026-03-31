# Test admin login and products fetch

# Step 1: Login as admin
Write-Host "Step 1: Logging in as admin..." -ForegroundColor Cyan
$loginBody = @{
    email = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8082/api/auth/admin/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
Write-Host "Login successful! Token: $($token.Substring(0,50))..." -ForegroundColor Green

# Step 2: Fetch products with admin token
Write-Host "`nStep 2: Fetching products with admin token..." -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$productsResponse = Invoke-RestMethod -Uri "http://localhost:8082/api/products" -Method Get -Headers $headers
Write-Host "Products response:" -ForegroundColor Green
$productsResponse | ConvertTo-Json -Depth 3

Write-Host "`nTotal products: $($productsResponse.totalElements)" -ForegroundColor Yellow
Write-Host "Products in content array: $($productsResponse.content.Count)" -ForegroundColor Yellow

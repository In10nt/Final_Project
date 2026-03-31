# Comprehensive API Testing Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API TESTING - Virtual Try-On SaaS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8082/api"
$adminToken = $null
$customerToken = $null

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get -ErrorAction Stop
    Write-Host "   OK Health check passed" -ForegroundColor Green
} catch {
    Write-Host "   FAIL Health check failed" -ForegroundColor Red
}

# Test 2: Admin Login
Write-Host "2. Testing Admin Login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@example.com"
        password = "admin123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $adminToken = $loginResponse.token
    Write-Host "   OK Admin login successful" -ForegroundColor Green
} catch {
    Write-Host "   FAIL Admin login failed" -ForegroundColor Red
}

# Test 3: Get Products Public
Write-Host "3. Testing Get Products (Public)..." -ForegroundColor Yellow
try {
    $publicProducts = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get -ErrorAction Stop
    Write-Host "   OK Public products: $($publicProducts.totalElements)" -ForegroundColor Green
} catch {
    Write-Host "   FAIL Public products fetch failed" -ForegroundColor Red
}

# Test 4: Get Products Admin
if ($adminToken) {
    Write-Host "4. Testing Get Products (Admin)..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $adminToken"
            "Content-Type" = "application/json"
        }
        $adminProducts = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get -Headers $headers -ErrorAction Stop
        Write-Host "   OK Admin products: $($adminProducts.totalElements)" -ForegroundColor Green
        if ($adminProducts.totalElements -eq 0) {
            Write-Host "   WARNING: Admin sees 0 products - tenant mismatch!" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   FAIL Admin products fetch failed" -ForegroundColor Red
    }
}

# Test 5: Customer Registration
Write-Host "5. Testing Customer Registration..." -ForegroundColor Yellow
try {
    $registerBody = @{
        email = "testcustomer@example.com"
        password = "customer123"
        firstName = "Test"
        lastName = "Customer"
        phone = "1234567890"
    } | ConvertTo-Json
    
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/customers/register" -Method Post -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   OK Customer registration successful" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*409*") {
        Write-Host "   INFO Customer already exists" -ForegroundColor Cyan
    } else {
        Write-Host "   FAIL Customer registration failed" -ForegroundColor Red
    }
}

# Test 6: Customer Login
Write-Host "6. Testing Customer Login..." -ForegroundColor Yellow
try {
    $customerLoginBody = @{
        email = "testcustomer@example.com"
        password = "customer123"
    } | ConvertTo-Json
    
    $customerLoginResponse = Invoke-RestMethod -Uri "$baseUrl/customers/login" -Method Post -Body $customerLoginBody -ContentType "application/json" -ErrorAction Stop
    $customerToken = $customerLoginResponse.token
    Write-Host "   OK Customer login successful" -ForegroundColor Green
} catch {
    Write-Host "   FAIL Customer login failed" -ForegroundColor Red
}

# Test 7: Get Customers
if ($adminToken) {
    Write-Host "7. Testing Get Customers (Admin)..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $adminToken"
            "Content-Type" = "application/json"
        }
        $customers = Invoke-RestMethod -Uri "$baseUrl/customers" -Method Get -Headers $headers -ErrorAction Stop
        Write-Host "   OK Customers: $($customers.totalElements)" -ForegroundColor Green
    } catch {
        Write-Host "   FAIL Customers fetch failed" -ForegroundColor Red
    }
}

# Test 8: Dashboard Stats
if ($adminToken) {
    Write-Host "8. Testing Dashboard Stats (Admin)..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $adminToken"
            "Content-Type" = "application/json"
        }
        $stats = Invoke-RestMethod -Uri "$baseUrl/analytics/dashboard" -Method Get -Headers $headers -ErrorAction Stop
        Write-Host "   OK Dashboard stats retrieved" -ForegroundColor Green
    } catch {
        Write-Host "   FAIL Dashboard stats fetch failed" -ForegroundColor Red
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTS COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

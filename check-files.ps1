Write-Host "Checking Virtual Try-On Platform files..." -ForegroundColor Green

$files = @(
    "docker-compose.yml",
    ".env.example", 
    "backend/pom.xml",
    "mobile_app/pubspec.yaml",
    "admin_dashboard/package.json",
    "ai_services/requirements.txt"
)

Write-Host "Required files:" -ForegroundColor Yellow
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "MISSING: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Project directories:" -ForegroundColor Yellow
$dirs = @("backend", "mobile_app", "admin_dashboard", "ai_services")
foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        $count = (Get-ChildItem -Path $dir -Recurse -File).Count
        Write-Host "OK: $dir ($count files)" -ForegroundColor Green
    } else {
        Write-Host "MISSING: $dir" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Docker status:" -ForegroundColor Yellow
try {
    docker info 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Docker is running" -ForegroundColor Green
        Write-Host "Ready to start platform with: .\run.ps1" -ForegroundColor Cyan
    } else {
        Write-Host "Docker is not running" -ForegroundColor Yellow
        Write-Host "Please start Docker Desktop first" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Docker check failed" -ForegroundColor Red
}
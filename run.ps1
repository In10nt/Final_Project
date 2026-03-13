Write-Host "Starting Virtual Try-On Platform..." -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env file" -ForegroundColor Yellow
}

# Start Docker Compose
Write-Host "Starting services with Docker Compose..." -ForegroundColor Yellow
docker-compose up --build -d

Write-Host ""
Write-Host "Platform is starting! Access URLs:" -ForegroundColor Green
Write-Host "Admin Dashboard: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:8080" -ForegroundColor White
Write-Host "AI Services: http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Container status:" -ForegroundColor Yellow
docker-compose ps
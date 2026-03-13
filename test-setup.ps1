Write-Host "🧪 Testing Virtual Try-On Platform Setup" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Test 1: Check if all files are present
Write-Host "Test 1: Checking project files..." -ForegroundColor Yellow

$requiredFiles = @(
    "docker-compose.yml",
    ".env.example",
    "backend/pom.xml",
    "mobile_app/pubspec.yaml",
    "admin_dashboard/package.json",
    "ai_services/requirements.txt"
)

$allFilesPresent = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (missing)" -ForegroundColor Red
        $allFilesPresent = $false
    }
}

Write-Host ""

# Test 2: Check prerequisites
Write-Host "Test 2: Checking prerequisites..." -ForegroundColor Yellow

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker: Not installed" -ForegroundColor Red
}

# Check Node.js (for admin dashboard)
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Node.js: Not installed (optional for Docker setup)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Node.js: Not installed (optional for Docker setup)" -ForegroundColor Yellow
}

# Check Flutter (for mobile app)
try {
    $flutterVersion = flutter --version 2>$null | Select-String "Flutter"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Flutter: Available" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Flutter: Not installed (optional for Docker setup)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Flutter: Not installed (optional for Docker setup)" -ForegroundColor Yellow
}

# Check Python (for AI services)
try {
    $pythonVersion = python --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Python: Not installed (optional for Docker setup)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Python: Not installed (optional for Docker setup)" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Project structure
Write-Host "Test 3: Project structure..." -ForegroundColor Yellow
$directories = @("backend", "mobile_app", "admin_dashboard", "ai_services")
foreach ($dir in $directories) {
    if (Test-Path $dir) {
        $fileCount = (Get-ChildItem -Path $dir -Recurse -File).Count
        Write-Host "✅ $dir ($fileCount files)" -ForegroundColor Green
    } else {
        Write-Host "❌ $dir (missing)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
if ($allFilesPresent) {
    Write-Host "✅ All project files are present" -ForegroundColor Green
    Write-Host "✅ Project structure is complete" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Ready to start! Options:" -ForegroundColor Green
    Write-Host "1. Wait for Docker Desktop to start, then run: .\run.ps1" -ForegroundColor White
    Write-Host "2. Or start individual components manually" -ForegroundColor White
} else {
    Write-Host "❌ Some files are missing" -ForegroundColor Red
}

Write-Host ""
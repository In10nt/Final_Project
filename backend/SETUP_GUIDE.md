# 🚀 Virtual Try-On Platform Setup Guide

This guide will help you set up and run the complete Virtual Try-On platform on your local machine.

## Prerequisites

### Required Software
1. **Docker Desktop** (latest version)
   - Download: https://www.docker.com/products/docker-desktop
   - Ensure Docker is running before starting

2. **Git** (for cloning repository)
   - Download: https://git-scm.com/downloads

### Optional (for development)
3. **Node.js 18+** (for admin dashboard development)
   - Download: https://nodejs.org/

4. **Flutter SDK 3.x** (for mobile app development)
   - Download: https://flutter.dev/docs/get-started/install

5. **Java 17+** (for backend development)
   - Download: https://adoptium.net/

6. **Python 3.11+** (for AI services development)
   - Download: https://www.python.org/downloads/

## Quick Start (5 minutes)

### Step 1: Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd virtual-tryon-platform

# Copy environment template
cp .env.example .env
```

### Step 2: Configure Environment
Edit the `.env` file with your settings:
```bash
# Basic configuration (required)
POSTGRES_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key_at_least_32_characters

# AWS configuration (optional for local development)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET_NAME=your-s3-bucket
```

### Step 3: Start Platform
**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### Step 4: Access Applications
- **Admin Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Docs**: http://localhost:8080/swagger-ui.html
- **AI Services**: http://localhost:8000
- **AI Docs**: http://localhost:8000/docs

## Detailed Setup Instructions

### 1. Database Setup

The platform will automatically:
- Create PostgreSQL database with schema
- Set up multi-tenant tables
- Configure Row Level Security
- Create initial indexes

**Manual database access:**
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d virtual_tryon

# View tables
\dt

# Check tenant isolation
SELECT * FROM tenants;
```

### 2. Backend Service

**Automatic startup:**
- Spring Boot application on port 8080
- JWT authentication configured
- Multi-tenant context enabled
- Health checks available

**Manual backend development:**
```bash
cd backend

# Run locally (requires Java 17+)
./mvnw spring-boot:run

# Run tests
./mvnw test

# Build JAR
./mvnw clean package
```

### 3. AI Services

**Automatic startup:**
- FastAPI application on port 8000
- MediaPipe for body analysis
- Virtual try-on processing
- Size recommendation engine

**Manual AI development:**
```bash
cd ai_services

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Admin Dashboard

**Automatic startup:**
- React application on port 3000
- Material-UI components
- Authentication flow
- Product management interface

**Manual dashboard development:**
```bash
cd admin_dashboard

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### 5. Mobile App Setup

**Prerequisites:**
- Flutter SDK 3.x installed
- Android Studio or VS Code with Flutter extension
- Android emulator or physical device

**Setup steps:**
```bash
cd mobile_app

# Install dependencies
flutter pub get

# Generate code (JSON serialization)
flutter packages pub run build_runner build

# Check Flutter setup
flutter doctor

# Run on device/emulator
flutter run
```

## Testing the Platform

### 1. Create Test Tenant
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d virtual_tryon

# Insert test tenant
INSERT INTO tenants (name, subdomain, contact_email) 
VALUES ('Test Shop', 'testshop', 'admin@testshop.com');
```

### 2. Test API Endpoints
```bash
# Health check
curl http://localhost:8080/actuator/health

# AI service health
curl http://localhost:8000/health

# Test body analysis (requires image)
curl -X POST "http://localhost:8000/api/ai/body-analysis" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@test-image.jpg"
```

### 3. Test Admin Dashboard
1. Open http://localhost:3000
2. Try to login (authentication will be implemented)
3. Navigate through product management
4. Check analytics dashboard

### 4. Test Mobile App
1. Start Flutter app: `flutter run`
2. Test user registration flow
3. Try barcode scanning (camera permission required)
4. Test virtual try-on features

## Development Workflow

### 1. Backend Development
```bash
# Make changes to Java code
# Restart backend service
docker-compose restart backend

# View logs
docker-compose logs -f backend
```

### 2. Frontend Development
```bash
# Admin dashboard hot reload
cd admin_dashboard
npm start

# Mobile app hot reload
cd mobile_app
flutter run
```

### 3. AI Services Development
```bash
# Make changes to Python code
# Restart AI service
docker-compose restart ai-services

# View logs
docker-compose logs -f ai-services
```

## Troubleshooting

### Common Issues

**1. Docker not starting:**
```bash
# Check Docker status
docker info

# Restart Docker Desktop
# Try again: docker-compose up
```

**2. Port conflicts:**
```bash
# Check what's using ports
netstat -an | findstr :8080  # Windows
lsof -i :8080               # Linux/Mac

# Stop conflicting services or change ports in docker-compose.yml
```

**3. Database connection issues:**
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

**4. AI services not starting:**
```bash
# Check AI service logs
docker-compose logs ai-services

# Common issue: insufficient memory
# Increase Docker memory allocation to 4GB+
```

### Service-Specific Issues

**Backend Issues:**
- Check Java version (requires 17+)
- Verify database connection in logs
- Check JWT secret configuration

**Mobile App Issues:**
- Run `flutter doctor` to check setup
- Ensure Android SDK is properly configured
- Check device/emulator connectivity

**AI Services Issues:**
- Verify Python dependencies installation
- Check GPU availability for ML models
- Monitor memory usage during processing

## Next Steps

### Phase 1: Basic Functionality (Week 1-2)
1. ✅ Set up development environment
2. 🔄 Implement user authentication
3. 📋 Add product management
4. 📋 Create basic mobile screens

### Phase 2: Core Features (Week 3-4)
1. 📋 Implement barcode scanning
2. 📋 Add body profile creation
3. 📋 Integrate AI services
4. 📋 Build virtual try-on flow

### Phase 3: Advanced Features (Week 5-6)
1. 📋 Add social sharing
2. 📋 Implement recommendations
3. 📋 Build analytics dashboard
4. 📋 Optimize performance

## Support

### Documentation
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **AI Documentation**: http://localhost:8000/docs
- **Database Schema**: See `DATABASE_SCHEMA.sql`
- **Development Roadmap**: See `DEVELOPMENT_ROADMAP.md`

### Monitoring
- **Backend Health**: http://localhost:8080/actuator/health
- **AI Health**: http://localhost:8000/health
- **Database**: `docker-compose exec postgres psql -U postgres -d virtual_tryon`

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f ai-services
docker-compose logs -f postgres
```

### Getting Help
1. Check logs for error messages
2. Verify all prerequisites are installed
3. Ensure Docker has sufficient resources (4GB+ RAM)
4. Check firewall/antivirus blocking ports
5. Review environment configuration in `.env`

---

🎉 **Congratulations!** You now have a fully functional Virtual Try-On platform running locally. Start with the admin dashboard to add products, then use the mobile app to test the virtual try-on experience.
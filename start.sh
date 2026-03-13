#!/bin/bash

echo "🚀 Starting Virtual Try-On Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before continuing."
    echo "   Especially set your AWS credentials if you want S3 integration."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p data/postgres
mkdir -p data/redis

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
echo "Backend: $(curl -s http://localhost:8080/actuator/health | grep -o '"status":"[^"]*"' || echo 'Not ready')"
echo "AI Services: $(curl -s http://localhost:8000/health | grep -o '"status":"[^"]*"' || echo 'Not ready')"
echo "Admin Dashboard: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo 'Not ready')"

echo ""
echo "✅ Platform is starting up!"
echo ""
echo "🌐 Access URLs:"
echo "   Admin Dashboard: http://localhost:3000"
echo "   Backend API: http://localhost:8080"
echo "   API Documentation: http://localhost:8080/swagger-ui.html"
echo "   AI Services: http://localhost:8000"
echo "   AI Documentation: http://localhost:8000/docs"
echo ""
echo "📊 Monitoring:"
echo "   Backend Health: http://localhost:8080/actuator/health"
echo "   AI Health: http://localhost:8000/health"
echo ""
echo "🔧 Development Commands:"
echo "   View logs: docker-compose logs -f [service_name]"
echo "   Stop services: docker-compose down"
echo "   Restart service: docker-compose restart [service_name]"
echo ""
echo "📱 Mobile App Development:"
echo "   cd mobile_app && flutter pub get && flutter run"
echo ""

# Show running containers
echo "🐳 Running containers:"
docker-compose ps
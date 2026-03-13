#!/bin/bash

echo "Creating Virtual Try-On Platform project structure..."

# Create main directories
mkdir -p backend/src/main/java/com/virtualtryonsaas/{config,controller,dto,entity,repository,security,service,tenant}
mkdir -p backend/src/main/resources

mkdir -p ai_services/{models,services}

mkdir -p mobile_app/lib/{providers,screens/{auth,home,profile,scanner,product,tryon},services}

mkdir -p admin_dashboard/src/{contexts,components/Layout,pages,services}

echo "Project structure created!"
echo ""
echo "Next steps:"
echo "1. Copy all the files I provided into their respective directories"
echo "2. Run: cp .env.example .env"
echo "3. Edit .env file with your settings"
echo "4. Run: ./start.sh"
echo ""
# Virtual Try-On Platform Setup Instructions

## Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Database Setup

1. **Start MySQL Server**
   ```bash
   # Windows (if MySQL is installed as service)
   net start mysql
   
   # Or start MySQL manually
   mysqld --console
   ```

2. **Create Database and Import Schema**
   ```bash
   mysql -u root -p
   ```
   
   Then run the SQL script:
   ```sql
   source MYSQL_SETUP_FIXED.sql
   ```

## Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   Backend will start on: http://localhost:8082

## Frontend Admin Dashboard Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the admin dashboard**
   ```bash
   npm start
   ```

   Admin dashboard will start on: http://localhost:3002

## Customer Store Setup

1. **Navigate to customer-store directory**
   ```bash
   cd customer-store
   ```

2. **Dependencies are already installed, start the customer store**
   ```bash
   npm start
   ```

   Customer store will start on: http://localhost:3001

## Access the Applications

### Admin Dashboard (http://localhost:3002)
- **Login:** user@example.com
- **Password:** password (any password works in demo mode)
- **Features:**
  - Product management (CRUD operations)
  - Customer management
  - Analytics dashboard
  - Settings

### Customer Store (http://localhost:3001)
- **Features:**
  - Virtual Try-On experience
  - AI-powered body measurement analysis
  - 3D avatar with clothing visualization
  - Product browsing
  - Shopping cart functionality

## Virtual Try-On Features

### 1. Body Profile Creation
- Take a photo for AI body analysis
- Manual measurement input
- Body shape and skin tone selection
- Profile management

### 2. Virtual Try-On Process
- Select products from catalog
- AI generates virtual fitting
- Confidence scoring and fit feedback
- Size recommendations
- 3D avatar visualization

### 3. AI Integration
- OpenAI integration for body measurement analysis
- Mock AI responses for demo (when API key not provided)
- Confidence scoring algorithms
- Size recommendation engine

## Configuration

### OpenAI API Key (Optional)
To enable real AI analysis, add your OpenAI API key:

1. **Backend Configuration**
   Add to `backend/src/main/resources/application.yml`:
   ```yaml
   openai:
     api:
       key: your-openai-api-key-here
   ```

2. **Environment Variable**
   ```bash
   export OPENAI_API_KEY=your-openai-api-key-here
   ```

### Database Configuration
Default configuration in `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/virtual_tryon
    username: root
    password: password
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend (8082): Change in `application.yml`
   - Frontend (3002): Change in `package.json` start script
   - Customer Store (3001): Change in `package.json` start script

2. **Database Connection Issues**
   - Ensure MySQL is running
   - Check credentials in `application.yml`
   - Verify database `virtual_tryon` exists

3. **CORS Issues**
   - Backend has CORS enabled for all origins
   - Check browser console for specific errors

4. **Missing Dependencies**
   ```bash
   # Backend
   cd backend && mvn clean install
   
   # Frontend
   cd frontend && npm install
   
   # Customer Store
   cd customer-store && npm install
   ```

## Demo Data

The system includes sample data:
- 1 Tenant: Fashion Store
- 1 User: user@example.com
- 2 Products: Classic White Shirt, Blue Denim Jeans
- Product variants with sizes and stock

## Next Steps

1. **Add Real Products**: Use the admin dashboard to add your product catalog
2. **Configure AI**: Add OpenAI API key for real body analysis
3. **Customize UI**: Modify the customer store branding and styling
4. **Add Payment**: Integrate payment processing for complete e-commerce
5. **Mobile App**: Extend to mobile platforms for better camera access

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console logs for specific error messages
3. Ensure all prerequisites are installed and configured correctly
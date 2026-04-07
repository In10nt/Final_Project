# Virtual Try-On Fashion Store - Complete Application Documentation

## 📋 Table of Contents
1. [Technology Stack](#technology-stack)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Services & Ports](#services--ports)
5. [Database Schema](#database-schema)
6. [File Purposes](#file-purposes)
7. [API Endpoints](#api-endpoints)
8. [Features](#features)
9. [Setup & Running](#setup--running)

---

## 🛠 Technology Stack

### Backend
- **Framework**: Spring Boot 3.x (Java)
- **Database**: MySQL 8.0
- **ORM**: Hibernate/JPA
- **Security**: JWT Authentication
- **Email**: JavaMailSender (SMTP)
- **Build Tool**: Maven

### Frontend - Admin Panel
- **Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Port**: 3002

### Frontend - Customer Store
- **Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **3D Rendering**: Three.js (OBJLoader, FBXLoader, GLTFLoader)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Port**: 3001

### AI/ML Service
- **Language**: Python 3.x
- **Framework**: Flask
- **ML Library**: scikit-learn (Random Forest)
- **Data Processing**: NumPy, Pandas
- **Port**: 5000

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
├──────────────────────────┬──────────────────────────────────┤
│   Admin Panel (3002)     │   Customer Store (3001)          │
│   - Product Management   │   - Shopping                     │
│   - 3D Model Upload      │   - Virtual Try-On               │
│   - Size Chart Config    │   - AI Recommendations           │
│   - Order Management     │   - Cart & Checkout              │
└──────────────────────────┴──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API LAYER (8082)                        │
├─────────────────────────────────────────────────────────────┤
│   Spring Boot REST API                                       │
│   - Authentication (JWT)                                     │
│   - Product CRUD                                             │
│   - File Upload (3D Models, Images)                         │
│   - Order Processing                                         │
│   - Email Service                                            │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│   MySQL (3306)   │ │ AI Service   │ │  File Storage    │
│   - Products     │ │   (5000)     │ │  - 3D Models     │
│   - Users        │ │ - Size Rec   │ │  - Images        │
│   - Orders       │ │ - Fit Score  │ │  - Uploads       │
│   - Body Profile │ │ - ML Model   │ │                  │
└──────────────────┘ └──────────────┘ └──────────────────┘
```

---

## 📁 Project Structure

```
virtual-tryon-platform/
│
├── src/main/                          # Backend (Spring Boot)
│   ├── java/com/virtualtryonsaas/
│   │   ├── controller/                # REST API Controllers
│   │   │   ├── AdminController.java
│   │   │   ├── ProductController.java
│   │   │   ├── CustomerAuthController.java
│   │   │   ├── OrderController.java
│   │   │   └── FileUploadController.java
│   │   │
│   │   ├── service/                   # Business Logic
│   │   │   ├── ProductService.java
│   │   │   ├── CustomerAuthService.java
│   │   │   ├── EmailService.java
│   │   │   └── AIIntegrationService.java
│   │   │
│   │   ├── entity/                    # Database Models
│   │   │   ├── Product.java
│   │   │   ├── User.java
│   │   │   ├── Customer.java
│   │   │   └── BodyProfile.java
│   │   │
│   │   ├── dto/                       # Data Transfer Objects
│   │   │   ├── ProductDto.java
│   │   │   ├── ProductRequest.java
│   │   │   └── OrderConfirmationRequest.java
│   │   │
│   │   ├── repository/                # Database Access
│   │   │   ├── ProductRepository.java
│   │   │   ├── UserRepository.java
│   │   │   └── CustomerRepository.java
│   │   │
│   │   └── security/                  # Security Config
│   │       ├── JwtAuthenticationFilter.java
│   │       └── SecurityConfig.java
│   │
│   └── resources/
│       ├── application.yml            # App Configuration
│       └── static/uploads/            # Uploaded Files
│           ├── models/                # 3D Models (.obj, .fbx, .glb)
│           └── images/                # Product Images
│
├── frontend/                          # Admin Panel (React)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── DashboardPage.js      # Admin Dashboard
│   │   │   ├── ProductsPage.js       # Product Management
│   │   │   └── LoginPage.js          # Admin Login
│   │   │
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   └── Sidebar.js
│   │   │
│   │   └── services/
│   │       └── apiService.js         # API Calls
│   │
│   └── package.json                  # Dependencies
│
├── customer-store/                    # Customer Store (React)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.js           # Landing Page
│   │   │   ├── ProductsPage.js       # Product Listing
│   │   │   ├── ProductDetailPage.js  # Product Details
│   │   │   ├── VirtualTryOnPageNew.js # AI Try-On
│   │   │   ├── CartPageNew.js        # Shopping Cart
│   │   │   ├── CheckoutPage.js       # Checkout
│   │   │   ├── AboutPage.js          # About Us
│   │   │   └── CustomerLoginPage.js  # Customer Login
│   │   │
│   │   ├── components/
│   │   │   ├── Header.js             # Navigation Bar
│   │   │   ├── Footer.js             # Footer
│   │   │   ├── Model3DViewer.js      # 3D Model Renderer
│   │   │   ├── AIRecommendations.js  # AI Suggestions
│   │   │   └── FitBadge.js           # Fit Score Display
│   │   │
│   │   ├── contexts/
│   │   │   ├── CustomerAuthContext.js # Auth State
│   │   │   └── CartContext.js        # Cart State
│   │   │
│   │   └── services/
│   │       └── apiService.js         # API Calls
│   │
│   └── package.json                  # Dependencies
│
├── ai-model/                          # AI/ML Service (Python)
│   ├── ai_service.py                 # Flask API Server
│   ├── size_recommender.py           # Size Recommendation Logic
│   ├── fit_calculator.py             # Fit Score Calculator
│   ├── train_size_model.py           # Model Training Script
│   ├── generate_training_data.py     # Synthetic Data Generator
│   ├── models/
│   │   └── size_recommender.pkl      # Trained ML Model
│   ├── training_data_size.json       # Training Dataset
│   └── requirements.txt              # Python Dependencies
│
├── SQL Scripts/
│   ├── RUN_THIS_FIRST.sql           # Initial Setup
│   ├── COMPLETE_DATABASE_SETUP.sql  # Full Schema
│   ├── ADD_SIZE_CHART_TO_PRODUCTS.sql
│   └── FIX_ADMIN_PASSWORD.sql
│
└── Documentation/
    ├── AI_SETUP_GUIDE.md
    ├── ADMIN_3D_MODEL_GUIDE.md
    ├── EMAIL_SETUP_GUIDE.md
    └── COMPLETE_TESTING_GUIDE.md
```

---

## 🔌 Services & Ports

| Service | Port | Purpose | Technology |
|---------|------|---------|------------|
| **Backend API** | 8082 | REST API, Business Logic | Spring Boot |
| **Admin Panel** | 3002 | Product Management UI | React + MUI |
| **Customer Store** | 3001 | Shopping UI | React + MUI + Three.js |
| **AI Service** | 5000 | Size Recommendations | Python Flask |
| **MySQL Database** | 3306 | Data Storage | MySQL 8.0 |

---

## 🗄 Database Schema

### Tables

#### 1. **products**
```sql
- id (BIGINT, PK)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- brand (VARCHAR)
- material (VARCHAR)
- color (VARCHAR)              # Comma-separated colors
- category (VARCHAR)           # shirt, pants, jacket, etc.
- size_chart (JSON)            # Product-specific measurements
- available_sizes (VARCHAR)    # XS,S,M,L,XL,XXL
- image_url (VARCHAR)
- model_3d_url (VARCHAR)       # Path to 3D model file
- sku (VARCHAR)
- barcode (VARCHAR)
- stock_quantity (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. **users** (Admin)
```sql
- id (BIGINT, PK)
- username (VARCHAR, UNIQUE)
- password (VARCHAR)           # BCrypt hashed
- email (VARCHAR)
- role (VARCHAR)               # ADMIN, SUPER_ADMIN
- created_at (TIMESTAMP)
```

#### 3. **customers**
```sql
- id (BIGINT, PK)
- email (VARCHAR, UNIQUE)
- password (VARCHAR)           # BCrypt hashed
- first_name (VARCHAR)
- last_name (VARCHAR)
- phone (VARCHAR)
- created_at (TIMESTAMP)
```

#### 4. **body_profiles**
```sql
- id (BIGINT, PK)
- user_id (BIGINT, FK)
- height_cm (DECIMAL)
- chest_cm (DECIMAL)
- waist_cm (DECIMAL)
- hip_cm (DECIMAL)
- body_shape (VARCHAR)         # hourglass, pear, apple, etc.
- skin_tone (VARCHAR)
- gender (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 📄 File Purposes

### Backend Files

#### Controllers
- **AdminController.java**: Admin authentication, user management
- **ProductController.java**: CRUD operations for products
- **CustomerAuthController.java**: Customer login/register
- **OrderController.java**: Order processing, email confirmation
- **FileUploadController.java**: Handle 3D model & image uploads

#### Services
- **ProductService.java**: Product business logic
- **CustomerAuthService.java**: Customer authentication
- **EmailService.java**: Send order confirmation emails
- **AIIntegrationService.java**: Communicate with AI service

#### Entities
- **Product.java**: Product model with size chart
- **User.java**: Admin user model
- **Customer.java**: Customer user model
- **BodyProfile.java**: Customer body measurements

#### DTOs
- **ProductDto.java**: Product data transfer
- **ProductRequest.java**: Product creation/update
- **OrderConfirmationRequest.java**: Order email data

### Frontend Files (Customer Store)

#### Pages
- **HomePage.js**: Landing page with hero, features, trending products
- **ProductsPage.js**: Product listing with 3D models
- **ProductDetailPage.js**: Product details, add to cart, buy now
- **VirtualTryOnPageNew.js**: AI-powered size recommendations
- **CartPageNew.js**: Shopping cart with quantity management
- **CheckoutPage.js**: 3-step checkout with payment
- **AboutPage.js**: Company information
- **CustomerLoginPage.js**: Customer authentication

#### Components
- **Header.js**: Navigation bar with cart count
- **Footer.js**: Footer with links
- **Model3DViewer.js**: Three.js 3D model renderer
- **AIRecommendations.js**: Display AI size suggestions
- **FitBadge.js**: Show fit score (Perfect, Good, Loose, Tight)

#### Contexts
- **CustomerAuthContext.js**: Global auth state
- **CartContext.js**: Global cart state with localStorage

### AI Service Files

- **ai_service.py**: Flask API with endpoints
  - `/api/ai/recommend-size`: Get size recommendation
  - `/api/ai/calculate-fit`: Calculate fit score
  
- **size_recommender.py**: Random Forest ML model (84% accuracy)
- **fit_calculator.py**: Calculate fit scores for chest/waist/hip
- **train_size_model.py**: Train ML model with 500 samples
- **generate_training_data.py**: Create synthetic training data
- **size_recommender.pkl**: Trained model file

### SQL Scripts

- **RUN_THIS_FIRST.sql**: Initial database setup
- **COMPLETE_DATABASE_SETUP.sql**: Full schema with sample data
- **ADD_SIZE_CHART_TO_PRODUCTS.sql**: Add size chart columns
- **FIX_ADMIN_PASSWORD.sql**: Reset admin password

---

## 🔗 API Endpoints

### Backend (Port 8082)

#### Authentication
```
POST /api/admin/login          # Admin login
POST /api/customers/register   # Customer register
POST /api/customers/login      # Customer login
```

#### Products
```
GET    /api/products           # Get all products
GET    /api/products/{id}      # Get product by ID
POST   /api/products           # Create product (Admin)
PUT    /api/products/{id}      # Update product (Admin)
DELETE /api/products/{id}      # Delete product (Admin)
```

#### File Upload
```
POST /api/upload/model         # Upload 3D model
POST /api/upload/image         # Upload product image
```

#### Orders
```
POST /api/orders/send-confirmation  # Send order email
```

#### Body Profile
```
POST /api/body-profile/create  # Create body profile
PUT  /api/body-profile/{id}    # Update body profile
GET  /api/body-profile/user/{userId}  # Get user profile
```

### AI Service (Port 5000)

```
POST /api/ai/recommend-size    # Get size recommendation
POST /api/ai/calculate-fit     # Calculate fit score
POST /api/ai/style-recommend   # Get style suggestions
```

---

## ✨ Features

### Admin Panel Features
1. **Product Management**
   - Add/Edit/Delete products
   - Upload 3D models (.obj, .fbx, .glb)
   - Upload product images
   - Configure size charts per product
   - Set available sizes
   - Add multiple colors

2. **Dashboard**
   - View statistics
   - Manage orders
   - User management

### Customer Store Features

1. **Shopping**
   - Browse products with 3D visualization
   - View products from all angles
   - Filter by category
   - Search products
   - Add to cart
   - Checkout with payment

2. **AI-Powered Virtual Try-On**
   - Enter body measurements
   - Get personalized size recommendations
   - See fit scores (84% accuracy)
   - View fit analysis (chest, waist, hip)
   - Product-specific size charts

3. **3D Product Visualization**
   - Rotate products 360°
   - Zoom in/out
   - Change product colors
   - View from front/back/sides
   - Auto-rotation option

4. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Apply promo codes (SAVE10, SAVE20)
   - See order summary
   - Free shipping over $50

5. **Checkout**
   - 3-step process
   - Shipping information
   - Payment method (demo card or COD)
   - Order review
   - Email confirmation

6. **User Account**
   - Register/Login
   - Save body profile
   - View order history
   - Manage wishlist

---

## 🚀 Setup & Running

### Prerequisites
```bash
- Java 17+
- Node.js 16+
- Python 3.8+
- MySQL 8.0
- Maven
```

### 1. Database Setup
```bash
# Start MySQL
mysql -u root -p

# Run setup script
source RUN_THIS_FIRST.sql
```

### 2. Backend Setup
```bash
# Navigate to project root
cd virtual-tryon-platform

# Build and run
mvn clean install
mvn spring-boot:run

# Backend runs on http://localhost:8082
```

### 3. AI Service Setup
```bash
# Navigate to AI folder
cd ai-model

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python ai_service.py

# AI service runs on http://localhost:5000
```

### 4. Admin Panel Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm start

# Admin panel runs on http://localhost:3002
```

### 5. Customer Store Setup
```bash
# Navigate to customer store
cd customer-store

# Install dependencies
npm install

# Start dev server
npm start

# Customer store runs on http://localhost:3001
```

### Default Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

**Customer Login:**
- Register new account or use test account

---

## 📊 Data Flow

### 1. Product Creation Flow
```
Admin Panel → Upload 3D Model → Backend API → File Storage
           → Enter Product Details → Backend API → MySQL
           → Configure Size Chart → Backend API → MySQL (JSON)
```

### 2. Shopping Flow
```
Customer → Browse Products → View 3D Model → Add to Cart (LocalStorage)
        → Checkout → Enter Shipping Info → Select Payment
        → Place Order → Backend API → Send Email → Customer Email
```

### 3. AI Recommendation Flow
```
Customer → Enter Measurements → Save Profile → Backend API → MySQL
        → Select Product → Request Size → Backend API → AI Service
        → AI Service → Calculate Fit → ML Model → Return Size + Score
        → Display Recommendation → Customer
```

---

## 🎨 Design System

### Colors
- **Primary**: #FFFFFF (White)
- **Secondary**: #000000 (Black)
- **Background**: #000000, #0a0a0a, #1a1a1a
- **Text**: #FFFFFF (primary), #888888 (secondary)
- **Success**: #4CAF50
- **Error**: #FF6B6B
- **Border**: #333333

### Typography
- **Font Family**: Inter, Roboto, Helvetica, Arial
- **Headings**: Bold, 700-800 weight
- **Body**: Regular, 400 weight

---

## 🔐 Security

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: BCrypt encryption
3. **CORS**: Configured for frontend origins
4. **Input Validation**: Server-side validation
5. **SQL Injection Prevention**: JPA/Hibernate parameterized queries

---

## 📧 Email Configuration

The system sends professional HTML emails for:
- Order confirmations
- Order invoices
- Shipping updates

Configure in `application.yml`:
```yaml
spring:
  mail:
    host: smtp.gmail.com
    username: your-email@gmail.com
    password: your-app-password
```

---

## 🧪 Testing

### Test Promo Codes
- `SAVE10`: 10% discount
- `SAVE20`: 20% discount

### Test Card Numbers (Demo)
- Any 16-digit number (e.g., 4111 1111 1111 1111)

---

## 📝 Notes

- This is a campus demo project
- Payment gateway is simulated (no real transactions)
- AI model uses synthetic training data
- 3D models should be optimized for web (<10MB)
- Email service is optional for demo

---

## 🆘 Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database credentials in `application.yml`
- Check port 8082 is available

### AI Service errors
- Verify Python dependencies installed
- Check port 5000 is available
- Ensure model file exists

### Frontend build errors
- Delete `node_modules` and reinstall
- Clear npm cache: `npm cache clean --force`
- Check Node.js version

---

## 📚 Additional Resources

- [AI Setup Guide](AI_SETUP_GUIDE.md)
- [3D Model Guide](ADMIN_3D_MODEL_GUIDE.md)
- [Email Setup Guide](EMAIL_SETUP_GUIDE.md)
- [Testing Guide](COMPLETE_TESTING_GUIDE.md)

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Project Type**: Campus Demo / Portfolio Project

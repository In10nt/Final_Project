# Quick Start Guide - Virtual Try-On SaaS Platform

## 🚀 Getting Started in 5 Minutes

### Step 1: Setup Database (1 minute)
```bash
# Open MySQL Workbench or command line
mysql -u root -p123456 < COMPLETE_DATABASE_SETUP.sql
```

### Step 2: Verify Services Running
- ✅ Backend: http://localhost:8082
- ✅ Admin Panel: http://localhost:3002
- ✅ Customer Store: http://localhost:3001

### Step 3: Test Admin Panel (2 minutes)
1. Go to: http://localhost:3002/login
2. Login: `admin@example.com` / `admin123`
3. Go to Products page
4. Click "Add Product"
5. Scroll to "3D Model" section
6. Click dropdown - see available models!
7. Select "shirt.obj"
8. Fill other fields and save

### Step 4: Test Customer Store (2 minutes)
1. Go to: http://localhost:3001
2. Register new account or login: `sarah.johnson@email.com` / `customer123`
3. Go to Virtual Try-On page
4. Create body profile (or skip if exists)
5. Click any product
6. Watch 3D model load! 🎉
7. Rotate, zoom, change colors

## 📋 Quick Reference

### Admin Credentials
- Email: `admin@example.com`
- Password: `admin123`

### Customer Credentials (for testing)
- Email: `sarah.johnson@email.com` | Password: `customer123`
- Email: `mike.davis@email.com` | Password: `customer123`
- Email: `emily.chen@email.com` | Password: `customer123`

### Available 3D Models
- `/uploads/models/shirt.obj` - For shirts, tops
- `/uploads/models/pant.obj` - For pants, jeans
- `/uploads/models/suit.obj` - For suits, jackets
- `/uploads/models/suit collar.obj` - For formal suits

### Key URLs
- Backend API: http://localhost:8082/api
- Admin Panel: http://localhost:3002
- Customer Store: http://localhost:3001
- Models List API: http://localhost:8082/api/upload/models/list
- Health Check: http://localhost:8082/api/health

## 🎯 Key Features to Test

### Admin Side
1. ✅ Login
2. ✅ View products list
3. ✅ Add product with 3D model (dropdown selection)
4. ✅ Upload new 3D model file
5. ✅ Upload product image
6. ✅ Edit product
7. ✅ Delete product
8. ✅ View customers
9. ✅ Manage admins

### Customer Side
1. ✅ Register account
2. ✅ Login
3. ✅ Browse products
4. ✅ Create body profile
5. ✅ Virtual try-on with 3D model
6. ✅ Rotate 3D model
7. ✅ Zoom 3D model
8. ✅ Change model colors
9. ✅ View from different angles

## 🔧 Troubleshooting

### Backend not responding
```bash
# Check if running
curl http://localhost:8082/api/health

# Restart if needed
# Stop: Ctrl+C in terminal
# Start: mvn spring-boot:run
```

### Admin panel not loading
```bash
# Check if running on port 3002
# Restart: npm start in frontend folder
```

### Customer store not loading
```bash
# Check if running on port 3001
# Restart: npm start in customer-store folder
```

### 3D models not showing
1. Check database has model3d_url values
2. Check files exist in: `src/main/resources/static/uploads/models/`
3. Test URL: http://localhost:8082/uploads/models/shirt.obj
4. Check browser console for errors

### Dropdown empty in admin panel
1. Check backend is running
2. Test API: http://localhost:8082/api/upload/models/list
3. Refresh the page
4. Check browser console for errors

## 📊 Database Tables

### Main Tables
- `admins` - Admin users
- `users` - Customer accounts
- `products` - Product catalog (with model3d_url)
- `body_profiles` - Customer measurements
- `try_on_sessions` - Try-on history
- `categories` - Product categories

### Key Columns
- `products.model3d_url` - Path to 3D model file
- `products.image_url` - Path to product image
- `body_profiles.user_id` - Links to customer
- `users.user_type` - 'CUSTOMER' or 'ADMIN'

## 🎨 3D Model Management

### For Admins
1. Go to Products → Add/Edit Product
2. Scroll to "3D Model" section
3. Three options:
   - **Select from dropdown** (easiest)
   - **Upload new file** (adds to library)
   - **Enter URL manually** (advanced)

### Supported Formats
- .obj (recommended)
- .glb
- .gltf
- .mtl (material file for .obj)

### File Location
```
src/main/resources/static/uploads/models/
├── shirt.obj
├── shirt.mtl
├── pant.obj
├── pant.mtl
├── suit.obj
├── suit.mtl
└── suit collar.obj
```

## 📝 Common Tasks

### Add Product with 3D Model
1. Admin Panel → Products → Add Product
2. Fill: Name, Brand, Price, Color
3. 3D Model → Select "shirt.obj"
4. Create

### Register New Customer
1. Customer Store → Register
2. Fill: Email, Password, Name, Phone
3. Register
4. Auto-login

### Create Body Profile
1. Virtual Try-On → Create Profile
2. Fill measurements or take photo
3. Save Profile

### View Product in 3D
1. Virtual Try-On → Click product
2. Wait for model to load
3. Interact: drag, zoom, colors

## 🔐 Security Notes

- Passwords are BCrypt hashed
- JWT tokens for authentication
- CORS enabled for development
- File upload validation
- SQL injection prevention

## 📚 Documentation Files

- `COMPLETE_DATABASE_SETUP.sql` - Full database setup
- `COMPLETE_TESTING_GUIDE.md` - Comprehensive testing
- `ADMIN_3D_MODEL_GUIDE.md` - Admin 3D model guide
- `WHERE_TO_SELECT_3D_MODELS.md` - Dropdown location guide
- `FEATURE_COMPLETE_3D_MODELS.md` - Feature documentation
- `3D_MODELS_SETUP_GUIDE.md` - Technical setup guide

## 🎉 Success Checklist

- [ ] Database setup complete
- [ ] All services running
- [ ] Admin can login
- [ ] Admin can add product with 3D model
- [ ] Admin can see models in dropdown
- [ ] Customer can register/login
- [ ] Customer can create body profile
- [ ] Customer can view 3D models
- [ ] 3D model rotates smoothly
- [ ] Color picker works
- [ ] No console errors

## 🆘 Need Help?

1. Check `COMPLETE_TESTING_GUIDE.md` for detailed testing
2. Check browser console (F12) for errors
3. Check backend logs in terminal
4. Verify database has data
5. Test API endpoints directly

## 🎯 Next Steps

1. Test all features systematically
2. Add more products with 3D models
3. Upload custom 3D models
4. Test with real customers
5. Customize styling and branding
6. Add more features (cart, checkout, etc.)

---

**Everything is ready to use! Start testing now! 🚀**

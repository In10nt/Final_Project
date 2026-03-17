# Admin-Customer Connection Guide

## 🔗 How Admin Products Show in Customer Store

### **Current Setup:**
1. **Admin Panel** (Port 3002) - Add/Edit/Delete products
2. **Customer Store** (Port 3001) - Shows products for virtual try-on
3. **Backend API** (Port 8082) - Connects both systems

### **Connection Flow:**
```
Admin Panel → Backend API → Customer Store
    ↓              ↓              ↓
Add Product → Save to DB → Load in Store
```

### **Test the Connection:**

#### **Step 1: Add Product in Admin**
1. Go to http://localhost:3002
2. Login with: user@example.com / password
3. Go to Products page
4. Click "Add Product"
5. Add: Name, Price, Category, Description

#### **Step 2: See Product in Customer Store**
1. Go to http://localhost:3001/virtual-tryon
2. Look at "Available Products" section (right side)
3. Your admin product should appear automatically

### **API Endpoints Used:**
- **Admin saves:** `POST /api/products`
- **Customer loads:** `GET /api/products`

### **Troubleshooting:**
- **Products not showing?** Check if backend (port 8082) is running
- **Backend not running?** Start with: `mvn spring-boot:run` in backend folder
- **Still not working?** Customer store uses fallback mock products

### **Features Working:**
✅ Auto avatar generation when profile created
✅ Enhanced profile with nickname, gender, age
✅ Admin products sync to customer store
✅ Virtual try-on with personalized avatars
✅ OpenAI integration for real photo analysis
# Complete Testing Guide - Virtual Try-On SaaS Platform

## Overview
This document provides comprehensive testing procedures for both Admin and Customer sides of the application.

## Prerequisites

### Services Running
- ✅ Backend: http://localhost:8082 (Spring Boot)
- ✅ Admin Panel: http://localhost:3002 (React)
- ✅ Customer Store: http://localhost:3001 (React)
- ✅ MySQL Database: localhost:3306

### Database Setup
Run the complete database setup script:
```bash
mysql -u root -p123456 < COMPLETE_DATABASE_SETUP.sql
```

## Test Credentials

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

### Customer Accounts (Pre-created for testing)
- Email: `sarah.johnson@email.com` | Password: `customer123`
- Email: `mike.davis@email.com` | Password: `customer123`
- Email: `emily.chen@email.com` | Password: `customer123`

Note: Customers should register through the app for proper password hashing.

---

## PART 1: BACKEND API TESTING

### 1.1 Health Check
```bash
curl http://localhost:8082/api/health
```
**Expected:** Status 200, health status response

### 1.2 Products API
```bash
# Get all products
curl http://localhost:8082/api/products

# Get specific product
curl http://localhost:8082/api/products/{product-id}
```
**Expected:** JSON array of products with 3D model URLs

### 1.3 3D Models List API
```bash
curl http://localhost:8082/api/upload/models/list
```
**Expected:** 
```json
{
  "models": [
    {"filename": "pant.obj", "name": "pant", "url": "/uploads/models/pant.obj"},
    {"filename": "shirt.obj", "name": "shirt", "url": "/uploads/models/shirt.obj"},
    {"filename": "suit.obj", "name": "suit", "url": "/uploads/models/suit.obj"},
    {"filename": "suit collar.obj", "name": "suit collar", "url": "/uploads/models/suit collar.obj"}
  ]
}
```

### 1.4 Static File Access
```bash
# Test 3D model file access
curl -I http://localhost:8082/uploads/models/shirt.obj
```
**Expected:** Status 200, Content-Type: application/octet-stream

### 1.5 Admin Authentication
```bash
curl -X POST http://localhost:8082/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```
**Expected:** JWT token in response

### 1.6 Customer Registration
```bash
curl -X POST http://localhost:8082/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@test.com",
    "password":"test123",
    "firstName":"Test",
    "lastName":"User",
    "phone":"+1-555-0199"
  }'
```
**Expected:** Success response with JWT token

---

## PART 2: ADMIN PANEL TESTING

### 2.1 Admin Login
**URL:** http://localhost:3002/login

**Steps:**
1. Open admin panel
2. Enter email: `admin@example.com`
3. Enter password: `admin123`
4. Click "Login"

**Expected Results:**
- ✅ Successful login
- ✅ Redirected to dashboard
- ✅ Token stored in localStorage
- ✅ Admin name displayed in header

**Test Cases:**
- [ ] Valid credentials login
- [ ] Invalid email shows error
- [ ] Invalid password shows error
- [ ] Empty fields show validation errors

### 2.2 Dashboard
**URL:** http://localhost:3002/dashboard

**Expected Results:**
- ✅ Statistics cards displayed
- ✅ Total products count
- ✅ Total customers count
- ✅ Recent activity
- ✅ Charts/graphs (if implemented)

**Test Cases:**
- [ ] Dashboard loads without errors
- [ ] Statistics are accurate
- [ ] Navigation menu works
- [ ] Logout button works

### 2.3 Products Management
**URL:** http://localhost:3002/products

#### 2.3.1 View Products List
**Steps:**
1. Navigate to Products page
2. View products table

**Expected Results:**
- ✅ Products table displays
- ✅ Shows: Name, Brand, Price, SKU, Color, Status
- ✅ Edit and Delete buttons visible
- ✅ "Add Product" button visible

**Test Cases:**
- [ ] Products list loads
- [ ] All columns display correctly
- [ ] Pagination works (if implemented)
- [ ] Search/filter works (if implemented)

#### 2.3.2 Add New Product
**Steps:**
1. Click "Add Product" button
2. Fill in product details:
   - Name: "Test Product"
   - Description: "Test description"
   - Brand: "Test Brand"
   - Price: 99.99
   - SKU: "TEST-001"
   - Barcode: "TEST-BAR-001"
   - Color: "Red"
   - Material: "Cotton"

3. **Test 3D Model Selection:**
   - Scroll to "3D Model" section
   - Click "Select Existing Model" dropdown
   - Verify models appear: shirt.obj, pant.obj, suit.obj, suit collar.obj
   - Select "shirt.obj"
   - Verify URL auto-populates: `/uploads/models/shirt.obj`
   - Verify green chip appears: "Selected: /uploads/models/shirt.obj"

4. Click "Create"

**Expected Results:**
- ✅ Dialog opens with form
- ✅ All fields are editable
- ✅ 3D model dropdown shows available models
- ✅ Model selection auto-populates URL
- ✅ Product saves successfully
- ✅ Success message appears
- ✅ Product appears in list
- ✅ Dialog closes

**Test Cases:**
- [ ] Form validation works
- [ ] Required fields show errors
- [ ] Dropdown shows all models
- [ ] Model selection works
- [ ] Manual URL entry works
- [ ] Product saves with 3D model
- [ ] Cancel button works

#### 2.3.3 Upload New 3D Model
**Steps:**
1. Click "Add Product"
2. Scroll to 3D Model section
3. Click "Upload New" button
4. Select a .obj file from your computer
5. Wait for upload

**Expected Results:**
- ✅ File picker opens
- ✅ Upload progress indicator shows
- ✅ Success message appears
- ✅ URL auto-populates
- ✅ Model appears in dropdown for future use

**Test Cases:**
- [ ] .obj file uploads successfully
- [ ] .glb file uploads successfully
- [ ] .gltf file uploads successfully
- [ ] .mtl file uploads successfully
- [ ] Invalid file type shows error
- [ ] Large file shows error (>10MB)
- [ ] Upload progress indicator works

#### 2.3.4 Upload Product Image
**Steps:**
1. In product form, find "Product Image" section
2. Click "Upload" button next to Image URL
3. Select an image file
4. Wait for upload

**Expected Results:**
- ✅ File picker opens
- ✅ Image uploads successfully
- ✅ URL auto-populates
- ✅ Success message appears

**Test Cases:**
- [ ] JPG image uploads
- [ ] PNG image uploads
- [ ] Invalid file type shows error
- [ ] Large file shows error

#### 2.3.5 Edit Product
**Steps:**
1. Click edit icon (pencil) next to any product
2. Modify fields
3. Change 3D model selection
4. Click "Update"

**Expected Results:**
- ✅ Dialog opens with existing data
- ✅ All fields are pre-filled
- ✅ Current 3D model is selected
- ✅ Changes save successfully
- ✅ Updated data appears in list

**Test Cases:**
- [ ] Edit dialog opens with data
- [ ] Can change 3D model
- [ ] Can upload new model
- [ ] Updates save correctly
- [ ] Cancel discards changes

#### 2.3.6 Delete Product
**Steps:**
1. Click delete icon (trash) next to any product
2. Confirm deletion

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Product is deleted
- ✅ Product removed from list
- ✅ Success message appears

**Test Cases:**
- [ ] Confirmation dialog shows
- [ ] Cancel keeps product
- [ ] Confirm deletes product
- [ ] Product removed from database

### 2.4 Customers Management
**URL:** http://localhost:3002/customers

**Expected Results:**
- ✅ Customers list displays
- ✅ Shows: Name, Email, Phone, Status
- ✅ Customer details viewable

**Test Cases:**
- [ ] Customers list loads
- [ ] All customer data displays
- [ ] Can view customer details
- [ ] Can view customer orders (if implemented)

### 2.5 Admins Management
**URL:** http://localhost:3002/admins

**Expected Results:**
- ✅ Admins list displays
- ✅ Can add new admin
- ✅ Can edit admin
- ✅ Can delete admin

**Test Cases:**
- [ ] Admins list loads
- [ ] Add admin works
- [ ] Edit admin works
- [ ] Delete admin works
- [ ] Role assignment works

---

## PART 3: CUSTOMER STORE TESTING

### 3.1 Customer Registration
**URL:** http://localhost:3001/register

**Steps:**
1. Open customer store
2. Click "Register" or go to /register
3. Fill in:
   - Email: `newcustomer@test.com`
   - Password: `test123`
   - First Name: `New`
   - Last Name: `Customer`
   - Phone: `+1-555-0200`
4. Click "Register"

**Expected Results:**
- ✅ Registration form displays
- ✅ All fields are editable
- ✅ Registration succeeds
- ✅ JWT token received
- ✅ Redirected to home/dashboard
- ✅ User is logged in

**Test Cases:**
- [ ] Form validation works
- [ ] Duplicate email shows error
- [ ] Weak password shows error
- [ ] Registration succeeds
- [ ] Auto-login after registration

### 3.2 Customer Login
**URL:** http://localhost:3001/login

**Steps:**
1. Enter email: `sarah.johnson@email.com`
2. Enter password: `customer123`
3. Click "Login"

**Expected Results:**
- ✅ Login succeeds
- ✅ JWT token stored
- ✅ Redirected to home
- ✅ User name displayed

**Test Cases:**
- [ ] Valid credentials login
- [ ] Invalid credentials show error
- [ ] Remember me works (if implemented)
- [ ] Forgot password works (if implemented)

### 3.3 Browse Products
**URL:** http://localhost:3001/products

**Expected Results:**
- ✅ Products grid displays
- ✅ Product images show
- ✅ Product details visible
- ✅ Prices displayed
- ✅ Can click product for details

**Test Cases:**
- [ ] Products load correctly
- [ ] Images display
- [ ] Filters work (if implemented)
- [ ] Search works (if implemented)
- [ ] Sorting works (if implemented)

### 3.4 Virtual Try-On Feature
**URL:** http://localhost:3001/virtual-tryon

This is the main feature to test thoroughly!

#### 3.4.1 Create Body Profile
**Steps:**
1. Go to Virtual Try-On page
2. Click "Create Profile" button
3. Fill in measurements:
   - Nickname: "Test User"
   - Gender: Female/Male
   - Age: 25
   - Height: 165 cm
   - Chest: 88 cm
   - Waist: 72 cm
   - Hips: 95 cm
   - Shoulders: 42 cm
   - Body Shape: Hourglass
   - Skin Tone: Medium
   - Hair Color: Brown
   - Eye Color: Brown
4. Click "Save Profile"

**Expected Results:**
- ✅ Profile dialog opens
- ✅ All sliders work
- ✅ Dropdowns work
- ✅ Profile saves successfully
- ✅ Avatar generated
- ✅ Profile displayed in left panel

**Test Cases:**
- [ ] Profile form opens
- [ ] All inputs work
- [ ] Sliders adjust values
- [ ] Profile saves
- [ ] Avatar displays
- [ ] Can update profile
- [ ] Can delete profile

#### 3.4.2 Take Photo for Profile
**Steps:**
1. Click "Take Photo" button
2. Allow camera access
3. Position yourself
4. Click "Capture & Analyze"

**Expected Results:**
- ✅ Camera dialog opens
- ✅ Camera stream shows
- ✅ Photo captures
- ✅ Analysis runs
- ✅ Measurements auto-filled
- ✅ Profile created

**Test Cases:**
- [ ] Camera access requested
- [ ] Camera stream displays
- [ ] Photo capture works
- [ ] Analysis completes
- [ ] Measurements populated
- [ ] Profile saved

#### 3.4.3 Upload Photo for Profile
**Steps:**
1. Click "Upload Image" button
2. Select a photo
3. Wait for analysis

**Expected Results:**
- ✅ File picker opens
- ✅ Photo uploads
- ✅ Analysis runs
- ✅ Measurements extracted
- ✅ Profile created

**Test Cases:**
- [ ] File upload works
- [ ] Analysis completes
- [ ] Measurements populated
- [ ] Profile saved

#### 3.4.4 View 3D Model
**Steps:**
1. Ensure body profile exists
2. Click on any product in the right panel
3. Wait for 3D model to load

**Expected Results:**
- ✅ 3D model loads in center panel
- ✅ Model displays correctly
- ✅ Model is oriented properly (standing upright)
- ✅ Auto-rotation starts
- ✅ Product info shows below model

**Test Cases:**
- [ ] Model loads without errors
- [ ] Model displays correctly
- [ ] Model orientation is correct
- [ ] Loading indicator shows
- [ ] Error handling works

#### 3.4.5 Interact with 3D Model
**Steps:**
1. With model loaded, test interactions:
   - Drag mouse to rotate
   - Scroll to zoom
   - Click view angle buttons (F/R/B/L)
   - Click pause/play button
   - Click reset button

**Expected Results:**
- ✅ Mouse drag rotates model horizontally
- ✅ Scroll wheel zooms in/out
- ✅ View buttons jump to angles
- ✅ Pause stops auto-rotation
- ✅ Play resumes auto-rotation
- ✅ Reset returns to default view

**Test Cases:**
- [ ] Drag rotation works
- [ ] Zoom works
- [ ] View angle buttons work
- [ ] Pause/play works
- [ ] Reset works
- [ ] Controls are responsive

#### 3.4.6 Change Model Color
**Steps:**
1. With model loaded, find color picker below model
2. Click different color circles
3. Observe model color change

**Expected Results:**
- ✅ Color picker displays
- ✅ 12 colors available
- ✅ Clicking color changes model
- ✅ Selected color highlighted
- ✅ Color change is smooth

**Test Cases:**
- [ ] All colors work
- [ ] Color change is instant
- [ ] Selected color highlighted
- [ ] Colors look realistic

#### 3.4.7 Try Multiple Products
**Steps:**
1. Click different products in right panel
2. Observe model changes

**Expected Results:**
- ✅ Each product loads its 3D model
- ✅ Models switch smoothly
- ✅ Product info updates
- ✅ Color picker resets

**Test Cases:**
- [ ] Can switch between products
- [ ] Models load correctly
- [ ] No memory leaks
- [ ] Performance is good

### 3.5 Shopping Cart (If Implemented)
**URL:** http://localhost:3001/cart

**Expected Results:**
- ✅ Cart displays items
- ✅ Can update quantities
- ✅ Can remove items
- ✅ Total calculates correctly

**Test Cases:**
- [ ] Add to cart works
- [ ] Cart displays items
- [ ] Quantity update works
- [ ] Remove item works
- [ ] Total is correct

### 3.6 Checkout (If Implemented)
**URL:** http://localhost:3001/checkout

**Expected Results:**
- ✅ Checkout form displays
- ✅ Can enter shipping info
- ✅ Can enter payment info
- ✅ Order submits successfully

**Test Cases:**
- [ ] Checkout form works
- [ ] Validation works
- [ ] Payment processing works
- [ ] Order confirmation shows

---

## PART 4: INTEGRATION TESTING

### 4.1 End-to-End Product Flow
**Scenario:** Admin adds product → Customer views in 3D

**Steps:**
1. Admin logs in
2. Admin adds new product with 3D model
3. Customer logs in
4. Customer goes to Virtual Try-On
5. Customer clicks new product
6. Customer views 3D model

**Expected Results:**
- ✅ Product appears immediately for customer
- ✅ 3D model loads correctly
- ✅ All features work

### 4.2 End-to-End Try-On Flow
**Scenario:** Complete virtual try-on experience

**Steps:**
1. Customer registers
2. Customer creates body profile
3. Customer browses products
4. Customer tries on product
5. Customer changes colors
6. Customer adds to cart (if implemented)

**Expected Results:**
- ✅ Smooth flow from start to finish
- ✅ No errors or crashes
- ✅ Data persists correctly

### 4.3 Multi-User Testing
**Scenario:** Multiple users simultaneously

**Steps:**
1. Open multiple browser windows
2. Login as different users
3. Perform actions simultaneously

**Expected Results:**
- ✅ No conflicts
- ✅ Data isolation works
- ✅ Performance is acceptable

---

## PART 5: ERROR HANDLING TESTING

### 5.1 Network Errors
**Test Cases:**
- [ ] Backend offline - shows error message
- [ ] Slow network - shows loading indicator
- [ ] Timeout - shows timeout error
- [ ] 404 errors - handled gracefully
- [ ] 500 errors - shows server error

### 5.2 Invalid Data
**Test Cases:**
- [ ] Invalid email format
- [ ] Weak password
- [ ] Negative prices
- [ ] Missing required fields
- [ ] Invalid file types

### 5.3 Authentication Errors
**Test Cases:**
- [ ] Expired token - redirects to login
- [ ] Invalid token - shows error
- [ ] Unauthorized access - blocked
- [ ] Session timeout - handled

---

## PART 6: PERFORMANCE TESTING

### 6.1 3D Model Loading
**Metrics:**
- Model load time: < 3 seconds
- Model render time: < 1 second
- Smooth rotation: 60 FPS
- Memory usage: < 200MB

**Test Cases:**
- [ ] Large models load efficiently
- [ ] Multiple model switches don't leak memory
- [ ] Rotation is smooth
- [ ] Zoom is responsive

### 6.2 Page Load Times
**Metrics:**
- Admin panel: < 2 seconds
- Customer store: < 2 seconds
- Products list: < 1 second
- Virtual Try-On: < 3 seconds

### 6.3 API Response Times
**Metrics:**
- Products API: < 500ms
- Models list API: < 200ms
- Authentication: < 1 second
- File upload: < 5 seconds

---

## PART 7: BROWSER COMPATIBILITY

### 7.1 Desktop Browsers
**Test on:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (latest)

### 7.2 Mobile Browsers
**Test on:**
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Firefox Mobile

### 7.3 Features to Test
- [ ] 3D model rendering
- [ ] Touch controls (mobile)
- [ ] Camera access (mobile)
- [ ] File uploads
- [ ] Responsive design

---

## PART 8: SECURITY TESTING

### 8.1 Authentication
**Test Cases:**
- [ ] JWT tokens expire correctly
- [ ] Passwords are hashed (BCrypt)
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] CSRF protection enabled

### 8.2 Authorization
**Test Cases:**
- [ ] Customers can't access admin panel
- [ ] Admins can't access customer data without permission
- [ ] API endpoints require authentication
- [ ] File uploads are validated

### 8.3 Data Protection
**Test Cases:**
- [ ] Passwords never exposed
- [ ] Sensitive data encrypted
- [ ] HTTPS enforced (production)
- [ ] CORS configured correctly

---

## TEST RESULTS TEMPLATE

### Test Execution Summary

| Category | Total Tests | Passed | Failed | Skipped |
|----------|-------------|--------|--------|---------|
| Backend API | 6 | | | |
| Admin Panel | 20 | | | |
| Customer Store | 25 | | | |
| Integration | 3 | | | |
| Error Handling | 15 | | | |
| Performance | 10 | | | |
| Browser Compat | 7 | | | |
| Security | 12 | | | |
| **TOTAL** | **98** | | | |

### Critical Issues Found
1. 
2. 
3. 

### Minor Issues Found
1. 
2. 
3. 

### Recommendations
1. 
2. 
3. 

---

## AUTOMATED TESTING (Future)

### Unit Tests
- Backend: JUnit tests for services
- Frontend: Jest tests for components

### Integration Tests
- API endpoint tests
- Database integration tests

### E2E Tests
- Selenium/Cypress tests
- User flow automation

---

## CONCLUSION

This comprehensive testing guide covers all aspects of the Virtual Try-On SaaS Platform. Follow each section systematically to ensure the application works correctly.

**Priority Testing Areas:**
1. ✅ 3D Model Display (Core Feature)
2. ✅ Admin Product Management
3. ✅ Customer Virtual Try-On
4. ✅ Authentication & Authorization
5. ✅ File Uploads

**Success Criteria:**
- All critical features work without errors
- 3D models load and display correctly
- Admin can manage products with 3D models
- Customers can view and interact with 3D models
- Performance is acceptable
- Security is maintained

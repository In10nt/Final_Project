# CRUD Operations Guide - Virtual Try-On Platform

## Overview

All CRUD (Create, Read, Update, Delete) operations have been implemented for the admin dashboard.

## Available Pages & Features

### 1. Dashboard
- **URL:** http://localhost:3000/dashboard
- **Features:**
  - Overview metrics (customers, products, try-ons, conversion rate)
  - Recent activity feed
  - Quick actions

### 2. Products Management
- **URL:** http://localhost:3000/products
- **Operations:**
  - ✓ **Create:** Click "Add Product" button
  - ✓ **Read:** View all products in table
  - ✓ **Update:** Click edit icon to modify product
  - ✓ **Delete:** Click delete icon to remove product

**Product Fields:**
- Product Name (required)
- Description
- Brand
- Price
- Barcode
- SKU
- Color
- Material

### 3. Customers Management
- **URL:** http://localhost:3000/customers
- **Operations:**
  - ✓ **Read:** View all customers in table
  - Display customer information:
    - Email
    - First Name
    - Last Name
    - Phone
    - Status
    - Join Date

### 4. Analytics Dashboard
- **URL:** http://localhost:3000/analytics
- **Features:**
  - Total try-ons metric
  - Conversion rate
  - Average session time
  - Customer satisfaction rating
  - Weekly try-ons chart
  - Conversion trend chart
  - Top products list

### 5. Settings
- **URL:** http://localhost:3000/settings
- **Features:**
  - Store Information (name, email, phone, address)
  - Feature toggles:
    - Enable/Disable Notifications
    - Enable/Disable Analytics
    - Enable/Disable AI Recommendations
    - Maintenance Mode
  - API Configuration display

## Backend API Endpoints

### Products API
```
GET    /api/products                 - Get all products (paginated)
GET    /api/products/{id}            - Get product by ID
GET    /api/products/barcode/{code}  - Get product by barcode
POST   /api/products                 - Create new product
PUT    /api/products/{id}            - Update product
DELETE /api/products/{id}            - Delete product
```

### Customers API
```
GET    /api/customers                - Get all customers (paginated)
```

### Analytics API
```
GET    /api/analytics/dashboard      - Get dashboard metrics
GET    /api/analytics/products/{id}  - Get product analytics
```

## How to Use CRUD Operations

### Adding a Product
1. Go to Products page
2. Click "Add Product" button
3. Fill in product details
4. Click "Create" button

### Editing a Product
1. Go to Products page
2. Find the product in the table
3. Click the edit icon (pencil)
4. Modify the details
5. Click "Update" button

### Deleting a Product
1. Go to Products page
2. Find the product in the table
3. Click the delete icon (trash)
4. Confirm deletion

### Viewing Customers
1. Go to Customers page
2. View all registered customers
3. See customer details (email, name, phone, status, join date)

### Viewing Analytics
1. Go to Analytics page
2. View key metrics
3. Check weekly try-on trends
4. Review conversion trends
5. See top performing products

### Configuring Settings
1. Go to Settings page
2. Update store information
3. Toggle features on/off
4. Click "Save Settings"

## Frontend Components

### ProductsPage.js
- Full CRUD interface for products
- Dialog form for add/edit
- Table view with actions
- Error handling and loading states

### CustomersPage.js
- Read-only customer list
- Displays customer information
- Status indicators
- Join date display

### AnalyticsPage.js
- Dashboard metrics cards
- Bar chart for weekly try-ons
- Line chart for conversion trends
- Top products list

### SettingsPage.js
- Store information form
- Feature toggles
- API configuration display
- Settings save functionality

## API Service Methods

All API calls are handled through `apiService.js`:

```javascript
// Products
apiService.getProducts(page, size)
apiService.getProduct(id)
apiService.createProduct(data)
apiService.updateProduct(id, data)
apiService.deleteProduct(id)

// Customers
apiService.getCustomers(page, size)

// Analytics
apiService.getDashboardMetrics()
apiService.getProductAnalytics(productId)
```

## Error Handling

All pages include:
- Error alerts for failed operations
- Loading spinners during data fetch
- Confirmation dialogs for delete operations
- Try-catch blocks for API calls

## Next Steps

To extend CRUD operations:

1. **Add more fields** to products (size, weight, etc.)
2. **Implement customer CRUD** (create, edit, delete customers)
3. **Add product categories** management
4. **Implement inventory tracking**
5. **Add order management** page
6. **Create reports** section

## Testing

To test CRUD operations:

1. **Create:** Add a new product with all fields
2. **Read:** Verify product appears in list
3. **Update:** Edit product and verify changes
4. **Delete:** Remove product and verify it's gone
5. **View Customers:** Check customer list loads
6. **View Analytics:** Check charts and metrics display

## Troubleshooting

### Products not loading?
- Check backend is running on port 8082
- Check browser console for errors
- Verify database has products

### Add Product dialog not opening?
- Check browser console for errors
- Verify Material-UI components are loaded

### API errors?
- Check backend health: http://localhost:8082/actuator/health
- Check API docs: http://localhost:8082/swagger-ui.html
- Verify database connection

---

**Status:** ✓ All CRUD operations implemented and ready to use!

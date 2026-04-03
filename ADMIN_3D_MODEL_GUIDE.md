# Admin Guide: Adding 3D Models to Products

## Overview
Admins can now easily add 3D models to products through the admin panel with two options:
1. Select from existing 3D models
2. Upload new 3D model files

## Features Added

### 1. View Available 3D Models
- When adding/editing a product, you'll see a dropdown with all available 3D models
- Models are automatically detected from the `uploads/models` folder

### 2. Select Existing Model
- Use the "Select Existing Model" dropdown
- Choose from pre-uploaded models like:
  - shirt.obj
  - pant.obj
  - suit.obj
  - suit collar.obj

### 3. Upload New Model
- Click the "Upload New" button
- Select your 3D model file (.obj, .glb, .gltf, or .mtl)
- File is automatically uploaded and URL is populated
- The new model becomes available for other products too

### 4. Upload Product Images
- Click "Upload" button next to Image URL field
- Select an image file
- Image is automatically uploaded and URL is populated

## How to Use

### Adding a Product with 3D Model

1. **Go to Products Page**
   - Navigate to http://localhost:3002/products
   - Click "Add Product" button

2. **Fill Basic Information**
   - Name: e.g., "Classic White Shirt"
   - Description: Product details
   - Brand: e.g., "Fashion Brand"
   - Price: e.g., 49.99
   - SKU, Barcode, Color, Material

3. **Add Product Image**
   - Option A: Enter image URL manually
   - Option B: Click "Upload" and select image file

4. **Add 3D Model**
   - Option A: Select from dropdown (existing models)
   - Option B: Click "Upload New" to upload a new model file
   - Option C: Enter model URL manually

5. **Save**
   - Click "Create" button
   - Product is now available with 3D model!

### Editing Existing Products

1. Click the edit icon (pencil) next to any product
2. Update the 3D Model field using any of the three options above
3. Click "Update"

## Supported 3D Model Formats

### Primary Formats
- **.obj** - Wavefront OBJ (recommended, widely supported)
- **.glb** - Binary glTF (compact, efficient)
- **.gltf** - glTF JSON format

### Material Files
- **.mtl** - Material file for .obj models (upload alongside .obj)

## File Upload Process

### Backend
- Files are uploaded to: `src/main/resources/static/uploads/models/`
- Each file gets a unique UUID filename to prevent conflicts
- API endpoint: `POST /api/upload/model`

### Frontend
- Automatic file validation
- Progress indication during upload
- Success/error notifications
- Automatic refresh of available models list

## API Endpoints

### List Available Models
```
GET /api/upload/models/list
Response: {
  "models": [
    {
      "filename": "shirt.obj",
      "url": "/uploads/models/shirt.obj",
      "name": "shirt"
    },
    ...
  ]
}
```

### Upload Model
```
POST /api/upload/model
Content-Type: multipart/form-data
Body: file (binary)

Response: {
  "url": "/uploads/models/abc-123.obj",
  "filename": "abc-123.obj"
}
```

### Upload Image
```
POST /api/upload/image
Content-Type: multipart/form-data
Body: file (binary)

Response: {
  "url": "/uploads/images/xyz-456.jpg",
  "filename": "xyz-456.jpg"
}
```

## Best Practices

### 3D Model Files
1. **Optimize file size** - Keep models under 5MB for fast loading
2. **Use .obj format** - Most compatible with Three.js viewer
3. **Include .mtl files** - Upload material files with .obj models
4. **Test before uploading** - Verify models work in a 3D viewer first

### Naming Convention
- Use descriptive names: `blue-jeans.obj`, `red-dress.obj`
- Avoid spaces: Use hyphens or underscores
- Keep names short and clear

### Organization
- Group related models (shirt variants, pant variants)
- Delete unused models periodically
- Keep a backup of original model files

## Troubleshooting

### Model doesn't appear in dropdown
- Check if file was uploaded successfully
- Verify file extension is .obj, .glb, or .gltf
- Refresh the page to reload available models

### Upload fails
- Check file size (must be under 10MB)
- Verify file format is supported
- Check backend logs for errors
- Ensure uploads folder has write permissions

### Model doesn't display in customer store
- Verify model3dUrl is saved in database
- Test model URL directly: http://localhost:8082/uploads/models/[filename]
- Check browser console for loading errors
- Ensure .mtl file is uploaded for .obj models

### CORS errors
- Backend has CORS enabled for all origins
- If issues persist, check browser console
- Verify backend is running on port 8082

## Customer Experience

When a product has a 3D model:
1. Customer goes to Virtual Try-On page
2. Clicks on the product
3. 3D model loads in the center viewer
4. Customer can:
   - Rotate model with mouse drag
   - Zoom with scroll wheel
   - Change colors using color picker
   - View from different angles (F/R/B/L buttons)
   - Auto-rotate or pause

## Technical Details

### File Storage
```
src/main/resources/static/
  └── uploads/
      ├── models/
      │   ├── shirt.obj
      │   ├── shirt.mtl
      │   ├── pant.obj
      │   └── ...
      └── images/
          ├── product1.jpg
          └── ...
```

### Database Schema
```sql
products table:
  - model3d_url TEXT  -- e.g., "/uploads/models/shirt.obj"
  - image_url TEXT    -- e.g., "/uploads/images/product.jpg"
```

### Frontend Components
- `ProductsPage.js` - Admin product management
- `Model3DViewer.js` - Customer 3D viewer
- `VirtualTryOnPage.js` - Customer try-on experience

## Next Steps

1. Run the SQL script to add 3D models to existing products:
   ```bash
   mysql -u root -p123456 virtual_tryon < quick_fix_3d_models.sql
   ```

2. Test the admin panel:
   - Add a new product with 3D model
   - Edit existing product to add model
   - Upload a new model file

3. Test customer experience:
   - Go to Virtual Try-On page
   - Click products to view 3D models
   - Test all viewer features

## Support

If you encounter issues:
1. Check backend logs (terminal running mvn spring-boot:run)
2. Check browser console (F12 → Console tab)
3. Verify file permissions on uploads folder
4. Ensure all services are running (backend, admin, customer store)

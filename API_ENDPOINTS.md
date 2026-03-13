# Virtual Try-On Platform API Documentation

## Base URL
- Development: `http://localhost:8080`
- Production: `https://api.virtualtryon.com`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Authentication Endpoints

### Customer Authentication
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "tenantId": "uuid"
}
```

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "uuid"
}
```

### Admin Authentication
```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@shop.com",
  "password": "adminpass123"
}
```

## Product Management

### Get Products (Paginated)
```http
GET /api/products?page=0&size=20&category=shirts&brand=nike
Authorization: Bearer <token>

Response:
{
  "content": [
    {
      "id": "uuid",
      "name": "Cotton T-Shirt",
      "description": "Comfortable cotton t-shirt",
      "brand": "Nike",
      "price": 29.99,
      "currency": "USD",
      "barcode": "1234567890123",
      "sku": "NIKE-TSHIRT-001",
      "color": "Blue",
      "material": "100% Cotton",
      "images": [
        {
          "url": "https://s3.amazonaws.com/bucket/image1.jpg",
          "isPrimary": true
        }
      ],
      "variants": [
        {
          "id": "uuid",
          "size": "M",
          "stockQuantity": 50,
          "measurements": {
            "chest": 102,
            "length": 71,
            "shoulder": 45
          }
        }
      ]
    }
  ],
  "totalElements": 150,
  "totalPages": 8,
  "size": 20,
  "number": 0
}
```

### Get Product by ID
```http
GET /api/products/{id}
Authorization: Bearer <token>
```

### Get Product by Barcode
```http
GET /api/products/barcode/{barcode}
Authorization: Bearer <token>
```

### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Cotton T-Shirt",
  "description": "Comfortable cotton t-shirt",
  "brand": "Nike",
  "price": 29.99,
  "barcode": "1234567890123",
  "sku": "NIKE-TSHIRT-001",
  "color": "Blue",
  "material": "100% Cotton",
  "categoryId": "uuid"
}
```

## Body Profile Management

### Get User Body Profile
```http
GET /api/body-profiles/me
Authorization: Bearer <token>

Response:
{
  "id": "uuid",
  "userId": "uuid",
  "height": 175,
  "weight": 70.5,
  "chest": 96,
  "waist": 81,
  "hip": 97,
  "shoulderWidth": 42,
  "bodyShape": "hourglass",
  "skinTone": "medium",
  "profileImageUrl": "https://s3.amazonaws.com/bucket/profile.jpg",
  "bodyLandmarks": {
    "landmarks": [...],
    "confidence": 0.95
  }
}
```

### Update Body Profile
```http
PUT /api/body-profiles/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "height": 175,
  "weight": 70.5,
  "chest": 96,
  "waist": 81,
  "hip": 97,
  "bodyShape": "hourglass",
  "skinTone": "medium"
}
```

### Upload Profile Image
```http
POST /api/body-profiles/me/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- image: <file>
```

## Virtual Try-On

### Create Try-On Session
```http
POST /api/try-on/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "uuid",
  "variantId": "uuid",
  "bodyProfileId": "uuid"
}

Response:
{
  "id": "uuid",
  "resultImageUrl": "https://s3.amazonaws.com/bucket/tryon-result.jpg",
  "fitScore": 0.87,
  "processingTimeMs": 3500,
  "recommendations": {
    "recommendedSize": "M",
    "confidence": 0.92,
    "reasoning": "Based on your measurements, size M provides the best fit"
  }
}
```

### Get Try-On History
```http
GET /api/try-on/sessions/me?page=0&size=10
Authorization: Bearer <token>
```

## Size Recommendations

### Get Size Recommendation
```http
POST /api/recommendations/size
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "uuid",
  "bodyProfileId": "uuid"
}

Response:
{
  "recommendedSize": "M",
  "confidence": 0.92,
  "reasoning": "Based on your chest measurement of 96cm and the product's sizing chart",
  "alternativeSizes": [
    {
      "size": "L",
      "confidence": 0.75,
      "fit": "loose"
    }
  ]
}
```

## User Favorites

### Add to Favorites
```http
POST /api/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "uuid"
}
```

### Get User Favorites
```http
GET /api/favorites/me?page=0&size=20
Authorization: Bearer <token>
```

### Remove from Favorites
```http
DELETE /api/favorites/{productId}
Authorization: Bearer <token>
```

## Analytics (Admin Only)

### Get Dashboard Metrics
```http
GET /api/analytics/dashboard
Authorization: Bearer <admin_token>

Response:
{
  "totalUsers": 1250,
  "totalProducts": 450,
  "totalTryOnSessions": 8750,
  "averageFitScore": 0.84,
  "topProducts": [...],
  "userGrowth": [...],
  "tryOnTrends": [...]
}
```

### Get Product Analytics
```http
GET /api/analytics/products/{productId}
Authorization: Bearer <admin_token>
```

## File Upload

### Upload Product Images
```http
POST /api/upload/product-images
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- images: <file[]>
- productId: uuid
```

## AI Services Integration

### Analyze Body Image
```http
POST /api/ai/body-analysis
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- image: <file>

Response:
{
  "landmarks": [...],
  "measurements": {
    "shoulderWidth": 42.5,
    "waistWidth": 32.1,
    "hipWidth": 38.7,
    "bodyHeight": 175.2
  },
  "bodyShape": "hourglass",
  "confidence": 0.95
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/products",
  "details": {
    "field": "name",
    "message": "Product name is required"
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Rate Limiting

- Customer endpoints: 100 requests per minute
- Admin endpoints: 200 requests per minute
- AI processing endpoints: 10 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```
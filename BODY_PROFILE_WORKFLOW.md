# Body Profile Workflow

## Overview
Users must create their body profile before they can use the Virtual Try-On feature and get AI recommendations.

## User Flow

### 1. Login
- User logs in or registers an account
- After successful login, they can access protected routes

### 2. Create Body Profile (First Time)
**Route:** `/profile/body`

When a user visits the Virtual Try-On page without a profile, they are automatically redirected to the Body Profile creation page.

#### Step 1: Choose Input Method
Users can choose between:
- **Upload Photo** (Recommended): AI extracts measurements from photo
- **Manual Input**: Enter measurements manually

#### Step 2: Enter Measurements
Users provide:
- Gender (Male/Female)
- Height (cm)
- Shoulders (cm)
- Bust/Chest (cm)
- Waist (cm)
- Hips (cm)

A visual guide shows how to measure each body part correctly.

#### Step 3: Review & Save
- Review all measurements
- See what benefits they'll get (AI recommendations, Virtual Try-On, 3D Avatar)
- Click "Save & Continue" to save profile
- Automatically redirected to Virtual Try-On page

### 3. Virtual Try-On Page
**Route:** `/virtual-tryon`

Once profile is created:
- **Left Panel**: Displays user's profile (read-only)
  - Shows all body measurements
  - Displays 3D avatar if created
  - "Edit Profile" button to update measurements
  - Profile remains visible for reference

- **Center Panel**: Product display
  - Shows selected product in 3D or 2D
  - Color picker for available colors
  - Product details

- **Right Panel**: AI Recommendations
  - Personalized size recommendations
  - Fit score (84% accuracy)
  - Size confidence levels
  - Fit analysis for chest, waist, and hips

- **Bottom**: Product Grid
  - Browse all available products
  - Products sorted by best fit score
  - Fit badges show compatibility
  - Click to try on virtually

### 4. Update Profile
Click "Edit Profile" button → Redirected to `/profile/body` with existing data pre-filled → Make changes → Save → Return to Virtual Try-On

## Technical Implementation

### Routes
```javascript
/profile/body     - Body profile creation/edit (Protected)
/virtual-tryon    - Virtual try-on with AI recommendations (Protected)
/avatar/customize - Avatar customization (Protected, Optional)
```

### Data Flow
1. User creates profile → Saved to backend API
2. Profile data stored in `CustomerAuthContext`
3. Virtual Try-On loads profile from context
4. AI recommendations calculated based on profile measurements
5. Products sorted by fit score

### API Endpoints
- `POST /api/body-profile/create` - Create new profile
- `PUT /api/body-profile/{id}` - Update existing profile
- `GET /api/body-profile/user/{userId}` - Get user's profile
- `POST /api/ai/calculate-fit` - Calculate fit score for product

### Key Components
- **BodyProfilePage.js**: Profile creation/editing with stepper
- **VirtualTryOnPageNew.js**: Virtual try-on with AI recommendations
- **AIRecommendations.js**: Display AI size suggestions
- **PhotoMeasurementUpload.js**: AI photo measurement extraction
- **BodyMeasurementVisual.js**: Visual measurement guide

## Features

### Profile Creation
✓ Step-by-step wizard
✓ Photo upload with AI extraction
✓ Manual input with visual guide
✓ Gender selection
✓ Measurement validation
✓ Profile preview before saving

### Virtual Try-On
✓ Read-only profile display
✓ Easy profile editing
✓ Product selection
✓ 3D/2D visualization
✓ Color picker
✓ AI recommendations
✓ Fit score badges
✓ Smart product sorting

### AI Recommendations
✓ 84% accuracy
✓ Personalized size suggestions
✓ Fit level indicators
✓ Chest, waist, hip fit analysis
✓ Confidence scores
✓ Alternative size suggestions

## Workflow Enforcement
- Cannot access Virtual Try-On without profile
- Auto-redirect to profile creation
- Profile required for AI recommendations
- Avatar creation is optional
- Profile can be updated anytime

## User Benefits
1. **Personalized Shopping**: AI-powered size recommendations
2. **Reduce Returns**: Better fit prediction
3. **Save Time**: No guessing sizes
4. **Virtual Try-On**: See clothes on your body type
5. **Confidence**: Know your size before buying

# Avatar Preferences Flow

## Overview
Avatar preferences (skin tone, hair color, hair style, eye color) are saved to the user's body profile and automatically loaded throughout the application.

## Complete Workflow

### 1. Body Profile Creation
**Route:** `/profile/body`

Users first create their body profile with measurements:
- Height, Shoulders, Chest, Waist, Hips
- Gender selection
- Profile saved to backend

**Data Saved:**
- `userId`
- `heightCm`, `chestCm`, `waistCm`, `hipCm`, `shoulderWidthCm`
- `gender`

### 2. Avatar Customization
**Route:** `/avatar/customize`

Users customize their 3D avatar appearance:

#### Avatar Preferences:
- **Skin Tone**: Light, Medium, Tan, Dark
- **Hair Color**: Black, Brown, Blonde, Red, Gray
- **Hair Style**: Short, Medium, Long, Ponytail (Female) / Bald (Male)
- **Eye Color**: Brown, Blue, Green, Hazel, Gray
- **Body Shape**: Athletic, Slim, Average, Curvy

#### Features:
✓ Real-time preview with 3D model
✓ Color pickers with visual swatches
✓ Auto-loads saved preferences
✓ AI-powered customization recommendations
✓ Instant color application to model

#### Backend Process:
1. User selects preferences
2. Clicks "Preview Avatar" → Generates 3D model
3. Adjusts preferences (real-time updates)
4. Clicks "Save Avatar" → Saves to body profile

**API Endpoint:** `POST /api/avatar/generate`

**Data Saved to Body Profile:**
```java
profile.setSkinTone(customization.getSkinTone());
profile.setHairColor(customization.getHairColor());
profile.setHairStyle(customization.getHairStyle());
profile.setEyeColor(customization.getEyeColor());
profile.setBodyShape(customization.getBodyShape());
profile.setAvatarModelUrl(avatarUrl);
```

### 3. Virtual Try-On Display
**Route:** `/virtual-tryon`

Avatar preferences are automatically loaded and displayed:

#### Left Panel - Profile Section:
- Shows avatar 3D model with saved preferences
- Displays color badges for:
  - Skin tone (with color swatch)
  - Hair color (with color swatch)
- Two action buttons:
  - **Edit Profile** → Update measurements
  - **Create/Customize Avatar** → Edit avatar appearance

#### Avatar Loading:
```javascript
<Model3DViewer
  modelUrl={bodyProfile.avatarModelUrl}
  skinTone={bodyProfile.skinTone}    // Applied automatically
  hairColor={bodyProfile.hairColor}   // Applied automatically
  eyeColor={bodyProfile.eyeColor}     // Applied automatically
  autoRotate={true}
/>
```

### 4. Preference Persistence

#### Database Storage (body_profiles table):
```sql
- skin_tone VARCHAR
- hair_color VARCHAR
- hair_style VARCHAR
- eye_color VARCHAR
- body_shape VARCHAR
- avatar_model_url TEXT
```

#### Context Management:
Preferences are stored in `CustomerAuthContext` and available globally:
```javascript
const { bodyProfile } = useCustomerAuth();
// bodyProfile.skinTone
// bodyProfile.hairColor
// bodyProfile.hairStyle
// bodyProfile.eyeColor
```

## Data Flow

### Avatar Creation Flow:
1. **User** → Selects preferences in Avatar Customization page
2. **Frontend** → Sends preferences to `/api/avatar/generate`
3. **Backend** → Updates body profile with preferences
4. **Backend** → Generates 3D model URL
5. **Backend** → Saves everything to database
6. **Frontend** → Refreshes `CustomerAuthContext`
7. **All Pages** → Now have access to saved preferences

### Avatar Display Flow:
1. **Virtual Try-On** loads
2. **CustomerAuthContext** provides `bodyProfile`
3. **Profile Section** shows avatar with preferences:
   - Loads 3D model from `avatarModelUrl`
   - Applies `skinTone` to model
   - Applies `hairColor` to model
   - Applies `eyeColor` to model
4. **Visual Badges** display preference summary

## Key Components

### AvatarCustomizationPage.js
- Loads saved preferences from `bodyProfile`
- Provides UI for customization
- Sends preferences to backend
- Real-time preview with color application

### VirtualTryOnPageNew.js
- Displays saved avatar with preferences
- Shows color badges for visual reference
- Buttons to edit profile or customize avatar

### Model3DViewer.js
- Receives avatar preferences as props
- Applies colors to 3D model
- Handles real-time color changes

### CustomerAuthContext.js
- Stores body profile globally
- Includes all avatar preferences
- Auto-refreshes after updates

## Backend Services

### AvatarGenerationService.java
```java
public AvatarResponse generateAvatar(UUID userId, AvatarCustomizationRequest customization) {
    // 1. Get body profile
    BodyProfile profile = bodyProfileRepository.findByUserId(userId)...
    
    // 2. Generate avatar with AI
    Map<String, Object> aiCustomization = aiCustomizationService.generateAvatarCustomization(...)
    
    // 3. Generate 3D model URL
    String avatarUrl = generateReadyPlayerMeAvatar(profile, customization, proportions);
    
    // 4. Save preferences to profile
    profile.setSkinTone(customization.getSkinTone());
    profile.setHairColor(customization.getHairColor());
    profile.setHairStyle(customization.getHairStyle());
    profile.setEyeColor(customization.getEyeColor());
    profile.setAvatarModelUrl(avatarUrl);
    bodyProfileRepository.save(profile);
    
    return new AvatarResponse(avatarUrl, ...);
}
```

### BodyProfile Entity
Contains all avatar preference fields:
- `skinTone` - User's selected skin color
- `hairColor` - User's selected hair color
- `hairStyle` - User's selected hair style
- `eyeColor` - User's selected eye color
- `bodyShape` - User's body type
- `avatarModelUrl` - Path to 3D model file

## User Benefits

### Personalization
✓ Custom avatar reflects user's appearance
✓ Preferences saved permanently
✓ Consistent across all pages

### Convenience
✓ One-time setup
✓ Auto-loads everywhere
✓ Easy updates

### Visual Feedback
✓ Color badges show current preferences
✓ 3D model displays actual appearance
✓ Real-time preview during customization

### Seamless Integration
✓ Avatar available in Virtual Try-On
✓ Profile display shows preferences
✓ No manual re-entry needed

## Technical Features

### Real-Time Preview
- Changes apply instantly to 3D model
- No page refresh needed
- Smooth color transitions

### Auto-Loading
- Preferences load on component mount
- Uses `useEffect` to fetch from context
- Falls back to defaults if not set

### Color Mapping
```javascript
const skinTones = [
  { value: 'light', color: '#FFE0BD' },
  { value: 'medium', color: '#D4A574' },
  { value: 'tan', color: '#C68642' },
  { value: 'dark', color: '#8D5524' }
];

const hairColors = [
  { value: 'black', color: '#000000' },
  { value: 'brown', color: '#654321' },
  { value: 'blonde', color: '#FAF0BE' },
  { value: 'red', color: '#8B0000' },
  { value: 'gray', color: '#808080' }
];
```

### Preference Badges
Visual indicators show current settings:
- Color swatches match actual preferences
- Text labels for clarity
- Compact, non-intrusive design

## Update Workflow

### Changing Avatar Preferences:
1. User clicks "Customize Avatar" button
2. Redirected to `/avatar/customize`
3. Current preferences pre-loaded
4. User makes changes
5. Preview updates in real-time
6. Click "Save Avatar"
7. Preferences saved to database
8. Context refreshed
9. Return to Virtual Try-On
10. New preferences applied automatically

### No Manual Sync Required:
- Backend saves preferences
- Frontend context auto-refreshes
- All pages get updated data
- 3D models reload with new colors

## Summary

The avatar preference system provides:

1. **Complete Persistence** - All preferences saved to database
2. **Automatic Loading** - Preferences load everywhere automatically
3. **Real-Time Updates** - Changes apply instantly
4. **Visual Feedback** - Color badges and 3D preview
5. **Easy Editing** - One-click access to customization
6. **Seamless Integration** - Works across all pages
7. **User-Friendly** - Set once, use everywhere

Users create their avatar once, and it appears with all their preferences throughout the application!

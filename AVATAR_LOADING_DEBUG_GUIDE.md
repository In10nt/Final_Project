# Avatar Loading Debug Guide

## Issue
Avatar not loading in Virtual Try-On page

## Debugging Steps

### 1. Check Browser Console
Open browser DevTools (F12) and look for these console messages:

```javascript
// When Virtual Try-On loads:
"VirtualTryOnPageNew: No body profile, redirecting to profile creation"
// OR
"VirtualTryOnPageNew: Body profile loaded: { id, gender, avatarUrl, skinTone, hairColor, eyeColor }"

// When forcing refresh:
"VirtualTryOnPageNew: Forcing body profile refresh from backend..."
"VirtualTryOnPageNew: Body profile refreshed: { avatarUrl, skinTone, hairColor }"

// When avatar displays:
"VirtualTryOnPageNew Avatar Display: { hasBodyProfile, hasAuthBodyProfile, avatarUrl, skinTone, hairColor, eyeColor }"
```

### 2. Check LocalStorage
In DevTools Console, run:

```javascript
// Check if body profile is stored
JSON.parse(localStorage.getItem('customer_body_profile'))

// Should show:
{
  id: "...",
  userId: "...",
  gender: "FEMALE",
  avatarModelUrl: "http://localhost:8082/uploads/models/...",
  skinTone: "medium",
  hairColor: "brown",
  hairStyle: "long",
  eyeColor: "brown",
  heightCm: 165,
  chestCm: 88,
  // ... other fields
}
```

### 3. Check Backend API Response
In DevTools Network tab, find the request:
- URL: `http://localhost:8082/api/body-profile/user/{userId}`
- Method: GET
- Check Response body for avatar fields

### 4. Verify Avatar Was Created
1. Go to `/avatar/customize`
2. Customize avatar
3. Click "Preview Avatar"
4. Click "Save Avatar"
5. Check console for: "Avatar saved: ..."
6. Go back to `/virtual-tryon`
7. Avatar should now load

## Common Issues & Solutions

### Issue 1: `avatarModelUrl` is null
**Cause:** Avatar was never created
**Solution:**
1. Navigate to `/avatar/customize`
2. Complete avatar customization
3. Click "Save Avatar"

### Issue 2: Body profile not loading
**Cause:** Context not refreshing
**Solution:**
- Try logging out and back in
- Hard refresh page (Ctrl+Shift+R)
- Check backend is running

### Issue 3: Avatar URL exists but model not showing
**Cause:** Model file path incorrect or file doesn't exist
**Solution:**
- Check console for Model3DViewer errors
- Verify file exists at: `uploads/models/ScaleReferenceDummy.obj`
- Check backend logs

### Issue 4: Preferences not applying
**Cause:** Props not passed correctly
**Solution:**
- Check browser console logs
- Verify `skinTone`, `hairColor`, `eyeColor` are in body profile
- Ensure Model3DViewer receives props

## Testing Workflow

### Step-by-Step Test:

1. **Login**
   ```
   User: test@example.com
   Password: password123
   ```

2. **Create Body Profile** (`/profile/body`)
   - Enter measurements
   - Click "Save & Continue"
   - Should redirect to Virtual Try-On

3. **Virtual Try-On** (`/virtual-tryon`)
   - Open Console
   - Check logs for body profile data
   - Avatar section should be hidden (no avatar yet)
   - Click "Create Avatar" button

4. **Create Avatar** (`/avatar/customize`)
   - Select skin tone (e.g., "Medium")
   - Select hair color (e.g., "Brown")
   - Select hair style (e.g., "Long")
   - Select eye color (e.g., "Brown")
   - Click "Preview Avatar"
   - Wait for 3D model to load
   - Adjust preferences (should update in real-time)
   - Click "Save Avatar"
   - Wait for success message

5. **Return to Virtual Try-On** (`/virtual-tryon`)
   - Open Console
   - Should see: "VirtualTryOnPageNew: Forcing body profile refresh from backend..."
   - Should see: "VirtualTryOnPageNew Avatar Display: { avatarUrl: '...', skinTone: 'medium', hairColor: 'brown' }"
   - Avatar should appear in left panel
   - Color badges should show (skin tone + hair color)

## Backend Verification

### Check Database
```sql
SELECT 
  id, 
  user_id, 
  gender,
  avatar_model_url,
  skin_tone,
  hair_color,
  hair_style,
  eye_color
FROM body_profiles
WHERE user_id = 'YOUR_USER_ID';
```

Expected Result:
```
avatar_model_url: http://localhost:8082/uploads/models/ScaleReferenceDummy.obj
skin_tone: medium
hair_color: brown
hair_style: long
eye_color: brown
```

### Check Backend Logs
Look for:
```
=== Avatar Generation Started ===
User ID: ...
Customization: AvatarCustomizationRequest{skinTone=medium, hairColor=brown, ...}
Body Profile found: Gender=FEMALE, Height=165
Avatar URL: http://localhost:8082/uploads/models/ScaleReferenceDummy.obj
Body profile updated with avatar info
=== Avatar Generation Complete ===
```

## Force Refresh Solution

If avatar still not loading, add this to browser console while on Virtual Try-On page:

```javascript
// Force refresh body profile
const refreshBodyProfile = async () => {
  const token = localStorage.getItem('customer_token');
  const customer = JSON.parse(localStorage.getItem('customer_data'));
  
  const response = await fetch(
    `http://localhost:8082/api/body-profile/user/${customer.id}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const profile = await response.json();
  console.log('Refreshed Profile:', profile);
  
  localStorage.setItem('customer_body_profile', JSON.stringify(profile));
  window.location.reload();
};

refreshBodyProfile();
```

## Quick Checklist

Before reporting an issue, verify:

- [ ] Backend server is running (http://localhost:8082)
- [ ] User is logged in
- [ ] Body profile exists (check database or API)
- [ ] Avatar was created (navigate to /avatar/customize and save)
- [ ] `avatarModelUrl` field is not null in database
- [ ] Avatar preferences (`skinTone`, `hairColor`, etc.) are saved
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls
- [ ] LocalStorage has `customer_body_profile` with avatar data

## Expected Behavior

### Without Avatar:
- Avatar section is hidden
- "Create Avatar" button shows in green
- Clicking button goes to avatar customization

### With Avatar:
- Avatar 3D model displays
- Color badges show below avatar (skin tone + hair color)
- "Customize Avatar" button shows in purple
- Avatar rotates automatically

## Contact

If issue persists after following this guide:
1. Copy all console logs
2. Copy body profile from localStorage
3. Copy backend API response
4. Take screenshot of Virtual Try-On page
5. Report with all information above

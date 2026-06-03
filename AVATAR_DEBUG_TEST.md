# Avatar Debug Test

## Steps to Test Avatar Loading

### Step 1: Check Console Logs
1. Open your browser DevTools (F12)
2. Go to Console tab
3. Navigate to Virtual Try-On page (`/virtual-tryon`)
4. Look for these log messages:

```
VirtualTryOnPageNew Avatar Display: {
  hasBodyProfile: true/false,
  hasAuthBodyProfile: true/false, 
  avatarUrl: "http://localhost:8082/..." or null,
  skinTone: "medium" or null,
  hairColor: "brown" or null,
  eyeColor: "brown" or null
}
```

### Step 2: Check if Avatar was Created
1. Go to `/avatar/customize`
2. Select preferences (skin tone, hair color, etc.)
3. Click "Preview Avatar" 
4. Wait for 3D model to load
5. Click "Save Avatar"
6. Wait for success message
7. Go back to `/virtual-tryon`

### Step 3: Check Backend Data
Open browser console and run:

```javascript
// Check localStorage data
const bodyProfile = JSON.parse(localStorage.getItem('customer_body_profile'));
console.log('Body Profile in localStorage:', bodyProfile);
console.log('Avatar URL:', bodyProfile?.avatarModelUrl);
console.log('Skin Tone:', bodyProfile?.skinTone);
console.log('Hair Color:', bodyProfile?.hairColor);
```

### Step 4: Force Refresh Profile
If avatar still not showing, run this in console:

```javascript
// Force refresh from backend
const customer = JSON.parse(localStorage.getItem('customer_data'));
const token = localStorage.getItem('customer_token');

fetch(`http://localhost:8082/api/body-profile/user/${customer.id}`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(profile => {
  console.log('Fresh profile from backend:', profile);
  localStorage.setItem('customer_body_profile', JSON.stringify(profile));
  window.location.reload();
});
```

## Expected Results

### If Avatar Exists:
- Console shows: `avatarUrl: "http://localhost:8082/uploads/models/ScaleReferenceDummy.obj"`
- Console shows: `skinTone: "medium"`, `hairColor: "brown"`, etc.
- Avatar section appears in Virtual Try-On page
- Color badges show below avatar

### If Avatar Missing:
- Console shows: `avatarUrl: null`
- Console shows: `"VirtualTryOnPageNew: No avatar URL, skipping avatar display"`
- Avatar section is hidden
- Only measurements display shows

## Troubleshooting

### Issue: Console shows `hasBodyProfile: false`
**Solution:** Body profile not loaded
1. Check if user is logged in
2. Create body profile at `/profile/body`
3. Check localStorage for `customer_body_profile`

### Issue: Console shows `avatarUrl: null`
**Solution:** Avatar not created
1. Go to `/avatar/customize`
2. Create and save avatar
3. Check backend logs for avatar generation

### Issue: Avatar URL exists but model not loading
**Solution:** Model file issue
1. Check if file exists: `http://localhost:8082/uploads/models/ScaleReferenceDummy.obj`
2. Check Model3DViewer component errors
3. Check backend file serving

### Issue: Preferences not showing
**Solution:** Preference fields missing
1. Check if `skinTone`, `hairColor` fields have values
2. Verify backend DTO includes all avatar fields
3. Check database for saved preferences

## Quick Fix Commands

### Reset Everything:
```javascript
localStorage.clear();
window.location.reload();
// Then login and recreate profile + avatar
```

### Check Backend Avatar Generation:
```javascript
// Test avatar generation API directly
fetch('http://localhost:8082/api/avatar/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('customer_token')}`
  },
  body: JSON.stringify({
    userId: JSON.parse(localStorage.getItem('customer_data')).id,
    skinTone: 'medium',
    hairColor: 'brown',
    hairStyle: 'long',
    eyeColor: 'brown',
    bodyShape: 'athletic'
  })
})
.then(res => res.json())
.then(data => console.log('Avatar Generation Response:', data));
```

## Report Results

After running these tests, please share:
1. Console log output from Step 1
2. LocalStorage data from Step 3
3. Any error messages
4. What you see vs what you expect

This will help identify exactly where the avatar loading is failing.
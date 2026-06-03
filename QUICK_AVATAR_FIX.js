// QUICK AVATAR DEBUG SCRIPT
// Copy and paste this into your browser console (F12) while on Virtual Try-On page

console.log('=== AVATAR DEBUG START ===');

// Check current user and profile data
const customer = JSON.parse(localStorage.getItem('customer_data') || '{}');
const bodyProfile = JSON.parse(localStorage.getItem('customer_body_profile') || '{}');
const token = localStorage.getItem('customer_token');

console.log('1. Customer:', customer);
console.log('2. Body Profile:', bodyProfile);
console.log('3. Token exists:', !!token);
console.log('4. Avatar URL:', bodyProfile?.avatarModelUrl);
console.log('5. Skin Tone:', bodyProfile?.skinTone);
console.log('6. Hair Color:', bodyProfile?.hairColor);

// Test backend connection
if (customer.id && token) {
  console.log('6. Testing backend connection...');
  
  fetch(`http://localhost:8082/api/body-profile/user/${customer.id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => {
    console.log('7. Backend response status:', res.status);
    return res.json();
  })
  .then(profile => {
    console.log('8. Fresh profile from backend:', profile);
    console.log('9. Backend Avatar URL:', profile?.avatarModelUrl);
    
    if (!profile.avatarModelUrl) {
      console.log('❌ NO AVATAR FOUND - Need to create avatar');
      console.log('👉 Go to /avatar/customize to create one');
    } else {
      console.log('✅ Avatar exists, updating localStorage...');
      localStorage.setItem('customer_body_profile', JSON.stringify(profile));
      console.log('🔄 Reload page to see avatar');
    }
  })
  .catch(err => {
    console.log('❌ Backend error:', err);
    console.log('🔧 Check if backend server is running on http://localhost:8082');
  });
} else {
  console.log('❌ Missing customer ID or token - please login first');
}

// Quick avatar creation test
function createTestAvatar() {
  if (!customer.id || !token) {
    console.log('❌ Need to login first');
    return;
  }
  
  console.log('🎨 Creating test avatar...');
  
  fetch('http://localhost:8082/api/avatar/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      userId: customer.id,
      skinTone: 'medium',
      hairColor: 'brown',
      hairStyle: 'long',
      eyeColor: 'brown',
      bodyShape: 'athletic'
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Avatar created:', data);
    console.log('🔄 Refreshing page...');
    window.location.reload();
  })
  .catch(err => {
    console.log('❌ Avatar creation failed:', err);
  });
}

// Make function available in console
window.createTestAvatar = createTestAvatar;

console.log('=== AVATAR DEBUG END ===');
console.log('💡 If no avatar found, run: createTestAvatar()');
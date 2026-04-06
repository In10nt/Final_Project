import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Fab,
  Alert,
  TextField,
} from '@mui/material';
import {
  CameraAlt,
  PhotoCamera,
  ThreeDRotation,
  Share,
  Favorite,
  ShoppingCart,
  Fullscreen,
  CloudUpload,
  Delete,
  Refresh,
} from '@mui/icons-material';
import { bodyProfileAPI, virtualTryOnAPI, productsAPI } from '../services/apiService';
import Model3DViewer from '../components/Model3DViewer';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import AIRecommendations from '../components/AIRecommendations';

const VirtualTryOnPage = () => {
  const { customer } = useCustomerAuth();
  const [bodyProfile, setBodyProfile] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tryOnResult, setTryOnResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [showImageUploadDialog, setShowImageUploadDialog] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]); // Initialize as empty array
  const [measurements, setMeasurements] = useState({
    height: 165,
    chest: 88,
    waist: 72,
    hips: 95,
    shoulders: 42,
  });
  const [bodyShape, setBodyShape] = useState('hourglass');
  const [skinTone, setSkinTone] = useState('medium');
  const [gender, setGender] = useState('female');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState(25);
  const [hairColor, setHairColor] = useState('brown');
  const [eyeColor, setEyeColor] = useState('brown');
  const [selectedModelColor, setSelectedModelColor] = useState('White');
  const modelViewerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Get user ID from authenticated customer
  const userId = customer?.id || '3a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d'; // Fallback to Sarah's ID for demo

  useEffect(() => {
    // Load user's body profile if exists
    loadBodyProfile();
    // Load products from backend
    loadProducts();
  }, []);

  const generateAvatarFromProfile = async (profile) => {
    try {
      // Generate avatar based on profile details
      const avatarUrl = await createPersonalizedAvatar(profile);
      
      // Update profile with generated avatar
      const updatedProfile = {
        ...profile,
        avatarUrl: avatarUrl,
        profileImageUrl: avatarUrl
      };
      
      setBodyProfile(updatedProfile);
      localStorage.setItem('bodyProfile', JSON.stringify(updatedProfile));
      
    } catch (error) {
      console.error('Avatar generation failed:', error);
    }
  };

  const createPersonalizedAvatar = async (profile) => {
    // Create a realistic avatar based on profile details
    const genderIcon = profile.gender === 'male' ? '👨' : '👩';
    const displayName = profile.nickname || (profile.gender === 'male' ? 'Male' : 'Female');
    const bodyShapeIcon = {
      'hourglass': '⏳',
      'pear': '🍐', 
      'apple': '🍎',
      'rectangle': '📱',
      'inverted-triangle': '🔺'
    }[profile.bodyShape] || '👤';
    
    // Generate avatar with profile characteristics
    const avatarText = `${genderIcon} ${displayName} ${bodyShapeIcon}`;
    const skinColor = {
      'light': 'f5deb3',
      'medium': 'deb887', 
      'dark': 'cd853f'
    }[profile.skinTone] || 'deb887';
    
    return `https://via.placeholder.com/200x300/${skinColor}/333333?text=${encodeURIComponent(avatarText)}`;
  };

  const loadBodyProfile = async () => {
    try {
      const response = await bodyProfileAPI.getUserProfile(userId);
      const profile = response.data;
      setBodyProfile(profile);
      setMeasurements({
        height: profile.heightCm || 165,
        chest: profile.chestCm || 88,
        waist: profile.waistCm || 72,
        hips: profile.hipCm || 95,
        shoulders: profile.shoulderWidthCm || 42,
      });
      setBodyShape(profile.bodyShape || 'hourglass');
      setSkinTone(profile.skinTone || 'medium');
      setGender(profile.gender || 'female');
      setNickname(profile.nickname || '');
      setAge(profile.age || 25);
      setHairColor(profile.hairColor || 'brown');
      setEyeColor(profile.eyeColor || 'brown');
    } catch (error) {
      console.log('Backend not available, checking local storage');
      // Try to load from localStorage as fallback
      const savedProfile = localStorage.getItem('bodyProfile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setBodyProfile(profile);
          setMeasurements({
            height: profile.heightCm || 165,
            chest: profile.chestCm || 88,
            waist: profile.waistCm || 72,
            hips: profile.hipCm || 95,
            shoulders: profile.shoulderWidthCm || 42,
          });
          setBodyShape(profile.bodyShape || 'hourglass');
          setSkinTone(profile.skinTone || 'medium');
          setGender(profile.gender || 'female');
          setNickname(profile.nickname || '');
          setAge(profile.age || 25);
          setHairColor(profile.hairColor || 'brown');
          setEyeColor(profile.eyeColor || 'brown');
        } catch (parseError) {
          console.log('No valid saved profile found');
        }
      }
    }
  };

  const loadProducts = async () => {
    // Set fallback products immediately to prevent map error
    const fallbackProducts = [
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Classic White Shirt',
        price: 49.99,
        image: 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Shirt',
        category: 'Shirts',
        brand: 'Fashion Brand',
        color: 'White',
        material: 'Cotton'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Blue Denim Jeans',
        price: 79.99,
        image: 'https://via.placeholder.com/300x400/4169e1/ffffff?text=Blue+Jeans',
        category: 'Pants',
        brand: 'Fashion Brand',
        color: 'Blue',
        material: 'Denim'
      },
    ];

    setProducts(fallbackProducts);

    try {
      // Try to fetch real products from admin panel
      console.log('Fetching products from admin panel...');
      const response = await productsAPI.getAllProducts();
      
      // Handle paginated response
      let adminProducts = [];
      if (response.data) {
        if (response.data.content && Array.isArray(response.data.content)) {
          adminProducts = response.data.content;
        } else if (Array.isArray(response.data)) {
          adminProducts = response.data;
        }
      }
      
      if (adminProducts.length > 0) {
        console.log('Loaded products from admin:', adminProducts.length);
        
        // Transform admin products to customer format
        const customerProducts = adminProducts.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category: 'General', // Since category is not properly linked
          image: product.imageUrl || `https://via.placeholder.com/300x400/cccccc/333333?text=${encodeURIComponent(product.name)}`,
          description: product.description,
          brand: product.brand || 'Fashion Brand',
          color: product.color || 'Default',
          material: product.material || 'Mixed',
          barcode: product.barcode,
          sku: product.sku,
          model3dUrl: product.model3dUrl // Add 3D model URL
        }));
        
        console.log('Transformed products:', customerProducts);
        setProducts(customerProducts);
      } else {
        console.log('No products found from admin, using fallback');
      }
    } catch (error) {
      console.error('Failed to load products from admin panel:', error);
      console.log('Using fallback products for demo');
      // Keep fallback products
    }
  };

  const handleCreateProfile = () => {
    setShowProfileDialog(true);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileData = {
        userId: userId,
        heightCm: measurements.height,
        chestCm: measurements.chest,
        waistCm: measurements.waist,
        hipCm: measurements.hips,
        shoulderWidthCm: measurements.shoulders,
        bodyShape: bodyShape,
        skinTone: skinTone,
        gender: gender,
        nickname: nickname,
        age: age,
        hairColor: hairColor,
        eyeColor: eyeColor,
      };

      let savedProfile;
      try {
        if (bodyProfile && bodyProfile.id) {
          // Update existing profile
          const response = await bodyProfileAPI.updateProfile(bodyProfile.id, profileData);
          savedProfile = response.data;
        } else {
          // Create new profile
          const response = await bodyProfileAPI.createProfile(profileData);
          savedProfile = response.data;
        }
      } catch (apiError) {
        console.log('Backend not available, using offline mode');
        // Fallback to local storage when backend is not available
        savedProfile = {
          id: Date.now().toString(),
          ...profileData,
          profileImageUrl: 'https://via.placeholder.com/200x300/cccccc/666666?text=Avatar',
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('bodyProfile', JSON.stringify(savedProfile));
      }

      setBodyProfile(savedProfile);
      setShowProfileDialog(false);
      
      // Auto-generate avatar after saving profile
      setTimeout(() => generateAvatarFromProfile(savedProfile), 100);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      setCameraStream(stream);
      setShowCameraDialog(true);
      
      // Wait for dialog to open and video element to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access is required for photo capture. Please allow camera permissions and try again.');
    }
  };

  const handleImageUpload = () => {
    setShowImageUploadDialog(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        analyzePhoto(imageData);
        setShowImageUploadDialog(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      setBodyProfile(null);
      setTryOnResult(null);
      localStorage.removeItem('bodyProfile');
      
      // Reset form values
      setMeasurements({
        height: 165,
        chest: 88,
        waist: 72,
        hips: 95,
        shoulders: 42,
      });
      setBodyShape('hourglass');
      setSkinTone('medium');
      setGender('female');
      setNickname('');
      setAge(25);
      setHairColor('brown');
      setEyeColor('brown');
    }
  };

  const handleResetProfile = () => {
    if (window.confirm('Are you sure you want to reset your profile to default values?')) {
      setMeasurements({
        height: 165,
        chest: 88,
        waist: 72,
        hips: 95,
        shoulders: 42,
      });
      setBodyShape('hourglass');
      setSkinTone('medium');
      setGender('female');
      setNickname('');
      setAge(25);
      setHairColor('brown');
      setEyeColor('brown');
      setTryOnResult(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg');
      
      // In production, send to AI service for body analysis
      analyzePhoto(imageData);
    }
  };

  const analyzePhoto = async (imageData) => {
    setLoading(true);
    setError(null);
    try {
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

      // Try backend API first
      try {
        const analysisResponse = await bodyProfileAPI.analyzePhoto(file, userId);
        const analyzedProfile = analysisResponse.data;

        setMeasurements({
          height: analyzedProfile.heightCm || 165,
          chest: analyzedProfile.chestCm || 88,
          waist: analyzedProfile.waistCm || 72,
          hips: analyzedProfile.hipCm || 95,
          shoulders: analyzedProfile.shoulderWidthCm || 42,
        });
        
        setBodyShape(analyzedProfile.bodyShape || 'hourglass');
        setSkinTone(analyzedProfile.skinTone || 'medium');
        setBodyProfile(analyzedProfile);
        
        setShowCameraDialog(false);
        
        // Stop camera stream
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        }
      } catch (apiError) {
        console.log('Backend API not available, using enhanced offline analysis');
        
        // Enhanced offline analysis with more realistic results
        const enhancedAnalysis = performOfflineAnalysis();
        
        setMeasurements(enhancedAnalysis.measurements);
        setBodyShape(enhancedAnalysis.bodyShape);
        setSkinTone(enhancedAnalysis.skinTone);
        setGender(enhancedAnalysis.gender);
        setAge(enhancedAnalysis.age);
        setHairColor(enhancedAnalysis.hairColor);
        setEyeColor(enhancedAnalysis.eyeColor);
        
        // Create a mock profile
        const mockProfile = {
          id: Date.now().toString(),
          userId: userId,
          ...enhancedAnalysis.measurements,
          bodyShape: enhancedAnalysis.bodyShape,
          skinTone: enhancedAnalysis.skinTone,
          gender: enhancedAnalysis.gender,
          nickname: nickname || enhancedAnalysis.suggestedNickname,
          age: enhancedAnalysis.age,
          hairColor: enhancedAnalysis.hairColor,
          eyeColor: enhancedAnalysis.eyeColor,
          profileImageUrl: imageData,
        };
        
        setBodyProfile(mockProfile);
        localStorage.setItem('bodyProfile', JSON.stringify(mockProfile));
        
        setShowCameraDialog(false);
        
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        }
      }
    } catch (error) {
      console.error('Photo analysis failed:', error);
      setError('Photo analysis failed. Please try manual input or try again.');
    } finally {
      setLoading(false);
    }
  };

  const performOfflineAnalysis = () => {
    // Simulate more realistic body analysis
    const baseHeight = 160 + Math.random() * 25; // 160-185cm
    const bodyShapes = ['hourglass', 'pear', 'apple', 'rectangle', 'inverted-triangle'];
    const skinTones = ['light', 'medium', 'dark'];
    const genders = ['female', 'male'];
    const hairColors = ['black', 'brown', 'blonde', 'red'];
    const eyeColors = ['brown', 'blue', 'green', 'hazel'];
    
    const selectedShape = bodyShapes[Math.floor(Math.random() * bodyShapes.length)];
    const selectedTone = skinTones[Math.floor(Math.random() * skinTones.length)];
    const selectedGender = genders[Math.floor(Math.random() * genders.length)];
    const selectedHair = hairColors[Math.floor(Math.random() * hairColors.length)];
    const selectedEyes = eyeColors[Math.floor(Math.random() * eyeColors.length)];
    const analyzedAge = 20 + Math.floor(Math.random() * 30); // 20-50 years
    
    // Generate measurements based on body shape and gender
    let measurements = {};
    
    if (selectedGender === 'male') {
      // Male measurements
      switch (selectedShape) {
        case 'rectangle':
          measurements = {
            heightCm: Math.round(baseHeight + 10), // Males typically taller
            chestCm: Math.round(95 + Math.random() * 15),
            waistCm: Math.round(85 + Math.random() * 12),
            hipCm: Math.round(95 + Math.random() * 10),
            shoulderWidthCm: Math.round(45 + Math.random() * 8),
          };
          break;
        default:
          measurements = {
            heightCm: Math.round(baseHeight + 10),
            chestCm: Math.round(95 + Math.random() * 15),
            waistCm: Math.round(85 + Math.random() * 12),
            hipCm: Math.round(95 + Math.random() * 10),
            shoulderWidthCm: Math.round(45 + Math.random() * 8),
          };
      }
    } else {
      // Female measurements
      switch (selectedShape) {
        case 'hourglass':
          measurements = {
            heightCm: Math.round(baseHeight),
            chestCm: Math.round(85 + Math.random() * 15),
            waistCm: Math.round(65 + Math.random() * 10),
            hipCm: Math.round(90 + Math.random() * 15),
            shoulderWidthCm: Math.round(38 + Math.random() * 8),
          };
          break;
        case 'pear':
          measurements = {
            heightCm: Math.round(baseHeight),
            chestCm: Math.round(80 + Math.random() * 10),
            waistCm: Math.round(70 + Math.random() * 8),
            hipCm: Math.round(95 + Math.random() * 15),
            shoulderWidthCm: Math.round(36 + Math.random() * 6),
          };
          break;
        default:
          measurements = {
            heightCm: Math.round(baseHeight),
            chestCm: Math.round(85 + Math.random() * 15),
            waistCm: Math.round(70 + Math.random() * 12),
            hipCm: Math.round(90 + Math.random() * 15),
            shoulderWidthCm: Math.round(38 + Math.random() * 8),
          };
      }
    }
    
    return {
      measurements: {
        height: measurements.heightCm,
        chest: measurements.chestCm,
        waist: measurements.waistCm,
        hips: measurements.hipCm,
        shoulders: measurements.shoulderWidthCm,
      },
      bodyShape: selectedShape,
      skinTone: selectedTone,
      gender: selectedGender,
      age: analyzedAge,
      hairColor: selectedHair,
      eyeColor: selectedEyes,
      suggestedNickname: selectedGender === 'male' ? 'Alex' : 'Sarah',
    };
  };

  const handleVirtualTryOn = async (product) => {
    console.log('=== VIRTUAL TRY-ON CLICKED ===');
    console.log('Selected product:', product);
    console.log('Product 3D model URL:', product.model3dUrl);
    
    setSelectedProduct(product);
    setSelectedModelColor(product.color || 'White'); // Set initial color
    setLoading(false);
    setError(null);
    
    // If product has 3D model, just display it
    if (product.model3dUrl) {
      console.log('Product has 3D model, displaying:', product.model3dUrl);
      return;
    } else {
      console.log('Product does NOT have 3D model URL');
    }

    // Otherwise, try the virtual try-on API
    if (!bodyProfile) {
      setError('Body profile not found. Please create your profile first.');
      return;
    }

    setLoading(true);

    try {
      const tryOnRequest = {
        userId: userId,
        productId: product.id,
        variantId: null,
        size: 'M',
        color: product.color || 'default',
        generateAvatar: true,
        use3DModel: true,
      };

      const response = await virtualTryOnAPI.performTryOn(tryOnRequest);
      const result = response.data;
      
      if (result.success) {
        setTryOnResult(result);
      } else {
        setError(result.message || 'Virtual try-on failed');
      }
    } catch (error) {
      console.error('Virtual try-on failed:', error);
      setError('Virtual try-on failed. Using offline mode.');
      
      // Enhanced fallback with better avatar generation
      setTimeout(() => {
        const avatarUrl = generateTryOnAvatar(product, bodyProfile);
        const mockResult = {
          sessionId: Date.now(),
          avatarWithClothingUrl: avatarUrl,
          resultImageUrl: avatarUrl,
          confidenceScore: 0.85 + Math.random() * 0.1,
          fitFeedback: generateFitFeedback(product, bodyProfile),
          recommendedSize: recommendSize(bodyProfile),
          success: true,
        };
        
        setTryOnResult(mockResult);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const generateTryOnAvatar = (product, profile) => {
    // Create try-on avatar with clothing
    const baseUrl = 'https://via.placeholder.com/400x600';
    const productColors = {
      'Classic White Shirt': 'ffffff/333333',
      'Blue Denim Jeans': '4169e1/ffffff', 
      'Summer Dress': 'ff69b4/ffffff'
    };
    
    const colorScheme = productColors[product.name] || 'cccccc/333333';
    const displayName = profile.nickname || (profile.gender === 'male' ? 'Male' : 'Female');
    const genderIcon = profile.gender === 'male' ? '👨' : '👩';
    const text = encodeURIComponent(`${genderIcon} ${displayName} wearing ${product.name}`);
    
    return `${baseUrl}/${colorScheme}?text=${text}`;
  };

  const generateFitFeedback = (product, profile) => {
    const feedbacks = [
      `Perfect fit for your ${profile.bodyShape || 'body'} shape!`,
      `This ${product.category.toLowerCase()} complements your measurements beautifully.`,
      `Excellent choice! This style works great with your proportions.`,
      `Great fit! This item should look fantastic on you.`
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const recommendSize = (profile) => {
    if (!profile || !profile.chestCm) return 'M';
    const chest = profile.chestCm || profile.chest || 88;
    
    if (chest < 85) return 'S';
    else if (chest < 95) return 'M';
    else if (chest < 105) return 'L';
    else return 'XL';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" textAlign="center" gutterBottom fontWeight="bold">
        Virtual Try-On Experience
      </Typography>
      <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
        See how clothes look on you before buying
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Panel - Body Profile */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Your Body Profile
              </Typography>
              
              {bodyProfile ? (
                <Box>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <img
                      src={bodyProfile.profileImageUrl || bodyProfile.avatarUrl || 'https://via.placeholder.com/200x300/cccccc/666666?text=Avatar'}
                      alt="Your Avatar"
                      style={{ width: 150, height: 200, objectFit: 'cover', borderRadius: 8 }}
                    />
                    {bodyProfile.nickname && (
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
                        {bodyProfile.nickname}
                      </Typography>
                    )}
                    <Chip 
                      label={bodyProfile.gender === 'female' ? '👩 Female' : '👨 Male'} 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Height:</strong> {bodyProfile.heightCm || bodyProfile.height} cm
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Chest:</strong> {bodyProfile.chestCm || bodyProfile.chest} cm
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Waist:</strong> {bodyProfile.waistCm || bodyProfile.waist} cm
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Hips:</strong> {bodyProfile.hipCm || bodyProfile.hips} cm
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Body Shape:</strong> {bodyProfile.bodyShape}
                  </Typography>
                  {bodyProfile.age && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Age:</strong> {bodyProfile.age} years
                    </Typography>
                  )}
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowProfileDialog(true)}
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Update Profile
                  </Button>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleResetProfile}
                      startIcon={<Refresh />}
                      sx={{ flex: 1 }}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={handleDeleteProfile}
                      startIcon={<Delete />}
                      sx={{ flex: 1 }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Create your body profile to start virtual try-on
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleCreateProfile}
                    startIcon={<CameraAlt />}
                    sx={{ mb: 1 }}
                    fullWidth
                  >
                    Create Profile
                  </Button>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={handleTakePhoto}
                      startIcon={<PhotoCamera />}
                      sx={{ flex: 1 }}
                    >
                      Take Photo
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleImageUpload}
                      startIcon={<CloudUpload />}
                      sx={{ flex: 1 }}
                    >
                      Upload Image
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Center Panel - 3D Avatar */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: 680 }}>
            <CardContent sx={{ height: '100%', p: 0 }}>
              {selectedProduct && selectedProduct.model3dUrl ? (
                <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flex: 1, position: 'relative' }}>
                    <Model3DViewer 
                      ref={modelViewerRef}
                      modelUrl={bodyProfile?.avatarModelUrl || 'http://localhost:8082/uploads/models/ScaleReferenceDummy.obj'}
                      clothingModelUrl={selectedProduct.model3dUrl}
                      width={400} 
                      height={480}
                      productColor={selectedModelColor}
                      showColorPicker={false}
                    />
                  </Box>
                  
                  {/* Product Information Card with Color Picker */}
                  <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', minHeight: 200 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {selectedProduct?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {selectedProduct?.brand} • {selectedProduct?.material}
                    </Typography>
                    
                    {/* Color Palette */}
                    <Box sx={{ my: 1.5 }}>
                      <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Colors
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                        {[
                          { name: 'White', hex: '#FFFFFF' },
                          { name: 'Black', hex: '#000000' },
                          { name: 'Red', hex: '#DC143C' },
                          { name: 'Blue', hex: '#4169E1' },
                          { name: 'Navy', hex: '#000080' },
                          { name: 'Green', hex: '#228B22' },
                          { name: 'Yellow', hex: '#FFD700' },
                          { name: 'Pink', hex: '#FF69B4' },
                          { name: 'Purple', hex: '#9370DB' },
                          { name: 'Orange', hex: '#FF8C00' },
                          { name: 'Gray', hex: '#808080' },
                          { name: 'Brown', hex: '#8B4513' },
                        ].map((color) => (
                          <Box
                            key={color.name}
                            title={color.name}
                            onClick={() => {
                              setSelectedModelColor(color.name);
                              if (modelViewerRef.current && modelViewerRef.current.changeColor) {
                                modelViewerRef.current.changeColor(color.hex);
                              }
                            }}
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: color.hex,
                              borderRadius: '50%',
                              cursor: 'pointer',
                              border: selectedModelColor === color.name ? '3px solid #1976d2' : '2px solid',
                              borderColor: selectedModelColor === color.name ? '#1976d2' : (color.hex === '#FFFFFF' ? '#ddd' : color.hex),
                              boxShadow: selectedModelColor === color.name ? '0 0 0 2px rgba(25, 118, 210, 0.2)' : '0 1px 3px rgba(0,0,0,0.2)',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'scale(1.2)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" color="primary.main" sx={{ mt: 1 }}>
                      ${selectedProduct?.price}
                    </Typography>
                  </Box>
                </Box>
              ) : tryOnResult ? (
                <Box sx={{ position: 'relative', height: '100%' }}>
                  <img
                    src={tryOnResult.avatarWithClothingUrl}
                    alt="Virtual Try-On Result"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  {/* Overlay Controls */}
                  <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.8)', mr: 1 }}>
                      <ThreeDRotation />
                    </IconButton>
                    <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.8)', mr: 1 }}>
                      <Fullscreen />
                    </IconButton>
                    <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}>
                      <Share />
                    </IconButton>
                  </Box>

                  {/* Fit Information */}
                  <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {selectedProduct?.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            Fit Confidence:
                          </Typography>
                          <Chip 
                            label={`${Math.round(tryOnResult.confidenceScore * 100)}%`}
                            color="success"
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {tryOnResult.fitFeedback}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Recommended Size:</strong> {tryOnResult.recommendedSize}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: '#f5f5f5'
                }}>
                  {loading ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <CircularProgress size={60} sx={{ mb: 2 }} />
                      <Typography variant="h6">
                        {selectedProduct ? 'Loading 3D Model...' : 'Processing...'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedProduct ? 'Preparing 3D visualization' : 'Please wait'}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <ThreeDRotation sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Select a product to view in 3D
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Click on any product to see its 3D model
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Products */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* AI Recommendations */}
            {bodyProfile && selectedProduct && (
              <AIRecommendations 
                bodyProfile={bodyProfile} 
                selectedProduct={selectedProduct} 
              />
            )}
            
            {/* Products List */}
            <Box>
              <Typography variant="h5" gutterBottom>
                Available Products
              </Typography>
          
          <Grid container spacing={2}>
            {(products || []).map((product) => (
              <Grid item xs={12} key={product.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                    border: selectedProduct?.id === product.id ? '2px solid primary.main' : 'none'
                  }}
                  onClick={() => handleVirtualTryOn(product)}
                >
                  <Box sx={{ display: 'flex' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: 80, height: 100, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {product.category} • {product.brand}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {product.color} • {product.material}
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        ${product.price}
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {tryOnResult && (
            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<ShoppingCart />}
                size="large"
                sx={{ mb: 1 }}
              >
                Add to Cart
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Favorite />}
              >
                Add to Wishlist
              </Button>
            </Box>
          )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Body Profile Dialog */}
      <Dialog open={showProfileDialog} onClose={() => setShowProfileDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Your Body Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary.main">
                👤 Personal Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nickname (Optional)"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g., Sarah, Alex, etc."
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="female">👩 Female</MenuItem>
                  <MenuItem value="male">👨 Male</MenuItem>
                  <MenuItem value="other">🧑 Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography gutterBottom>Age</Typography>
              <Slider
                value={age}
                onChange={(_, value) => setAge(value)}
                min={16}
                max={80}
                valueLabelDisplay="on"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Hair Color</InputLabel>
                <Select
                  value={hairColor}
                  onChange={(e) => setHairColor(e.target.value)}
                >
                  <MenuItem value="black">Black</MenuItem>
                  <MenuItem value="brown">Brown</MenuItem>
                  <MenuItem value="blonde">Blonde</MenuItem>
                  <MenuItem value="red">Red</MenuItem>
                  <MenuItem value="gray">Gray</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Eye Color</InputLabel>
                <Select
                  value={eyeColor}
                  onChange={(e) => setEyeColor(e.target.value)}
                >
                  <MenuItem value="brown">Brown</MenuItem>
                  <MenuItem value="blue">Blue</MenuItem>
                  <MenuItem value="green">Green</MenuItem>
                  <MenuItem value="hazel">Hazel</MenuItem>
                  <MenuItem value="gray">Gray</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Body Measurements */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary.main" sx={{ mt: 2 }}>
                📏 Body Measurements
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Height (cm)</Typography>
              <Slider
                value={measurements.height}
                onChange={(_, value) => setMeasurements({...measurements, height: value})}
                min={140}
                max={200}
                valueLabelDisplay="on"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Chest (cm)</Typography>
              <Slider
                value={measurements.chest}
                onChange={(_, value) => setMeasurements({...measurements, chest: value})}
                min={70}
                max={120}
                valueLabelDisplay="on"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Waist (cm)</Typography>
              <Slider
                value={measurements.waist}
                onChange={(_, value) => setMeasurements({...measurements, waist: value})}
                min={60}
                max={100}
                valueLabelDisplay="on"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Hips (cm)</Typography>
              <Slider
                value={measurements.hips}
                onChange={(_, value) => setMeasurements({...measurements, hips: value})}
                min={80}
                max={130}
                valueLabelDisplay="on"
              />
            </Grid>

            {/* Appearance */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary.main" sx={{ mt: 2 }}>
                🎨 Appearance
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Body Shape</InputLabel>
                <Select
                  value={bodyShape}
                  onChange={(e) => setBodyShape(e.target.value)}
                >
                  <MenuItem value="hourglass">⏳ Hourglass</MenuItem>
                  <MenuItem value="pear">🍐 Pear</MenuItem>
                  <MenuItem value="apple">🍎 Apple</MenuItem>
                  <MenuItem value="rectangle">📱 Rectangle</MenuItem>
                  <MenuItem value="inverted-triangle">🔺 Inverted Triangle</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Skin Tone</InputLabel>
                <Select
                  value={skinTone}
                  onChange={(e) => setSkinTone(e.target.value)}
                >
                  <MenuItem value="light">🌕 Light</MenuItem>
                  <MenuItem value="medium">🌗 Medium</MenuItem>
                  <MenuItem value="dark">🌑 Dark</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProfileDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Save Profile'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={showImageUploadDialog} onClose={() => setShowImageUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Your Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CloudUpload sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Choose a photo to analyze your body measurements
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              For best results, use a full-body photo with good lighting
            </Typography>
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="photo-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUpload />}
                size="large"
              >
                Select Photo
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImageUploadDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Camera Dialog */}
      <Dialog open={showCameraDialog} onClose={() => setShowCameraDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Take Your Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', minHeight: 400 }}>
            {showCameraDialog && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ 
                    width: '100%', 
                    maxWidth: 400, 
                    height: 300, 
                    objectFit: 'cover',
                    borderRadius: 8,
                    backgroundColor: '#f0f0f0',
                    display: cameraStream ? 'block' : 'none'
                  }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                {!cameraStream && (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minHeight: 300,
                    bgcolor: '#f5f5f5',
                    borderRadius: 2,
                    border: '2px dashed #ccc'
                  }}>
                    <CameraAlt sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Camera is starting...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Please allow camera access when prompted
                    </Typography>
                  </Box>
                )}
              </>
            )}
            
            {loading && (
              <Box sx={{ mt: 2 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Analyzing your body measurements...
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowCameraDialog(false);
            if (cameraStream) {
              cameraStream.getTracks().forEach(track => track.stop());
              setCameraStream(null);
            }
          }}>
            Cancel
          </Button>
          <Button 
            onClick={capturePhoto} 
            variant="contained" 
            disabled={loading || !cameraStream}
            startIcon={<PhotoCamera />}
          >
            {loading ? 'Analyzing...' : 'Capture & Analyze'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Buttons */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleTakePhoto}
      >
        <PhotoCamera />
      </Fab>
    </Container>
  );
};

export default VirtualTryOnPage;
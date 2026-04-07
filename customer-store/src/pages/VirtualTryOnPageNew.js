import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Divider,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { CheckCircle, Person, Straighten, Palette, Lightbulb } from '@mui/icons-material';
import AIRecommendations from '../components/AIRecommendations';
import FitBadge from '../components/FitBadge';
import Model3DViewer from '../components/Model3DViewer';
import { productsAPI } from '../services/apiService';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import axios from 'axios';

const VirtualTryOnPageNew = () => {
  const { customer, bodyProfile: authBodyProfile, refreshBodyProfile } = useCustomerAuth();
  
  // Profile state
  const [bodyProfile, setBodyProfile] = useState(null);
  const [measurements, setMeasurements] = useState({
    height: 165,
    chest: 88,
    waist: 72,
    hips: 95,
  });
  const [bodyShape, setBodyShape] = useState('rectangle');
  const [skinTone, setSkinTone] = useState('medium');
  const [gender, setGender] = useState('female');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Products state
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productFitScores, setProductFitScores] = useState({});
  const [calculatingFit, setCalculatingFit] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const modelViewerRef = useRef(null);

  useEffect(() => {
    loadProducts();
    loadProfile();
  }, [authBodyProfile, customer]);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAllProducts();
      const productData = response.data?.content || response.data || [];
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadProfile = () => {
    // Use backend profile if available
    if (authBodyProfile) {
      setBodyProfile(authBodyProfile);
      setMeasurements({
        height: authBodyProfile.heightCm || 165,
        chest: authBodyProfile.chestCm || 88,
        waist: authBodyProfile.waistCm || 72,
        hips: authBodyProfile.hipCm || 95,
      });
      setBodyShape(authBodyProfile.bodyShape || 'rectangle');
      setSkinTone(authBodyProfile.skinTone || 'medium');
      setGender((authBodyProfile.gender || 'FEMALE').toLowerCase());
    }
  };

  const handleSaveProfile = async () => {
    if (!customer) {
      setSaveError('Please login to save your profile');
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const profileData = {
        userId: customer.id,
        heightCm: measurements.height,
        chestCm: measurements.chest,
        waistCm: measurements.waist,
        hipCm: measurements.hips,
        bodyShape: bodyShape,
        skinTone: skinTone,
        gender: gender.toUpperCase(),
      };

      let response;
      if (authBodyProfile?.id) {
        // Update existing profile
        response = await axios.put(
          `http://localhost:8082/api/body-profile/${authBodyProfile.id}`,
          profileData
        );
      } else {
        // Create new profile
        response = await axios.post(
          'http://localhost:8082/api/body-profile/create',
          profileData
        );
      }

      setBodyProfile(response.data);
      if (refreshBodyProfile) {
        await refreshBodyProfile();
      }
      
      // Calculate fit scores for all products
      await calculateFitScores();
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const calculateFitScores = async () => {
    if (products.length === 0) return;
    
    setCalculatingFit(true);
    const fitScores = {};

    try {
      for (const product of products) {
        // Parse product size chart if available
        let productSizeChart = null;
        if (product.sizeChart) {
          try {
            productSizeChart = JSON.parse(product.sizeChart);
          } catch (e) {
            console.warn('Failed to parse size chart for product:', product.id);
          }
        }

        // Calculate fit score with product-specific size chart
        const fitResponse = await axios.post(
          'http://localhost:5000/api/ai/calculate-fit',
          {
            measurements: {
              chest_cm: measurements.chest,
              waist_cm: measurements.waist,
              hip_cm: measurements.hips
            },
            product_size_chart: productSizeChart,
            clothing_type: product.category?.toLowerCase() || 'shirt'
          }
        );

        fitScores[product.id] = {
          fit_score: fitResponse.data.fit_details.fit_score,
          fit_level: fitResponse.data.fit_details.fit_level,
          recommended_size: fitResponse.data.fit_details.best_size,
          chest_fit: fitResponse.data.fit_details.chest_fit,
          waist_fit: fitResponse.data.fit_details.waist_fit,
          hip_fit: fitResponse.data.fit_details.hip_fit
        };
      }

      setProductFitScores(fitScores);
    } catch (error) {
      console.error('Error calculating fit scores:', error);
    } finally {
      setCalculatingFit(false);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    // Set default color to first available color
    if (product.color) {
      const colors = product.color.split(',').map(c => c.trim());
      setSelectedColor(colors[0]);
    }
  };
  
  const handleColorChange = (color) => {
    setSelectedColor(color);
    
    // Change 3D model color if viewer ref exists
    if (modelViewerRef.current && modelViewerRef.current.changeColor) {
      const colorMap = {
        'White': 0xFFFFFF,
        'Black': 0x000000,
        'Red': 0xDC143C,
        'Blue': 0x4169E1,
        'Navy': 0x000080,
        'Green': 0x228B22,
        'Yellow': 0xFFD700,
        'Pink': 0xFF69B4,
        'Purple': 0x9370DB,
        'Orange': 0xFF8C00,
        'Gray': 0x808080,
        'Grey': 0x808080,
        'Brown': 0x8B4513,
      };
      const hexColor = colorMap[color] || 0xCCCCCC;
      modelViewerRef.current.changeColor(hexColor);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      py: { xs: 2, sm: 3, md: 4 }
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 6 } }}>
          <Typography 
            variant="h2" 
            gutterBottom 
            fontWeight="bold"
            sx={{ 
              color: '#ffffff',
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
              textShadow: '0 2px 10px rgba(255,255,255,0.1)',
              animation: 'slideInDown 0.8s ease-out',
              '@keyframes slideInDown': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(-30px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            AI-Powered Virtual Try-On
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#b0b0b0',
              mb: 3,
              fontWeight: 300,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
            }}
          >
            Find Your Perfect Fit with Machine Learning
          </Typography>
          <Box sx={{ 
            display: 'inline-flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.5, sm: 2, md: 3 },
            mt: 2,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1, sm: 1.5 },
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            width: { xs: '100%', sm: 'auto' },
            maxWidth: { xs: '300px', sm: 'none' }
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: { xs: '1rem', md: '1.25rem' } }}>84%</Typography>
              <Typography variant="caption" sx={{ color: '#888', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>Accuracy</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)', display: { xs: 'none', sm: 'block' } }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: { xs: '1rem', md: '1.25rem' } }}>500+</Typography>
              <Typography variant="caption" sx={{ color: '#888', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>Training Samples</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)', display: { xs: 'none', sm: 'block' } }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: { xs: '1rem', md: '1.25rem' } }}>AI</Typography>
              <Typography variant="caption" sx={{ color: '#888', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>Powered</Typography>
            </Box>
          </Box>
        </Box>

      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
        {/* Left: Profile Form */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            position: { xs: 'relative', lg: 'sticky' },
            top: { xs: 0, lg: 20 },
            mb: { xs: 2, lg: 0 }
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  bgcolor: '#ffffff', 
                  borderRadius: 2, 
                  p: { xs: 1, sm: 1.5 },
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Person sx={{ color: '#000000', fontSize: { xs: 24, sm: 28 } }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="#ffffff" sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                    Your Profile
                  </Typography>
                  <Typography variant="caption" color="#888" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Get personalized recommendations
                  </Typography>
                </Box>
              </Box>

              {bodyProfile && (
                <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircle />}>
                  Profile saved! AI recommendations active.
                </Alert>
              )}

              {saveError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {saveError}
                </Alert>
              )}

              {!customer && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Please login to save your profile permanently
                </Alert>
              )}

              {/* Gender */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: '#888', '&.Mui-focused': { color: '#ffffff' } }}>Gender</InputLabel>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  label="Gender"
                  sx={{
                    color: '#ffffff',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
                    '.MuiSvgIcon-root': { color: '#ffffff' }
                  }}
                >
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                </Select>
              </FormControl>

              {/* Height */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" fontWeight="600" color="#ffffff">
                    Height
                  </Typography>
                  <Chip 
                    label={`${measurements.height} cm`} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#ffffff',
                      color: '#000000',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Slider
                  value={measurements.height}
                  onChange={(_, val) => setMeasurements({ ...measurements, height: val })}
                  min={140}
                  max={200}
                  valueLabelDisplay="auto"
                  sx={{
                    color: '#ffffff',
                    '& .MuiSlider-thumb': {
                      width: 20,
                      height: 20,
                      bgcolor: '#ffffff',
                      '&:hover': {
                        boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)',
                      },
                    },
                    '& .MuiSlider-track': {
                      bgcolor: '#ffffff',
                    },
                    '& .MuiSlider-rail': {
                      bgcolor: '#333333',
                    },
                  }}
                />
              </Box>

              {/* Chest */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" fontWeight="600" color="#ffffff">
                    Chest
                  </Typography>
                  <Chip 
                    label={`${measurements.chest} cm`} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#ffffff',
                      color: '#000000',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Slider
                  value={measurements.chest}
                  onChange={(_, val) => setMeasurements({ ...measurements, chest: val })}
                  min={70}
                  max={130}
                  valueLabelDisplay="auto"
                  sx={{
                    color: '#ffffff',
                    '& .MuiSlider-thumb': {
                      width: 20,
                      height: 20,
                      bgcolor: '#ffffff',
                    },
                    '& .MuiSlider-track': {
                      bgcolor: '#ffffff',
                    },
                    '& .MuiSlider-rail': {
                      bgcolor: '#333333',
                    },
                  }}
                />
              </Box>

              {/* Waist */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" fontWeight="600" color="#ffffff">
                    Waist
                  </Typography>
                  <Chip 
                    label={`${measurements.waist} cm`} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#ffffff',
                      color: '#000000',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Slider
                  value={measurements.waist}
                  onChange={(_, val) => setMeasurements({ ...measurements, waist: val })}
                  min={55}
                  max={120}
                  valueLabelDisplay="auto"
                  sx={{
                    color: '#ffffff',
                    '& .MuiSlider-thumb': {
                      width: 20,
                      height: 20,
                      bgcolor: '#ffffff',
                    },
                    '& .MuiSlider-track': {
                      bgcolor: '#ffffff',
                    },
                    '& .MuiSlider-rail': {
                      bgcolor: '#333333',
                    },
                  }}
                />
              </Box>

              {/* Hips */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" fontWeight="600" color="#ffffff">
                    Hips
                  </Typography>
                  <Chip 
                    label={`${measurements.hips} cm`} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#ffffff',
                      color: '#000000',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Slider
                  value={measurements.hips}
                  onChange={(_, val) => setMeasurements({ ...measurements, hips: val })}
                  min={75}
                  max={140}
                  valueLabelDisplay="auto"
                  sx={{
                    color: '#ffffff',
                    '& .MuiSlider-thumb': {
                      width: 20,
                      height: 20,
                      bgcolor: '#ffffff',
                    },
                    '& .MuiSlider-track': {
                      bgcolor: '#ffffff',
                    },
                    '& .MuiSlider-rail': {
                      bgcolor: '#333333',
                    },
                  }}
                />
              </Box>

              {/* Body Shape */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Body Shape</InputLabel>
                <Select
                  value={bodyShape}
                  onChange={(e) => setBodyShape(e.target.value)}
                  label="Body Shape"
                >
                  <MenuItem value="hourglass">Hourglass</MenuItem>
                  <MenuItem value="pear">Pear</MenuItem>
                  <MenuItem value="apple">Apple</MenuItem>
                  <MenuItem value="rectangle">Rectangle</MenuItem>
                  <MenuItem value="inverted-triangle">Inverted Triangle</MenuItem>
                </Select>
              </FormControl>

              {/* Skin Tone */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Skin Tone</InputLabel>
                <Select
                  value={skinTone}
                  onChange={(e) => setSkinTone(e.target.value)}
                  label="Skin Tone"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="tan">Tan</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSaveProfile}
                disabled={saving || !customer}
                sx={{
                  py: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: '0.9rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                  bgcolor: '#ffffff',
                  color: '#000000',
                  '&:hover': {
                    bgcolor: '#e0e0e0',
                  },
                  '&:disabled': {
                    bgcolor: '#333333',
                    color: '#666666',
                  }
                }}
              >
                {saving ? (
                  <CircularProgress size={24} sx={{ color: '#000000' }} />
                ) : (
                  'Save & Get AI Recommendations'
                )}
              </Button>

              {bodyProfile && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                  Profile ID: {bodyProfile.id?.toString().substring(0, 8)}...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Center: Product Display */}
        <Grid item xs={12} lg={4}>
          {selectedProduct ? (
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              border: '2px solid #ffffff',
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(255,255,255,0.1)',
              transition: 'all 0.3s',
              overflow: 'hidden',
              mb: { xs: 2, lg: 0 }
            }}>
              <Box sx={{ 
                position: 'relative', 
                height: { xs: 300, sm: 400, md: 450 }, 
                background: 'radial-gradient(circle, #2a2a2a 0%, #0a0a0a 100%)', 
                overflow: 'hidden' 
              }}>
                {selectedProduct.model3dUrl ? (
                  <Box sx={{ 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle, #1a1a1a 0%, #000000 100%)'
                  }}>
                    <Model3DViewer 
                      ref={modelViewerRef}
                      modelUrl={`http://localhost:8082${selectedProduct.model3dUrl}`}
                      height={450}
                      width="100%"
                      productColor={selectedColor || selectedProduct.color?.split(',')[0]?.trim() || 'White'}
                      showColorPicker={false}
                    />
                  </Box>
                ) : (
                  <CardMedia
                    component="img"
                    height="450"
                    image={selectedProduct.imageUrl || selectedProduct.image}
                    alt={selectedProduct.name}
                    sx={{ objectFit: 'contain', bgcolor: '#0a0a0a' }}
                  />
                )}
                <Chip 
                  label="SELECTED" 
                  sx={{ 
                    position: 'absolute', 
                    top: { xs: 10, sm: 20 }, 
                    right: { xs: 10, sm: 20 },
                    fontWeight: 'bold',
                    bgcolor: '#ffffff',
                    color: '#000000',
                    zIndex: 10,
                    fontSize: { xs: '0.7rem', sm: '0.9rem' },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 2, sm: 2.5 }
                  }} 
                />
              </Box>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="#ffffff" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                  {selectedProduct.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  <Chip 
                    label={selectedProduct.brand} 
                    size="medium" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                    }} 
                  />
                  {selectedProduct.material && (
                    <Chip 
                      label={selectedProduct.material} 
                      size="medium" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                      }} 
                    />
                  )}
                  {selectedProduct.color && (
                    <Chip 
                      label={selectedProduct.color} 
                      size="medium" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                      }} 
                    />
                  )}
                </Box>
                
                {/* Available Colors Section */}
                {selectedProduct.color && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="#888" sx={{ mb: 1.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      Available Colors
                    </Typography>
                    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, flexWrap: 'wrap' }}>
                      {selectedProduct.color.split(',').map((color, index) => {
                        const trimmedColor = color.trim();
                        const isSelected = selectedColor === trimmedColor;
                        return (
                          <Box
                            key={index}
                            onClick={() => handleColorChange(trimmedColor)}
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              cursor: 'pointer',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              }
                            }}
                          >
                            <Box
                              sx={{
                                width: { xs: 40, sm: 50 },
                                height: { xs: 40, sm: 50 },
                                bgcolor: trimmedColor.toLowerCase(),
                                borderRadius: 2,
                                border: isSelected ? '3px solid #ffffff' : '2px solid rgba(255,255,255,0.3)',
                                boxShadow: isSelected ? '0 4px 12px rgba(255,255,255,0.3)' : '0 2px 8px rgba(0,0,0,0.3)',
                                mb: 0.5
                              }}
                            />
                            <Typography 
                              variant="caption" 
                              color={isSelected ? '#ffffff' : '#888'}
                              fontWeight={isSelected ? 'bold' : 'normal'}
                              sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                            >
                              {trimmedColor}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
                
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#ffffff', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                  ${selectedProduct.price}
                </Typography>
                <Typography variant="body1" color="#b0b0b0" sx={{ lineHeight: 1.8, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  {selectedProduct.description}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              mb: { xs: 2, lg: 0 }
            }}>
              <CardContent sx={{ textAlign: 'center', p: { xs: 3, sm: 4, md: 6 } }}>
                <Box sx={{ 
                  width: { xs: 80, sm: 100, md: 120 },
                  height: { xs: 80, sm: 100, md: 120 },
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3
                }}>
                  <Straighten sx={{ fontSize: { xs: 40, sm: 50, md: 60 }, color: '#666' }} />
                </Box>
                <Typography variant="h5" color="#ffffff" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                  Select a Product
                </Typography>
                <Typography variant="body2" color="#888" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Choose from our collection below to see AI-powered recommendations
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right: AI Recommendations */}
        <Grid item xs={12} lg={4}>
          {bodyProfile && selectedProduct ? (
            <AIRecommendations
              bodyProfile={bodyProfile}
              selectedProduct={selectedProduct}
            />
          ) : (
            <Card sx={{ 
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: '400px', md: '500px' }
            }}>
              <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center', width: '100%' }}>
                {/* Dancing GIF */}
                <Box
                  sx={{
                    width: { xs: '200px', sm: '250px' },
                    height: { xs: '200px', sm: '250px' },
                    margin: '0 auto',
                    mb: 3,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    animation: 'float 4s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                    },
                  }}
                >
                  <img
                    src="/dance-animation.gif"
                    alt="Get AI Recommendations"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div style="color: white; display: flex; align-items: center; justify-content: center; height: 100%; font-size: 60px;">🤖</div>';
                    }}
                  />
                </Box>

                <Typography variant="h5" color="#ffffff" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                  {!bodyProfile
                    ? 'Get AI-Powered Recommendations'
                    : 'Select a Product'}
                </Typography>
                <Typography variant="body1" color="#888" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {!bodyProfile
                    ? 'Save your profile to unlock personalized size recommendations with 84% accuracy'
                    : 'Choose a product from our collection to see AI-powered fit analysis'}
                </Typography>
                
                {!bodyProfile && (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    mt: 2
                  }}>
                    <Chip 
                      label="84% Accuracy" 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }} 
                    />
                    <Chip 
                      label="AI Powered" 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }} 
                    />
                    <Chip 
                      label="Smart Fit" 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }} 
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Products Grid */}
      <Box sx={{ mt: 6 }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4,
          p: { xs: 2, sm: 3, md: 4 },
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mb: { xs: 3, sm: 4 },
            gap: { xs: 2, sm: 0 }
          }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="#ffffff" sx={{ 
                mb: 1, 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                animation: 'fadeInLeft 0.8s ease-out',
                '@keyframes fadeInLeft': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateX(-30px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateX(0)',
                  },
                },
              }}>
                Our Collection
              </Typography>
              <Typography variant="body2" color="#888" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {bodyProfile ? 'Sorted by best fit for you' : 'Browse our products'}
              </Typography>
            </Box>
            {bodyProfile && (
              <Chip 
                label="AI Sorted" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 2, sm: 2.5 },
                  fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                }}
              />
            )}
          </Box>
          
          {calculatingFit && (
            <Box sx={{ mb: 4 }}>
              <Alert 
                severity="info" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)', 
                  color: '#ffffff', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Calculating fit scores for your measurements...
              </Alert>
              <LinearProgress 
                sx={{ 
                  mt: 2, 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  '& .MuiLinearProgress-bar': { bgcolor: '#ffffff' },
                  borderRadius: 1,
                  height: 6
                }} 
              />
            </Box>
          )}
          
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {products
              .sort((a, b) => {
                // Sort by fit score if available
                const fitA = productFitScores[a.id]?.fit_score || 0;
                const fitB = productFitScores[b.id]?.fit_score || 0;
                return fitB - fitA;
              })
              .map((product) => {
                const fitData = productFitScores[product.id];
                
                return (
              <Grid item xs={6} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: '#0a0a0a',
                    border: selectedProduct?.id === product.id ? '2px solid #ffffff' : '1px solid #333',
                    borderRadius: 2,
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: '#ffffff',
                    },
                  }}
                  onClick={() => handleSelectProduct(product)}
                >
                  {/* Fit Badge Overlay */}
                  {fitData && (
                    <Box sx={{
                      position: 'absolute',
                      top: { xs: 4, sm: 8 },
                      left: { xs: 4, sm: 8 },
                      zIndex: 10
                    }}>
                      <FitBadge 
                        fitScore={fitData.fit_score} 
                        fitLevel={fitData.fit_level}
                        size="small"
                      />
                    </Box>
                  )}
                  
                  <Box sx={{ 
                    position: 'relative', 
                    height: { xs: 280, sm: 320, md: 380 }, 
                    background: 'radial-gradient(circle, #2a2a2a 0%, #0a0a0a 100%)'
                  }}>
                    {product.model3dUrl ? (
                      <Model3DViewer 
                        modelUrl={`http://localhost:8082${product.model3dUrl}`}
                        height={380}
                        width="100%"
                        productColor={product.color?.split(',')[0]?.trim() || 'White'}
                        showColorPicker={false}
                        autoRotate={false}
                      />
                    ) : (
                      <CardMedia
                        component="img"
                        height="380"
                        image={product.imageUrl || product.image}
                        alt={product.name}
                        sx={{ objectFit: 'contain', bgcolor: '#000000' }}
                      />
                    )}
                    {selectedProduct?.id === product.id && (
                      <Box sx={{
                        position: 'absolute',
                        top: { xs: 4, sm: 8 },
                        right: { xs: 4, sm: 8 },
                        bgcolor: '#ffffff',
                        color: '#000000',
                        borderRadius: '50%',
                        width: { xs: 24, sm: 32 },
                        height: { xs: 24, sm: 32 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        zIndex: 10,
                        fontSize: { xs: '0.8rem', sm: '1rem' }
                      }}>
                        ✓
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap color="#ffffff" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="#888" noWrap sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {product.brand}
                    </Typography>
                    
                    {fitData && (
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5, flexWrap: 'wrap' }}>
                          <Chip 
                            label={`Size ${fitData.recommended_size}`}
                            size="small"
                            sx={{
                              bgcolor: '#ffffff',
                              color: '#000000',
                              fontWeight: 'bold',
                              fontSize: { xs: '0.65rem', sm: '0.75rem' },
                              height: { xs: 20, sm: 24 }
                            }}
                          />
                          <Chip 
                            label={`${Math.round(fitData.fit_score)}% fit`}
                            size="small"
                            sx={{
                              bgcolor: '#333',
                              color: '#ffffff',
                              fontWeight: 'bold',
                              fontSize: { xs: '0.65rem', sm: '0.75rem' },
                              height: { xs: 20, sm: 24 }
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                    
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', color: '#ffffff', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                      ${product.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )})}
          </Grid>
        </Card>
      </Box>
    </Container>
    </Box>
  );
};

export default VirtualTryOnPageNew;

import React, { useState, useEffect } from 'react';
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
        // Get recommended size from AI
        const sizeResponse = await axios.post(
          'http://localhost:5000/api/ai/recommend-size',
          {
            measurements: {
              chest_cm: measurements.chest,
              waist_cm: measurements.waist,
              hip_cm: measurements.hips,
              height_cm: measurements.height
            },
            gender: gender,
            clothing_type: product.category?.toLowerCase() || 'shirt'
          }
        );

        const recommendedSize = sizeResponse.data.recommendation.recommended_size;

        // Calculate fit score
        const fitResponse = await axios.post(
          'http://localhost:5000/api/ai/calculate-fit',
          {
            measurements: {
              chest_cm: measurements.chest,
              waist_cm: measurements.waist,
              hip_cm: measurements.hips
            },
            product_size: recommendedSize,
            clothing_type: product.category?.toLowerCase() || 'shirt'
          }
        );

        fitScores[product.id] = {
          ...fitResponse.data.fit_details,
          recommended_size: recommendedSize
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
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#000000',
      py: 4 
    }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h2" 
            gutterBottom 
            fontWeight="bold"
            sx={{ 
              color: '#ffffff',
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            ✨ AI-Powered Virtual Try-On
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#b0b0b0',
              mb: 1,
              fontWeight: 300
            }}
          >
            Personalized Size, Color & Style Recommendations
          </Typography>
          <Box sx={{ 
            display: 'inline-flex', 
            gap: 2, 
            mt: 2,
            px: 3,
            py: 1,
            bgcolor: '#1a1a1a',
            borderRadius: 2,
            border: '1px solid #333'
          }}>
            <Typography variant="body2" sx={{ color: '#888' }}>
              🤖 Machine Learning
            </Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>
              84% Accuracy
            </Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>
              500+ Training Samples
            </Typography>
          </Box>
        </Box>

      <Grid container spacing={3}>
        {/* Left: Profile Form */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(255,255,255,0.05)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  bgcolor: '#ffffff', 
                  borderRadius: '50%', 
                  p: 1, 
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Person sx={{ color: '#000000', fontSize: 28 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" color="#ffffff">
                  Your Profile
                </Typography>
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
                  <MenuItem value="hourglass">⏳ Hourglass</MenuItem>
                  <MenuItem value="pear">🍐 Pear</MenuItem>
                  <MenuItem value="apple">🍎 Apple</MenuItem>
                  <MenuItem value="rectangle">📱 Rectangle</MenuItem>
                  <MenuItem value="inverted-triangle">🔺 Inverted Triangle</MenuItem>
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
                  <MenuItem value="light">☀️ Light</MenuItem>
                  <MenuItem value="medium">🌤️ Medium</MenuItem>
                  <MenuItem value="tan">🌞 Tan</MenuItem>
                  <MenuItem value="dark">🌙 Dark</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSaveProfile}
                disabled={saving || !customer}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
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
                  <>🤖 Save & Get AI Recommendations</>
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
        <Grid item xs={12} md={4}>
          {selectedProduct ? (
            <Card sx={{ 
              height: '100%',
              background: '#1a1a1a',
              border: '2px solid #ffffff',
              borderRadius: 3,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={selectedProduct.imageUrl || selectedProduct.image}
                  alt={selectedProduct.name}
                  sx={{ objectFit: 'contain', bgcolor: '#0a0a0a' }}
                />
                <Chip 
                  label="SELECTED" 
                  sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16,
                    fontWeight: 'bold',
                    bgcolor: '#ffffff',
                    color: '#000000'
                  }} 
                />
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" color="#ffffff">
                  {selectedProduct.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    label={selectedProduct.brand} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#333',
                      color: '#ffffff',
                      border: '1px solid #666'
                    }} 
                  />
                  <Chip 
                    label={selectedProduct.material} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#333',
                      color: '#ffffff',
                      border: '1px solid #666'
                    }} 
                  />
                </Box>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#ffffff' }}>
                  ${selectedProduct.price}
                </Typography>
                <Typography variant="body2" color="#b0b0b0">
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
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 3
            }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ fontSize: 80, mb: 2 }}>👕</Box>
                <Typography variant="h6" color="#ffffff" gutterBottom>
                  Select a product below
                </Typography>
                <Typography variant="body2" color="#888">
                  to see AI-powered recommendations
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right: AI Recommendations */}
        <Grid item xs={12} md={4}>
          {bodyProfile && selectedProduct ? (
            <AIRecommendations
              bodyProfile={bodyProfile}
              selectedProduct={selectedProduct}
            />
          ) : (
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {!bodyProfile
                    ? 'Save your profile to get AI recommendations'
                    : 'Select a product to see recommendations'}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Products Grid */}
      <Box sx={{ mt: 4 }}>
        <Card sx={{ 
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: 3,
          p: 3
        }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="#ffffff" sx={{ mb: 3 }}>
            Available Products {bodyProfile && `- Showing Fit Scores`}
          </Typography>
          
          {calculatingFit && (
            <Box sx={{ mb: 3 }}>
              <Alert severity="info" sx={{ bgcolor: '#1a1a1a', color: '#ffffff', border: '1px solid #333' }}>
                Calculating fit scores for your measurements...
              </Alert>
              <LinearProgress sx={{ mt: 1, bgcolor: '#333', '& .MuiLinearProgress-bar': { bgcolor: '#ffffff' } }} />
            </Box>
          )}
          
          <Grid container spacing={2}>
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
              <Grid item xs={12} sm={6} md={3} key={product.id}>
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
                      top: 8,
                      left: 8,
                      zIndex: 10
                    }}>
                      <FitBadge 
                        fitScore={fitData.fit_score} 
                        fitLevel={fitData.fit_level}
                        size="small"
                      />
                    </Box>
                  )}
                  
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageUrl || product.image}
                      alt={product.name}
                      sx={{ objectFit: 'contain', bgcolor: '#000000' }}
                    />
                    {selectedProduct?.id === product.id && (
                      <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: '#ffffff',
                        color: '#000000',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </Box>
                    )}
                  </Box>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap color="#ffffff">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="#888" noWrap>
                      {product.brand}
                    </Typography>
                    
                    {fitData && (
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <Chip 
                          label={`Size ${fitData.recommended_size}`}
                          size="small"
                          sx={{
                            bgcolor: '#333',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            mr: 0.5
                          }}
                        />
                        <Typography variant="caption" color="#888">
                          {fitData.fit_score}% fit
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', color: '#ffffff' }}>
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

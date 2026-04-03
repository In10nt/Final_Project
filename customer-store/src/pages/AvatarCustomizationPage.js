import React, { useState } from 'react';
import {
  Container, Grid, Typography, Box, Button, Card, CardContent,
  FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import Model3DViewer from '../components/Model3DViewer';
import axios from 'axios';

const AvatarCustomizationPage = () => {
  const { customer, bodyProfile } = useCustomerAuth();
  const navigate = useNavigate();
  
  const [customization, setCustomization] = useState({
    skinTone: 'medium',
    hairColor: 'brown',
    hairStyle: 'short',
    eyeColor: 'brown',
    faceShape: 'oval',
    bodyShape: 'athletic'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const skinTones = [
    { value: 'light', label: 'Light', color: '#FFE0BD' },
    { value: 'medium', label: 'Medium', color: '#D4A574' },
    { value: 'tan', label: 'Tan', color: '#C68642' },
    { value: 'dark', label: 'Dark', color: '#8D5524' }
  ];

  const hairColors = [
    { value: 'black', label: 'Black', color: '#000000' },
    { value: 'brown', label: 'Brown', color: '#654321' },
    { value: 'blonde', label: 'Blonde', color: '#FAF0BE' },
    { value: 'red', label: 'Red', color: '#8B0000' },
    { value: 'gray', label: 'Gray', color: '#808080' }
  ];

  const hairStyles = bodyProfile?.gender === 'FEMALE' 
    ? [
        { value: 'short', label: 'Short (Pixie)' },
        { value: 'medium', label: 'Medium (Bob)' },
        { value: 'long', label: 'Long (Flowing)' },
        { value: 'ponytail', label: 'Ponytail' }
      ]
    : [
        { value: 'short', label: 'Short' },
        { value: 'medium', label: 'Medium' },
        { value: 'long', label: 'Long' },
        { value: 'bald', label: 'Bald' }
      ];

  const eyeColors = [
    { value: 'brown', label: 'Brown', color: '#654321' },
    { value: 'blue', label: 'Blue', color: '#4169E1' },
    { value: 'green', label: 'Green', color: '#228B22' },
    { value: 'hazel', label: 'Hazel', color: '#8E7618' },
    { value: 'gray', label: 'Gray', color: '#708090' }
  ];

  const handleChange = (field, value) => {
    setCustomization(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!customer || !bodyProfile) {
      setError('Please create your body profile first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const response = await axios.post('http://localhost:8082/api/avatar/generate', {
        userId: customer.id,
        ...customization
      });
      
      console.log('Avatar generated:', response.data);
      setAvatarUrl(response.data.avatarModelUrl);
      setSuccess(true);
    } catch (err) {
      console.error('Avatar generation error:', err);
      setError(err.response?.data?.message || 'Failed to generate avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToTryOn = () => {
    navigate('/virtual-tryon');
  };

  if (!customer) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Please login to customize your avatar</Alert>
      </Container>
    );
  }

  if (!bodyProfile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          Please create your body profile first to generate an avatar
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
        Customize Your Avatar
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" paragraph>
        Create a personalized 3D avatar based on your body measurements
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Avatar generated successfully! 
          <Button 
            variant="contained" 
            size="small" 
            onClick={handleGoToTryOn}
            sx={{ ml: 2 }}
          >
            Go to Virtual Try-On
          </Button>
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Preview Section */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Avatar Preview</Typography>
              <Box
                sx={{
                  height: 500,
                  bgcolor: '#f5f5f5',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {avatarUrl ? (
                  <Model3DViewer 
                    modelUrl={avatarUrl} 
                    width={400} 
                    height={500}
                    showColorPicker={false}
                  />
                ) : (
                  <Box textAlign="center" p={3}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {bodyProfile.gender === 'FEMALE' ? '♀ Female' : '♂ Male'} Avatar
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Customize your avatar and click "Generate" to see your 3D human model
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Height: {bodyProfile.heightCm}cm | Chest: {bodyProfile.chestCm}cm
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Waist: {bodyProfile.waistCm}cm | Hip: {bodyProfile.hipCm}cm
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Customization Options */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Customization Options</Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Creating {bodyProfile.gender === 'FEMALE' ? 'Female' : 'Male'} Avatar based on your profile
              </Alert>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Skin Tone */}
                <FormControl fullWidth>
                  <InputLabel>Skin Tone</InputLabel>
                  <Select
                    value={customization.skinTone}
                    label="Skin Tone"
                    onChange={(e) => handleChange('skinTone', e.target.value)}
                  >
                    {skinTones.map(tone => (
                      <MenuItem key={tone.value} value={tone.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 20, height: 20, bgcolor: tone.color, borderRadius: 1 }} />
                          {tone.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Hair Color */}
                <FormControl fullWidth>
                  <InputLabel>Hair Color</InputLabel>
                  <Select
                    value={customization.hairColor}
                    label="Hair Color"
                    onChange={(e) => handleChange('hairColor', e.target.value)}
                  >
                    {hairColors.map(color => (
                      <MenuItem key={color.value} value={color.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 20, height: 20, bgcolor: color.color, borderRadius: 1 }} />
                          {color.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Hair Style */}
                <FormControl fullWidth>
                  <InputLabel>Hair Style</InputLabel>
                  <Select
                    value={customization.hairStyle}
                    label="Hair Style"
                    onChange={(e) => handleChange('hairStyle', e.target.value)}
                  >
                    {hairStyles.map(style => (
                      <MenuItem key={style.value} value={style.value}>{style.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Eye Color */}
                <FormControl fullWidth>
                  <InputLabel>Eye Color</InputLabel>
                  <Select
                    value={customization.eyeColor}
                    label="Eye Color"
                    onChange={(e) => handleChange('eyeColor', e.target.value)}
                  >
                    {eyeColors.map(color => (
                      <MenuItem key={color.value} value={color.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 20, height: 20, bgcolor: color.color, borderRadius: '50%' }} />
                          {color.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generate Avatar'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AvatarCustomizationPage;

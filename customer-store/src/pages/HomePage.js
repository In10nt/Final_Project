import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material';
import { 
  ThreeDRotation, 
  CameraAlt, 
  ShoppingBag, 
  Star,
  TrendingUp,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/apiService';

const HomePage = () => {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const response = await productsAPI.getAllProducts();
      let products = [];
      
      if (response.data) {
        if (response.data.content && Array.isArray(response.data.content)) {
          products = response.data.content;
        } else if (Array.isArray(response.data)) {
          products = response.data;
        }
      }
      
      // Take first 3 products for trending section
      setTrendingProducts(products.slice(0, 3));
    } catch (error) {
      console.error('Failed to load trending products:', error);
    }
  };

  const features = [
    {
      icon: <ThreeDRotation sx={{ fontSize: 40 }} />,
      title: '3D Virtual Try-On',
      description: 'See how clothes look on your personalized 3D avatar before buying',
    },
    {
      icon: <CameraAlt sx={{ fontSize: 40 }} />,
      title: 'AI Body Analysis',
      description: 'Take a photo and let AI analyze your measurements for perfect fit',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Perfect Fit Guarantee',
      description: 'Our AI ensures 95% accuracy in size recommendations',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Try Before You Buy
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Experience the future of online shopping with AI-powered virtual try-on
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/virtual-tryon')}
              startIcon={<ThreeDRotation />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                px: 4,
                py: 1.5,
              }}
            >
              Start Virtual Try-On
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/products')}
              startIcon={<ShoppingBag />}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5,
              }}
            >
              Browse Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom fontWeight="bold">
          Why Choose Virtual Try-On?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Revolutionary technology that transforms your shopping experience
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 3,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Trending Products */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h3" fontWeight="bold">
              Trending Now
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {trendingProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                  onClick={() => navigate(`/products`)}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={product.imageUrl || `https://via.placeholder.com/300x400?text=${encodeURIComponent(product.name)}`}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        ${product.price}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ color: 'gold', fontSize: 20, mr: 0.5 }} />
                        <Typography variant="body2">
                          {product.rating || 4.5}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/virtual-tryon');
                      }}
                    >
                      Try On Virtually
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Ready to Transform Your Shopping?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of customers who shop smarter with virtual try-on
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/virtual-tryon')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
              px: 4,
              py: 1.5,
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
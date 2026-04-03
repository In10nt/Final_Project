import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Grid, Typography, Box, Button, Card, CardContent,
  Chip, CircularProgress, Alert, Divider
} from '@mui/material';
import {
  ShoppingCart, Favorite, Share, CheckCircle, LocalShipping
} from '@mui/icons-material';
import axios from 'axios';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import Model3DViewer from '../components/Model3DViewer';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customer, bodyProfile } = useCustomerAuth();
  
  const [product, setProduct] = useState(null);
  const [sizeRecommendation, setSizeRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSize, setLoadingSize] = useState(false);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && customer && bodyProfile) {
      fetchSizeRecommendation();
    }
  }, [product, customer, bodyProfile]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/api/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSizeRecommendation = async () => {
    setLoadingSize(true);
    try {
      const response = await axios.post('http://localhost:8082/api/size-recommendation', {
        userId: customer.id,
        productId: id
      });
      setSizeRecommendation(response.data);
      setSelectedSize(response.data.recommendedSize);
    } catch (err) {
      console.error('Size recommendation failed:', err);
    } finally {
      setLoadingSize(false);
    }
  };

  const handleTryOn = () => {
    if (!customer) {
      navigate('/login');
      return;
    }
    navigate('/virtual-tryon', { state: { product } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* 3D Model Viewer */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <Box sx={{ height: 500, bgcolor: '#f5f5f5' }}>
              {product.model3dUrl ? (
                <Model3DViewer modelUrl={`http://localhost:8082${product.model3dUrl}`} />
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                  <Typography color="textSecondary">No 3D model available</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {product.name}
            </Typography>
            
            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
              ${product.price}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Chip label={product.brand} color="primary" sx={{ mr: 1 }} />
              <Chip label={product.material} variant="outlined" sx={{ mr: 1 }} />
              <Chip label={product.color} variant="outlined" />
            </Box>

            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Size Recommendation */}
            {customer && bodyProfile ? (
              <Card sx={{ mb: 3, bgcolor: '#f0f7ff', border: '1px solid #2196f3' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                    Size Recommendation
                  </Typography>
                  
                  {loadingSize ? (
                    <Box display="flex" alignItems="center" gap={2}>
                      <CircularProgress size={20} />
                      <Typography variant="body2">Analyzing your measurements...</Typography>
                    </Box>
                  ) : sizeRecommendation ? (
                    <>
                      <Typography variant="h4" color="primary" fontWeight="bold" sx={{ my: 1 }}>
                        {sizeRecommendation.recommendedSize}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {sizeRecommendation.explanation}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Confidence: {sizeRecommendation.confidence}
                      </Typography>
                      {sizeRecommendation.alternativeSizes && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Alternative sizes: {sizeRecommendation.alternativeSizes.join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Create a body profile to get personalized size recommendations
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  {!customer ? 'Login to get personalized size recommendations' : 'Create your body profile to get size recommendations'}
                </Typography>
              </Alert>
            )}

            {/* Size Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Select Size
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'contained' : 'outlined'}
                    onClick={() => setSelectedSize(size)}
                    sx={{ minWidth: 60 }}
                  >
                    {size}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                disabled={!selectedSize}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleTryOn}
              >
                Try On
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button startIcon={<Favorite />} variant="text">
                Add to Wishlist
              </Button>
              <Button startIcon={<Share />} variant="text">
                Share
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Product Info */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                <LocalShipping sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                Free shipping on orders over $50
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                SKU: {product.sku}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Barcode: {product.barcode}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;

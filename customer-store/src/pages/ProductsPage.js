import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, CardActions, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/apiService';
import Model3DViewer from '../components/Model3DViewer';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAllProducts();
      console.log('Products response:', response);
      // Handle different response structures
      const productData = response.data?.content || response.data || [];
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTryOn = (productId) => {
    navigate(`/virtual-tryon?productId=${productId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#000000', minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ 
          color: '#ffffff', 
          fontWeight: 'bold',
          animation: 'flipInX 0.8s ease-out',
          '@keyframes flipInX': {
            '0%': {
              opacity: 0,
              transform: 'perspective(400px) rotateX(90deg)',
            },
            '40%': {
              transform: 'perspective(400px) rotateX(-10deg)',
            },
            '70%': {
              transform: 'perspective(400px) rotateX(10deg)',
            },
            '100%': {
              opacity: 1,
              transform: 'perspective(400px) rotateX(0deg)',
            },
          },
        }}>
          Products
        </Typography>
        <Typography variant="h6" sx={{ color: '#888' }}>
          Browse our collection and try them on virtually
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: '#1a1a1a',
              border: '1px solid #333',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                borderColor: '#666',
                boxShadow: '0 20px 60px rgba(255,255,255,0.1)',
              }
            }}>
              <Box sx={{ 
                position: 'relative', 
                height: 380, 
                bgcolor: '#000',
                overflow: 'hidden'
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
                    image={product.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image'}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#888' }}>
                  {product.description}
                </Typography>
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  ${product.price}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Category: {product.category}
                </Typography>
              </CardContent>
              <CardActions sx={{ gap: 1, p: 2 }}>
                <Button 
                  size="medium" 
                  fullWidth 
                  variant="outlined" 
                  onClick={() => navigate(`/products/${product.id}`)}
                  sx={{
                    borderColor: '#666',
                    color: '#ffffff',
                    '&:hover': {
                      borderColor: '#ffffff',
                      bgcolor: 'rgba(255,255,255,0.05)',
                    }
                  }}
                >
                  View Details
                </Button>
                <Button 
                  size="medium" 
                  fullWidth 
                  variant="contained" 
                  onClick={() => handleTryOn(product.id)}
                  sx={{
                    bgcolor: '#ffffff',
                    color: '#000000',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#e0e0e0',
                    }
                  }}
                >
                  Try On
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {products.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: '#888' }}>
            No products available yet. Check back soon!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ProductsPage;

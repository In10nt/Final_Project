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
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #334155',
              borderRadius: 3,
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                borderColor: '#3b82f6',
                boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)',
              }
            }}>
              <Box sx={{ 
                position: 'relative', 
                height: 380, 
                bgcolor: '#000',
                overflow: 'hidden',
                borderRadius: '12px 12px 0 0',
              }}>
                {product.model3dUrl ? (
                  <Model3DViewer 
                    modelUrl={`http://localhost:8082${product.model3dUrl}`}
                    height={380}
                    width="100%"
                    productColor={product.color?.split(',')[0]?.trim() || 'White'}
                    productCategory={product.category}
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
                <Box sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  bgcolor: 'rgba(59, 130, 246, 0.9)',
                  color: '#fff',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}>
                  ${product.price}
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography gutterBottom variant="h5" component="h2" sx={{ 
                  color: '#e2e8f0', 
                  fontWeight: 700,
                  mb: 1.5,
                }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ 
                  mb: 2, 
                  color: '#94a3b8',
                  lineHeight: 1.6,
                }}>
                  {product.description}
                </Typography>
                <Box sx={{
                  display: 'inline-block',
                  px: 1.5,
                  py: 0.5,
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 1,
                }}>
                  <Typography variant="caption" sx={{ 
                    color: '#60a5fa',
                    fontWeight: 500,
                  }}>
                    {product.category}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ gap: 1.5, p: 3, pt: 0 }}>
                <Button 
                  size="large" 
                  fullWidth 
                  variant="outlined" 
                  onClick={() => navigate(`/products/${product.id}`)}
                  sx={{
                    borderColor: '#334155',
                    color: '#e2e8f0',
                    borderWidth: 2,
                    fontWeight: 600,
                    py: 1.2,
                    '&:hover': {
                      borderColor: '#3b82f6',
                      bgcolor: 'rgba(59, 130, 246, 0.1)',
                      borderWidth: 2,
                    }
                  }}
                >
                  View Details
                </Button>
                <Button 
                  size="large" 
                  fullWidth 
                  variant="contained" 
                  onClick={() => handleTryOn(product.id)}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    py: 1.2,
                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
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

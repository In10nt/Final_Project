import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProductDetailPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Product Details
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Detailed view of selected product
        </Typography>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;
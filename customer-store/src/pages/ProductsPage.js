import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProductsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Products
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Browse our collection of fashion items
        </Typography>
      </Box>
    </Container>
  );
};

export default ProductsPage;
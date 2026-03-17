import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const CheckoutPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Checkout
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Complete your purchase
        </Typography>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
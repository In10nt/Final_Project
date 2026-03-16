import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const CartPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Shopping Cart
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your selected items
        </Typography>
      </Box>
    </Container>
  );
};

export default CartPage;
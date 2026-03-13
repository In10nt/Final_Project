import React from 'react';
import { Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box sx={{ padding: 3 }}>
      {children}
    </Box>
  );
};

export default Layout;
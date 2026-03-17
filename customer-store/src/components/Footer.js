import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Fashion Store
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your premier destination for virtual try-on fashion experiences. 
              Discover the perfect fit with our cutting-edge technology.
            </Typography>
            <Box>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link color="inherit" href="/" sx={{ mb: 1, textDecoration: 'none' }}>
                Home
              </Link>
              <Link color="inherit" href="/products" sx={{ mb: 1, textDecoration: 'none' }}>
                Products
              </Link>
              <Link color="inherit" href="#" sx={{ mb: 1, textDecoration: 'none' }}>
                Categories
              </Link>
              <Link color="inherit" href="#" sx={{ mb: 1, textDecoration: 'none' }}>
                Virtual Try-On
              </Link>
              <Link color="inherit" href="#" sx={{ mb: 1, textDecoration: 'none' }}>
                About Us
              </Link>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link color="inherit" href="#" sx={{ mb: 1, textDecoration: 'none' }}>
                Contact Us
              </Link>
              <Link color="inherit" href="#" sx={{ mb: 1, textDecoration: 'none' }}>
                Size Guide
              </Link>
              <Link color="inherit" href="#" sx={{ mb: 1, textDecoration: 'none' }}>
                Shipping Info
              </Link>
              <Link color="inherit" href="#" sx={{ mb: 1, textDecoration: 'none' }}>
                Returns
              </Link>
              <Link color="inherit" href="#" sx={{ mb: 1, textDecoration: 'none' }}>
                FAQ
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                123 Fashion St, Style City, SC 12345
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                +1 (555) 123-4567
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                support@fashionstore.com
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.2)' }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2">
            © 2026 Fashion Store. All rights reserved.
          </Typography>
          <Box>
            <Link color="inherit" href="#" sx={{ mx: 1, textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link color="inherit" href="#" sx={{ mx: 1, textDecoration: 'none' }}>
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
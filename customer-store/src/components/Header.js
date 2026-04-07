import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  InputBase,
  alpha,
  Menu,
  MenuItem,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart,
  Person,
  Favorite,
  Menu as MenuIcon,
  Logout,
  Login,
  ThreeDRotation,
  Home,
  Category,
  Info,
  Close,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import { useCart } from '../contexts/CartContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  const { getCartCount } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Products', path: '/products', icon: <Category /> },
    { label: 'Virtual Try-On', path: '/virtual-tryon', icon: <ThreeDRotation />, highlight: true },
    { label: 'About', path: '/about', icon: <Info /> },
  ];

  const drawer = (
    <Box sx={{ width: 280, bgcolor: '#000000', height: '100%', color: '#ffffff' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #333'
      }}>
        <Typography variant="h6" fontWeight="bold">
          Fashion Store
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: '#ffffff' }}>
          <Close />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
              sx={{
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
                ...(item.highlight && {
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderLeft: '3px solid #ffffff',
                })
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', color: '#ffffff' }}>
                {item.icon}
              </Box>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => {
                navigate('/avatar/customize');
                handleDrawerToggle();
              }}
              sx={{
                py: 1.5,
                bgcolor: 'rgba(255,255,255,0.05)',
                borderLeft: '3px solid #ffffff',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', color: '#ffffff' }}>
                <Person />
              </Box>
              <ListItemText primary="My Avatar" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider sx={{ bgcolor: '#333', my: 2 }} />
      {isAuthenticated ? (
        <Box sx={{ px: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, color: '#888' }}>
            Signed in as
          </Typography>
          <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
            {customer?.firstName} {customer?.lastName}
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Logout />}
            onClick={() => {
              handleLogout();
              handleDrawerToggle();
            }}
            sx={{
              borderColor: '#666',
              color: '#ffffff',
              '&:hover': {
                borderColor: '#ffffff',
                bgcolor: 'rgba(255,255,255,0.05)',
              }
            }}
          >
            Logout
          </Button>
        </Box>
      ) : (
        <Box sx={{ px: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Login />}
            onClick={() => {
              navigate('/login');
              handleDrawerToggle();
            }}
            sx={{
              bgcolor: '#ffffff',
              color: '#000000',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#e0e0e0',
              }
            }}
          >
            Login
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: '#000000',
          borderBottom: '1px solid #333',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box
              sx={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center',
                gap: 1,
                mr: { xs: 2, md: 4 }
              }}
              onClick={() => navigate('/')}
            >
              <ThreeDRotation sx={{ fontSize: 28 }} />
              <Typography
                variant="h6"
                component="div"
                sx={{ 
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'block' },
                  background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Fashion Store
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    ...(item.highlight && {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.15)' 
                      }
                    }),
                    ...(!item.highlight && {
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.05)' 
                      }
                    })
                  }}
                >
                  {item.label}
                </Button>
              ))}
              {isAuthenticated && (
                <Button
                  color="inherit"
                  onClick={() => navigate('/avatar/customize')}
                  startIcon={<Person />}
                  sx={{
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.15)' 
                    }
                  }}
                >
                  My Avatar
                </Button>
              )}
            </Box>

            {/* Search */}
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mx: { xs: 1, md: 3 } }}>
              <Search sx={{ maxWidth: 500, width: '100%' }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search products..."
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </Box>

            {/* Right side icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
              {isAuthenticated && customer && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mr: 1, 
                    display: { xs: 'none', lg: 'block' },
                    color: '#b0b0b0',
                    fontWeight: 500
                  }}
                >
                  Hi, {customer.firstName}
                </Typography>
              )}
              
              <IconButton 
                color="inherit"
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <Favorite />
              </IconButton>
              
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/cart')}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <Badge 
                  badgeContent={getCartCount()} 
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#ffffff',
                      color: '#000000',
                      fontWeight: 'bold',
                    }
                  }}
                >
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {isAuthenticated ? (
                <>
                  <IconButton 
                    color="inherit" 
                    onClick={handleMenuOpen}
                    sx={{
                      display: { xs: 'none', sm: 'flex' },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    <Person />
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        bgcolor: '#1a1a1a',
                        color: '#ffffff',
                        border: '1px solid #333',
                        mt: 1,
                        minWidth: 200,
                      }
                    }}
                  >
                    <MenuItem 
                      onClick={() => { 
                        handleMenuClose(); 
                        navigate('/avatar/customize'); 
                      }}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      <Person sx={{ mr: 1, fontSize: 20 }} />
                      Customize Avatar
                    </MenuItem>
                    <MenuItem 
                      onClick={() => { 
                        handleMenuClose(); 
                        navigate('/virtual-tryon'); 
                      }}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      <ThreeDRotation sx={{ mr: 1, fontSize: 20 }} />
                      My Profile
                    </MenuItem>
                    <MenuItem 
                      onClick={handleMenuClose}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      <ShoppingCart sx={{ mr: 1, fontSize: 20 }} />
                      My Orders
                    </MenuItem>
                    <MenuItem 
                      onClick={handleMenuClose}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      <Favorite sx={{ mr: 1, fontSize: 20 }} />
                      Wishlist
                    </MenuItem>
                    <Divider sx={{ bgcolor: '#333', my: 1 }} />
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{
                        color: '#ff6b6b',
                        '&:hover': {
                          bgcolor: 'rgba(255,107,107,0.1)',
                        }
                      }}
                    >
                      <Logout sx={{ mr: 1, fontSize: 20 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button 
                  color="inherit" 
                  startIcon={<Login />}
                  onClick={() => navigate('/login')}
                  sx={{ 
                    ml: 1,
                    display: { xs: 'none', sm: 'flex' },
                    bgcolor: '#ffffff',
                    color: '#000000',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    px: 2,
                    '&:hover': {
                      bgcolor: '#e0e0e0',
                    }
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            bgcolor: '#000000',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
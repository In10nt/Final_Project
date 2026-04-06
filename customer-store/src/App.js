import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';

import { CustomerAuthProvider, useCustomerAuth } from './contexts/CustomerAuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VirtualTryOnPage from './pages/VirtualTryOnPageNew';  // Using new image-based version
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AvatarCustomizationPage from './pages/AvatarCustomizationPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import CustomerRegisterPage from './pages/CustomerRegisterPage';
import AITestPage from './pages/AITestPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useCustomerAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#e0e0e0',
      contrastText: '#000000',
    },
    secondary: {
      main: '#000000',
      light: '#333333',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    background: {
      default: '#000000',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: '#333333',
    success: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    info: {
      main: '#666666',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(255, 255, 255, 0.15)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(255, 255, 255, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #333333',
        },
      },
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <CustomerAuthProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<CustomerLoginPage />} />
                  <Route path="/register" element={<CustomerRegisterPage />} />
                  <Route path="/virtual-tryon" element={
                    <ProtectedRoute>
                      <VirtualTryOnPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/ai-test" element={<AITestPage />} />
                  <Route path="/avatar/customize" element={
                    <ProtectedRoute>
                      <AvatarCustomizationPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CustomerAuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
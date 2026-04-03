import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';

import { CustomerAuthProvider, useCustomerAuth } from './contexts/CustomerAuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VirtualTryOnPage from './pages/VirtualTryOnPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AvatarCustomizationPage from './pages/AvatarCustomizationPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import CustomerRegisterPage from './pages/CustomerRegisterPage';

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
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#e74c3c',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
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
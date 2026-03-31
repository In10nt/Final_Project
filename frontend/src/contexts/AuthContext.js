import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) {
        apiService.setAuthToken(token);
        // Token exists, set as authenticated
        // User data will be loaded after successful API calls
        setIsAuthenticated(true);
      }
    } catch (error) {
      localStorage.removeItem('admin_token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.adminLogin(email, password);
      const { token, email: userEmail, firstName, lastName, userId, tenantId } = response;
      
      const userData = {
        id: userId,
        email: userEmail,
        firstName,
        lastName,
        tenantId
      };
      
      localStorage.setItem('admin_token', token);
      apiService.setAuthToken(token);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    apiService.setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
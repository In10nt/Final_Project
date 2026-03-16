import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async adminLogin(email, password) {
    const response = await this.api.post('/api/auth/admin/login', {
      email,
      password,
    });
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/api/auth/me');
    return response.data;
  }

  // Product methods
  async getProducts(page = 0, size = 20, filters = {}) {
    const params = { page, size, ...filters };
    const response = await this.api.get('/api/products', { params });
    return response.data;
  }

  async getProduct(id) {
    const response = await this.api.get(`/api/products/${id}`);
    return response.data;
  }

  async createProduct(productData) {
    const response = await this.api.post('/api/products', productData);
    return response.data;
  }

  async updateProduct(id, productData) {
    const response = await this.api.put(`/api/products/${id}`, productData);
    return response.data;
  }

  async deleteProduct(id) {
    await this.api.delete(`/api/products/${id}`);
  }

  // Customer methods
  async getCustomers(page = 0, size = 20) {
    const response = await this.api.get('/api/customers', {
      params: { page, size },
    });
    return response.data;
  }

  // Analytics methods
  async getDashboardMetrics() {
    const response = await this.api.get('/api/analytics/dashboard');
    return response.data;
  }

  async getProductAnalytics(productId) {
    const response = await this.api.get(`/api/analytics/products/${productId}`);
    return response.data;
  }

  // File upload methods
  async uploadProductImages(productId, files) {
    const formData = new FormData();
    formData.append('productId', productId);
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await this.api.post('/api/upload/product-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Token management
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('admin_token', token);
    } else {
      localStorage.removeItem('admin_token');
    }
  }

  getAuthToken() {
    return localStorage.getItem('admin_token');
  }

  clearAuthToken() {
    localStorage.removeItem('admin_token');
  }
}

export const apiService = new ApiService();
export default apiService;
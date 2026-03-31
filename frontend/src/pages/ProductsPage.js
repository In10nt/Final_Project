import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress, Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/apiService';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    sku: '',
    barcode: '',
    color: '',
    material: '',
    status: 'active'
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setError('Please login to access this page');
      setLoading(false);
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(0, 100);
      setProducts(response.content || []);
      setError(null);
    } catch (err) {
      setError('Failed to load products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        brand: product.brand || '',
        price: product.price || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        color: product.color || '',
        material: product.material || '',
        status: product.status || 'active'
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        brand: '',
        price: '',
        sku: '',
        barcode: '',
        color: '',
        material: '',
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('You are not logged in. Please login again.');
        return;
      }

      console.log('Submitting product with token:', token.substring(0, 50) + '...');

      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      handleCloseDialog();
      fetchProducts();
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save product';
      setError(`Error ${err.response?.status || ''}: ${errorMsg}`);
      console.error('Product save error:', err.response || err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product: ' + err.message);
      }
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            error.includes('403') || error.includes('Forbidden') ? (
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
              >
                RELOGIN
              </Button>
            ) : null
          }
        >
          {error}
          {error.includes('login') && (
            <div style={{ marginTop: 8 }}>
              <a href="/login" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Click here to login
              </a>
            </div>
          )}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No products found</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.color}</TableCell>
                  <TableCell>{product.status}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(product)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
          <TextField fullWidth margin="normal" label="Description" name="description" value={formData.description} onChange={handleInputChange} multiline rows={3} />
          <TextField fullWidth margin="normal" label="Brand" name="brand" value={formData.brand} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Price" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
          <TextField fullWidth margin="normal" label="SKU" name="sku" value={formData.sku} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Barcode" name="barcode" value={formData.barcode} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Color" name="color" value={formData.color} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Material" name="material" value={formData.material} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage;

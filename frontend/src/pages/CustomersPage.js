import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import apiService from '../services/apiService';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getCustomers(0, 20);
      setCustomers(response.content || []);
    } catch (err) {
      setError('Failed to load customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>First Name</strong></TableCell>
                <TableCell><strong>Last Name</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Joined</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.firstName || '-'}</TableCell>
                    <TableCell>{customer.lastName || '-'}</TableCell>
                    <TableCell>{customer.phone || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status || 'active'}
                        color={customer.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CustomersPage;

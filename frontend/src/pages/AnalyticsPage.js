import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import apiService from '../services/apiService';

const AnalyticsPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getDashboardMetrics();
      setMetrics(response);
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Mon', tryOns: 400, conversions: 48 },
    { name: 'Tue', tryOns: 520, conversions: 62 },
    { name: 'Wed', tryOns: 480, conversions: 58 },
    { name: 'Thu', tryOns: 610, conversions: 73 },
    { name: 'Fri', tryOns: 720, conversions: 86 },
    { name: 'Sat', tryOns: 890, conversions: 107 },
    { name: 'Sun', tryOns: 650, conversions: 78 },
  ];

  const StatCard = ({ title, value, subtitle }) => (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="h2">
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Try-Ons"
              value="8,750"
              subtitle="This month"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Conversion Rate"
              value="12.5%"
              subtitle="↑ 2.3% from last month"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Avg. Session Time"
              value="4m 32s"
              subtitle="Per customer"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Customer Satisfaction"
              value="4.8/5"
              subtitle="Based on feedback"
            />
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Weekly Try-Ons
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tryOns" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Conversion Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="conversions" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Top Products */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Top Products
              </Typography>
              <Box sx={{ mt: 2 }}>
                {[
                  { name: 'Cotton T-Shirt', tryOns: 1250, conversions: 156 },
                  { name: 'Denim Jeans', tryOns: 980, conversions: 127 },
                  { name: 'Casual Dress', tryOns: 850, conversions: 98 },
                  { name: 'Leather Jacket', tryOns: 720, conversions: 86 },
                  { name: 'Summer Shorts', tryOns: 650, conversions: 78 },
                ].map((product, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderBottom: '1px solid #eee',
                      '&:hover': { backgroundColor: '#f9f9f9' },
                    }}
                  >
                    <Typography variant="body2">{product.name}</Typography>
                    <Box display="flex" gap={3}>
                      <Typography variant="body2" color="textSecondary">
                        Try-Ons: {product.tryOns}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        Conversions: {product.conversions}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AnalyticsPage;

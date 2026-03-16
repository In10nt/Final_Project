import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  People,
  Inventory,
  TrendingUp,
  ShoppingCart,
} from '@mui/icons-material';
import apiService from '../services/apiService';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await apiService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
      // Fallback to mock data
      setMetrics({
        totalCustomers: 1250,
        totalProducts: 450,
        totalTryOns: 8750,
        conversionRate: 12.5,
        averageRating: 4.8,
      });
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 40, color }} />
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to your Virtual Try-On admin dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Metrics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Customers"
            value={metrics?.totalCustomers?.toLocaleString() || '0'}
            icon={People}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Products"
            value={metrics?.totalProducts?.toLocaleString() || '0'}
            icon={Inventory}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Try-On Sessions"
            value={metrics?.totalTryOns?.toLocaleString() || '0'}
            icon={ShoppingCart}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversion Rate"
            value={`${metrics?.conversionRate || 0}%`}
            icon={TrendingUp}
            color="warning.main"
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                `${metrics?.newCustomersThisMonth || 0} new customers this month`,
                `${metrics?.totalProducts || 0} products in inventory`,
                `Average rating: ${metrics?.averageRating || 0}/5`,
                `${metrics?.totalTryOns || 0} total try-on sessions`,
                `Conversion rate: ${metrics?.conversionRate || 0}%`,
              ].map((activity, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{ py: 1, borderBottom: '1px solid #eee' }}
                >
                  • {activity}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ py: 1 }}>
                • Add new product
              </Typography>
              <Typography variant="body2" sx={{ py: 1 }}>
                • View customer analytics
              </Typography>
              <Typography variant="body2" sx={{ py: 1 }}>
                • Export sales report
              </Typography>
              <Typography variant="body2" sx={{ py: 1 }}>
                • Manage inventory
              </Typography>
              <Typography variant="body2" sx={{ py: 1 }}>
                • Update store settings
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
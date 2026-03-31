import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Box, Card, CardContent, CircularProgress,
  LinearProgress, Chip
} from '@mui/material';
import {
  People, Inventory, TrendingUp, ShoppingCart, Star, TrendingDown,
  Analytics, Settings
} from '@mui/icons-material';
import apiService from '../services/apiService';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalTryOns: 0,
    conversionRate: 0,
    averageRating: 0,
    newCustomersThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await apiService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
      // Set default values if API fails
      setMetrics({
        totalCustomers: 0,
        totalProducts: 0,
        totalTryOns: 0,
        conversionRate: 0,
        averageRating: 0,
        newCustomersThisMonth: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <Card elevation={3} sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box flex={1}>
            <Typography color="textSecondary" gutterBottom variant="body2" fontWeight={500}>
              {title}
            </Typography>
            <Typography variant="h3" component="h2" fontWeight="bold" sx={{ my: 1 }}>
              {value}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" gap={0.5}>
                {trend === 'up' ? (
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                )}
                <Typography variant="caption" color={trend === 'up' ? 'success.main' : 'error.main'}>
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: color,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const StatCard = ({ title, value, max, color }) => (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Box display="flex" alignItems="center" gap={2} mt={1}>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
        <Box flex={1}>
          <LinearProgress
            variant="determinate"
            value={(value / max) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: color,
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your store today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Metrics */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Customers"
            value={metrics.totalCustomers.toLocaleString()}
            icon={People}
            color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            trend="up"
            trendValue="+12% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Products"
            value={metrics.totalProducts.toLocaleString()}
            icon={Inventory}
            color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            trend="up"
            trendValue="+5 new items"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Try-On Sessions"
            value={metrics.totalTryOns.toLocaleString()}
            icon={ShoppingCart}
            color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            trend="up"
            trendValue="+23% this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate}%`}
            icon={TrendingUp}
            color="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            trend="up"
            trendValue="+2.5% vs last month"
          />
        </Grid>

        {/* Secondary Stats */}
        <Grid item xs={12} md={4}>
          <StatCard
            title="Average Rating"
            value={metrics.averageRating}
            max={5}
            color="#ffd700"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="New Customers This Month"
            value={metrics.newCustomersThisMonth}
            max={100}
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              System Status
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Chip label="All Systems Operational" color="success" icon={<Star />} />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { text: 'New customer registered', time: '2 minutes ago', color: 'success.main' },
                { text: 'Product "Cotton T-Shirt" tried on 15 times', time: '15 minutes ago', color: 'info.main' },
                { text: 'Size recommendation accuracy improved to 92%', time: '1 hour ago', color: 'warning.main' },
                { text: 'New product "Denim Jacket" added', time: '2 hours ago', color: 'primary.main' },
                { text: 'Customer feedback: 4.8/5 average rating', time: '3 hours ago', color: 'success.main' },
              ].map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    py: 1.5,
                    px: 2,
                    mb: 1,
                    borderLeft: 3,
                    borderColor: activity.color,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {activity.text}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { text: 'Add new product', icon: <Inventory />, color: 'primary.main' },
                { text: 'View customer analytics', icon: <Analytics />, color: 'info.main' },
                { text: 'Manage inventory', icon: <ShoppingCart />, color: 'warning.main' },
                { text: 'Update store settings', icon: <Settings />, color: 'secondary.main' },
              ].map((action, index) => (
                <Box
                  key={index}
                  sx={{
                    py: 1.5,
                    px: 2,
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box sx={{ color: action.color }}>{action.icon}</Box>
                  <Typography variant="body2">{action.text}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;

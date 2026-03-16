import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  People,
  Inventory,
  TrendingUp,
  ShoppingCart,
} from '@mui/icons-material';

const DashboardPage = () => {
  // Mock data - in real app, this would come from API
  const metrics = {
    totalCustomers: 1250,
    totalProducts: 450,
    totalTryOns: 8750,
    conversionRate: 12.5,
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
            value={metrics.totalCustomers.toLocaleString()}
            icon={People}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Products"
            value={metrics.totalProducts.toLocaleString()}
            icon={Inventory}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Try-On Sessions"
            value={metrics.totalTryOns.toLocaleString()}
            icon={ShoppingCart}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate}%`}
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
                'New customer registered: john.doe@email.com',
                'Product "Cotton T-Shirt" was tried on 15 times today',
                'Size recommendation accuracy improved to 92%',
                'New product "Denim Jacket" added to inventory',
                'Customer feedback: 4.8/5 average rating',
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
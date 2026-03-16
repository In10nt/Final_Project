import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Grid,
} from '@mui/material';
import { Save } from '@mui/icons-material';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    storeName: 'Fashion Store',
    storeEmail: 'admin@fashionstore.com',
    storePhone: '+1234567890',
    storeAddress: '123 Fashion St',
    enableNotifications: true,
    enableAnalytics: true,
    enableRecommendations: true,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Store Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Store Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="Store Name"
              name="storeName"
              value={settings.storeName}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Store Email"
              name="storeEmail"
              type="email"
              value={settings.storeEmail}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Store Phone"
              name="storePhone"
              value={settings.storePhone}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Store Address"
              name="storeAddress"
              value={settings.storeAddress}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
            />
          </Paper>
        </Grid>

        {/* Features */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Features & Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <FormControlLabel
              control={
                <Switch
                  name="enableNotifications"
                  checked={settings.enableNotifications}
                  onChange={handleInputChange}
                />
              }
              label="Enable Notifications"
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Send email notifications for new orders and customer activities
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  name="enableAnalytics"
                  checked={settings.enableAnalytics}
                  onChange={handleInputChange}
                />
              }
              label="Enable Analytics"
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Track customer behavior and try-on statistics
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  name="enableRecommendations"
                  checked={settings.enableRecommendations}
                  onChange={handleInputChange}
                />
              }
              label="Enable AI Recommendations"
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Show personalized product recommendations to customers
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleInputChange}
                />
              }
              label="Maintenance Mode"
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Temporarily disable the store for maintenance
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>

        {/* API Configuration */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              API Configuration
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                API Base URL: http://localhost:8082
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
                API Version: v1.0.0
              </Typography>
            </Box>

            <Typography variant="body2" color="textSecondary">
              For API documentation, visit:{' '}
              <a href="http://localhost:8082/swagger-ui.html" target="_blank" rel="noopener noreferrer">
                Swagger UI
              </a>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;

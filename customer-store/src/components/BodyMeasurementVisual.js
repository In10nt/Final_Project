import React from 'react';
import { Box, Typography, Slider } from '@mui/material';
import Model3DViewer from './Model3DViewer';

const BodyMeasurementVisual = ({ measurements, onMeasurementChange, gender = 'female', avatarUrl }) => {
  const measurementConfig = [
    {
      key: 'shoulders',
      label: 'Shoulders',
      icon: '↔️',
      min: 30,
      max: 60,
      unit: 'cm',
      color: '#9333ea',
    },
    {
      key: 'chest',
      label: 'Bust/Chest',
      icon: '👔',
      min: 70,
      max: 130,
      unit: 'cm',
      color: '#9333ea',
    },
    {
      key: 'waist',
      label: 'Waist',
      icon: '⌛',
      min: 50,
      max: 110,
      unit: 'cm',
      color: '#9333ea',
    },
    {
      key: 'hips',
      label: 'Hips',
      icon: '🔄',
      min: 70,
      max: 140,
      unit: 'cm',
      color: '#9333ea',
    },
    {
      key: 'height',
      label: 'Height',
      icon: '📏',
      min: 140,
      max: 210,
      unit: 'cm',
      color: '#9333ea',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        p: 0,
        bgcolor: 'transparent',
        minHeight: 400,
      }}
    >
      {/* Debug: Show avatar URL status */}
      {console.log('BodyMeasurementVisual - avatarUrl:', avatarUrl)}
      
      {/* Left Side - Avatar with Measurement Lines */}
      <Box
        sx={{
          flex: { xs: '1', md: '0 0 220px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          bgcolor: '#0a0a0a',
          borderRadius: 2,
          border: '1px solid #333',
          overflow: 'hidden',
          minHeight: 380,
        }}
      >
        {/* Avatar Image */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1.5,
          }}
        >
          {avatarUrl ? (
            /* Use 3D Model Viewer for avatar */
            <Model3DViewer
              modelUrl={avatarUrl}
              width="100%"
              height={380}
              productCategory="avatar"
              showColorPicker={false}
              autoRotate={true}
            />
          ) : (
            /* Professional Silhouette Avatar - Show when no avatar created */
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                p: 2,
              }}
            >
              <svg
                width="160"
                height="280"
                viewBox="0 0 200 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simple professional silhouette */}
                <path
                  d="M 100 30 
                     C 85 30 75 40 75 55 
                     C 75 70 85 80 100 80 
                     C 115 80 125 70 125 55 
                     C 125 40 115 30 100 30 Z
                     M 100 85
                     L 95 100
                     L 70 120
                     L 70 200
                     L 80 200
                     L 80 120
                     L 95 110
                     L 95 180
                     L 85 250
                     L 85 440
                     L 95 440
                     L 95 250
                     L 100 200
                     L 105 250
                     L 105 440
                     L 115 440
                     L 115 250
                     L 105 180
                     L 105 110
                     L 120 120
                     L 120 200
                     L 130 200
                     L 130 120
                     L 105 100
                     Z"
                  fill="#444"
                  opacity="0.6"
                />
              </svg>
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 2, 
                  color: '#9333ea', 
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}
              >
                No Avatar Created
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#666', 
                  textAlign: 'center',
                  fontSize: '0.65rem',
                  mt: 0.5
                }}
              >
                Visit Avatar Customization<br/>to create your 3D avatar
              </Typography>
            </Box>
          )}

          {/* Measurement indicator lines */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
            }}
          >
            {/* Shoulders line */}
            <Box
              sx={{
                position: 'absolute',
                top: '15%',
                left: '10%',
                right: '10%',
                height: '1px',
                bgcolor: '#9333ea',
                opacity: 0.4,
                '&::before': {
                  content: '"↔"',
                  position: 'absolute',
                  right: -16,
                  top: -8,
                  fontSize: '12px',
                  color: '#9333ea',
                },
              }}
            />
            {/* Chest line */}
            <Box
              sx={{
                position: 'absolute',
                top: '30%',
                left: '15%',
                right: '15%',
                height: '1px',
                bgcolor: '#9333ea',
                opacity: 0.4,
              }}
            />
            {/* Waist line */}
            <Box
              sx={{
                position: 'absolute',
                top: '45%',
                left: '20%',
                right: '20%',
                height: '1px',
                bgcolor: '#9333ea',
                opacity: 0.4,
              }}
            />
            {/* Hips line */}
            <Box
              sx={{
                position: 'absolute',
                top: '55%',
                left: '15%',
                right: '15%',
                height: '1px',
                bgcolor: '#9333ea',
                opacity: 0.4,
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 8,
            color: '#666',
            fontSize: '0.65rem',
          }}
        >
          Measurement Reference
        </Typography>
      </Box>

      {/* Right Side - Measurement Sliders */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {measurementConfig.map((config) => (
          <Box
            key={config.key}
            sx={{
              bgcolor: '#1a1a1a',
              borderRadius: 1.5,
              p: 2,
              border: '1px solid #333',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: '#9333ea',
                bgcolor: '#1f1f1f',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: '#9333ea15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                  }}
                >
                  {config.icon}
                </Box>
                <Typography variant="body2" fontWeight="600" color="#ffffff" sx={{ fontSize: '0.9rem' }}>
                  {config.label}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: '#9333ea',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  minWidth: '65px',
                  textAlign: 'right',
                }}
              >
                {measurements[config.key]} {config.unit}
              </Typography>
            </Box>

            <Slider
              value={measurements[config.key]}
              onChange={(_, value) => onMeasurementChange(config.key, value)}
              min={config.min}
              max={config.max}
              valueLabelDisplay="auto"
              sx={{
                color: config.color,
                height: 5,
                '& .MuiSlider-thumb': {
                  width: 18,
                  height: 18,
                  bgcolor: config.color,
                  border: '2px solid #000',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0 0 0 6px ${config.color}33`,
                  },
                },
                '& .MuiSlider-track': {
                  height: 5,
                  borderRadius: 2.5,
                  border: 'none',
                },
                '& .MuiSlider-rail': {
                  height: 5,
                  borderRadius: 2.5,
                  bgcolor: '#333',
                  opacity: 1,
                },
                '& .MuiSlider-valueLabel': {
                  bgcolor: config.color,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" color="#666" fontSize="0.65rem">
                {config.min}
              </Typography>
              <Typography variant="caption" color="#666" fontSize="0.65rem">
                {config.max}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BodyMeasurementVisual;

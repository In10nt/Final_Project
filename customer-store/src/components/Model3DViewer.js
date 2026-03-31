import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box, CircularProgress, Typography, IconButton, Tooltip } from '@mui/material';
import { PlayArrow, Pause, ThreeSixty } from '@mui/icons-material';

const Model3DViewer = forwardRef(({ modelUrl, width = 400, height = 600, productColor = 'White', showColorPicker = true, onColorChange }, ref) => {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const controlsRef = useRef(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [selectedColor, setSelectedColor] = React.useState(productColor);

  // Available colors for the product
  const availableColors = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
    { name: 'Red', hex: '#DC143C' },
    { name: 'Blue', hex: '#4169E1' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Green', hex: '#228B22' },
    { name: 'Yellow', hex: '#FFD700' },
    { name: 'Pink', hex: '#FF69B4' },
    { name: 'Purple', hex: '#9370DB' },
    { name: 'Orange', hex: '#FF8C00' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Brown', hex: '#8B4513' },
  ];

  useEffect(() => {
    if (!modelUrl) {
      setError('No 3D model URL provided');
      setLoading(false);
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup - position camera to look at model from front
    const camera = new THREE.PerspectiveCamera(
      50,
      width / height,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4); // Front view, centered
    camera.lookAt(0, 0, 0); // Look at center of model

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    if (mountRef.current) {
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);
    }

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 10, 7.5);
    directionalLight1.castShadow = true;
    directionalLight1.shadow.mapSize.width = 2048;
    directionalLight1.shadow.mapSize.height = 2048;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight3.position.set(0, -5, 5);
    scene.add(directionalLight3);

    // Add a subtle rim light
    const rimLight = new THREE.DirectionalLight(0x4488ff, 0.3);
    rimLight.position.set(0, 0, -10);
    scene.add(rimLight);

    // Add ground plane for better depth perception
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.1 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Controls - restrict to horizontal rotation only (like a turntable)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    
    // Lock vertical rotation - keep camera at same height
    controls.minPolarAngle = Math.PI / 2; // Horizontal
    controls.maxPolarAngle = Math.PI / 2; // Horizontal
    
    controls.autoRotate = true;
    controls.autoRotateSpeed = 3.0; // Horizontal rotation speed
    controls.enablePan = false; // Disable panning
    controls.target.set(0, 0, 0); // Rotate around center of model
    controlsRef.current = controls;

    // Load 3D model
    const loader = new OBJLoader();
    let fullModelUrl;
    if (modelUrl.startsWith('http')) {
      fullModelUrl = modelUrl;
    } else if (modelUrl.startsWith('/')) {
      fullModelUrl = `http://localhost:8082${modelUrl}`;
    } else {
      // If no leading slash, add it
      fullModelUrl = `http://localhost:8082/${modelUrl}`;
    }

    loader.load(
      fullModelUrl,
      (object) => {
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim;
        object.scale.multiplyScalar(scale);
        
        // Fix orientation - rotate model to stand upright
        object.rotation.x = -Math.PI / 2; // Rotate 90 degrees around X-axis to stand up
        object.rotation.y = 0;
        object.rotation.z = 0;
        
        // Recalculate bounding box after rotation
        object.updateMatrixWorld(true);
        const rotatedBox = new THREE.Box3().setFromObject(object);
        const rotatedCenter = rotatedBox.getCenter(new THREE.Vector3());
        
        // Center the model at origin (0, 0, 0)
        object.position.set(
          -rotatedCenter.x,
          -rotatedCenter.y,
          -rotatedCenter.z
        );
        
        // Apply enhanced material with better appearance
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xdddddd,
              roughness: 0.5,
              metalness: 0.1,
              flatShading: false,
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(object);
        modelRef.current = object;
        setLoading(false);
      },
      (xhr) => {
        const percentComplete = (xhr.loaded / xhr.total * 100);
        console.log(percentComplete.toFixed(2) + '% loaded');
      },
      (error) => {
        console.error('Error loading 3D model:', error);
        setError('Failed to load 3D model');
        setLoading(false);
      }
    );

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [modelUrl, width, height]);

  // Change model color
  const changeColor = (colorHex) => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.color.set(colorHex);
        }
      });
    }
  };

  // Expose changeColor method to parent via ref
  useImperativeHandle(ref, () => ({
    changeColor
  }));

  // Handle color selection
  const handleColorChange = (color) => {
    setSelectedColor(color.name);
    changeColor(color.hex);
  };

  // Toggle auto-rotation
  const toggleAutoRotate = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !autoRotate;
      setAutoRotate(!autoRotate);
    }
  };

  // Reset camera position
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Jump to specific view angles
  const jumpToView = (angle) => {
    if (controlsRef.current) {
      const radius = 4; // Distance from model
      const height = 0; // Camera height - centered
      
      // Calculate camera position based on angle
      const x = radius * Math.sin(angle);
      const z = radius * Math.cos(angle);
      
      // Smoothly move camera to new position
      controlsRef.current.object.position.set(x, height, z);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  if (error) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          borderRadius: 2,
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width, height }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            zIndex: 1,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading 3D Model...
          </Typography>
        </Box>
      )}
      
      {/* Control buttons */}
      {!loading && (
        <>
          {/* View angle buttons */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              zIndex: 2,
            }}
          >
            <Tooltip title="Front View" placement="left">
              <IconButton 
                onClick={() => jumpToView(0)} 
                size="small" 
                sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,1)' } }}
              >
                <Typography variant="caption" fontWeight="bold">F</Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Right Side" placement="left">
              <IconButton 
                onClick={() => jumpToView(Math.PI / 2)} 
                size="small" 
                sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,1)' } }}
              >
                <Typography variant="caption" fontWeight="bold">R</Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Back View" placement="left">
              <IconButton 
                onClick={() => jumpToView(Math.PI)} 
                size="small" 
                sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,1)' } }}
              >
                <Typography variant="caption" fontWeight="bold">B</Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Left Side" placement="left">
              <IconButton 
                onClick={() => jumpToView(-Math.PI / 2)} 
                size="small" 
                sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,1)' } }}
              >
                <Typography variant="caption" fontWeight="bold">L</Typography>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Bottom controls container */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              display: 'flex',
              justifyContent: showColorPicker ? 'space-between' : 'flex-end',
              alignItems: 'flex-end',
              zIndex: 2,
            }}
          >
            {/* Color picker - only show if showColorPicker is true */}
            {showColorPicker && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  borderRadius: 2,
                  padding: 1.5,
                  boxShadow: 2,
                }}
              >
                <Typography variant="caption" fontWeight="bold">
                  Colors
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, maxWidth: 180 }}>
                  {availableColors.map((color) => (
                    <Tooltip key={color.name} title={color.name}>
                      <Box
                        onClick={() => handleColorChange(color)}
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: color.hex,
                          borderRadius: '50%',
                          cursor: 'pointer',
                          border: selectedColor === color.name ? '3px solid #1976d2' : '2px solid #ddd',
                          boxShadow: selectedColor === color.name ? 2 : 0,
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'scale(1.15)',
                            boxShadow: 2,
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            )}

            {/* Playback controls */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                bgcolor: 'rgba(255,255,255,0.9)',
                borderRadius: 2,
                padding: 1,
                boxShadow: 2,
              }}
            >
              <Tooltip title={autoRotate ? "Pause Rotation" : "Auto Rotate"}>
                <IconButton onClick={toggleAutoRotate} size="small" color="primary">
                  {autoRotate ? <Pause /> : <PlayArrow />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Reset View">
                <IconButton onClick={resetCamera} size="small" color="primary">
                  <ThreeSixty />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </>
      )}

      {/* Instructions */}
      {!loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: 1,
            borderRadius: 1,
            fontSize: '0.75rem',
            zIndex: 2,
          }}
        >
          <Typography variant="caption" display="block">
            🖱️ Drag to rotate
          </Typography>
          <Typography variant="caption" display="block">
            🔍 Scroll to zoom
          </Typography>
        </Box>
      )}
      
      <div ref={mountRef} style={{ width, height, borderRadius: 8 }} />
    </Box>
  );
});

export default Model3DViewer;

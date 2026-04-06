import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box, CircularProgress, Typography, IconButton, Tooltip } from '@mui/material';
import { PlayArrow, Pause, ThreeSixty } from '@mui/icons-material';

const Model3DViewer = forwardRef(({ modelUrl, hairModelUrl, clothingModelUrl, width = '100%', height = 600, productColor = 'White', showColorPicker = true, onColorChange }, ref) => {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const hairRef = useRef(null);
  const clothingRef = useRef(null);
  const controlsRef = useRef(null);
  const sceneRef = useRef(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [selectedColor, setSelectedColor] = React.useState(productColor);
  const [containerSize, setContainerSize] = React.useState({ width: 400, height: 600 });

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

    // Calculate responsive dimensions
    const calculateDimensions = () => {
      if (mountRef.current) {
        const containerWidth = typeof width === 'number' ? width : mountRef.current.offsetWidth || 400;
        const containerHeight = typeof height === 'number' ? height : 600;
        setContainerSize({ width: containerWidth, height: containerHeight });
      }
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Pure black background

    // Camera setup - position camera to look at model from front
    const camera = new THREE.PerspectiveCamera(
      50,
      containerSize.width / containerSize.height,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4); // Front view, centered
    camera.lookAt(0, 0, 0); // Look at center of model

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerSize.width, containerSize.height);
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
    controls.autoRotateSpeed = 2.0; // Smooth rotation speed
    controls.enablePan = false; // Disable panning
    controls.target.set(0, 0, 0); // Rotate around center of model
    controlsRef.current = controls;

    // Load 3D model - detect file type and use appropriate loader
    let fullModelUrl;
    if (modelUrl.startsWith('http')) {
      fullModelUrl = modelUrl;
    } else if (modelUrl.startsWith('/')) {
      fullModelUrl = `http://localhost:8082${modelUrl}`;
    } else {
      // If no leading slash, add it
      fullModelUrl = `http://localhost:8082/${modelUrl}`;
    }

    // Detect file extension
    const fileExtension = modelUrl.toLowerCase().split('.').pop();
    const isFBX = fileExtension === 'fbx';
    const isOBJ = fileExtension === 'obj';
    const isGLB = fileExtension === 'glb' || fileExtension === 'gltf';
    
    console.log('Loading 3D model:', { modelUrl, fullModelUrl, fileExtension, isFBX, isOBJ, isGLB });

    // Function to process loaded model
    const processLoadedModel = (object) => {
      // Get initial dimensions
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      
      console.log('Model dimensions before rotation:', { x: size.x, y: size.y, z: size.z });
      
      // For OBJ files, apply rotation to make mannequin stand upright
      if (isOBJ) {
        console.log('Applying mannequin rotation');
        // Rotate to stand up and face forward
        object.rotation.x = -Math.PI / 2; // Rotate -90 degrees on X to stand up correctly
        object.rotation.y = 0;
        object.rotation.z = 0; // No Z rotation needed
      }
      
      // Update matrix after rotation
      object.updateMatrixWorld(true);
      
      // Recalculate bounding box after rotation
      const rotatedBox = new THREE.Box3().setFromObject(object);
      const rotatedSize = rotatedBox.getSize(new THREE.Vector3());
      const rotatedCenter = rotatedBox.getCenter(new THREE.Vector3());
      
      console.log('Model dimensions after rotation:', { x: rotatedSize.x, y: rotatedSize.y, z: rotatedSize.z });
      
      // Scale to fit viewport - make it taller
      const maxDim = Math.max(rotatedSize.x, rotatedSize.y, rotatedSize.z);
      const scale = 2.5 / maxDim;
      object.scale.multiplyScalar(scale);
      
      // Center the model at origin
      object.position.set(
        -rotatedCenter.x * scale,
        -rotatedCenter.y * scale,
        -rotatedCenter.z * scale
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
      sceneRef.current = scene;
      setLoading(false);
    };

    // Load based on file type
    if (isGLB) {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        fullModelUrl,
        (gltf) => {
          processLoadedModel(gltf.scene);
        },
        (xhr) => {
          const percentComplete = (xhr.loaded / xhr.total * 100);
          console.log(percentComplete.toFixed(2) + '% loaded');
        },
        (error) => {
          console.error('Error loading GLB model:', error);
          setError('Failed to load GLB model');
          setLoading(false);
        }
      );
    } else if (isFBX) {
      const fbxLoader = new FBXLoader();
      fbxLoader.load(
        fullModelUrl,
        processLoadedModel,
        (xhr) => {
          const percentComplete = (xhr.loaded / xhr.total * 100);
          console.log(percentComplete.toFixed(2) + '% loaded');
        },
        (error) => {
          console.error('Error loading FBX model:', error);
          setError('Failed to load FBX model');
          setLoading(false);
        }
      );
    } else if (isOBJ) {
      const objLoader = new OBJLoader();
      objLoader.load(
        fullModelUrl,
        processLoadedModel,
        (xhr) => {
          const percentComplete = (xhr.loaded / xhr.total * 100);
          console.log(percentComplete.toFixed(2) + '% loaded');
        },
        (error) => {
          console.error('Error loading OBJ model:', error);
          setError('Failed to load OBJ model');
          setLoading(false);
        }
      );
    } else {
      setError('Unsupported 3D model format. Please use OBJ, FBX, GLB, or GLTF files.');
      setLoading(false);
    }

    // Load hair model if provided - wait for main model to load first
    if (hairModelUrl) {
      const hairExtension = hairModelUrl.toLowerCase().split('.').pop();
      const hairFullUrl = hairModelUrl.startsWith('http') ? hairModelUrl : `http://localhost:8082${hairModelUrl}`;
      
      console.log('Loading hair model:', hairFullUrl);
      
      // Wait a bit for main model to load, then add hair
      setTimeout(() => {
        if (hairExtension === 'glb' || hairExtension === 'gltf' || hairExtension === 'hair') {
          const gltfLoader = new GLTFLoader();
          gltfLoader.load(
            hairFullUrl,
            (gltf) => {
              const hairModel = gltf.scene;
              
              console.log('Hair model loaded successfully!');
              console.log('Hair model structure:', hairModel);
              
              // Get hair dimensions
              const hairBox = new THREE.Box3().setFromObject(hairModel);
              const hairSize = hairBox.getSize(new THREE.Vector3());
              console.log('Hair original size:', hairSize);
              
              // Scale hair to match mannequin head size (approximately 20cm)
              const hairMaxDim = Math.max(hairSize.x, hairSize.y, hairSize.z);
              const targetHairSize = 0.25; // 25cm for hair
              const hairScale = targetHairSize / hairMaxDim;
              hairModel.scale.set(hairScale, hairScale, hairScale);
              
              // Position hair on top of mannequin's head
              // Mannequin is now rotated -90° on X
              hairModel.position.set(0, 1.0, 0); // Position on top of head
              
              // Rotate hair to match mannequin orientation
              hairModel.rotation.x = -Math.PI / 2; // Match mannequin rotation
              hairModel.rotation.y = 0;
              hairModel.rotation.z = 0; // No Z rotation needed
              
              // Apply realistic hair material
              hairModel.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  if (!child.material) {
                    child.material = new THREE.MeshStandardMaterial();
                  }
                  // Default brown hair color
                  child.material.color.set(0x654321);
                  child.material.roughness = 0.6;
                  child.material.metalness = 0.0;
                  child.material.side = THREE.DoubleSide; // Render both sides
                  child.castShadow = true;
                  child.receiveShadow = true;
                }
              });
              
              scene.add(hairModel);
              hairRef.current = hairModel;
              console.log('Hair model added to scene at position:', hairModel.position);
              console.log('Hair model rotation:', hairModel.rotation);
              console.log('Hair model scale:', hairModel.scale);
            },
            (progress) => {
              const percent = (progress.loaded / progress.total * 100).toFixed(0);
              console.log(`Hair loading: ${percent}%`);
            },
            (error) => {
              console.error('Error loading hair model:', error);
            }
          );
        }
      }, 1500); // Wait 1.5 seconds for main model to load
    }

    // Load clothing model if provided - overlay on mannequin
    if (clothingModelUrl) {
      const clothingExtension = clothingModelUrl.toLowerCase().split('.').pop();
      const clothingFullUrl = clothingModelUrl.startsWith('http') ? clothingModelUrl : `http://localhost:8082${clothingModelUrl}`;
      
      console.log('=== CLOTHING MODEL LOADING ===');
      console.log('Clothing URL:', clothingFullUrl);
      console.log('Clothing extension:', clothingExtension);
      
      // Wait for mannequin to load, then add clothing
      setTimeout(() => {
        const loadClothingModel = (clothingExtension === 'glb' || clothingExtension === 'gltf') ? 
          new GLTFLoader() : 
          (clothingExtension === 'fbx' ? new FBXLoader() : new OBJLoader());
        
        loadClothingModel.load(
          clothingFullUrl,
          (loaded) => {
            const clothingModel = (clothingExtension === 'glb' || clothingExtension === 'gltf') ? 
              loaded.scene : loaded;
            
            console.log('=== CLOTHING MODEL LOADED ===');
            console.log('Clothing model object:', clothingModel);
            console.log('Clothing children count:', clothingModel.children.length);
            
            // Apply same rotation as mannequin to match orientation
            if (clothingExtension === 'obj') {
              clothingModel.rotation.x = -Math.PI / 2; // Same as mannequin
              clothingModel.rotation.y = 0;
              clothingModel.rotation.z = 0; // No Z rotation needed
            } else if (clothingExtension === 'glb' || clothingExtension === 'gltf') {
              // GLB files might need different rotation
              clothingModel.rotation.x = -Math.PI / 2;
              clothingModel.rotation.y = 0;
              clothingModel.rotation.z = 0;
            }
            
            // Update matrix after rotation
            clothingModel.updateMatrixWorld(true);
            
            // Get clothing dimensions AFTER rotation
            const clothingBox = new THREE.Box3().setFromObject(clothingModel);
            const clothingSize = clothingBox.getSize(new THREE.Vector3());
            const clothingCenter = clothingBox.getCenter(new THREE.Vector3());
            
            console.log('Clothing size after rotation:', clothingSize);
            console.log('Clothing center after rotation:', clothingCenter);
            
            // Scale clothing to match mannequin size exactly
            const clothingMaxDim = Math.max(clothingSize.x, clothingSize.y, clothingSize.z);
            const targetClothingSize = 2.5; // Same as mannequin
            const clothingScale = targetClothingSize / clothingMaxDim;
            clothingModel.scale.multiplyScalar(clothingScale);
            
            console.log('Clothing scale:', clothingScale);
            
            // Position clothing to align perfectly with mannequin center
            // Both models should be centered at (0, 0, 0)
            clothingModel.position.set(
              -clothingCenter.x * clothingScale,
              -clothingCenter.y * clothingScale,
              -clothingCenter.z * clothingScale
            );
            
            console.log('Clothing final position:', clothingModel.position);
            
            // Apply clothing material with product color
            let meshCount = 0;
            clothingModel.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                meshCount++;
                // Create new material if it doesn't exist
                child.material = new THREE.MeshStandardMaterial({
                  color: productColor === 'White' ? 0xffffff : 
                         productColor === 'Black' ? 0x000000 :
                         productColor === 'Red' ? 0xDC143C :
                         productColor === 'Blue' ? 0x4169E1 :
                         0xcccccc,
                  roughness: 0.6,
                  metalness: 0.0,
                  side: THREE.DoubleSide,
                  transparent: false,
                  opacity: 1.0,
                  depthTest: true,
                  depthWrite: true
                });
                
                child.castShadow = true;
                child.receiveShadow = true;
                child.renderOrder = 1;
                
                console.log('Applied material to mesh:', child.name || 'unnamed');
              }
            });
            
            console.log('Total meshes in clothing:', meshCount);
            
            // Make mannequin slightly transparent so clothing is more visible
            if (modelRef.current) {
              let mannequinMeshCount = 0;
              modelRef.current.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  mannequinMeshCount++;
                  child.material.transparent = true;
                  child.material.opacity = 0.3; // Semi-transparent mannequin
                  child.renderOrder = 0;
                }
              });
              console.log('Made mannequin transparent, meshes:', mannequinMeshCount);
            }
            
            scene.add(clothingModel);
            clothingRef.current = clothingModel;
            console.log('=== CLOTHING MODEL ADDED TO SCENE ===');
            console.log('Scene children count:', scene.children.length);
          },
          (progress) => {
            const percent = (progress.loaded / progress.total * 100).toFixed(0);
            console.log(`Clothing loading: ${percent}%`);
          },
          (error) => {
            console.error('=== ERROR LOADING CLOTHING ===');
            console.error('Error:', error);
          }
        );
      }, 2000); // Wait 2 seconds for mannequin to load
    } else {
      console.log('No clothing model URL provided');
    }

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
      const containerWidth = typeof width === 'number' ? width : mountRef.current?.offsetWidth || 400;
      const containerHeight = typeof height === 'number' ? height : 600;
      camera.aspect = containerWidth / containerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerWidth, containerHeight);
      setContainerSize({ width: containerWidth, height: containerHeight });
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
  }, [modelUrl, hairModelUrl, clothingModelUrl, width, height, productColor]);

  // Change model color
  const changeColor = (colorHex) => {
    // Change clothing color if present
    if (clothingRef.current) {
      clothingRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.color.set(colorHex);
        }
      });
    }
    // Otherwise change mannequin color
    else if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.color.set(colorHex);
        }
      });
    }
  };

  // Change hair color separately
  const changeHairColor = (colorHex) => {
    if (hairRef.current) {
      hairRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            child.material.color.set(colorHex);
          }
        }
      });
    }
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    changeColor,
    changeHairColor
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
          width: '100%',
          height: typeof height === 'number' ? height : '100%',
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
    <Box sx={{ position: 'relative', width: '100%', height: typeof height === 'number' ? height : '100%' }}>
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
      
      <div ref={mountRef} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
    </Box>
  );
});

export default Model3DViewer;

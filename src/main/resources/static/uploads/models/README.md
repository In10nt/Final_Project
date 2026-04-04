# 3D Models Directory

This directory contains large 3D model files that are not tracked in Git due to file size limitations.

## Required Files

Place the following 3D model files in this directory:

### Avatar/Mannequin Models
- `ScaleReferenceDummy.obj` (89MB) - Main mannequin model for avatar system
- `ScaleReferenceDummy.mtl` - Material file for mannequin
- `HairPackPT1.glb` (16MB) - Hair models pack

### Clothing Models
- `shirt.obj` (2.4MB) - Shirt model
- `shirt.mtl` - Shirt material
- `pant.obj` (0.7MB) - Pants model
- `pant.mtl` - Pants material
- `suit.obj` (1.4MB) - Suit jacket model
- `suit.mtl` - Suit material
- `suit collar.obj` (4.7MB) - Suit with collar model
- `suit collar.mtl` - Suit collar material

## File Storage Options

Since these files are too large for Git, you can:

1. **Store locally** - Keep files in this directory (already gitignored)
2. **Cloud storage** - Upload to Google Drive, Dropbox, or AWS S3
3. **Git LFS** - Use Git Large File Storage (requires setup)
4. **CDN** - Host on a CDN for production use

## Setup Instructions

1. Place your 3D model files in this directory
2. Ensure file names match exactly as listed above
3. Restart the Spring Boot application
4. Models will be accessible at: `http://localhost:8082/uploads/models/[filename]`

## File Format Support

The application supports:
- `.obj` - Wavefront OBJ format
- `.glb` - Binary glTF format
- `.fbx` - Autodesk FBX format
- `.gltf` - Text glTF format

## Notes

- Files in this directory are automatically served by Spring Boot
- Maximum file size for upload: 100MB (configurable in application.properties)
- Models should be properly oriented (standing upright) for best results
- Use Blender to edit/export models if needed

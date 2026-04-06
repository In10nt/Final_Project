"""
Script to fix pant.obj to fit the mannequin model
This will rescale and reposition the pants to fit properly on the lower body
"""

def fix_pant_obj():
    input_file = "src/main/resources/static/uploads/models/pant.obj"
    output_file = "src/main/resources/static/uploads/models/pant_fitted.obj"
    
    print("Reading pant.obj...")
    
    vertices = []
    faces = []
    other_lines = []
    
    # Read the OBJ file
    with open(input_file, 'r') as f:
        for line in f:
            if line.startswith('v '):
                # Vertex line
                parts = line.strip().split()
                x, y, z = float(parts[1]), float(parts[2]), float(parts[3])
                vertices.append([x, y, z])
            elif line.startswith('f '):
                faces.append(line)
            else:
                other_lines.append(line)
    
    print(f"Found {len(vertices)} vertices")
    
    # Calculate bounding box
    min_x = min(v[0] for v in vertices)
    max_x = max(v[0] for v in vertices)
    min_y = min(v[1] for v in vertices)
    max_y = max(v[1] for v in vertices)
    min_z = min(v[2] for v in vertices)
    max_z = max(v[2] for v in vertices)
    
    size_x = max_x - min_x
    size_y = max_y - min_y
    size_z = max_z - min_z
    
    center_x = (min_x + max_x) / 2
    center_y = (min_y + max_y) / 2
    center_z = (min_z + max_z) / 2
    
    print(f"Original size: X={size_x:.2f}, Y={size_y:.2f}, Z={size_z:.2f}")
    print(f"Original center: X={center_x:.2f}, Y={center_y:.2f}, Z={center_z:.2f}")
    
    # Target dimensions based on actual mannequin size
    # Original pants: X=23.73, Y=14.51, Z=57.09 (Z is leg length!)
    # We need Z to scale up to match mannequin leg length
    # Mannequin legs are ~90 units, so target Z should be large
    target_width = 45.0    # Hip width (X dimension)
    target_height = 30.0   # Hip to waist (Y dimension)  
    target_depth = 90.0    # Leg length (Z dimension) - this is the key!
    
    # Calculate scale factors
    scale_x = target_width / size_x
    scale_y = target_height / size_y
    scale_z = target_depth / size_z
    
    # Use uniform scale (smallest to ensure it fits)
    scale = min(scale_x, scale_y, scale_z)
    
    print(f"Scale factors: X={scale_x:.3f}, Y={scale_y:.3f}, Z={scale_z:.3f}")
    print(f"Using scale factor: {scale:.6f}")
    
    # Target position (lower body of mannequin)
    # Mannequin Y range is 0 to 180
    # Legs/pants should be at the BOTTOM, roughly Y=0 to Y=90
    target_x = 0.0
    target_y = 30.0  # Much lower - bottom half of body
    target_z = 7.0   # Match mannequin Z center
    
    # Transform vertices
    new_vertices = []
    for v in vertices:
        # Center the pants
        x = v[0] - center_x
        y = v[1] - center_y
        z = v[2] - center_z
        
        # Scale
        x *= scale
        y *= scale
        z *= scale
        
        # Move to target position
        x += target_x
        y += target_y
        z += target_z
        
        new_vertices.append([x, y, z])
    
    # Calculate new bounding box
    new_min_y = min(v[1] for v in new_vertices)
    new_max_y = max(v[1] for v in new_vertices)
    new_size_y = new_max_y - new_min_y
    
    print(f"New size: Y={new_size_y:.2f}")
    print(f"New Y range: {new_min_y:.2f} to {new_max_y:.2f}")
    
    # Write the new OBJ file
    print(f"Writing to {output_file}...")
    with open(output_file, 'w') as f:
        # Write header
        f.write("# Fitted pants for mannequin\n")
        f.write(f"# Scaled by {scale:.6f}\n")
        f.write(f"# Positioned at Y={target_y}\n\n")
        
        # Write other lines (materials, etc.)
        for line in other_lines:
            if not line.startswith('#'):
                f.write(line)
        
        # Write vertices
        for v in new_vertices:
            f.write(f"v {v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")
        
        # Write faces
        for face in faces:
            f.write(face)
    
    print("Done! Fitted pants saved to:", output_file)
    print("\nTo use:")
    print("1. Update the product in database:")
    print("   UPDATE products SET model3d_url = '/uploads/models/pant_fitted.obj' WHERE name = 'Blue Denim Jeans';")
    print("2. Refresh the Virtual Try-On page")

if __name__ == "__main__":
    fix_pant_obj()

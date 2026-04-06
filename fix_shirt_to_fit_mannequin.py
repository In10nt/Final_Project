"""
Script to fix shirt.obj to fit the mannequin model
This will rescale and reposition the shirt to fit properly on the torso
"""

def fix_shirt_obj():
    input_file = "src/main/resources/static/uploads/models/shirt.obj"
    output_file = "src/main/resources/static/uploads/models/shirt_fitted.obj"
    
    print("Reading shirt.obj...")
    
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
    # Mannequin is 180 units tall, ~104 units wide, ~37 units deep
    # Torso is roughly 40% of height = 72 units
    # Shoulder width is roughly 50% of mannequin width = 52 units
    target_height = 70.0  # Torso height to match mannequin scale
    target_width = 50.0   # Shoulder width to match mannequin scale
    target_depth = 30.0   # Torso depth to match mannequin scale
    
    # Calculate scale factors
    scale_x = target_width / size_x
    scale_y = target_height / size_y
    scale_z = target_depth / size_z
    
    # Use uniform scale (smallest to ensure it fits)
    scale = min(scale_x, scale_y, scale_z)
    
    print(f"Scale factor: {scale:.6f}")
    
    # Target position (upper torso of mannequin)
    # Mannequin Y range is 0 to 180, torso is roughly 90-130
    target_x = 0.0
    target_y = 110.0  # Upper chest area of mannequin
    target_z = 7.0    # Match mannequin Z center
    
    # Transform vertices
    new_vertices = []
    for v in vertices:
        # Center the shirt
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
        f.write("# Fitted shirt for mannequin\n")
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
    
    print("Done! Fitted shirt saved to:", output_file)
    print("\nTo use:")
    print("1. Update the product in database:")
    print("   UPDATE products SET model3d_url = '/uploads/models/shirt_fitted.obj' WHERE name = 'Classic White Shirt';")
    print("2. Refresh the Virtual Try-On page")

if __name__ == "__main__":
    fix_shirt_obj()

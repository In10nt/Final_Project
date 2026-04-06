"""
Check dimensions of 3D models
"""

def check_obj_dimensions(filename):
    print(f"\n=== Checking {filename} ===")
    
    vertices = []
    
    with open(filename, 'r') as f:
        for line in f:
            if line.startswith('v '):
                parts = line.strip().split()
                x, y, z = float(parts[1]), float(parts[2]), float(parts[3])
                vertices.append([x, y, z])
    
    if not vertices:
        print("No vertices found!")
        return
    
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
    
    print(f"Vertices: {len(vertices)}")
    print(f"Size: X={size_x:.2f}, Y={size_y:.2f}, Z={size_z:.2f}")
    print(f"Center: X={center_x:.2f}, Y={center_y:.2f}, Z={center_z:.2f}")
    print(f"X range: {min_x:.2f} to {max_x:.2f}")
    print(f"Y range: {min_y:.2f} to {max_y:.2f}")
    print(f"Z range: {min_z:.2f} to {max_z:.2f}")

if __name__ == "__main__":
    check_obj_dimensions("src/main/resources/static/uploads/models/shirt.obj")
    check_obj_dimensions("src/main/resources/static/uploads/models/pant.obj")
    check_obj_dimensions("src/main/resources/static/uploads/models/shirt_fitted.obj")
    check_obj_dimensions("src/main/resources/static/uploads/models/ScaleReferenceDummy.obj")

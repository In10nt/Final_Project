"""
Script to fix OBJ file orientation for ALL models
Rotates all OBJ files 90 degrees to stand upright
"""

import os
import glob

def rotate_obj_file(input_file, output_file):
    """Rotate OBJ file 90 degrees around X axis"""
    
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    with open(output_file, 'w', encoding='utf-8') as f:
        for line in lines:
            if line.startswith('v '):  # Vertex line
                parts = line.split()
                if len(parts) >= 4:
                    x = float(parts[1])
                    y = float(parts[2])
                    z = float(parts[3])
                    
                    # Rotate 90 degrees around X axis (different direction)
                    # New coordinates: x' = x, y' = z, z' = -y
                    new_x = x
                    new_y = z
                    new_z = -y
                    
                    f.write(f'v {new_x} {new_y} {new_z}\n')
                else:
                    f.write(line)
            else:
                f.write(line)
    
    print(f'Fixed: {os.path.basename(input_file)}')

# Fix ALL OBJ files in the models directory
models_dir = 'src/main/resources/static/uploads/models/'

# Find all OBJ files
obj_files = glob.glob(models_dir + '*.obj')

print(f'Found {len(obj_files)} OBJ files to fix:\n')

for obj_file in obj_files:
    # Skip already fixed files
    if '_fixed' in obj_file:
        continue
    
    # Create output filename
    base_name = os.path.splitext(obj_file)[0]
    output_file = base_name + '_fixed.obj'
    
    try:
        rotate_obj_file(obj_file, output_file)
    except Exception as e:
        print(f'Error fixing {obj_file}: {e}')

print(f'\n✓ All models fixed! Fixed files saved with "_fixed" suffix')
print('\nFixed files:')
fixed_files = glob.glob(models_dir + '*_fixed.obj')
for f in fixed_files:
    print(f'  - {os.path.basename(f)}')


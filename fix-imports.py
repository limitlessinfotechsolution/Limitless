import os
import re
from pathlib import Path

# Root directory
root_dir = Path('.')

# Pattern to match
pattern = r"from ['\"]\.\.\/\.\.\/\.\.\/src\/"
replacement = r"from '@/"

# Counter
fixed_count = 0

# Walk through app directory
for file_path in root_dir.glob('app/**/*.tsx'):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the pattern
        new_content = re.sub(pattern, replacement, content)
        
        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✓ Fixed: {file_path}")
            fixed_count += 1
        
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")

# Also check .ts files
for file_path in root_dir.glob('app/**/*.ts'):
    if file_path.name.endswith('.test.ts'):
        continue  # Skip test files
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the pattern
        new_content = re.sub(pattern, replacement, content)
        
        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✓ Fixed: {file_path}")
            fixed_count += 1
        
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")

print(f"\nDone! Fixed {fixed_count} files.")

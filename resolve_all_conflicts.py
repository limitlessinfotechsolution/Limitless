import os
import re
from pathlib import Path

# Files with merge conflicts
conflict_files = [
    'app/admin/backup/page.tsx',
    'app/client-portal/page.tsx'
]

# Pattern to match merge conflict markers
pattern = r'<<<<<<< Updated upstream\r?\n.*?\r?\n=======\r?\n(.*?)\r?\n>>>>>>> Stashed changes'

resolved_count = 0

for file_path in conflict_files:
    if os.path.exists(file_path):
        print(f"Resolving conflicts in {file_path}...")
        
        # Read the file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count conflicts before
        conflicts_before = len(re.findall(r'<<<<<<< Updated upstream', content))
        
        # Remove conflict markers and keep the "Stashed changes" version
        resolved = re.sub(pattern, r'\1', content, flags=re.DOTALL)
        
        # Count conflicts after
        conflicts_after = len(re.findall(r'<<<<<<< Updated upstream', resolved))
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(resolved)
        
        conflicts_resolved = conflicts_before - conflicts_after
        print(f"  ✓ Resolved {conflicts_resolved} conflict(s)")
        resolved_count += conflicts_resolved
    else:
        print(f"  ✗ File not found: {file_path}")

print(f"\nTotal conflicts resolved: {resolved_count}")

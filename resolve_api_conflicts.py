import re

# Read the file
with open('app/api/pages/[id]/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove conflict markers and keep the "Stashed changes" version
pattern = r'<<<<<<< Updated upstream\r?\n.*?\r?\n=======\r?\n(.*?)\r?\n>>>>>>> Stashed changes'
resolved = re.sub(pattern, r'\1', content, flags=re.DOTALL)

# Write back
with open('app/api/pages/[id]/route.ts', 'w', encoding='utf-8') as f:
    f.write(resolved)

print("Merge conflicts in API route resolved!")

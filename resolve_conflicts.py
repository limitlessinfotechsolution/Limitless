import re

# Read the file
with open('app/admin/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove conflict markers and keep the "Stashed changes" version
# Pattern: <<<<<<< Updated upstream\n...content...\n=======\n...keep this...\n>>>>>>> Stashed changes
pattern = r'<<<<<<< Updated upstream\r?\n.*?\r?\n=======\r?\n(.*?)\r?\n>>>>>>> Stashed changes'
resolved = re.sub(pattern, r'\1', content, flags=re.DOTALL)

# Write back
with open('app/admin/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(resolved)

print("Merge conflicts resolved successfully!")

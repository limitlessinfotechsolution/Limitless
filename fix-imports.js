// Script to fix all relative imports in the app directory
const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/enterprise/team/page.tsx',
  'app/enterprise/reporting/page.tsx',
  'app/enterprise/profile/page.tsx',
  'app/enterprise/pricing/page.tsx',
  'app/enterprise/dashboard/page.tsx',
  'app/enterprise/chat/page.tsx',
  'app/enterprise/calendar/page.tsx',
  'app/enterprise/analytics/page.tsx',
  'app/blog/[id]/page.tsx',
  'app/admin/settings/page.tsx',
  'app/admin/roles/page.tsx',
  'app/admin/projects/page.tsx',
  'app/admin/mail/page.tsx',
];

const rootDir = process.cwd();

filesToFix.forEach(file => {
  const filePath = path.join(rootDir, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all instances of '../../../src/' with '@/'
    const updatedContent = content.replace(/from ['"]\.\.\/\.\.\/\.\.\/src\//g, "from '@/");
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✓ Fixed: ${file}`);
    } else {
      console.log(`- Skipped (no changes): ${file}`);
    }
  } else {
    console.log(`✗ Not found: ${file}`);
  }
});

console.log('\nDone!');

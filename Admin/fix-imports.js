const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix relative paths to aliases
      content = content.replace(/from\s+["']\.\.\/\.\.\/components\/([^"']+)["']/g, 'from "@/components/$1"');
      content = content.replace(/from\s+["']\.\.\/\.\.\/services\/([^"']+)["']/g, 'from "@/services/$1"');
      content = content.replace(/from\s+["']\.\.\/\.\.\/store\/([^"']+)["']/g, 'from "@/store/$1"');
      content = content.replace(/from\s+["']\.\.\/\.\.\/types\/([^"']+)["']/g, 'from "@/types/$1"');
      content = content.replace(/from\s+["']\.\.\/\.\.\/utils\/([^"']+)["']/g, 'from "@/utils/$1"');
      
      content = content.replace(/from\s+["']\.\.\/components\/([^"']+)["']/g, 'from "@/components/$1"');
      content = content.replace(/from\s+["']\.\.\/services\/([^"']+)["']/g, 'from "@/services/$1"');
      content = content.replace(/from\s+["']\.\.\/store\/([^"']+)["']/g, 'from "@/store/$1"');
      content = content.replace(/from\s+["']\.\.\/types\/([^"']+)["']/g, 'from "@/types/$1"');
      content = content.replace(/from\s+["']\.\.\/utils\/([^"']+)["']/g, 'from "@/utils/$1"');

      // Fix Sidebar import in layout.tsx
      if (file === 'layout.tsx') {
        content = content.replace(/from "\.\/Sidebar"/g, 'from "@/components/Sidebar"');
        content = content.replace(/from "\.\/Topbar"/g, 'from "@/components/Topbar"');
      }

      // Remove dummyProjects import
      content = content.replace(/,\s*dummyProjects\s*/g, '');
      content = content.replace(/import\s*{\s*dummyProjects\s*}\s*from\s+["'][^"']+["'];?/g, '');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(process.cwd(), 'app'));
console.log("Fixed imports in app/");

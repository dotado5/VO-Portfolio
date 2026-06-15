const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../Old-Admin/src');
const destAppDir = path.resolve(__dirname, 'app');
const destComponentsDir = path.resolve(__dirname, 'components');

function transformAndSave(srcPath, destPath, isLayout = false) {
  if (!fs.existsSync(srcPath)) {
    console.error(`File not found: ${srcPath}`);
    return;
  }
  let content = fs.readFileSync(srcPath, 'utf8');
  content = `"use client";\n\n` + content;
  
  // Replace react-router-dom imports
  content = content.replace(/import\s+{([^}]*)}\s+from\s+["']react-router-dom["']/g, (match, imports) => {
    let newImports = [];
    if (imports.includes('useNavigate')) newImports.push('import { useRouter } from "next/navigation";');
    if (imports.includes('useLocation')) newImports.push('import { usePathname } from "next/navigation";');
    if (imports.includes('Link') || imports.includes('NavLink')) newImports.push('import Link from "next/link";');
    return newImports.join('\n');
  });
  
  // Replace Navigate usage
  content = content.replace(/useNavigate\(\)/g, 'useRouter()');
  // Replace useLocation
  content = content.replace(/useLocation\(\)/g, 'usePathname()');
  // Replace location.pathname
  content = content.replace(/location\.pathname/g, 'pathname');
  // Replace NavLink with Link
  content = content.replace(/<NavLink/g, '<Link');
  content = content.replace(/<\/NavLink>/g, '</Link>');
  // Replace the 'to' prop in Link/NavLink with 'href' for Link
  content = content.replace(/to=/g, 'href=');
  
  // Replace relative component imports with @/
  content = content.replace(/from\s+["']\.\.\/components\/([^"']+)["']/g, 'from "@/components/$1"');
  content = content.replace(/from\s+["']\.\/components\/([^"']+)["']/g, 'from "@/components/$1"');
  content = content.replace(/from\s+["']\.\.\/store\/([^"']+)["']/g, 'from "@/store/$1"');
  content = content.replace(/from\s+["']\.\.\/api\/([^"']+)["']/g, 'from "@/api/$1"');
  content = content.replace(/from\s+["']\.\.\/lib\/([^"']+)["']/g, 'from "@/utils/supabase/client"');

  if (isLayout) {
     content = content.replace(/<Outlet \/>/g, '{children}');
     content = content.replace(/AdminLayout\(\)/g, 'AdminLayout({ children }: { children: React.ReactNode })');
  }

  // Ensure directory exists
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, content);
  console.log(`Saved ${destPath}`);
}

// 1. Pages
transformAndSave(path.join(srcDir, 'pages', 'Login.tsx'), path.join(destAppDir, 'login', 'page.tsx'));
transformAndSave(path.join(srcDir, 'pages', 'Signup.tsx'), path.join(destAppDir, 'signup', 'page.tsx'));
transformAndSave(path.join(srcDir, 'pages', 'Overview.tsx'), path.join(destAppDir, '(dashboard)', 'overview', 'page.tsx'));
transformAndSave(path.join(srcDir, 'pages', 'Analytics.tsx'), path.join(destAppDir, '(dashboard)', 'analytics', 'page.tsx'));
transformAndSave(path.join(srcDir, 'pages', 'Dashboard.tsx'), path.join(destAppDir, '(dashboard)', 'dashboard', 'page.tsx'));

// 2. Layout
transformAndSave(path.join(srcDir, 'components', 'AdminLayout.tsx'), path.join(destAppDir, '(dashboard)', 'layout.tsx'), true);

console.log("Migration complete.");

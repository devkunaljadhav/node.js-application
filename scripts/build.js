/**
 * Cross-platform production build script for nodejs-cicd-app
 * Creates dist/ folder and copies server.js, package.json, src/, public/
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('📦 Building project artifacts into dist/...');

// 1. Clean and create dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Files & folders to copy to dist
const itemsToCopy = [
  'server.js',
  'package.json',
  'package-lock.json',
  'src',
  'public'
];

for (const item of itemsToCopy) {
  const srcPath = path.join(rootDir, item);
  const destPath = path.join(distDir, item);

  if (fs.existsSync(srcPath)) {
    fs.cpSync(srcPath, destPath, { recursive: true });
    console.log(`  ✔ Copied ${item} -> dist/${item}`);
  }
}

console.log('✨ Production build complete! Artifacts ready in dist/ directory.');

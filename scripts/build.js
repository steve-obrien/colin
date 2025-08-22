const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const srcPaintingsDir = path.join(projectRoot, 'paintings');
const distPaintingsDir = path.join(distDir, 'paintings');

function removeDirectoryIfExists(directoryPath) {
  try {
    fs.rmSync(directoryPath, { recursive: true, force: true });
  } catch (error) {
    // Ignore if it doesn't exist
  }
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function copyIfExists(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

function copyDirectoryRecursive(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

function generateImagesManifest(inputDir, outputFile) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const images = fs
    .readdirSync(inputDir)
    .filter((fileName) => imageExtensions.includes(path.extname(fileName).toLowerCase()))
    .map((fileName) => `${fileName}`);

  fs.writeFileSync(outputFile, JSON.stringify(images, null, 2));
  console.log(`✅ Generated ${images.length} image entries at ${path.relative(projectRoot, outputFile)}`);
}

function build() {
  console.log('🛠️  Building site to dist/ ...');

  // Clean dist
  removeDirectoryIfExists(distDir);
  ensureDirectory(distDir);

  // Copy paintings directory
  if (!fs.existsSync(srcPaintingsDir)) {
    throw new Error('paintings directory not found');
  }
  copyDirectoryRecursive(srcPaintingsDir, distPaintingsDir);

  // Copy top-level assets
  copyIfExists(path.join(projectRoot, 'index.html'), path.join(distDir, 'index.html'));
  copyIfExists(path.join(projectRoot, 'profile.png'), path.join(distDir, 'profile.png'));
  copyIfExists(path.join(projectRoot, 'CNAME'), path.join(distDir, 'CNAME'));

  // Generate images manifest inside dist/paintings
  ensureDirectory(distPaintingsDir);
  generateImagesManifest(distPaintingsDir, path.join(distPaintingsDir, 'images.json'));

  console.log('✅ Build complete.');
}

build();



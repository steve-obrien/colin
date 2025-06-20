const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../paintings');
const OUTPUT_FILE = path.join(__dirname, '../public/data/images.json');

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Ensure the output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const images = fs.readdirSync(IMAGES_DIR)
  .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
  .map(file => `${file}`);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(images, null, 2));
console.log(`✅ Generated ${images.length} image entries in images.json`);
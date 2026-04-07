// Simple script to create placeholder PWA icons
// Run with: node generate-icons.js

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 167, 180, 192, 384, 512];

// Create SVG icon template
const createSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000" rx="${size * 0.1}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" 
        fill="white" text-anchor="middle" dominant-baseline="central" font-weight="bold">B</text>
</svg>`;

// Generate icons
sizes.forEach(size => {
  const svg = createSVG(size);
  const filename = `public/icon-${size}.png`;
  
  // For now, just create SVG files (you'll need to convert to PNG)
  fs.writeFileSync(`public/icon-${size}.svg`, svg.trim());
  console.log(`Created icon-${size}.svg`);
});

console.log('\nTo convert SVG to PNG, use an online converter or ImageMagick:');
console.log('convert icon-192.svg icon-192.png');

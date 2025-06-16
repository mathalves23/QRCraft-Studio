// Script para gerar ícones PWA
const fs = require('fs');
const { createCanvas } = require('canvas');

function generatePWAIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#3b82f6');
  gradient.addColorStop(1, '#1d4ed8');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // QR Code pattern simulation
  const blockSize = Math.floor(size / 8);
  const margin = blockSize;
  
  ctx.fillStyle = '#ffffff';
  
  // Corner squares (QR Code finder patterns)
  const cornerSize = blockSize * 3;
  
  // Top-left corner
  ctx.fillRect(margin, margin, cornerSize, cornerSize);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(margin + blockSize, margin + blockSize, blockSize, blockSize);
  
  // Top-right corner
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(size - margin - cornerSize, margin, cornerSize, cornerSize);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(size - margin - cornerSize + blockSize, margin + blockSize, blockSize, blockSize);
  
  // Bottom-left corner
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(margin, size - margin - cornerSize, cornerSize, cornerSize);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(margin + blockSize, size - margin - cornerSize + blockSize, blockSize, blockSize);
  
  // Center pattern
  ctx.fillStyle = '#ffffff';
  const centerX = size / 2 - blockSize / 2;
  const centerY = size / 2 - blockSize / 2;
  ctx.fillRect(centerX, centerY, blockSize, blockSize);
  
  // Random pattern blocks
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 12; i++) {
    const x = Math.floor(Math.random() * 6) * blockSize + margin;
    const y = Math.floor(Math.random() * 6) * blockSize + margin;
    if (x > margin + cornerSize || y > margin + cornerSize) {
      ctx.fillRect(x, y, blockSize * 0.7, blockSize * 0.7);
    }
  }
  
  // Save the canvas as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/${filename}`, buffer);
  console.log(`✅ Generated ${filename} (${size}x${size})`);
}

// Generate PWA icons
try {
  generatePWAIcon(192, 'pwa-192x192.png');
  generatePWAIcon(512, 'pwa-512x512.png');
  generatePWAIcon(180, 'apple-touch-icon.png');
  console.log('🎉 All PWA icons generated successfully!');
} catch (error) {
  console.error('❌ Error generating icons:', error.message);
  console.log('📝 Creating simple fallback icons instead...');
  
  // Fallback: create simple colored squares
  const canvas = createCanvas(192, 192);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(0, 0, 192, 192);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('QR', 96, 96);
  
  fs.writeFileSync('public/pwa-192x192.png', canvas.toBuffer('image/png'));
  
  // Scale to 512x512
  const canvas512 = createCanvas(512, 512);
  const ctx512 = canvas512.getContext('2d');
  
  ctx512.fillStyle = '#3b82f6';
  ctx512.fillRect(0, 0, 512, 512);
  
  ctx512.fillStyle = '#ffffff';
  ctx512.font = 'bold 128px Arial';
  ctx512.textAlign = 'center';
  ctx512.textBaseline = 'middle';
  ctx512.fillText('QR', 256, 256);
  
  fs.writeFileSync('public/pwa-512x512.png', canvas512.toBuffer('image/png'));
  fs.writeFileSync('public/apple-touch-icon.png', canvas512.toBuffer('image/png'));
  
  console.log('✅ Fallback icons created!');
} 
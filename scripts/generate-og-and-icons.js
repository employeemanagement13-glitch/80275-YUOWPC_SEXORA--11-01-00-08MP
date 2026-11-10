const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function main() {
  const root = path.resolve(__dirname, '..');
  const fullLogoPath = path.join(root, 'public', 'Aroxes Logo.png');
  const iconPath = path.join(root, 'public', 'aroxes-icon.png');

  // -------------------------------------------------------------
  // 0. Extract Clean Logo Icon from "Aroxes Logo.png" if not exists
  // -------------------------------------------------------------
  const raw = await sharp(fullLogoPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: fullW, height: fullH, channels } = raw.info;
  const data = raw.data;

  // Mask out the dark text pixels (text starts around x >= 1675)
  const iconBuffer = Buffer.from(data);
  for (let x = 0; x < fullW; x++) {
    for (let y = 0; y < fullH; y++) {
      const idx = (y * fullW + x) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      // Dark text is r < 60 && g < 60 && b < 60
      if (x > 1650 && r < 60 && g < 60 && b < 60) {
        iconBuffer[idx + 3] = 0;
      }
      if (x > 1735) {
        iconBuffer[idx + 3] = 0;
      }
    }
  }

  // Save the trimmed icon
  await sharp(iconBuffer, { raw: { width: fullW, height: fullH, channels } })
    .trim()
    .png()
    .toFile(iconPath);

  const iconMeta = await sharp(iconPath).metadata();
  console.log(`✓ Clean logo icon extracted: ${iconMeta.width}x${iconMeta.height}`);

  // Create a balanced square version (with comfortable padding) for favicons & app icons
  const maxDim = Math.max(iconMeta.width, iconMeta.height);
  const paddedSize = Math.round(maxDim * 1.25);
  const squareIconBuffer = await sharp(iconPath)
    .extend({
      top: Math.round((paddedSize - iconMeta.height) / 2),
      bottom: Math.round((paddedSize - iconMeta.height) / 2),
      left: Math.round((paddedSize - iconMeta.width) / 2),
      right: Math.round((paddedSize - iconMeta.width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  // Also save a dedicated square icon image for WhatsApp / square avatar previews
  await sharp(squareIconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(root, 'public', 'aroxes-icon-square.png'));

  // -------------------------------------------------------------
  // 1. Generate Favicons (Google Search requirements: 48x48+, SVG/PNG)
  // -------------------------------------------------------------
  const sizes = [16, 32, 48, 96, 180, 192, 512];
  for (const s of sizes) {
    await sharp(squareIconBuffer)
      .resize(s, s, { fit: 'contain' })
      .png()
      .toFile(path.join(root, 'public', `icon-${s}.png`));
  }

  // Generate Google-specific 48x48 and 96x96
  await sharp(squareIconBuffer)
    .resize(48, 48, { fit: 'contain' })
    .png()
    .toFile(path.join(root, 'public', 'favicon-48x48.png'));

  // Next.js App Router icons
  await sharp(squareIconBuffer)
    .resize(512, 512, { fit: 'contain' })
    .png()
    .toFile(path.join(root, 'app', 'icon.png'));

  await sharp(squareIconBuffer)
    .resize(180, 180, { fit: 'contain' })
    .png()
    .toFile(path.join(root, 'app', 'apple-icon.png'));

  await sharp(squareIconBuffer)
    .resize(180, 180, { fit: 'contain' })
    .png()
    .toFile(path.join(root, 'public', 'apple-touch-icon.png'));

  // Build standard multi-resolution ICO file (16, 32, 48 PNG frames)
  const icoSizes = [16, 32, 48];
  const pngBuffers = [];
  for (const s of icoSizes) {
    const buf = await sharp(squareIconBuffer)
      .resize(s, s, { fit: 'contain' })
      .png()
      .toBuffer();
    pngBuffers.push({ size: s, buffer: buf });
  }

  const count = pngBuffers.length;
  const headerLen = 6 + count * 16;
  let offset = headerLen;
  const entries = [];

  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size === 256 ? 0 : item.size, 0);
    entry.writeUInt8(item.size === 256 ? 0 : item.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += item.buffer.length;
  }

  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0);
  iconDir.writeUInt16LE(1, 2);
  iconDir.writeUInt16LE(count, 4);

  const icoBuffer = Buffer.concat([iconDir, ...entries, ...pngBuffers.map(p => p.buffer)]);
  fs.writeFileSync(path.join(root, 'public', 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(root, 'app', 'favicon.ico'), icoBuffer);
  console.log('✓ Favicons and multi-resolution ICO created.');

  // Also update aeroxes-logo.png to the new logo so backward compatibility is 100% maintained
  await sharp(fullLogoPath).toFile(path.join(root, 'public', 'aeroxes-logo.png'));
  console.log('✓ Synchronized public/aeroxes-logo.png with Aroxes Logo.png');

  // -------------------------------------------------------------
  // 2. Generate 2400x1260 Ultra-HD / Retina 2x Open-Graph & Twitter Image Cards
  // -------------------------------------------------------------
  const width = 2400;
  const height = 1260;

  const whiteLogoPath = path.join(root, 'public', 'Aroxes_Logo_Transparent_White_Text.png');
  
  // Trim the white logo to eliminate transparent padding
  const trimmedWhiteLogoBuf = await sharp(whiteLogoPath)
    .trim()
    .toBuffer({ resolveWithObject: true });

  const whiteMeta = trimmedWhiteLogoBuf.info;
  // Upscale logo boldly (2080px wide on 2400px canvas = ~87% width)
  const targetLogoWidth = 2080;
  const targetLogoHeight = Math.round(targetLogoWidth * (whiteMeta.height / whiteMeta.width));
  const logoLeft = Math.round((width - targetLogoWidth) / 2);
  const logoTop = Math.round((height - targetLogoHeight) / 2);

  const resizedLogoBuf = await sharp(trimmedWhiteLogoBuf.data)
    .resize(targetLogoWidth, targetLogoHeight, {
      kernel: sharp.kernel.lanczos3,
      fit: 'contain',
    })
    .png()
    .toBuffer();

  // Deep dark canvas (#0f1110)
  const ogBuffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 15, g: 17, b: 16, alpha: 1 },
    },
  })
    .composite([
      {
        input: resizedLogoBuf,
        left: logoLeft,
        top: logoTop,
      },
    ])
    .png({ quality: 100, compressionLevel: 8 })
    .toBuffer();

  fs.writeFileSync(path.join(root, 'public', 'og-image.png'), ogBuffer);
  fs.writeFileSync(path.join(root, 'public', 'twitter-image.png'), ogBuffer);
  fs.writeFileSync(path.join(root, 'app', 'opengraph-image.png'), ogBuffer);
  fs.writeFileSync(path.join(root, 'app', 'twitter-image.png'), ogBuffer);

  console.log(`✓ Ultra-HD 2x Open Graph (2400x1260, upscaled on #0f1110) created: ${Math.round(ogBuffer.length / 1024)} KB.`);
}

main().catch(console.error);

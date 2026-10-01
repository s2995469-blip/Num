// Derives transparent logo variants from the client-supplied logo
// (public/logo/powerhouse-logo-original.png: white artwork on solid black).
// The artwork is monochrome, so luminance maps directly to coverage: the
// variants keep every pixel of the original shape and only swap the ink colour.
// The crop removes a 1px grey screenshot edge on the left side; proportions
// are unchanged (no scaling). Run: node scripts/process-logo.mjs
import sharp from 'sharp';

const SRC = 'public/logo/powerhouse-logo-original.png';
const CROP = { left: 18, top: 13, width: 190, height: 178 };

const { data, info } = await sharp(SRC)
  .extract(CROP)
  .raw()
  .ensureAlpha()
  .toBuffer({ resolveWithObject: true });

async function variant(out, [r, g, b]) {
  const buf = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const lum = data[i * 4];
    buf[i * 4] = r;
    buf[i * 4 + 1] = g;
    buf[i * 4 + 2] = b;
    buf[i * 4 + 3] = lum < 12 ? 0 : lum;
  }
  await sharp(buf, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log('wrote', out);
}

// For dark backgrounds: the original white artwork.
await variant('public/logo/powerhouse-logo-on-dark.png', [247, 244, 237]);
// For light backgrounds: Deep Espresso artwork.
await variant('public/logo/powerhouse-logo-on-light.png', [24, 23, 20]);

// Favicon / app icon: the original artwork on its own black field.
await sharp(SRC)
  .extract({ left: 6, top: 4, width: 214, height: 214 })
  .resize(192, 192, { kernel: 'lanczos3' })
  .png()
  .toFile('app/icon.png');
console.log('wrote app/icon.png');

// Split a tall screenshot into viewable chunks: node scripts/qa/split.mjs file.png [chunkHeight]
import sharp from "sharp";
const [file, ch = "1800"] = process.argv.slice(2);
const meta = await sharp(file).metadata();
const h = Number(ch);
for (let i = 0, y = 0; y < meta.height; i++, y += h) {
  const out = file.replace(/\.png$/, `.part${i}.png`);
  await sharp(file).extract({ left: 0, top: y, width: meta.width, height: Math.min(h, meta.height - y) }).toFile(out);
  console.log(out);
}

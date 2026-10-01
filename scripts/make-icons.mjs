// Generates the favicon, app icons and link-preview (Open Graph / Twitter) images from the
// static die image. Re-run after you regenerate public/images/die-static.webp:
//
//   node scripts/make-icons.mjs
//
// Outputs (Next picks these up from src/app automatically):
//   favicon.ico (16/32/48), icon.png (512), apple-icon.png (180),
//   opengraph-image.png + twitter-image.png (1200x630)
// `sharp` ships with Next.js, so nothing extra is installed.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC = "public/images/die-static.webp";
const OUT = "src/app";
const PAGE_GREY = "#ececec"; // close to the site's light grey background

// ---- crop tightly around the die (the source image has lots of transparent margin) ----
const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
let x0 = info.width,
  y0 = info.height,
  x1 = -1,
  y1 = -1;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 16) {
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    }
  }
}
const die = await sharp(SRC)
  .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
  .png()
  .toBuffer();
const dieMeta = await sharp(die).metadata();

// The die fitted inside a canvas, centred, with `pad` (fraction of the canvas) of space around it.
async function onCanvas(width, height, pad, background) {
  const box = {
    width: Math.round(width * (1 - 2 * pad)),
    height: Math.round(height * (1 - 2 * pad)),
  };
  const fitted = await sharp(die)
    .resize({ ...box, fit: "inside", kernel: "lanczos3" })
    .png()
    .toBuffer();
  const m = await sharp(fitted).metadata();
  return sharp({ create: { width, height, channels: 4, background } })
    .composite([
      {
        input: fitted,
        left: Math.round((width - m.width) / 2),
        top: Math.round((height - m.height) / 2),
      },
    ])
    .png({ compressionLevel: 9 });
}
const clear = { r: 0, g: 0, b: 0, alpha: 0 };

// ---- favicon.ico: PNG-compressed entries (supported by every current browser) ----
const sizes = [16, 32, 48];
const pngs = await Promise.all(
  sizes.map(async (s) => (await onCanvas(s, s, 0.03, clear)).toBuffer()),
);
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const o = 6 + 16 * i;
  header.writeUInt8(s, o);
  header.writeUInt8(s, o + 1);
  header.writeUInt8(0, o + 2);
  header.writeUInt8(0, o + 3);
  header.writeUInt16LE(1, o + 4);
  header.writeUInt16LE(32, o + 6);
  header.writeUInt32LE(pngs[i].length, o + 8);
  header.writeUInt32LE(offset, o + 12);
  offset += pngs[i].length;
});
writeFileSync(`${OUT}/favicon.ico`, Buffer.concat([header, ...pngs]));

// ---- icon.png (transparent) and apple-icon.png (iOS fills transparency with black, so give it a background) ----
await (await onCanvas(512, 512, 0.05, clear)).toFile(`${OUT}/icon.png`);
await (
  await onCanvas(180, 180, 0.12, PAGE_GREY)
).toFile(`${OUT}/apple-icon.png`);

// ---- link preview: the die on the site's grey gradient, 1200x630 ----
const W = 1200,
  H = 630;
const gradient = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="#d7d7d7"/><stop offset="0.7" stop-color="#f5f5f5"/><stop offset="1" stop-color="#f5f5f5"/></linearGradient></defs>` +
    `<rect width="${W}" height="${H}" fill="url(#g)"/></svg>`,
);
const dieH = 470; // die height on the card
const dieW = Math.round((dieH * dieMeta.width) / dieMeta.height);
const dieCard = await sharp(die)
  .resize({ width: dieW, height: dieH, kernel: "lanczos3" })
  .png()
  .toBuffer();
const card = await sharp(gradient)
  .composite([
    {
      input: dieCard,
      left: Math.round((W - dieW) / 2),
      top: Math.round((H - dieH) / 2),
    },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync(`${OUT}/opengraph-image.png`, card);
writeFileSync(`${OUT}/twitter-image.png`, card);

console.log(
  `die crop ${dieMeta.width}x${dieMeta.height}; wrote favicon.ico, icon.png, apple-icon.png, opengraph-image.png, twitter-image.png`,
);

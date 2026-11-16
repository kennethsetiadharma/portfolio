// Second step of recutting the hero reel (see CLAUDE.md, "Recutting the hero reel").
// Takes the recording made by scripts/make-reel.playwright.js in public/_raw/ and
// installs it: reel.mp4 as is, and its first frame as a 1280px-wide WebP poster.
// Run from the project root:  node scripts/finish-reel.mjs
import { copyFile, stat } from "node:fs/promises";
import sharp from "sharp";

const RAW = "public/_raw";
const OUT = "public/videos";

await copyFile(`${RAW}/reel.mp4`, `${OUT}/reel.mp4`);
const poster = await sharp(`${RAW}/reel-poster.png`)
  .resize(1280)
  .webp({ quality: 72 })
  .toFile(`${OUT}/reel-poster.webp`);

const reel = await stat(`${OUT}/reel.mp4`);
console.log(`reel.mp4 ${(reel.size / 1e6).toFixed(1)} MB, reel-poster.webp ${Math.round(poster.size / 1e3)} KB`);

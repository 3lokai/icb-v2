/**
 * Converts public/images/discovery/*.{png,jpg,jpeg,webp} to AVIF (resized + compressed).
 * Run: node scripts/optimize-discovery-images.mjs
 */
import { readdir, stat } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, "..", "public", "images", "discovery");

/** Card grid thumbnails: enough for ~480px display @2x */
const MAX_WIDTH = 960;
const AVIF_QUALITY = 68;
const AVIF_EFFORT = 6;

const files = await readdir(dir);
const sources = files.filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

if (sources.length === 0) {
  console.log("No PNG/JPEG/WebP files in", dir);
  process.exit(0);
}

for (const f of sources) {
  const base = f.replace(/\.(png|jpe?g|webp)$/i, "");
  const inputPath = join(dir, f);
  const outputPath = join(dir, `${base}.avif`);

  const meta = await sharp(inputPath).metadata();
  let pipeline = sharp(inputPath);
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, {
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  await pipeline.avif({ quality: AVIF_QUALITY, effort: AVIF_EFFORT }).toFile(outputPath);

  const inBytes = (await stat(inputPath)).size;
  const outBytes = (await stat(outputPath)).size;
  console.log(
    `${f} → ${base}.avif  ${Math.round(inBytes / 1024)}KB → ${Math.round(outBytes / 1024)}KB (${Math.round((1 - outBytes / inBytes) * 100)}% smaller)`
  );
}

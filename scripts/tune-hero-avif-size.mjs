/**
 * Re-encode hero AVIFs to target ~100KB via quality (and mild downscale if needed).
 * Run: node scripts/tune-hero-avif-size.mjs
 * Discovery JPG heroes → AVIF: node scripts/tune-hero-avif-size.mjs --discovery
 * Curation JPG → AVIF: node scripts/tune-hero-avif-size.mjs --curations
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const TARGET = 100 * 1024;
const MAX_OK = 110 * 1024; // allow slight overshoot
const DISCOVERY = process.argv.includes("--discovery");
const CURATIONS = process.argv.includes("--curations");
const IMAGES_DIR = DISCOVERY
  ? path.join(process.cwd(), "public", "images", "discovery")
  : CURATIONS
    ? path.join(process.cwd(), "public", "curations")
    : path.join(process.cwd(), "public", "images");

async function toAvif(input, quality, effort) {
  return input.avif({ quality, effort, chromaSubsampling: "4:2:0" }).toBuffer();
}

/** Pick quality in 1..100 with minimum |bytes - TARGET| for this pipeline. */
async function bestQualityForPipeline(pipeline) {
  let best = { q: 50, buf: null, diff: Infinity };
  for (let q = 1; q <= 100; q += 5) {
    const buf = await toAvif(pipeline.clone(), q, 4);
    const diff = Math.abs(buf.length - TARGET);
    if (diff < best.diff) {
      best = { q, buf, diff, size: buf.length };
    }
  }
  const q0 = Math.max(1, best.q - 4);
  const q1 = Math.min(100, best.q + 4);
  for (let q = q0; q <= q1; q += 1) {
    const buf = await toAvif(pipeline.clone(), q, 4);
    const diff = Math.abs(buf.length - TARGET);
    if (diff < best.diff) {
      best = { q, buf, diff, size: buf.length };
    }
  }
  const finalBuf = await toAvif(pipeline.clone(), best.q, 7);
  return { q: best.q, buf: finalBuf, size: finalBuf.length };
}

async function processFile(filename, outputFilename) {
  const filePath = path.join(IMAGES_DIR, filename);
  const outName = outputFilename ?? filename;
  const outPath = path.join(IMAGES_DIR, outName);
  const before = (await fs.stat(filePath)).size;
  const meta = await sharp(filePath).metadata();

  let pipeline = sharp(filePath);
  let w = meta.width ?? 1200;

  // If even q=1 is huge, step down width until we can get near target.
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const { q, buf, size } = await bestQualityForPipeline(pipeline);
    if (size <= MAX_OK) {
      const tmp = `${outPath}.tmp`;
      await fs.writeFile(tmp, buf);
      await fs.rename(tmp, outPath);
      console.log(
        `${filename} → ${outName}: ${(before / 1024).toFixed(1)}KB → ${(size / 1024).toFixed(1)}KB (q=${q}, ${w}×${meta.height})`,
      );
      return;
    }
    w = Math.max(640, Math.round(w * 0.9));
    pipeline = sharp(filePath).resize(w, null, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Last resort: write best attempt at smallest width
  const { q, buf, size } = await bestQualityForPipeline(
    sharp(filePath).resize(640, null, { fit: "inside", withoutEnlargement: true }),
  );
  const tmp = `${outPath}.tmp`;
  await fs.writeFile(tmp, buf);
  await fs.rename(tmp, outPath);
  console.log(
    `${filename} → ${outName}: ${(before / 1024).toFixed(1)}KB → ${(size / 1024).toFixed(1)}KB (q=${q}, forced ≤640px)`,
  );
}

const files = DISCOVERY
  ? (await fs.readdir(IMAGES_DIR))
      .filter((f) => /-hero\.jpe?g$/i.test(f))
      .sort()
  : CURATIONS
    ? (await fs.readdir(IMAGES_DIR))
        .filter((f) => /\.jpe?g$/i.test(f))
        .sort()
    : (await fs.readdir(IMAGES_DIR))
        .filter((f) => f.startsWith("hero-") && f.endsWith(".avif"))
        .sort();

for (const f of files) {
  const outAvif =
    DISCOVERY || CURATIONS ? f.replace(/\.jpe?g$/i, ".avif") : undefined;
  await processFile(f, outAvif);
}

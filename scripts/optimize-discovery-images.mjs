/**
 * Converts raster images under public/images/<folder> (recursively) to AVIF.
 * Run: node scripts/optimize-discovery-images.mjs
 * Run: node scripts/optimize-discovery-images.mjs about contact
 * Run: node scripts/optimize-discovery-images.mjs --files brewer_mechanism.png
 * With no args, defaults to "discovery" only (includes nested dirs e.g. discovery/brew-methods).
 */
import { readdir, stat } from "fs/promises";
import { join, dirname, relative, basename } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesRoot = join(__dirname, "..", "public", "images");
const argv = process.argv.slice(2);

let roots;
let explicitFiles = null;
if (argv[0] === "--files") {
  explicitFiles = argv.slice(1).map((p) => join(imagesRoot, p.replace(/\\/g, "/")));
} else if (argv.length > 0) {
  roots = argv.map((name) => join(imagesRoot, name));
} else {
  roots = [join(imagesRoot, "discovery")];
}

/** Card grid thumbnails: enough for ~480px display @2x */
const MAX_WIDTH = 960;
const AVIF_QUALITY = 68;
const AVIF_EFFORT = 6;

async function* walkRasterFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  for (const e of entries) {
    const full = join(root, e.name);
    if (e.isDirectory()) {
      yield* walkRasterFiles(full);
    } else if (/\.(png|jpe?g|webp)$/i.test(e.name)) {
      yield full;
    }
  }
}

const sources = [];
if (explicitFiles) {
  for (const p of explicitFiles) {
    if (/\.(png|jpe?g|webp)$/i.test(p)) sources.push(p);
  }
} else {
  for (const dir of roots) {
    for await (const p of walkRasterFiles(dir)) {
      sources.push(p);
    }
  }
}

if (sources.length === 0) {
  console.log(
    "No matching raster files",
    explicitFiles ? explicitFiles.join(", ") : roots.join(", ")
  );
  process.exit(0);
}

for (const inputPath of sources) {
  const f = basename(inputPath);
  const base = f.replace(/\.(png|jpe?g|webp)$/i, "");
  const outDir = dirname(inputPath);
  const outputPath = join(outDir, `${base}.avif`);
  const rel = relative(imagesRoot, inputPath).replace(/\\/g, "/");

  const inStat = await stat(inputPath);
  if (inStat.size === 0) {
    console.warn(`Skip (empty file): ${rel}`);
    continue;
  }

  let meta;
  try {
    meta = await sharp(inputPath).metadata();
  } catch (err) {
    console.warn(`Skip (unreadable): ${rel}`, err.message ?? err);
    continue;
  }
  let pipeline = sharp(inputPath);
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, {
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  await pipeline.avif({ quality: AVIF_QUALITY, effort: AVIF_EFFORT }).toFile(outputPath);

  const inBytes = inStat.size;
  const outBytes = (await stat(outputPath)).size;
  console.log(
    `${rel} → ${base}.avif  ${Math.round(inBytes / 1024)}KB → ${Math.round(outBytes / 1024)}KB (${Math.round((1 - outBytes / inBytes) * 100)}% smaller)`
  );
}

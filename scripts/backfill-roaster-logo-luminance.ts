/**
 * Backfills roasters.logo_is_light.
 *
 * Replaces the per-mount canvas rasterisation in useImageColor with a one-off
 * server-side sample. The algorithm below is a deliberate port of that hook, so
 * the stored value matches what the browser used to compute:
 *
 *   - fetch the SAME ImageKit URL the UI requests (roasterLogo preset, w=320)
 *   - scale to 64x64, ignoring aspect ratio (canvas drawImage(img,0,0,64,64) stretches)
 *   - skip pixels with alpha < 10
 *   - mean Rec.601 luminance (0.299r + 0.587g + 0.114b)
 *   - light (needs a dark plate) when that mean exceeds 150
 *
 * Logos that 404 or fail to decode are left NULL, which the UI renders as the
 * neutral plate — the same thing the hook did on error.
 *
 * Usage: npx tsx scripts/backfill-roaster-logo-luminance.ts [--dry-run]
 */
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { roasterImagePresets } from "../src/lib/imagekit";

const LUMINANCE_THRESHOLD = 150;
const SAMPLE_SIZE = 64;
const ALPHA_FLOOR = 10;
const CONCURRENCY = 8;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY. Source .env.local first."
  );
  process.exit(1);
}

const dryRun = process.argv.includes("--dry-run");
const supabase = createClient(url, key);

/** Mean luminance over non-transparent pixels, or null if nothing to sample. */
async function sampleIsLight(logoUrl: string): Promise<boolean | null> {
  const res = await fetch(logoUrl, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) {
    return null;
  }
  const input = Buffer.from(await res.arrayBuffer());

  // fit: "fill" == canvas drawImage's stretch-to-box, not a letterboxed resize.
  const { data } = await sharp(input)
    .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let total = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < ALPHA_FLOOR) continue;
    total += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    count++;
  }

  if (count === 0) {
    return null;
  }
  return total / count > LUMINANCE_THRESHOLD;
}

async function main() {
  const { data: roasters, error } = await supabase
    .from("roasters")
    .select("id, slug, name")
    .order("slug");

  if (error) {
    throw error;
  }
  if (!roasters?.length) {
    console.log("No roasters found.");
    return;
  }

  console.log(
    `Sampling ${roasters.length} roaster logos${dryRun ? " (dry run)" : ""}...\n`
  );

  const results: { light: number; dark: number; failed: string[] } = {
    light: 0,
    dark: 0,
    failed: [],
  };
  const warnings: string[] = [];

  // Plain sliding window — 96 rows does not warrant a queue library.
  for (let i = 0; i < roasters.length; i += CONCURRENCY) {
    const batch = roasters.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (r) => {
        const logoUrl = roasterImagePresets.roasterLogo(
          `roasters/${r.slug}-logo`
        );
        let isLight: boolean | null = null;
        try {
          isLight = await sampleIsLight(logoUrl);
        } catch (e) {
          isLight = null;
          warnings.push(`  ! ${r.slug}: ${(e as Error).message}`);
        }

        if (isLight === null) {
          results.failed.push(r.slug);
          return;
        }
        if (isLight) {
          results.light++;
        } else {
          results.dark++;
        }

        if (!dryRun) {
          const { error: upErr } = await supabase
            .from("roasters")
            .update({ logo_is_light: isLight })
            .eq("id", r.id);
          if (upErr) {
            warnings.push(`  ! ${r.slug}: update failed — ${upErr.message}`);
          }
        }
      })
    );
    process.stdout.write(
      `  ${Math.min(i + CONCURRENCY, roasters.length)}/${roasters.length}\r`
    );
  }

  for (const warning of warnings) {
    console.warn(warning);
  }

  console.log(`\n\nlight logos (dark plate): ${results.light}`);
  console.log(`dark logos  (light plate): ${results.dark}`);
  console.log(`unsampled (left NULL):     ${results.failed.length}`);
  if (results.failed.length) {
    console.log(`  ${results.failed.join(", ")}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

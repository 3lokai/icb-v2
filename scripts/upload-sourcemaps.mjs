/**
 * Injects PostHog chunk IDs, uploads the maps, then deletes them so they never ship.
 * Run: node scripts/upload-sourcemaps.mjs   (invoked by `npm run build`)
 *
 * Why this is not a one-line postbuild: on Vercel, the Next.js builder finalizes the
 * deployable output *inside* `next build` (the "Running onBuildComplete from Vercel"
 * step), so anything chained after `next build &&` mutates `.next/static` a second too
 * late — the injected chunk IDs and the map deletion both miss the deployment. The
 * artifacts that actually ship are under `.vercel/output/static`, so prefer that when
 * it exists. Locally `vercel build` copies output *after* the build command instead,
 * where `.next/static` is still the right target, hence the fallback.
 */
import { execFileSync } from "child_process";
import { existsSync, rmSync } from "fs";
import { globSync } from "fs";

const VERCEL_OUT = ".vercel/output/static/_next/static";
const dir = existsSync(VERCEL_OUT) ? VERCEL_OUT : ".next/static";
console.log(
  `sourcemaps: target ${dir}${dir === VERCEL_OUT ? "" : " (no .vercel/output — local build)"}`
);

try {
  execFileSync(
    "posthog-cli",
    [
      "--host",
      "https://eu.posthog.com",
      "--no-fail",
      "sourcemap",
      "process",
      "-d",
      dir,
      "--release-version",
      process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    ],
    { stdio: "inherit" }
  );
} catch (err) {
  // Never fail the deploy over telemetry tooling. The delete below still runs, so a
  // failure here ends with no maps anywhere rather than maps served to the public.
  console.warn(`sourcemaps: upload skipped (${err.message})`);
}

// Sweep both trees: whichever one we injected, the other may still hold copies, and a
// map left in either is a map that can ship.
let deleted = 0;
for (const root of [VERCEL_OUT, ".next/static"]) {
  if (!existsSync(root)) continue;
  for (const f of globSync(`${root}/**/*.js.map`)) {
    rmSync(f);
    deleted++;
  }
}
console.log(`sourcemaps: deleted ${deleted} .map files`);

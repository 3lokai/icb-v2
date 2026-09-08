/**
 * Injects PostHog chunk IDs, uploads the maps, then deletes them so they never ship.
 * Run: node scripts/upload-sourcemaps.mjs   (invoked by `npm run build`)
 *
 * Why this is not a one-line postbuild: on Vercel, the Next.js builder finalizes the
 * deployable output *inside* `next build` (the "Running onBuildComplete from Vercel"
 * step), so anything chained after `next build &&` mutates `.next/static` a second too
 * late — the injected chunk IDs and the map deletion both miss the deployment. The
 * artifacts that actually ship live under the Build Output API dir, which is an
 * absolute /vercel/output on the build container (the repo is checked out at
 * /vercel/path0), and <repo>/.vercel/output for a local `vercel build`.
 */
import { execFileSync } from "child_process";
import { existsSync, globSync, readdirSync, rmSync } from "fs";

// Ordered by specificity: the deployable output first, the build dir last. The last
// entry is the only one a plain `next build` produces.
const CANDIDATES = [
  "/vercel/output/static/_next/static",
  ".vercel/output/static/_next/static",
  ".next/static",
];

const found = CANDIDATES.filter((d) => existsSync(d));
console.log(`sourcemaps: candidates present -> ${found.join(", ") || "none"}`);

if (!found.some((d) => d.includes("/output/"))) {
  // No deployable-output tree. Injecting into .next/static alone is known not to reach
  // the deployment, so surface where the output actually is instead of failing mutely.
  for (const root of ["/vercel", "."]) {
    try {
      console.log(`sourcemaps: ls ${root} -> ${readdirSync(root).join(" ")}`);
    } catch {
      // Root does not exist off-Vercel; nothing to report.
    }
  }
}

// Inject+upload against the most specific tree available; that is what ships.
const target = found[0] ?? ".next/static";
console.log(`sourcemaps: target ${target}`);
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
      target,
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

// Sweep every tree: a map left in any of them is a map that can ship.
let deleted = 0;
for (const root of found) {
  for (const f of globSync(`${root}/**/*.js.map`)) {
    rmSync(f);
    deleted++;
  }
}
console.log(`sourcemaps: deleted ${deleted} .map files`);

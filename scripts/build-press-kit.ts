/**
 * Rasterize the wordmark SVGs and bundle public/press into icb-media-kit.zip.
 * Text files come from src/lib/press/content.ts, so the ZIP matches /press.
 * Run after changing press assets or copy:  npm run press:kit  (needs `zip`)
 * Wordmark SVGs themselves come from scripts/press-wordmark.py.
 */
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  copyFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import {
  BRAND_GUIDELINES,
  DATA_ATTRIBUTION,
  DESCRIPTIONS,
  FOUNDER_BIO,
  FOUNDER_PHOTO,
  LOGO_ASSETS,
  PRESS_CONTACT_EMAIL,
  SCREENSHOT_ASSETS,
} from "../src/lib/press/content";

const SITE = "https://www.indiancoffeebeans.com";
const pub = (href: string) => join("public", href);

async function main() {
  for (const name of [
    "icb-wordmark",
    "icb-wordmark-dark",
    "icb-wordmark-light",
  ]) {
    await sharp(pub(`/press/${name}.svg`))
      .png()
      .toFile(pub(`/press/${name}.png`));
  }

  const dir = mkdtempSync(join(tmpdir(), "icb-press-"));
  const kit = join(dir, "icb-media-kit");
  for (const sub of ["logos", "screenshots", "founder"])
    mkdirSync(join(kit, sub), { recursive: true });

  for (const a of LOGO_ASSETS)
    for (const f of a.files)
      copyFileSync(pub(f.href), join(kit, "logos", f.href.split("/").pop()!));
  for (const a of SCREENSHOT_ASSETS)
    for (const f of a.files)
      copyFileSync(
        pub(f.href),
        join(kit, "screenshots", f.href.split("/").pop()!)
      );
  copyFileSync(
    pub(FOUNDER_PHOTO.href),
    join(kit, "founder", FOUNDER_PHOTO.href.split("/").pop()!)
  );

  const readme = [
    "# IndianCoffeeBeans — Media Kit",
    "",
    `Press page: ${SITE}/press`,
    "",
    "## About IndianCoffeeBeans",
    ...DESCRIPTIONS.flatMap((d) => ["", `### ${d.label}`, "", d.text]),
    "",
    "## Founder",
    "",
    "### Short bio",
    "",
    FOUNDER_BIO.short,
    "",
    "### Long bio",
    "",
    FOUNDER_BIO.long.join("\n\n"),
    "",
    `Portrait: founder/${FOUNDER_PHOTO.href.split("/").pop()} (${FOUNDER_PHOTO.credit})`,
    "",
    "## Brand usage",
    "",
    ...BRAND_GUIDELINES.map((g) => `- ${g}`),
    "",
    "## Data attribution",
    "",
    `When citing ICB data: "${DATA_ATTRIBUTION}" (${SITE}/learn/insights).`,
    "Published, aggregated insights may be cited with attribution. The underlying dataset is not licensed for reproduction;",
    `for custom data, bulk exports or licensing see ${SITE}/developers or email ${PRESS_CONTACT_EMAIL}.`,
    "",
    "## Contact",
    "",
    `Media enquiries: ${PRESS_CONTACT_EMAIL}`,
    "",
  ].join("\n");
  writeFileSync(join(kit, "README.md"), readme);

  const out = join(process.cwd(), pub("/press/icb-media-kit.zip"));
  rmSync(out, { force: true });
  execFileSync("zip", ["-qr9X", out, "icb-media-kit"], { cwd: dir });
  rmSync(dir, { recursive: true });
  console.log(`Wrote ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

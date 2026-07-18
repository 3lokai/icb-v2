import { writeFileSync } from "node:fs";

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

import { cleanCoffeeName } from "../src/lib/utils/coffee-name";

dotenv.config({ path: ".env.local" });

/**
 * One-off backfill for `coffees.display_name`.
 *
 * Dry-run by default — prints a before -> after diff and writes nothing.
 * Pass `--write` to actually persist.
 *
 *   npm run backfill:coffee-display-names                    # dry run
 *   npm run backfill:coffee-display-names -- --out=diff.txt  # dry run -> file
 *   npm run backfill:coffee-display-names -- --write
 *
 * NEVER writes to `coffees.name`.
 */

const WRITE = process.argv.includes("--write");
const OUT = process.argv
  .find((a) => a.startsWith("--out="))
  ?.slice("--out=".length);

function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!key) throw new Error("SUPABASE_SECRET_KEY is not set");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

type Row = {
  id: string;
  name: string | null;
  display_name: string | null;
  // supabase-js types an embedded FK as an array; a to-one relation returns a
  // single object at runtime. Accept both and normalise at the call site.
  roasters: { name: string | null } | { name: string | null }[] | null;
};

function roasterNameOf(row: Row): string | null {
  const r = row.roasters;
  if (!r) return null;
  return (Array.isArray(r) ? r[0]?.name : r.name) ?? null;
}

async function fetchAll(supabase: ReturnType<typeof createServiceRoleClient>) {
  const rows: Row[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("coffees")
      .select("id, name, display_name, roasters(name)")
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!data?.length) break;
    rows.push(...(data as unknown as Row[]));
    if (data.length < PAGE) break;
  }
  return rows;
}

async function main() {
  const supabase = createServiceRoleClient();
  const rows = await fetchAll(supabase);

  const changed: { id: string; before: string; after: string }[] = [];
  const unchanged: Row[] = [];
  const emptied: Row[] = [];

  for (const row of rows) {
    const cleaned = cleanCoffeeName(row.name, roasterNameOf(row));

    // Guard: a cleaner bug that empties a non-empty name must never be written.
    if (!cleaned && row.name) {
      emptied.push(row);
      continue;
    }
    if (cleaned === row.display_name) {
      unchanged.push(row);
      continue;
    }
    if (cleaned === row.name && row.display_name === null) {
      // display_name not yet set, but cleaning is a no-op. Still needs writing
      // so the column is authoritative for every row.
      changed.push({ id: row.id, before: row.name ?? "", after: cleaned });
      continue;
    }
    changed.push({ id: row.id, before: row.name ?? "", after: cleaned });
  }

  const visiblyDifferent = changed
    .filter((c) => c.before !== c.after)
    .sort((a, b) => a.before.localeCompare(b.before));

  console.log(`\nMode: ${WRITE ? "WRITE" : "DRY RUN (no writes)"}`);
  console.log(`Total coffees:            ${rows.length}`);
  console.log(`Rows to write:            ${changed.length}`);
  console.log(`  ...text actually changes: ${visiblyDifferent.length}`);
  console.log(
    `  ...identical to name:     ${changed.length - visiblyDifferent.length}`
  );
  console.log(`Already correct:          ${unchanged.length}`);
  console.log(`Skipped (would empty):    ${emptied.length}`);

  if (emptied.length) {
    console.log("\n!! SKIPPED — cleaning produced an empty string:");
    for (const r of emptied)
      console.log(`   ${r.id}  ${JSON.stringify(r.name)}`);
  }

  if (OUT) {
    const lines = visiblyDifferent.map(
      (c, i) => `${String(i + 1).padStart(4)}. ${c.before}\n      ${c.after}\n`
    );
    writeFileSync(
      OUT,
      `Coffee display_name backfill — proposed changes\n` +
        `${visiblyDifferent.length} of ${rows.length} names change.\n` +
        `Line 1 = original (coffees.name, untouched)\n` +
        `Line 2 = cleaned (coffees.display_name)\n\n` +
        `${"=".repeat(72)}\n\n${lines.join("\n")}`,
      "utf8"
    );

    // CSV alongside, for spreadsheet review.
    const csvPath = OUT.replace(/\.[^.]+$/, "") + ".csv";
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    writeFileSync(
      csvPath,
      "id,original_name,cleaned_display_name\n" +
        visiblyDifferent
          .map((c) => [esc(c.id), esc(c.before), esc(c.after)].join(","))
          .join("\n"),
      "utf8"
    );
    console.log(`\nDiff written to ${OUT}`);
    console.log(`CSV  written to ${csvPath}`);
  } else {
    console.log(
      `\n=== DIFF (${visiblyDifferent.length} rows whose text changes) ===`
    );
    for (const c of visiblyDifferent) {
      console.log(`\n  - ${c.before}`);
      console.log(`  + ${c.after}`);
    }
  }

  if (!WRITE) {
    console.log(
      "\nDry run complete. Nothing written. Re-run with --write to apply."
    );
    return;
  }

  let written = 0;
  for (const c of changed) {
    const { error } = await supabase
      .from("coffees")
      .update({ display_name: c.after }) // only display_name — never name
      .eq("id", c.id);
    if (error) {
      console.error(`FAILED ${c.id}: ${error.message}`);
      continue;
    }
    written += 1;
  }
  console.log(`\nWrote display_name for ${written}/${changed.length} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

import { GEAR_FOLDS, GEAR_SEED } from "./gear-catalog.data";

dotenv.config({ path: ".env.local" });

/**
 * Upsert the curated gear catalog (scripts/gear-catalog.data.ts) and fold dirty
 * user-entered rows into it. Re-runnable.
 *
 * Dry-run by default — prints the plan and writes nothing. Pass `--write` to persist.
 *
 *   npm run gear:seed
 *   npm run gear:seed -- --write
 *
 * Folding keeps user_gear intact: the first dirty row for a slug becomes the canonical row
 * in place (same id); user_gear on the other dirty rows is repointed, then they're deleted.
 *
 * ponytail: no transaction (supabase-js can't span one). Every step is idempotent, so a
 * failed --write is fixed by re-running; move into an RPC if partial runs ever bite.
 */

const WRITE = process.argv.includes("--write");

function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!key) throw new Error("SUPABASE_SECRET_KEY is not set");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

type CatalogRow = { id: string; name: string; slug: string | null };

async function main() {
  const supabase = createServiceRoleClient();

  const { data: rows, error } = await supabase
    .from("gear_catalog")
    .select("id, name, slug");
  if (error) throw error;
  const catalog = rows as CatalogRow[];

  // ── Folds ──────────────────────────────────────────────────────────────────
  // gear_catalog.name is CITEXT UNIQUE: a user-created, slug-less row that shares a seed
  // product's name would make the slug upsert fail, so adopt it like an explicit fold.
  const folds: [string, string][] = [
    ...Object.entries(GEAR_FOLDS),
    ...GEAR_SEED.filter((g) =>
      catalog.some(
        (r) => r.slug === null && r.name.toLowerCase() === g.name.toLowerCase()
      )
    ).map((g): [string, string] => [g.name, g.slug]),
  ];
  const sourcesBySlug = new Map<string, CatalogRow[]>();
  for (const [dirtyName, slug] of folds) {
    const row = catalog.find(
      (r) => r.name.toLowerCase() === dirtyName.toLowerCase() && r.slug !== slug
    );
    if (!row) continue; // already folded, or never existed
    const sources = sourcesBySlug.get(slug) ?? [];
    if (!sources.some((r) => r.id === row.id))
      sourcesBySlug.set(slug, [...sources, row]);
  }

  const recount = new Set<string>();
  for (const [slug, sources] of sourcesBySlug) {
    const existing = catalog.find((r) => r.slug === slug);
    const keep = existing ?? sources[0];
    const others = sources.filter((s) => s.id !== keep.id);
    console.log(
      `fold → ${slug}: keep ${JSON.stringify(keep.name)}${
        others.length
          ? `, merge ${others.map((o) => JSON.stringify(o.name)).join(", ")}`
          : ""
      }`
    );
    if (!WRITE) continue;

    if (!existing) {
      const { error: e } = await supabase
        .from("gear_catalog")
        .update({ slug })
        .eq("id", keep.id);
      if (e) throw e;
    }
    for (const other of others) {
      await repointUserGear(supabase, other.id, keep.id);
      const { error: e } = await supabase
        .from("gear_catalog")
        .delete()
        .eq("id", other.id);
      if (e) throw e;
    }
    recount.add(keep.id);
  }

  // ── Upsert curated rows ────────────────────────────────────────────────────
  const known = new Set(
    catalog.map((r) => r.slug).concat([...sourcesBySlug.keys()])
  );
  const inserts = GEAR_SEED.filter((g) => !known.has(g.slug)).length;
  console.log(
    `\nupsert ${GEAR_SEED.length} curated products (${inserts} new, ${
      GEAR_SEED.length - inserts
    } updated)`
  );
  if (!WRITE) {
    console.log("\nDry run. Re-run with --write to persist.");
    return;
  }

  const { error: upsertError } = await supabase.from("gear_catalog").upsert(
    GEAR_SEED.map((g) => ({ ...g, is_verified: true })),
    { onConflict: "slug" }
  );
  if (upsertError) throw upsertError;

  // Repointing via UPDATE doesn't fire the usage_count triggers; recount folded rows.
  for (const id of recount) {
    const { count, error: e } = await supabase
      .from("user_gear")
      .select("id", { count: "exact", head: true })
      .eq("gear_id", id);
    if (e) throw e;
    const { error: e2 } = await supabase
      .from("gear_catalog")
      .update({ usage_count: count ?? 0 })
      .eq("id", id);
    if (e2) throw e2;
  }

  const { count } = await supabase
    .from("gear_catalog")
    .select("id", { count: "exact", head: true })
    .eq("is_verified", true);
  console.log(`done. verified gear_catalog rows: ${count}`);
}

async function repointUserGear(
  supabase: ReturnType<typeof createServiceRoleClient>,
  fromId: string,
  toId: string
) {
  const { data, error } = await supabase
    .from("user_gear")
    .select("id, user_id, notes")
    .eq("gear_id", fromId);
  if (error) throw error;
  for (const ug of data ?? []) {
    const { data: dupe, error: dupeError } = await supabase
      .from("user_gear")
      .select("id, notes")
      .eq("user_id", ug.user_id)
      .eq("gear_id", toId)
      .maybeSingle();
    if (dupeError) throw dupeError;
    if (!dupe) {
      const { error: e } = await supabase
        .from("user_gear")
        .update({ gear_id: toId })
        .eq("id", ug.id);
      if (e) throw e;
      continue;
    }
    // User already owns the canonical item: keep their notes from the duplicate, then drop it.
    if (ug.notes && ug.notes !== dupe.notes) {
      const { error: e } = await supabase
        .from("user_gear")
        .update({
          notes: [dupe.notes, ug.notes].filter(Boolean).join("\n\n"),
        })
        .eq("id", dupe.id);
      if (e) throw e;
    }
    const { error: e } = await supabase
      .from("user_gear")
      .delete()
      .eq("id", ug.id);
    if (e) throw e;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

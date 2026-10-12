import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

import { matchName, normalizeWords, type MatchResult } from "./gear-match";

dotenv.config({ path: ".env.local" });

/**
 * Match roaster store listings (raw_products, non-coffee) to verified gear_catalog rows
 * and create the roaster's gear_merchants row + gear_offers. Re-runnable.
 *
 * Dry-run by default: writes matched.csv / unmatched.csv and nothing else.
 *
 *   npm run gear:match                      # CSVs to .gear-match/
 *   npm run gear:match -- --out=some/dir
 *   npm run gear:match -- --write
 *
 * unmatched.csv (most-stocked first) is the review queue: add aliases or catalog rows,
 * re-run. A hand-set raw_products.gear_id is respected, never recomputed. Existing offers
 * are left alone; prices, stock and url refreshes belong to the scraper (Phase 1C).
 */

const WRITE = process.argv.includes("--write");
const OUT =
  process.argv.find((a) => a.startsWith("--out="))?.slice("--out=".length) ??
  ".gear-match";

function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!key) throw new Error("SUPABASE_SECRET_KEY is not set");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

type Supabase = ReturnType<typeof createServiceRoleClient>;

type RawRow = {
  id: string;
  name: string;
  roaster_id: string;
  platform_product_id: string;
  product_url: string | null;
  status: string | null;
  last_seen_at: string;
  gear_id: string | null;
};

type Roaster = {
  id: string;
  name: string;
  slug: string;
  website: string | null;
};

async function fetchAll<T>(
  build: (
    from: number,
    to: number
  ) => PromiseLike<{ data: T[] | null; error: unknown }>
): Promise<T[]> {
  const rows: T[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

const csv = (rows: (string | number)[][]) =>
  rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n") + "\n";

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function hostOf(url: string | null) {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : null;
  } catch {
    return null;
  }
}

async function main() {
  const supabase = createServiceRoleClient();

  const { data: catalog, error: catalogError } = await supabase
    .from("gear_catalog")
    .select("id, slug, aliases")
    .eq("is_verified", true)
    .not("slug", "is", null);
  if (catalogError) throw catalogError;
  const targets = (catalog ?? []) as {
    id: string;
    slug: string;
    aliases: string[];
  }[];
  const idBySlug = new Map(targets.map((t) => [t.slug, t.id]));
  const slugById = new Map(targets.map((t) => [t.id, t.slug]));

  const raw = await fetchAll<RawRow>((from, to) =>
    supabase
      .from("raw_products")
      .select(
        "id, name, roaster_id, platform_product_id, product_url, status, last_seen_at, gear_id"
      )
      .eq("is_coffee", false)
      .neq("status", "discontinued")
      .order("id")
      .range(from, to)
  );

  const roasterIds = [...new Set(raw.map((r) => r.roaster_id))];
  const { data: roasterRows, error: roasterError } = await supabase
    .from("roasters")
    .select("id, name, slug, website")
    .in("id", roasterIds);
  if (roasterError) throw roasterError;
  const roasters = new Map((roasterRows as Roaster[]).map((r) => [r.id, r]));

  const matched: { row: RawRow; gearId: string; how: string }[] = [];
  const unmatched = new Map<
    string,
    { stores: Set<string>; example: string; reason: string }
  >();

  for (const row of raw) {
    let result: MatchResult | null = null;
    let gearId = row.gear_id && slugById.has(row.gear_id) ? row.gear_id : null;
    let how = gearId ? "cached" : "";
    if (!gearId) {
      result = matchName(row.name, targets);
      if (result.kind === "match") {
        gearId = idBySlug.get(result.slug)!;
        how = `alias: ${result.alias}`;
      }
    }
    if (gearId && row.product_url) {
      matched.push({ row, gearId, how });
      continue;
    }
    const reason = gearId
      ? "no product_url"
      : result?.kind === "ambiguous"
        ? `ambiguous: ${result.slugs.join(" | ")}`
        : result?.kind === "stopword"
          ? `stopword: ${result.word}`
          : "";
    const key = normalizeWords(row.name).join(" ");
    const u = unmatched.get(key) ?? {
      stores: new Set(),
      example: row.name,
      reason,
    };
    u.stores.add(row.roaster_id);
    unmatched.set(key, u);
  }

  mkdirSync(OUT, { recursive: true });
  writeFileSync(
    join(OUT, "matched.csv"),
    csv([
      ["gear", "roaster", "listing", "how", "url"],
      ...matched
        .map(({ row, gearId, how }) => [
          slugById.get(gearId)!,
          roasters.get(row.roaster_id)?.name ?? row.roaster_id,
          row.name,
          how,
          row.product_url ?? "",
        ])
        .sort((a, b) => a[0].localeCompare(b[0])),
    ])
  );
  writeFileSync(
    join(OUT, "unmatched.csv"),
    csv([
      ["stores", "listing", "reason"],
      ...[...unmatched.values()]
        .sort((a, b) => b.stores.size - a.stores.size)
        .map((u) => [u.stores.size, u.example, u.reason]),
    ])
  );

  const perGear = new Map<string, Set<string>>();
  for (const m of matched) {
    perGear.set(
      m.gearId,
      (perGear.get(m.gearId) ?? new Set()).add(m.row.roaster_id)
    );
  }
  console.log(
    `${raw.length} non-coffee listings → ${matched.length} matched to ${perGear.size} products; ` +
      `${unmatched.size} distinct unmatched names. CSVs in ${OUT}/`
  );
  for (const [id, stores] of [...perGear]
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 15)) {
    console.log(
      `  ${String(stores.size).padStart(3)} stores  ${slugById.get(id)}`
    );
  }

  if (!WRITE) {
    console.log("\nDry run. Re-run with --write to persist.");
    return;
  }
  await persist(supabase, matched, roasters);
}

async function persist(
  supabase: Supabase,
  matched: { row: RawRow; gearId: string }[],
  roasters: Map<string, Roaster>
) {
  const matchedRoasterIds = [...new Set(matched.map((m) => m.row.roaster_id))];

  const { error: merchantError } = await supabase.from("gear_merchants").upsert(
    matchedRoasterIds.map((id) => {
      const r = roasters.get(id)!;
      return {
        slug: toSlug(r.slug || r.name),
        name: r.name,
        kind: "roaster",
        roaster_id: id,
        domain: hostOf(r.website),
      };
    }),
    { onConflict: "roaster_id", ignoreDuplicates: true }
  );
  if (merchantError) throw merchantError;

  const { data: merchants, error: mErr } = await supabase
    .from("gear_merchants")
    .select("id, roaster_id")
    .in("roaster_id", matchedRoasterIds);
  if (mErr) throw mErr;
  const merchantByRoaster = new Map(
    (merchants as { id: string; roaster_id: string }[]).map((m) => [
      m.roaster_id,
      m.id,
    ])
  );

  // Matching cache: only fill gaps, never overwrite a hand-set gear_id.
  const newMatches = new Map<string, string[]>();
  for (const { row, gearId } of matched) {
    if (!row.gear_id)
      newMatches.set(gearId, [...(newMatches.get(gearId) ?? []), row.id]);
  }
  for (const [gearId, ids] of newMatches) {
    const { error } = await supabase
      .from("raw_products")
      .update({ gear_id: gearId })
      .in("id", ids)
      .is("gear_id", null);
    if (error) throw error;
  }

  const { error: offerError } = await supabase.from("gear_offers").upsert(
    matched.map(({ row, gearId }) => ({
      gear_id: gearId,
      merchant_id: merchantByRoaster.get(row.roaster_id)!,
      source_product_id: String(row.platform_product_id),
      url: row.product_url!,
      status: row.status === "missing" ? "missing" : "active",
      last_seen_at: row.last_seen_at,
    })),
    {
      onConflict: "merchant_id,source_product_id,source_variant_id",
      ignoreDuplicates: true,
    }
  );
  if (offerError) throw offerError;

  const { count } = await supabase
    .from("gear_offers")
    .select("id", { count: "exact", head: true });
  console.log(
    `done. ${merchantByRoaster.size} roaster merchants, ${count} gear_offers total, ` +
      `${[...newMatches.values()].flat().length} raw_products newly matched.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

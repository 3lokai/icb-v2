import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Sentinel id used when a slug filter matches nothing. Filtering against it
 * matches no row, so an unknown or empty region returns an empty page instead of
 * the unfiltered catalogue. Callers MUST NOT treat "nothing resolved" as "no
 * filter" — `?regions=virajpet` used to return all 1,488 coffees.
 */
export const NO_MATCH_ID = "00000000-0000-0000-0000-000000000000";

/**
 * Discovery landing pages and `/coffees` filters use short slugs; `canon_regions.slug`
 * may differ. One-directional (page slug → canon slug); never rename page slugs to
 * match canon, they're live and indexed.
 * Must match [supabase/migrations/20260106000001_seed_canon_regions.sql](../../../supabase/migrations/20260106000001_seed_canon_regions.sql).
 */
const LANDING_REGION_SLUG_TO_CANON: Record<string, string> = {
  coorg: "kodagu-coorg",
  araku: "araku-valley",
  nilgiris: "nilgiri-hills",
};

/**
 * Region slugs (page or canon) -> `canon_regions.id[]`, **including every descendant**
 * down the `parent_id` edge.
 *
 * Coffee counts roll up that edge: Chikmagalur is tagged on 357 coffees directly but
 * covers 514 once Baba Budangiri, Mudigere and its localities are included. Resolving
 * here rather than in the nine landing-page configs fixes every caller at once —
 * discovery pages, `?regions=` URLs typed from the filter sidebar, and the estate
 * directory — and keeps the hierarchy in the database instead of a second copy in TS.
 */
export async function resolveRegionSlugsToCanonIds(
  supabase: SupabaseClient,
  slugs: string[]
): Promise<string[]> {
  if (slugs.length === 0) {
    return [];
  }

  const canonSlugs = new Set(
    slugs.map((slug) => LANDING_REGION_SLUG_TO_CANON[slug] ?? slug)
  );

  // The whole table is ~100 rows; one read is cheaper than a recursive round-trip
  // per level. Swap for a recursive CTE if canon_regions ever gets large.
  const { data, error } = await supabase
    .from("canon_regions")
    .select("id, slug, parent_id");

  if (error) {
    throw new Error(`Failed to resolve region slugs: ${error.message}`);
  }

  const rows = (data ?? []) as Array<{
    id: string;
    slug: string;
    parent_id: string | null;
  }>;

  const childIdsByParent = new Map<string, string[]>();
  for (const row of rows) {
    if (row.parent_id) {
      const siblings = childIdsByParent.get(row.parent_id) ?? [];
      siblings.push(row.id);
      childIdsByParent.set(row.parent_id, siblings);
    }
  }

  const resolved = new Set<string>();
  const pending = rows
    .filter((row) => canonSlugs.has(row.slug))
    .map((row) => row.id);

  while (pending.length > 0) {
    const id = pending.pop() as string;
    // The `seen` guard keeps a cycle from hanging the request even though
    // region_structure.py --check verifies the hierarchy is acyclic.
    if (resolved.has(id)) {
      continue;
    }
    resolved.add(id);
    pending.push(...(childIdsByParent.get(id) ?? []));
  }

  return [...resolved];
}

/**
 * Region slugs -> `regions.id[]` (the raw origin rows `coffee_directory_mv.region_ids`
 * holds), descendants included. Use for coffee queries; use
 * {@link resolveRegionSlugsToCanonIds} for anything keyed on `canon_region_id`.
 */
export async function resolveRegionSlugsToRegionIds(
  supabase: SupabaseClient,
  slugs: string[]
): Promise<string[]> {
  const canonRegionIds = await resolveRegionSlugsToCanonIds(supabase, slugs);
  if (canonRegionIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("regions")
    .select("id")
    .in("canon_region_id", canonRegionIds);

  // Must throw, not return []: callers turn an empty list into NO_MATCH_ID, so a
  // failed query would cache as "this region has no coffees".
  if (error) {
    throw new Error(`Failed to resolve region ids: ${error.message}`);
  }

  return (data ?? []).map((row: { id: string }) => row.id);
}

import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  BEAN_TYPES,
  COFFEE_STATUS,
  PROCESSING_METHODS,
  ROAST_LEVELS,
} from "@/lib/utils/coffee-constants";
import type { CoffeeFilterMeta } from "@/types/coffee-types";
import type {
  CoffeeStatusEnum,
  ProcessEnum,
  RoastLevelEnum,
  SpeciesEnum,
} from "@/types/db-enums";

/**
 * Fetch coffee filter meta data with counts
 * Returns all available filter options with their usage counts
 * Uses service role client to bypass RLS for server-side queries
 * Uses SQL aggregations for efficient counting
 */
export async function fetchCoffeeFilterMeta(): Promise<CoffeeFilterMeta> {
  const supabase = await createServiceRoleClient();

  // Helper to sort by count DESC, then label ASC
  const sortByCountAndLabel = <T extends { count: number; label: string }>(
    items: T[]
  ): T[] =>
    items.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.label.localeCompare(b.label);
    });

  // Run all queries in parallel for better performance
  const [
    flavorNotesResult,
    canonicalFlavorsResult,
    regionsResult,
    estatesResult,
    brewMethodsResult,
    roastersResult,
    roastLevelsResult,
    processesResult,
    statusesResult,
    speciesResult,
    totalsResult,
  ] = await Promise.all([
    // Flavor Notes - Use RPC or raw SQL for aggregation
    // Since Supabase doesn't support GROUP BY directly, we'll fetch all and aggregate in JS
    // This is still efficient for small lookup tables
    supabase
      .from("coffee_flavor_notes")
      .select("flavor_note_id, flavor_notes(id, key, label)")
      .then((result) => {
        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        // Aggregate counts
        const counts = new Map<
          string,
          { id: string; label: string; count: number }
        >();

        for (const row of data) {
          const fn = row.flavor_notes as unknown as {
            id: string;
            key: string;
            label: string;
          } | null;
          if (!fn) {
            continue;
          }

          const existing = counts.get(fn.id);
          if (existing) {
            existing.count += 1;
          } else {
            counts.set(fn.id, { id: fn.key, label: fn.label, count: 1 });
          }
        }

        return Array.from(counts.values()).filter((item) => item.count > 0);
      }),

    // Canonical Flavors - Join through coffee_flavor_notes -> flavor_notes -> flavor_note_to_canon -> canon_sensory_nodes
    supabase
      .from("coffee_flavor_notes")
      .select(
        `
        flavor_note_id,
        flavor_notes(
          id,
          flavor_note_to_canon(
            canon_node_id,
            canon_sensory_nodes(id, slug, descriptor, subcategory, family)
          )
        )
      `
      )
      .then((result) => {
        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        // Aggregate counts by canon_sensory_nodes.id
        const counts = new Map<
          string,
          {
            id: string;
            slug: string;
            descriptor: string;
            subcategory: string;
            family: string;
            count: number;
          }
        >();

        for (const row of data) {
          const fn = row.flavor_notes as unknown as {
            id: string;
            flavor_note_to_canon: Array<{
              canon_node_id: string;
              canon_sensory_nodes: {
                id: string;
                slug: string;
                descriptor: string;
                subcategory: string;
                family: string;
              } | null;
            }> | null;
          } | null;

          if (!fn || !fn.flavor_note_to_canon) {
            continue;
          }

          // Process each canonical flavor mapping
          for (const mapping of fn.flavor_note_to_canon) {
            const canonNode = mapping.canon_sensory_nodes;
            if (!canonNode) {
              continue;
            }

            const existing = counts.get(canonNode.id);
            if (existing) {
              existing.count += 1;
            } else {
              counts.set(canonNode.id, {
                id: canonNode.id,
                slug: canonNode.slug,
                descriptor: canonNode.descriptor,
                subcategory: canonNode.subcategory,
                family: canonNode.family,
                count: 1,
              });
            }
          }
        }

        return Array.from(counts.values()).filter((item) => item.count > 0);
      }),

    // Regions - join with canon_regions to get slug
    supabase
      .from("coffee_regions")
      .select(
        "region_id, regions(id, display_name, canon_region_id, canon_regions(slug))"
      )
      .then((result) => {
        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        const counts = new Map<
          string,
          { id: string; slug: string; label: string; count: number }
        >();

        for (const row of data) {
          const r = row.regions as unknown as {
            id: string;
            display_name: string | null;
            canon_region_id: string | null;
            canon_regions: {
              slug: string;
            } | null;
          } | null;
          if (!r) {
            continue;
          }

          const slug = r.canon_regions?.slug || r.id;
          const existing = counts.get(r.id);
          if (existing) {
            existing.count += 1;
          } else {
            counts.set(r.id, {
              id: r.id,
              slug: slug,
              label: r.display_name || r.id,
              count: 1,
            });
          }
        }

        return Array.from(counts.values()).filter((item) => item.count > 0);
      }),

    // Estates - get estate_key for URL-friendly filtering
    supabase
      .from("coffee_estates")
      .select("estate_id, estates(id, name, estate_key)")
      .then((result) => {
        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        const counts = new Map<
          string,
          { id: string; key: string; label: string; count: number }
        >();

        for (const row of data) {
          const e = row.estates as unknown as {
            id: string;
            name: string;
            estate_key: string | null;
          } | null;
          if (!e) {
            continue;
          }

          const key = e.estate_key || e.id;
          const existing = counts.get(e.id);
          if (existing) {
            existing.count += 1;
          } else {
            counts.set(e.id, {
              id: e.id,
              key: key,
              label: e.name,
              count: 1,
            });
          }
        }

        return Array.from(counts.values()).filter((item) => item.count > 0);
      }),

    // Brew Methods
    supabase
      .from("coffee_brew_methods")
      .select(
        "brew_method_id, brew_methods(id, label, canonical_key, canonical_label)"
      )
      .then((result) => {
        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        // Group by canonical_key instead of individual brew method id
        const counts = new Map<
          string,
          { id: string; label: string; count: number }
        >();

        for (const row of data) {
          const bm = row.brew_methods as unknown as {
            id: string;
            label: string;
            canonical_key: string | null;
            canonical_label: string | null;
          } | null;
          if (!bm) {
            continue;
          }

          // Only include brew methods with canonical_key
          if (!bm.canonical_key) {
            continue;
          }

          // Use canonical_key as id, canonical_label as label (fallback to canonical_key if label is null)
          const key = bm.canonical_key;
          const label = bm.canonical_label || bm.canonical_key;

          const existing = counts.get(key);
          if (existing) {
            existing.count += 1;
          } else {
            counts.set(key, { id: key, label: label, count: 1 });
          }
        }

        return Array.from(counts.values()).filter((item) => item.count > 0);
      }),

    // Roasters - count from coffee_summary, include slug
    supabase
      .from("coffee_summary")
      .select("roaster_id, roasters(id, name, slug)")
      .not("roaster_id", "is", null)
      .then((result) => {
        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        const counts = new Map<
          string,
          { id: string; slug: string; label: string; count: number }
        >();

        for (const row of data) {
          const r = row.roasters as unknown as {
            id: string;
            name: string;
            slug: string | null;
          } | null;
          if (!r) {
            continue;
          }

          const slug = r.slug || r.id;
          const existing = counts.get(r.id);
          if (existing) {
            existing.count += 1;
          } else {
            counts.set(r.id, {
              id: r.id,
              slug: slug,
              label: r.name,
              count: 1,
            });
          }
        }

        return Array.from(counts.values()).filter((item) => item.count > 0);
      }),

    // Roast Levels (from coffee_summary)
    supabase
      .from("coffee_summary")
      .select("roast_level")
      .not("roast_level", "is", null)
      .then((result) => {
        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        const counts = new Map<RoastLevelEnum, number>();
        for (const row of data) {
          if (row.roast_level) {
            counts.set(
              row.roast_level as RoastLevelEnum,
              (counts.get(row.roast_level as RoastLevelEnum) || 0) + 1
            );
          }
        }

        return Array.from(counts.entries())
          .map(([value, count]) => {
            const option = ROAST_LEVELS.find((r) => r.value === value);
            return {
              value,
              label: option?.label || value,
              count,
            };
          })
          .filter((item) => item.count > 0)
          .sort((a, b) => {
            if (b.count !== a.count) {
              return b.count - a.count;
            }
            return a.label.localeCompare(b.label);
          });
      }),

    // Processes (from coffee_summary)
    supabase
      .from("coffee_summary")
      .select("process")
      .not("process", "is", null)
      .then((result) => {
        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        const counts = new Map<ProcessEnum, number>();
        for (const row of data) {
          if (row.process) {
            counts.set(
              row.process as ProcessEnum,
              (counts.get(row.process as ProcessEnum) || 0) + 1
            );
          }
        }

        return Array.from(counts.entries())
          .map(([value, count]) => {
            const option = PROCESSING_METHODS.find((p) => p.value === value);
            return {
              value,
              label: option?.label || value,
              count,
            };
          })
          .filter((item) => item.count > 0)
          .sort((a, b) => {
            if (b.count !== a.count) {
              return b.count - a.count;
            }
            return a.label.localeCompare(b.label);
          });
      }),

    // Statuses (from coffee_summary)
    supabase
      .from("coffee_summary")
      .select("status")
      .not("status", "is", null)
      .then((result) => {
        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        const counts = new Map<CoffeeStatusEnum, number>();
        for (const row of data) {
          if (row.status) {
            counts.set(
              row.status as CoffeeStatusEnum,
              (counts.get(row.status as CoffeeStatusEnum) || 0) + 1
            );
          }
        }

        return Array.from(counts.entries())
          .map(([value, count]) => {
            const option = COFFEE_STATUS.find((s) => s.value === value);
            return {
              value,
              label: option?.label || value,
              count,
            };
          })
          .filter((item) => item.count > 0)
          .sort((a, b) => {
            if (b.count !== a.count) {
              return b.count - a.count;
            }
            return a.label.localeCompare(b.label);
          });
      }),

    // Species (from coffee_directory_mv; coffee_summary view does not have bean_species)
    supabase
      .from("coffee_directory_mv")
      .select("bean_species")
      .not("bean_species", "is", null)
      .then((result) => {
        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        const counts = new Map<SpeciesEnum, number>();
        for (const row of data) {
          if (row.bean_species) {
            counts.set(
              row.bean_species as SpeciesEnum,
              (counts.get(row.bean_species as SpeciesEnum) || 0) + 1
            );
          }
        }

        return Array.from(counts.entries())
          .map(([value, count]) => {
            const option = BEAN_TYPES.find((b) => b.value === value);
            return {
              value,
              label: option?.label || value,
              count,
            };
          })
          .filter((item) => item.count > 0)
          .sort((a, b) => {
            if (b.count !== a.count) {
              return b.count - a.count;
            }
            return a.label.localeCompare(b.label);
          });
      }),

    // Totals
    Promise.all([
      supabase
        .from("coffee_summary")
        .select("coffee_id", { count: "exact", head: true }),
      supabase
        .from("roasters")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
    ]).then(([coffeesResult, roastersResult]) => {
      if (coffeesResult.error) {
        throw coffeesResult.error;
      }
      if (roastersResult.error) {
        throw roastersResult.error;
      }
      return {
        coffees: coffeesResult.count || 0,
        roasters: roastersResult.count || 0,
      };
    }),
  ]);

  // Sort canonical flavors by count DESC, then descriptor ASC
  const sortedCanonicalFlavors = canonicalFlavorsResult.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.descriptor.localeCompare(b.descriptor);
  });

  return {
    flavorNotes: sortByCountAndLabel(flavorNotesResult),
    canonicalFlavors: sortedCanonicalFlavors,
    regions: sortByCountAndLabel(regionsResult),
    estates: sortByCountAndLabel(estatesResult),
    brewMethods: sortByCountAndLabel(brewMethodsResult),
    roasters: sortByCountAndLabel(roastersResult),
    roastLevels: roastLevelsResult,
    processes: processesResult,
    statuses: statusesResult,
    species: speciesResult,
    totals: totalsResult,
  };
}

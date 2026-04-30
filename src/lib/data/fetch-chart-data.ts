import { createClient } from "@/lib/supabase/server";

export type ChartDataItem = {
  label: string;
  value: number;
};

/**
 * Fetches and aggregates data for blog charts from Supabase.
 */
export async function fetchChartData(
  dataKey: string,
  limit: number = 10,
  region?: string
): Promise<ChartDataItem[]> {
  const supabase = await createClient();

  // Optimization: only select columns we need for the specific dataKey
  let selectFields = "coffee_id";
  if (dataKey === "process_distribution") selectFields = "process";
  if (dataKey === "roast_distribution") selectFields = "roast_level";
  if (dataKey === "species_distribution") selectFields = "bean_species";
  if (dataKey === "top_roasters") selectFields = "roaster_name";
  if (dataKey === "top_regions") selectFields = "canon_region_names";
  if (dataKey === "top_flavors") selectFields = "canon_flavor_descriptors";
  if (dataKey === "arabica_top_flavor_notes")
    selectFields = "canon_flavor_descriptors, bean_species";
  if (dataKey === "robusta_top_flavor_notes")
    selectFields = "canon_flavor_descriptors, bean_species";
  if (dataKey === "robusta_process_distribution")
    selectFields = "process, bean_species";
  if (dataKey === "estate_roaster_count")
    selectFields = "canon_estate_names, roaster_name";
  if (dataKey === "estate_region_distribution")
    selectFields = "canon_estate_names, canon_region_names";
  if (dataKey === "brew_method_distribution_light_roast")
    selectFields = "brew_method_canonical_keys, roast_level";
  if (dataKey === "price_distribution_250g")
    selectFields = "best_normalized_250g, in_stock_count";
  if (dataKey === "roaster_concentration") selectFields = "roaster_name";

  let query = supabase.from("coffee_directory_mv").select(selectFields);

  if (region) {
    // canon_region_names is an array of strings, so we use contains
    query = query.contains("canon_region_slugs", [region]);
  }

  // Species-filtered charts — filter at DB level
  if (dataKey === "arabica_top_flavor_notes") {
    query = query.eq("bean_species", "arabica");
  }
  if (
    dataKey === "robusta_top_flavor_notes" ||
    dataKey === "robusta_process_distribution"
  ) {
    query = query.eq("bean_species", "robusta");
  }

  if (dataKey === "price_distribution_250g") {
    query = query
      .gt("best_normalized_250g", 0)
      .gt("in_stock_count", 0)
      .lt("best_normalized_250g", 5000);
  }

  const { data: coffees, error } = await query;

  if (error) {
    console.error(`[fetchChartData] Error fetching ${dataKey}:`, error);
    throw new Error(`Failed to fetch chart data for ${dataKey}`);
  }

  if (!coffees) return [];

  switch (dataKey) {
    case "process_distribution":
      return aggregateSimpleDistribution(coffees, "process").map((item) => ({
        ...item,
        label: formatEnumLabel(item.label),
      }));

    case "roast_distribution":
      return aggregateSimpleDistribution(coffees, "roast_level").map(
        (item) => ({
          ...item,
          label: formatEnumLabel(item.label),
        })
      );

    case "species_distribution":
      return aggregateSimpleDistribution(coffees, "bean_species").map(
        (item) => ({
          ...item,
          label: formatEnumLabel(item.label),
        })
      );

    case "top_roasters":
      return aggregateSimpleDistribution(coffees, "roaster_name", limit);

    case "top_regions":
      return aggregateArrayField(coffees, "canon_region_names", limit);

    case "top_flavors":
      return aggregateArrayField(coffees, "canon_flavor_descriptors", limit);

    case "estate_roaster_count":
      return aggregateEstateRoasterCounts(coffees, limit);

    case "estate_region_distribution":
      return aggregateEstateRegionDistribution(coffees);

    case "brew_method_distribution_light_roast":
      return aggregateLightRoastBrewMethods(coffees, limit);

    case "roaster_concentration":
      return aggregateSimpleDistribution(coffees, "roaster_name", limit || 10);

    case "price_distribution_250g":
      return aggregatePriceDistribution(coffees);

    case "arabica_top_flavor_notes":
      return aggregateArrayField(coffees, "canon_flavor_descriptors", limit);

    case "robusta_top_flavor_notes":
      return aggregateArrayField(coffees, "canon_flavor_descriptors", limit);

    case "robusta_process_distribution":
      return aggregateSimpleDistribution(coffees, "process").map((item) => ({
        ...item,
        label: formatEnumLabel(item.label),
      }));

    default:
      return [];
  }
}

/**
 * Formats enum keys (lowercase, underscores) into human-readable labels.
 */
function formatEnumLabel(label: string): string {
  if (!label || label === "Unknown") return label;
  return label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Aggregates estates (by canon name) by how many unique roasters source from them.
 * Uses canon_estate_names from MV directly; returns top items up to limit.
 */
function aggregateEstateRoasterCounts(
  coffees: any[],
  limit: number
): ChartDataItem[] {
  const estateRoasters: Record<string, Set<string>> = {};

  coffees.forEach((c) => {
    if (c.canon_estate_names && Array.isArray(c.canon_estate_names)) {
      c.canon_estate_names.forEach((estateName: string) => {
        if (!estateName || estateName.length <= 5) return;
        if (!estateRoasters[estateName]) estateRoasters[estateName] = new Set();
        if (c.roaster_name) estateRoasters[estateName].add(c.roaster_name);
      });
    }
  });

  return Object.entries(estateRoasters)
    .map(([label, roasters]) => ({ label, value: roasters.size }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/**
 * Aggregates coffees that have estate attribution by geographic region cluster.
 * Uses canon_region_names from MV directly (no DB resolution).
 */
function aggregateEstateRegionDistribution(coffees: any[]): ChartDataItem[] {
  const clusterCounts: Record<string, number> = {};

  coffees.forEach((c) => {
    if (
      !c.canon_estate_names ||
      !Array.isArray(c.canon_estate_names) ||
      c.canon_estate_names.length === 0
    )
      return;

    if (
      c.canon_region_names &&
      Array.isArray(c.canon_region_names) &&
      c.canon_region_names.length > 0
    ) {
      const regionName = c.canon_region_names[0];
      const cluster = getRegionCluster(regionName);
      clusterCounts[cluster] = (clusterCounts[cluster] || 0) + 1;
    }
  });

  return Object.entries(clusterCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Groups regional names into the broad clusters used in the estates draft.
 */
function getRegionCluster(regionName: string): string {
  const name = regionName.toLowerCase();

  if (
    name.includes("chikmagalur") ||
    name.includes("bababudangiri") ||
    name.includes("mullanagiri")
  ) {
    return "Chikmagalur / Bababudangiri";
  }
  if (
    name.includes("sakleshpur") ||
    name.includes("hassan") ||
    name.includes("manjarabad")
  ) {
    return "Sakleshpur / Hassan";
  }
  if (name.includes("coorg") || name.includes("kodagu")) {
    return "Coorg (Kodagu)";
  }
  if (name.includes("biligiri") || name.includes("b.r. hills")) {
    return "Biligiri Hills";
  }
  if (
    name.includes("shevaroy") ||
    name.includes("tamil nadu") ||
    name.includes("nilgiris") ||
    name.includes("pulneys") ||
    name.includes("anamalais")
  ) {
    return "Tamil Nadu / Other";
  }
  if (
    name.includes("araku") ||
    name.includes("andhra") ||
    name.includes("odisha") ||
    name.includes("meghalaya") ||
    name.includes("wayanad")
  ) {
    return "Other States (Araku/Wayanad)";
  }

  return "Other / Unknown";
}

/**
 * Aggregates a simple string field into {label, value} pairs.
 */
function aggregateSimpleDistribution(
  data: any[],
  field: string,
  limit?: number
): ChartDataItem[] {
  const counts: Record<string, number> = {};
  data.forEach((item) => {
    let val = item[field];
    if (val === null || val === undefined) val = "Unknown";
    counts[val] = (counts[val] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit || undefined);
}

/**
 * Aggregates an array field (like flavors or region names) into frequency counts.
 */
function aggregateArrayField(
  data: any[],
  field: string,
  limit?: number
): ChartDataItem[] {
  const counts: Record<string, number> = {};
  data.forEach((item) => {
    const arr = item[field] as string[] | null;
    if (Array.isArray(arr)) {
      arr.forEach((val) => {
        counts[val] = (counts[val] || 0) + 1;
      });
    }
  });

  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit || undefined);
}

/**
 * Buckets normalized 250g prices into fixed ranges.
 */
function aggregatePriceDistribution(data: any[]): ChartDataItem[] {
  const buckets: ChartDataItem[] = [
    { label: "Under ₹500", value: 0 },
    { label: "₹500–749", value: 0 },
    { label: "₹750–999", value: 0 },
    { label: "₹1,000–1,249", value: 0 },
    { label: "₹1,250+", value: 0 },
  ];

  data.forEach((item) => {
    const price = item.best_normalized_250g;
    if (!price || price <= 0) return;
    if (price < 500) buckets[0].value++;
    else if (price < 750) buckets[1].value++;
    else if (price < 1000) buckets[2].value++;
    else if (price < 1250) buckets[3].value++;
    else buckets[4].value++;
  });

  return buckets;
}

/**
 * Aggregates brew methods specifically for light and light-medium roast coffees.
 */
function aggregateLightRoastBrewMethods(
  data: any[],
  limit?: number
): ChartDataItem[] {
  const counts: Record<string, number> = {};
  data.forEach((item) => {
    // Only count if it's a light or light_medium roast
    if (item.roast_level === "light" || item.roast_level === "light_medium") {
      const arr = item.brew_method_canonical_keys as string[] | null;
      if (Array.isArray(arr)) {
        arr.forEach((val) => {
          counts[val] = (counts[val] || 0) + 1;
        });
      }
    }
  });

  return Object.entries(counts)
    .map(([label, value]) => ({ label: formatEnumLabel(label), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit || undefined);
}

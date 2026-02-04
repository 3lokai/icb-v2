"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import type { SearchableItem } from "@/types/search";

type CoffeeRow = {
  coffee_id: string | null;
  slug: string | null;
  name: string | null;
  roaster_id: string | null;
  roast_level: string | null;
  roast_level_raw: string | null;
  roast_style_raw: string | null;
  process: string | null;
  process_raw: string | null;
  min_price_in_stock: number | null;
  best_normalized_250g: number | null;
  roasters: unknown;
};

type RoasterRow = {
  id: string;
  slug: string;
  name: string;
  hq_city: string | null;
  hq_state: string | null;
  hq_country: string | null;
  logo_url: string | null;
  image_url: string | null;
};

type RegionData = {
  display_name: string | null;
  subregion: string;
  country: string | null;
  state: string | null;
};

type FlavorNoteData = {
  label: string;
};

/**
 * Fetch and map coffee images
 */
async function fetchCoffeeImages(
  supabase: any,
  coffeeIds: string[]
): Promise<Map<string, string>> {
  const { data: imagesData } = await supabase
    .from("coffee_images")
    .select("coffee_id, imagekit_url")
    .in("coffee_id", coffeeIds)
    .order("sort_order", { ascending: true });

  const imagesMap = new Map<string, string>();
  for (const img of imagesData || []) {
    if (img.coffee_id && img.imagekit_url && !imagesMap.has(img.coffee_id)) {
      imagesMap.set(img.coffee_id, img.imagekit_url);
    }
  }
  return imagesMap;
}

/**
 * Extract region names from region data
 */
function extractRegionNames(region: RegionData): string[] {
  return [region.display_name, region.subregion, region.country, region.state]
    .filter(Boolean)
    .map((n) => String(n));
}

/**
 * Process region data for a coffee
 */
function processRegionData(
  coffeeId: string,
  regionData: unknown,
  regionsMap: Map<string, string[]>
): void {
  if (!regionData) {
    return;
  }

  const regions = Array.isArray(regionData) ? regionData : [regionData];
  for (const region of regions) {
    const regionTyped = region as RegionData;
    if (!regionTyped) {
      continue;
    }

    const regionNames = extractRegionNames(regionTyped);
    if (regionNames.length > 0) {
      const existing = regionsMap.get(coffeeId) || [];
      regionsMap.set(coffeeId, [...existing, ...regionNames]);
    }
  }
}

/**
 * Fetch and map coffee regions
 */
async function fetchCoffeeRegions(
  supabase: any,
  coffeeIds: string[]
): Promise<Map<string, string[]>> {
  const { data: regionsData } = await supabase
    .from("coffee_regions")
    .select(
      `
      coffee_id,
      regions:region_id (
        display_name,
        subregion,
        country,
        state
      )
    `
    )
    .in("coffee_id", coffeeIds);

  const regionsMap = new Map<string, string[]>();
  for (const cr of regionsData || []) {
    const coffeeId = cr.coffee_id as string | null;
    if (!coffeeId) {
      continue;
    }

    const regionData = cr.regions as unknown;
    processRegionData(coffeeId, regionData, regionsMap);
  }
  return regionsMap;
}

/**
 * Fetch and map coffee flavor notes
 */
async function fetchCoffeeFlavorNotes(
  supabase: any,
  coffeeIds: string[]
): Promise<Map<string, string[]>> {
  const { data: flavorNotesData } = await supabase
    .from("coffee_flavor_notes")
    .select(
      `
      coffee_id,
      flavor_notes:flavor_note_id (
        label
      )
    `
    )
    .in("coffee_id", coffeeIds);

  const flavorNotesMap = new Map<string, string[]>();
  for (const cfn of flavorNotesData || []) {
    const coffeeId = cfn.coffee_id as string | null;
    const flavorNoteData = cfn.flavor_notes as unknown;

    if (!(coffeeId && flavorNoteData)) {
      continue;
    }

    // Handle both single object and array responses
    const flavorNotes = Array.isArray(flavorNoteData)
      ? flavorNoteData
      : [flavorNoteData];
    for (const note of flavorNotes) {
      const noteTyped = note as FlavorNoteData;
      if (noteTyped?.label) {
        const existing = flavorNotesMap.get(coffeeId) || [];
        flavorNotesMap.set(coffeeId, [...existing, noteTyped.label]);
      }
    }
  }
  return flavorNotesMap;
}

/**
 * Extract roaster from coffee row
 */
function extractRoaster(
  roasterData: unknown
): { id: string; name: string; slug: string } | null {
  if (!roasterData) {
    return null;
  }

  const roasters = Array.isArray(roasterData) ? roasterData : [roasterData];
  const roaster = roasters[0] as {
    id: string;
    name: string;
    slug: string;
  } | null;

  if (!(roaster?.id && roaster?.name && roaster?.slug)) {
    return null;
  }

  return roaster;
}

/**
 * Map coffee data to SearchableItem
 */
function mapCoffeeToSearchableItem(options: {
  coffee: CoffeeRow;
  imageUrl: string | undefined;
  regionNames: string[];
  flavorNoteLabels: string[];
  ratingAvg: number | null;
}): SearchableItem | null {
  const { coffee, imageUrl, regionNames, flavorNoteLabels, ratingAvg } =
    options;
  if (!(coffee.coffee_id && coffee.slug && coffee.name)) {
    return null;
  }

  const roaster = extractRoaster(coffee.roasters);
  if (!roaster) {
    return null;
  }

  const searchableParts = [
    coffee.name,
    roaster.name,
    coffee.roast_level_raw,
    coffee.roast_style_raw,
    coffee.process_raw,
    ...regionNames,
  ].filter(Boolean);

  const searchableText = searchableParts.join(" ").toLowerCase();

  const tags = [
    coffee.roast_level_raw,
    coffee.roast_style_raw,
    coffee.process_raw,
    ...regionNames,
  ].filter(Boolean) as string[];

  const roastLevelLabel = coffee.roast_level_raw || coffee.roast_level || "";
  const processLabel = coffee.process_raw || coffee.process || "";
  const descriptionParts = [roaster.name, roastLevelLabel, processLabel].filter(
    Boolean
  );
  const description = descriptionParts.join(" • ");

  return {
    id: coffee.coffee_id,
    type: "coffee",
    title: coffee.name,
    description,
    url: `/roasters/${roaster.slug}/coffees/${coffee.slug}`,
    imageUrl,
    searchableText,
    flavorNotes: flavorNoteLabels.length > 0 ? flavorNoteLabels : undefined,
    tags,
    metadata: {
      coffee: {
        roasterName: roaster.name,
        region: regionNames.length > 0 ? regionNames.join(", ") : undefined,
        price: coffee.min_price_in_stock ?? undefined,
        bestNormalized250g: coffee.best_normalized_250g ?? undefined,
        rating: ratingAvg ?? undefined,
        roastLevel: coffee.roast_level_raw || undefined,
        process: coffee.process_raw || undefined,
      },
    },
  };
}

/**
 * Fetch rating data from coffees table
 */
async function fetchCoffeeRatings(
  supabase: any,
  coffeeIds: string[]
): Promise<Map<string, number | null>> {
  const { data: ratingsData } = await supabase
    .from("coffees")
    .select("id, rating_avg")
    .in("id", coffeeIds);

  const ratingsMap = new Map<string, number | null>();
  for (const coffee of ratingsData || []) {
    if (coffee.id) {
      ratingsMap.set(coffee.id, coffee.rating_avg ?? null);
    }
  }
  return ratingsMap;
}

/**
 * Fetch and map coffees to SearchableItem array
 */
async function fetchCoffees(supabase: any): Promise<SearchableItem[]> {
  const { data: coffeeData, error: coffeeError } = await supabase
    .from("coffee_summary")
    .select(
      `
      coffee_id,
      slug,
      name,
      roaster_id,
      status,
      roast_level,
      roast_level_raw,
      roast_style_raw,
      process,
      process_raw,
      min_price_in_stock,
      best_normalized_250g,
      roasters:roaster_id (
        id,
        name,
        slug
      )
    `
    )
    .not("name", "is", null)
    .not("slug", "is", null);

  if (coffeeError) {
    throw new Error(`Failed to fetch coffees: ${coffeeError.message}`);
  }

  if (!coffeeData || coffeeData.length === 0) {
    return [];
  }

  const coffeeIds = coffeeData
    .map((c: CoffeeRow) => c.coffee_id)
    .filter((id: string | null): id is string => Boolean(id));

  if (coffeeIds.length === 0) {
    return [];
  }

  // Fetch related data in parallel
  const [imagesMap, regionsMap, flavorNotesMap, ratingsMap] = await Promise.all(
    [
      fetchCoffeeImages(supabase, coffeeIds),
      fetchCoffeeRegions(supabase, coffeeIds),
      fetchCoffeeFlavorNotes(supabase, coffeeIds),
      fetchCoffeeRatings(supabase, coffeeIds),
    ]
  );

  // Map coffees to SearchableItem
  const items: SearchableItem[] = [];
  for (const coffee of coffeeData as CoffeeRow[]) {
    const imageUrl = imagesMap.get(coffee.coffee_id || "") || undefined;
    const regionNames = regionsMap.get(coffee.coffee_id || "") || [];
    const flavorNoteLabels = flavorNotesMap.get(coffee.coffee_id || "") || [];
    const ratingAvg = ratingsMap.get(coffee.coffee_id || "") ?? null;

    const item = mapCoffeeToSearchableItem({
      coffee,
      imageUrl,
      regionNames,
      flavorNoteLabels,
      ratingAvg,
    });

    if (item) {
      items.push(item);
    }
  }

  return items;
}

/**
 * Build coffee count map for roasters
 */
async function buildCoffeeCountMap(
  supabase: any,
  roasterIds: string[]
): Promise<Map<string, number>> {
  const { data: coffeeCounts } = await supabase
    .from("coffees")
    .select("roaster_id")
    .in("roaster_id", roasterIds);

  const coffeeCountMap = new Map<string, number>();
  for (const coffee of coffeeCounts || []) {
    if (coffee.roaster_id) {
      const current = coffeeCountMap.get(coffee.roaster_id) || 0;
      coffeeCountMap.set(coffee.roaster_id, current + 1);
    }
  }
  return coffeeCountMap;
}

/**
 * Map roaster to SearchableItem
 */
function mapRoasterToSearchableItem(
  roaster: RoasterRow,
  coffeeCount: number
): SearchableItem | null {
  if (!(roaster.id && roaster.slug && roaster.name)) {
    return null;
  }

  const locationParts = [
    roaster.hq_city,
    roaster.hq_state,
    roaster.hq_country,
  ].filter(Boolean) as string[];

  const description = locationParts.join(", ") || "Roaster";
  const searchableText = [roaster.name, ...locationParts]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return {
    id: roaster.id,
    type: "roaster",
    title: roaster.name,
    description,
    url: `/roasters/${roaster.slug}`,
    imageUrl: roaster.logo_url || roaster.image_url || undefined,
    searchableText,
    tags: locationParts,
    metadata: {
      roaster: {
        region: locationParts.length > 0 ? locationParts.join(", ") : undefined,
        coffeeCount: coffeeCount > 0 ? coffeeCount : undefined,
      },
    },
  };
}

/**
 * Fetch and map roasters to SearchableItem array
 */
async function fetchRoasters(supabase: any): Promise<SearchableItem[]> {
  const { data: roastersData, error: roastersError } = await supabase
    .from("roasters")
    .select(
      "id, slug, name, hq_city, hq_state, hq_country, logo_url, image_url, is_active"
    )
    .eq("is_active", true)
    .not("name", "is", null)
    .not("slug", "is", null);

  if (roastersError) {
    throw new Error(`Failed to fetch roasters: ${roastersError.message}`);
  }

  if (!roastersData || roastersData.length === 0) {
    return [];
  }

  // Get coffee counts per roaster
  const roasterIds = roastersData.map((r: RoasterRow) => r.id);
  const coffeeCountMap = await buildCoffeeCountMap(supabase, roasterIds);

  // Map roasters to SearchableItem
  const items: SearchableItem[] = [];
  for (const roaster of roastersData as RoasterRow[]) {
    const coffeeCount = coffeeCountMap.get(roaster.id) || 0;
    const item = mapRoasterToSearchableItem(roaster, coffeeCount);
    if (item) {
      items.push(item);
    }
  }

  return items;
}

/**
 * Build search index from coffees and roasters
 * Returns unified SearchableItem[] array for client-side search
 */
export async function buildSearchIndex(): Promise<SearchableItem[]> {
  const supabase = await createServiceRoleClient();

  // Fetch coffees and roasters in parallel
  const [coffeeItems, roasterItems] = await Promise.all([
    fetchCoffees(supabase),
    fetchRoasters(supabase),
  ]);

  return [...coffeeItems, ...roasterItems];
}

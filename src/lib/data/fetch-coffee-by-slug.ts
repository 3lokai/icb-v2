import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { fetchAllCoffeeImages } from "./fetch-coffees";
import type { CoffeeDetail } from "@/types/coffee-types";
import type {
  BrewMethod,
  CoffeeEstate,
  CoffeeImage,
  CoffeeRegion,
  CoffeeRoasterEmbedded,
  CoffeeSensory,
  CoffeeSummaryData,
  CoffeeVariant,
  FlavorNote,
} from "@/types/coffee-component-types";

type CoffeeRow = {
  id: string;
  slug: string | null;
  name: string | null;
  roaster_id: string | null;
  [key: string]: unknown;
};

/**
 * Build full CoffeeDetail from a coffees table row.
 * Fetches all related data (roaster, variants, images, etc.) and assembles CoffeeDetail.
 * Used by fetchCoffeeBySlug, fetchCoffeeByRoasterAndSlug, and fetchCoffeesBySlugOnly.
 */
async function buildCoffeeDetailFromRow(
  supabase: Awaited<ReturnType<typeof createClient>>,
  coffeeData: CoffeeRow
): Promise<CoffeeDetail | null> {
  if (!coffeeData.slug || !coffeeData.name || !coffeeData.roaster_id) {
    return null;
  }

  const coffeeId = coffeeData.id;

  const [
    roasterResult,
    variantsResult,
    imagesResult,
    sensoryResult,
    flavorNotesResult,
    brewMethodsResult,
    regionsResult,
    estatesResult,
    summaryResult,
    canonFlavorIdsResult,
  ] = await Promise.all([
    supabase
      .from("roasters")
      .select(
        "id, slug, name, website, hq_city, hq_state, hq_country, lat, lon, phone, support_email, instagram_handle, social_json, created_at, updated_at, default_concurrency"
      )
      .eq("id", coffeeData.roaster_id)
      .single(),

    supabase
      .from("variants")
      .select("*")
      .eq("coffee_id", coffeeId)
      .order("weight_g", { ascending: true }),

    fetchAllCoffeeImages(supabase, [coffeeId]),

    supabase
      .from("sensory_params")
      .select("*")
      .eq("coffee_id", coffeeId)
      .maybeSingle(),

    supabase
      .from("coffee_flavor_notes")
      .select("flavor_note_id, flavor_notes(id, key, label, group_key)")
      .eq("coffee_id", coffeeId),

    supabase
      .from("coffee_brew_methods")
      .select("brew_method_id, brew_methods(id, key, label)")
      .eq("coffee_id", coffeeId),

    supabase
      .from("coffee_regions")
      .select(
        "region_id, pct, regions(id, display_name, country, state, subregion)"
      )
      .eq("coffee_id", coffeeId),

    supabase
      .from("coffee_estates")
      .select(
        "estate_id, pct, estates(id, name, region_id, altitude_min_m, altitude_max_m, notes)"
      )
      .eq("coffee_id", coffeeId),

    supabase
      .from("coffee_summary")
      .select("*")
      .eq("coffee_id", coffeeId)
      .single(),

    supabase
      .from("coffee_directory_mv")
      .select("canon_flavor_node_ids, canon_flavor_slugs")
      .eq("coffee_id", coffeeId)
      .single(),
  ]);

  if (roasterResult.error || !roasterResult.data) {
    return null;
  }

  const roasterData = roasterResult.data;
  const roaster: CoffeeRoasterEmbedded = {
    id: roasterData.id,
    slug: roasterData.slug,
    name: roasterData.name,
    website: roasterData.website,
    hq_city: roasterData.hq_city,
    hq_state: roasterData.hq_state,
    hq_country: roasterData.hq_country,
    lat: roasterData.lat,
    lon: roasterData.lon,
    phone: roasterData.phone,
    support_email: roasterData.support_email,
    instagram_handle: roasterData.instagram_handle,
    social_json: roasterData.social_json,
    created_at: roasterData.created_at,
    updated_at: roasterData.updated_at,
    default_concurrency: roasterData.default_concurrency,
  };

  const variants: CoffeeVariant[] =
    variantsResult.data?.map((v) => ({
      id: v.id,
      coffee_id: v.coffee_id,
      platform_variant_id: v.platform_variant_id,
      sku: v.sku,
      barcode: v.barcode,
      weight_g: v.weight_g,
      grind: v.grind,
      pack_count: v.pack_count,
      currency: v.currency,
      price_current: v.price_current,
      compare_at_price: v.compare_at_price,
      in_stock: v.in_stock,
      stock_qty: v.stock_qty,
      subscription_available: v.subscription_available,
      status: v.status,
      created_at: v.created_at,
      updated_at: v.updated_at,
      last_seen_at: v.last_seen_at,
      price_last_checked_at: v.price_last_checked_at,
    })) || [];

  const images: CoffeeImage[] = imagesResult.get(coffeeId) || [];

  const sensory: CoffeeSensory | null = sensoryResult.data
    ? {
        acidity: sensoryResult.data.acidity,
        sweetness: sensoryResult.data.sweetness,
        bitterness: sensoryResult.data.bitterness,
        body: sensoryResult.data.body,
        aftertaste: sensoryResult.data.aftertaste,
        clarity: sensoryResult.data.clarity,
        confidence: sensoryResult.data.confidence,
        source: sensoryResult.data.source,
        notes: sensoryResult.data.notes,
        created_at: sensoryResult.data.created_at,
        updated_at: sensoryResult.data.updated_at,
      }
    : null;

  const flavorNotes: FlavorNote[] =
    flavorNotesResult.data
      ?.map((row) => {
        const fn = row.flavor_notes as unknown as {
          id: string;
          key: string;
          label: string;
          group_key: string | null;
        } | null;
        if (!fn) return null;
        return {
          id: fn.id,
          key: fn.key,
          label: fn.label,
          group_key: fn.group_key,
        };
      })
      .filter((fn): fn is FlavorNote => fn !== null) || [];

  const brewMethods: BrewMethod[] =
    brewMethodsResult.data
      ?.map((row) => {
        const bm = row.brew_methods as unknown as {
          id: string;
          key: string;
          label: string;
        } | null;
        if (!bm) return null;
        return {
          id: bm.id,
          key: bm.key,
          label: bm.label,
        };
      })
      .filter((bm): bm is BrewMethod => bm !== null) || [];

  const regions: CoffeeRegion[] =
    regionsResult.data
      ?.map((row) => {
        const region = row.regions as unknown as {
          id: string;
          display_name: string | null;
          country: string | null;
          state: string | null;
          subregion: string;
        } | null;
        if (!region) return null;
        return {
          id: region.id,
          display_name: region.display_name,
          country: region.country,
          state: region.state,
          subregion: region.subregion,
          pct: row.pct,
        };
      })
      .filter((r): r is CoffeeRegion => r !== null) || [];

  const estates: CoffeeEstate[] =
    estatesResult.data
      ?.map((row) => {
        const estate = row.estates as unknown as {
          id: string;
          name: string;
          region_id: string | null;
          altitude_min_m: number | null;
          altitude_max_m: number | null;
          notes: string | null;
        } | null;
        if (!estate) return null;
        return {
          id: estate.id,
          name: estate.name,
          region_id: estate.region_id,
          altitude_min_m: estate.altitude_min_m,
          altitude_max_m: estate.altitude_max_m,
          notes: estate.notes,
          pct: row.pct,
        };
      })
      .filter((e): e is CoffeeEstate => e !== null) || [];

  const canonFlavorIds: string[] =
    (canonFlavorIdsResult.data?.canon_flavor_node_ids as string[]) || [];
  const canonFlavorSlugs: string[] =
    (canonFlavorIdsResult.data?.canon_flavor_slugs as string[] | null)?.filter(
      Boolean
    ) ?? [];

  const summaryData = summaryResult.data;
  const summary: CoffeeSummaryData = summaryData
    ? {
        coffee_id: summaryData.coffee_id,
        status: summaryData.status,
        process: summaryData.process,
        process_raw: summaryData.process_raw,
        roast_level: summaryData.roast_level,
        roast_level_raw: summaryData.roast_level_raw,
        roast_style_raw: summaryData.roast_style_raw,
        direct_buy_url: summaryData.direct_buy_url,
        has_250g_bool: summaryData.has_250g_bool,
        has_sensory: summaryData.has_sensory,
        in_stock_count: summaryData.in_stock_count,
        min_price_in_stock: summaryData.min_price_in_stock,
        best_variant_id: summaryData.best_variant_id,
        best_normalized_250g: summaryData.best_normalized_250g,
        weights_available: summaryData.weights_available,
        sensory_public: summaryData.sensory_public,
        sensory_updated_at: summaryData.sensory_updated_at,
        seo_desc: summaryData.seo_desc ?? null,
      }
    : {
        coffee_id: coffeeId,
        status: coffeeData.status,
        process: coffeeData.process,
        process_raw: coffeeData.process_raw,
        roast_level: coffeeData.roast_level,
        roast_level_raw: coffeeData.roast_level_raw,
        roast_style_raw: coffeeData.roast_style_raw,
        direct_buy_url: coffeeData.direct_buy_url,
        has_250g_bool: null,
        has_sensory: sensory !== null,
        in_stock_count: null,
        min_price_in_stock: null,
        best_variant_id: null,
        best_normalized_250g: null,
        weights_available: null,
        sensory_public: null,
        sensory_updated_at: null,
        seo_desc: coffeeData.seo_desc ?? null,
      };

  return {
    id: coffeeData.id,
    slug: coffeeData.slug,
    name: coffeeData.name,
    roaster_id: coffeeData.roaster_id,
    description_md: coffeeData.description_md as string | null,
    direct_buy_url: coffeeData.direct_buy_url as string | null,
    status: coffeeData.status as CoffeeDetail["status"],
    is_coffee: coffeeData.is_coffee as boolean | null,
    is_limited: Boolean(coffeeData.is_limited),
    decaf: Boolean(coffeeData.decaf),
    crop_year: coffeeData.crop_year as number | null,
    harvest_window: coffeeData.harvest_window as string | null,
    roast_level: coffeeData.roast_level as CoffeeDetail["roast_level"],
    roast_level_raw: coffeeData.roast_level_raw as string | null,
    roast_style_raw: coffeeData.roast_style_raw as string | null,
    process: coffeeData.process as CoffeeDetail["process"],
    process_raw: coffeeData.process_raw as string | null,
    bean_species: coffeeData.bean_species as CoffeeDetail["bean_species"],
    default_grind: coffeeData.default_grind as CoffeeDetail["default_grind"],
    varieties: coffeeData.varieties as string[] | null,
    tags: coffeeData.tags as string[] | null,
    rating_avg: coffeeData.rating_avg as number | null,
    rating_count: Number(coffeeData.rating_count) || 0,
    roaster,
    variants,
    images,
    sensory,
    flavor_notes: flavorNotes,
    brew_methods: brewMethods,
    regions,
    estates,
    summary,
    canon_flavor_node_ids:
      canonFlavorIds.length > 0 ? canonFlavorIds : undefined,
    canon_flavor_slugs:
      canonFlavorSlugs.length > 0 ? canonFlavorSlugs : undefined,
  };
}

function getSupabase() {
  return process.env.SUPABASE_SECRET_KEY
    ? createServiceRoleClient()
    : createClient();
}

/**
 * Fetch a single coffee by slug with all related data (legacy: slug only, may be ambiguous).
 * Returns null if coffee not found.
 */
export async function fetchCoffeeBySlug(
  slug: string
): Promise<CoffeeDetail | null> {
  const supabase = await getSupabase();
  const { data: coffeeData, error: coffeeError } = await supabase
    .from("coffees")
    .select("*")
    .eq("slug", slug)
    .single();

  if (coffeeError || !coffeeData) {
    return null;
  }

  return buildCoffeeDetailFromRow(supabase, coffeeData as CoffeeRow);
}

/**
 * Fetch a single coffee by roaster slug and coffee slug (nested URL).
 * Returns null if roaster or coffee not found.
 */
export async function fetchCoffeeByRoasterAndSlug(
  roasterSlug: string,
  coffeeSlug: string
): Promise<CoffeeDetail | null> {
  const supabase = await getSupabase();

  const { data: roaster, error: roasterError } = await supabase
    .from("roasters")
    .select("id")
    .eq("slug", roasterSlug)
    .single();

  if (roasterError || !roaster) {
    return null;
  }

  const { data: coffeeData, error: coffeeError } = await supabase
    .from("coffees")
    .select("*")
    .eq("slug", coffeeSlug)
    .eq("roaster_id", roaster.id)
    .single();

  if (coffeeError || !coffeeData) {
    return null;
  }

  return buildCoffeeDetailFromRow(supabase, coffeeData as CoffeeRow);
}

/**
 * Fetch all coffees with the given slug (for legacy /coffees/[slug] redirect vs disambiguation).
 * Returns array of CoffeeDetail; may be 0, 1, or many.
 */
export async function fetchCoffeesBySlugOnly(
  slug: string
): Promise<CoffeeDetail[]> {
  const supabase = await getSupabase();
  const { data: rows, error } = await supabase
    .from("coffees")
    .select("*")
    .eq("slug", slug);

  if (error || !rows || rows.length === 0) {
    return [];
  }

  const results = await Promise.all(
    rows.map((row) => buildCoffeeDetailFromRow(supabase, row as CoffeeRow))
  );
  return results.filter((c): c is CoffeeDetail => c !== null);
}

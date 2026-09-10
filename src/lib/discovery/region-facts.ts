import { fetchRegionBySlugCached } from "@/lib/data/fetch-region-by-slug";
import type { LandingPageConfig } from "@/lib/discovery/landing-pages";
import type { RegionDetail } from "@/types/region-types";

/** One terroir card on a region landing page. `label` picks the icon at render. */
export type RegionFactCard = {
  label: string;
  value: string;
};

export type RegionFacts = {
  /** Overrides the config snapshot, which drifted (site said 900–1,700m, DB says 900–1,800m). */
  state: string | null;
  elevation: string | null;
  cards: RegionFactCard[];
};

function formatAltitude(region: RegionDetail): string | null {
  const { altitude_min_m: min, altitude_max_m: max } = region;
  if (min && max)
    return `${min.toLocaleString("en-IN")}–${max.toLocaleString("en-IN")}m`;
  return min
    ? `From ${min.toLocaleString("en-IN")}m`
    : max
      ? `Up to ${max.toLocaleString("en-IN")}m`
      : null;
}

function formatArea(region: RegionDetail): string | null {
  // Never render a figure without its provenance: the Coffee Board's older web figures
  // disagree with NRSC 2024 by up to 65%. Enforced in the DB by canon_regions_area_needs_source.
  if (!region.area_hectares || !region.area_source || !region.area_as_of) {
    return null;
  }
  const asOf = new Date(region.area_as_of).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
  return `${region.area_hectares.toLocaleString("en-IN")} ha under coffee (${region.area_source}, ${asOf})`;
}

/**
 * The canon region behind a landing page. Page slugs are not canon slugs, so try the
 * page slug first (`chikmagalur`, `northeast-india` are both real canon rows) and fall
 * back to the first slug the page filters on (`coorg` → `kodagu-coorg`).
 */
async function fetchCanonRegion(
  config: LandingPageConfig
): Promise<RegionDetail | null> {
  const byPageSlug = await fetchRegionBySlugCached(config.slug);
  if (byPageSlug) {
    return byPageSlug;
  }
  const [firstFilterSlug] = config.filter.region_slugs ?? [];
  return firstFilterSlug
    ? await fetchRegionBySlugCached(firstFilterSlug)
    : null;
}

/**
 * Terroir facts for a region landing page, read from `canon_regions`.
 *
 * The editorial voice (h1, intro, nudges, FAQ, flavour, roaster context) stays in
 * `region-pages.ts`; every fact below is sourced from the database so there is one
 * place to correct it. Missing values drop their card rather than render a blank —
 * `northeast-india` is an aggregate with no terroir of its own.
 */
export async function fetchRegionFacts(
  config: LandingPageConfig
): Promise<RegionFacts | null> {
  const region = await fetchCanonRegion(config);
  if (!region) {
    return null;
  }

  const cards: Array<RegionFactCard | null> = [
    region.climate ? { label: "Climate", value: region.climate } : null,
    region.soil ? { label: "Soil", value: region.soil } : null,
    formatAltitude(region)
      ? { label: "Altitude", value: formatAltitude(region) as string }
      : null,
    region.primary_varieties?.length
      ? { label: "Varieties", value: region.primary_varieties.join(", ") }
      : null,
    region.rainfall_mm
      ? {
          label: "Rainfall",
          value: `${region.rainfall_mm.toLocaleString("en-IN")}mm a year`,
        }
      : null,
    region.harvest_season
      ? { label: "Harvest", value: region.harvest_season }
      : null,
    region.intercrop_species?.length
      ? { label: "Intercrops", value: region.intercrop_species.join(", ") }
      : null,
    formatArea(region)
      ? { label: "Area", value: formatArea(region) as string }
      : null,
  ];

  return {
    state: region.state,
    elevation: formatAltitude(region),
    cards: cards.filter((card): card is RegionFactCard => card !== null),
  };
}

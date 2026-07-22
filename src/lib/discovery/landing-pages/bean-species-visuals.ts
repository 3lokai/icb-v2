// src/lib/discovery/landing-pages/bean-species-visuals.ts

/**
 * Shared "bean types at a glance" comparison data for the four species discovery
 * pages. The same grid renders on each species page with the current page
 * highlighted, so this is a single shared constant rather than per-page config.
 *
 * Images live under public/images/discovery/bean-types/ (user-provided source →
 * AVIF via `node scripts/tune-hero-avif-size.mjs --beans`).
 */
export type BeanSpeciesVisual = {
  slug: "arabica" | "robusta" | "liberica" | "excelsa";
  label: string;
  image: string;
  /** Short morphology line shown under the image. */
  shape: string;
};

export const BEAN_SPECIES_VISUALS: BeanSpeciesVisual[] = [
  {
    slug: "arabica",
    label: "Arabica",
    image: "/images/discovery/bean-types/arabica.avif",
    shape: "Flatter, oval bean with a curved center crease.",
  },
  {
    slug: "robusta",
    label: "Robusta",
    image: "/images/discovery/bean-types/robusta.avif",
    shape: "Rounder, smaller bean with a straight crease.",
  },
  {
    slug: "liberica",
    label: "Liberica",
    image: "/images/discovery/bean-types/liberica.avif",
    shape: "Large, asymmetric almond-shaped bean.",
  },
  {
    slug: "excelsa",
    label: "Excelsa",
    image: "/images/discovery/bean-types/excelsa.avif",
    shape: "Smaller Liberica-family bean, teardrop shaped.",
  },
];

/** Slugs that have a species image card in the comparison grid. */
const BEAN_SPECIES_SLUGS: Set<string> = new Set(
  BEAN_SPECIES_VISUALS.map((s) => s.slug)
);

/**
 * Categorical bean-type pages (sourcing / commercial concepts rather than
 * species). These have no bean morphology image, so they render as link pills
 * below the species image cards.
 */
export type BeanCategoryLink = {
  slug: "blends" | "chicory-mixes" | "single-origin";
  label: string;
};

export const BEAN_CATEGORY_LINKS: BeanCategoryLink[] = [
  { slug: "blends", label: "Blends" },
  { slug: "chicory-mixes", label: "Chicory Mixes" },
  { slug: "single-origin", label: "Single Origin" },
];

/** All bean-type page slugs that should render the comparison grid. */
export const BEAN_TYPE_NAV_SLUGS: Set<string> = new Set([
  ...BEAN_SPECIES_VISUALS.map((s) => s.slug),
  ...BEAN_CATEGORY_LINKS.map((c) => c.slug),
]);

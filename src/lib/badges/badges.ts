/**
 * Roaster & coffee badges (docs/roaster-assets.md).
 *
 * Pure module — no server imports — so the SVG routes, the /go redirect, the
 * badges-page configurator and the tests all share one source for enums, copy,
 * URLs and the renderer.
 */
import { FRAUNCES_400_WOFF2, FRAUNCES_600_WOFF2 } from "./fonts";
import { LOGO_PNG_DATA_URI } from "./logo";

export const BADGE_ENTITIES = ["roaster", "coffee"] as const;
export const ROASTER_BADGE_TYPES = [
  "listed",
  "rate",
  "explore",
  "count",
] as const;
export const COFFEE_BADGE_TYPES = ["listed", "rate", "view"] as const;
export const BADGE_THEMES = ["light", "dark", "mono"] as const;
export const BADGE_SIZES = ["compact", "standard"] as const;
export const BADGE_PLACEMENTS = [
  "product-page",
  "about-page",
  "footer",
  "reviews",
  "other",
] as const;

export type BadgeEntity = (typeof BADGE_ENTITIES)[number];
export type RoasterBadgeType = (typeof ROASTER_BADGE_TYPES)[number];
export type CoffeeBadgeType = (typeof COFFEE_BADGE_TYPES)[number];
export type BadgeType = RoasterBadgeType | CoffeeBadgeType;
export type BadgeTheme = (typeof BADGE_THEMES)[number];
export type BadgeSize = (typeof BADGE_SIZES)[number];
export type BadgePlacement = (typeof BADGE_PLACEMENTS)[number];

/**
 * Minimum ratings before the Rate badge shows a score (§5.4, §6.3). The
 * outreach hook rule (§25) reads this same constant so an email can never
 * promise a score the renderer would refuse to draw.
 */
export const MIN_RATINGS_FOR_BADGE = 5;

export const BADGE_TYPE_LABELS: Record<BadgeType, string> = {
  listed: "Listed",
  rate: "Rating & rate",
  explore: "Explore",
  view: "Tasting notes",
  count: "Coffee count",
};

export const BADGE_PLACEMENT_LABELS: Record<BadgePlacement, string> = {
  "product-page": "Product page",
  "about-page": "About page",
  footer: "Footer",
  reviews: "Reviews section",
  other: "Other",
};

export const BADGE_DIMENSIONS: Record<
  BadgeSize,
  { width: number; height: number }
> = {
  compact: { width: 196, height: 40 },
  standard: { width: 256, height: 56 },
};

export function badgeTypesFor(entity: BadgeEntity): readonly BadgeType[] {
  return entity === "roaster" ? ROASTER_BADGE_TYPES : COFFEE_BADGE_TYPES;
}

/** Slugs come from our own DB; anything else is rejected before a lookup. */
const SLUG_RE = /^[a-z0-9][a-z0-9_-]{0,199}$/i;
export function isValidSlug(value: string | undefined | null): value is string {
  return !!value && SLUG_RE.test(value);
}

function pick<T extends string>(
  allowed: readonly T[],
  value: string | null | undefined,
  fallback: T
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

/** Enum-validated query params. Unknown values fall back to defaults. */
export function parseBadgeParams(
  entity: BadgeEntity,
  params: URLSearchParams
): {
  type: BadgeType;
  theme: BadgeTheme;
  size: BadgeSize;
  placement: BadgePlacement;
} {
  return {
    type: pick(badgeTypesFor(entity), params.get("type"), "listed"),
    theme: pick(BADGE_THEMES, params.get("theme"), "light"),
    size: pick(BADGE_SIZES, params.get("size"), "standard"),
    placement: pick(BADGE_PLACEMENTS, params.get("placement"), "other"),
  };
}

export type BadgeData = {
  ratingAvg: number | null;
  ratingCount: number;
  /** Roaster only: public (active + seasonal) coffees. */
  coffeeCount?: number;
};

/** Count-weighted average across rating sources; unrated parts are ignored. */
export function combineRatings(
  parts: { ratingAvg: number | null; ratingCount: number }[]
): { ratingAvg: number | null; ratingCount: number } {
  let count = 0;
  let sum = 0;
  for (const p of parts) {
    if (p.ratingAvg == null || p.ratingCount <= 0) continue;
    count += p.ratingCount;
    sum += p.ratingAvg * p.ratingCount;
  }
  return { ratingAvg: count ? sum / count : null, ratingCount: count };
}

export function hasBadgeRating(data: BadgeData): boolean {
  return data.ratingAvg != null && data.ratingCount >= MIN_RATINGS_FOR_BADGE;
}

/**
 * The badge actually drawn: a count badge with no coffees degrades to Listed.
 * (The Rate badge adapts in badgeLead instead.) Never fabricates data.
 */
export function resolveBadgeType(
  entity: BadgeEntity,
  type: BadgeType,
  data: BadgeData
): BadgeType {
  if (type === "count" && (entity !== "roaster" || !data.coffeeCount))
    return "listed";
  return type;
}

/** First line of the badge; the second line is always the brand. */
export function badgeLead(
  entity: BadgeEntity,
  type: BadgeType,
  data: BadgeData
): string {
  switch (resolveBadgeType(entity, type, data)) {
    case "rate": {
      // One badge for both jobs: the score once there is one worth showing,
      // always with the CTA. Upgrades itself — no merchant edit.
      if (!hasBadgeRating(data))
        return entity === "roaster" ? "Rate us on" : "Rate this coffee on";
      const score = `★ ${data.ratingAvg!.toFixed(1)} · ${data.ratingCount} ratings`;
      return `${score} · ${entity === "roaster" ? "Rate us" : "Rate it"} on`;
    }
    case "explore":
      return "Explore our coffees on";
    case "view":
      return "Explore tasting notes on";
    case "count": {
      const n = data.coffeeCount!;
      return `${n} ${n === 1 ? "coffee" : "coffees"} listed on`;
    }
    default:
      return "Listed on";
  }
}

/** Static alt text for the embed snippet (dynamic numbers live in the SVG). */
export function badgeAlt(entity: BadgeEntity, type: BadgeType): string {
  switch (type) {
    case "rate":
      return entity === "roaster"
        ? "Rate us on IndianCoffeeBeans"
        : "Rate this coffee on IndianCoffeeBeans";
    case "explore":
      return "Explore our coffees on IndianCoffeeBeans";
    case "view":
      return "View this coffee on IndianCoffeeBeans";
    case "count":
      return "Our coffees on IndianCoffeeBeans";
    default:
      return "Listed on IndianCoffeeBeans";
  }
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Hex equivalents of the DESIGN.md background / border / muted-foreground /
// foreground tokens (light + dark). Hex, not oklch: the SVG renders on
// merchant sites in whatever browser their customers use.
const THEMES: Record<
  BadgeTheme,
  { bg: string; border: string; lead: string; brand: string }
> = {
  light: {
    bg: "#FCF9F2",
    border: "#DBD3C6",
    lead: "#6A5B44",
    brand: "#26170D",
  },
  dark: { bg: "#181410", border: "#392C23", lead: "#B3A299", brand: "#F2F0ED" },
  mono: { bg: "#FFFFFF", border: "#000000", lead: "#000000", brand: "#000000" },
};

const LAYOUT: Record<
  BadgeSize,
  {
    r: number;
    logo: number;
    pad: number;
    textX: number;
    leadY: number;
    leadSize: number;
    brandY: number;
    brandSize: number;
  }
> = {
  compact: {
    r: 8,
    logo: 24,
    pad: 8,
    textX: 38,
    leadY: 17,
    leadSize: 9,
    brandY: 31,
    brandSize: 12,
  },
  standard: {
    r: 10,
    logo: 32,
    pad: 12,
    textX: 54,
    leadY: 24,
    leadSize: 11.5,
    brandY: 42,
    brandSize: 16,
  },
};

// The site's display face, embedded (see ./fonts). ★ isn't in Fraunces and
// falls through to the serif stack.
const FONT = "Fraunces, Georgia, 'Times New Roman', serif";
const FONT_FACES = `<style>@font-face{font-family:Fraunces;font-weight:400;src:url(${FRAUNCES_400_WOFF2}) format('woff2')}@font-face{font-family:Fraunces;font-weight:600;src:url(${FRAUNCES_600_WOFF2}) format('woff2')}</style>`;

export function renderBadgeSvg(opts: {
  entity: BadgeEntity;
  type: BadgeType;
  theme: BadgeTheme;
  size: BadgeSize;
  data: BadgeData;
}): string {
  const { width, height } = BADGE_DIMENSIONS[opts.size];
  const c = THEMES[opts.theme];
  const l = LAYOUT[opts.size];
  const lead = escapeXml(badgeLead(opts.entity, opts.type, opts.data));
  const title = `${lead} IndianCoffeeBeans`;
  const logoY = (height - l.logo) / 2;
  // Mono drops the brand colour from the logo too.
  const filter =
    opts.theme === "mono"
      ? `<filter id="g"><feColorMatrix type="saturate" values="0"/></filter>`
      : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}"><title>${title}</title>${FONT_FACES}${filter}<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${l.r}" fill="${c.bg}" stroke="${c.border}"/><image x="${l.pad}" y="${logoY}" width="${l.logo}" height="${l.logo}" href="${LOGO_PNG_DATA_URI}"${opts.theme === "mono" ? ' filter="url(#g)"' : ""}/><text x="${l.textX}" y="${l.leadY}" font-family="${FONT}" font-size="${l.leadSize}" fill="${c.lead}">${lead}</text><text x="${l.textX}" y="${l.brandY}" font-family="${FONT}" font-size="${l.brandSize}" font-weight="600" fill="${c.brand}">IndianCoffeeBeans</text></svg>`;
}

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

export type BadgeTarget =
  | { entity: "roaster"; roasterSlug: string }
  | { entity: "coffee"; roasterSlug: string; coffeeSlug: string };

function entityPath(t: BadgeTarget): string {
  return t.entity === "roaster"
    ? `roaster/${t.roasterSlug}`
    : `coffee/${t.roasterSlug}/${t.coffeeSlug}`;
}

export function badgeImagePath(
  t: BadgeTarget,
  o: { type: BadgeType; theme: BadgeTheme; size: BadgeSize }
): string {
  return `/badges/${entityPath(t)}.svg?type=${o.type}&theme=${o.theme}&size=${o.size}`;
}

export function badgeLinkPath(
  t: BadgeTarget,
  o: { type: BadgeType; placement: BadgePlacement }
): string {
  return `/go/${entityPath(t)}?source=badge&type=${o.type}&placement=${o.placement}`;
}

/**
 * Where a badge click lands. Built only from validated slugs + enums, so the
 * /go redirect can never be pointed off-site.
 */
export function badgeDestinationPath(t: BadgeTarget, type: BadgeType): string {
  const base =
    t.entity === "roaster"
      ? `/roasters/${t.roasterSlug}`
      : `/roasters/${t.roasterSlug}/coffees/${t.coffeeSlug}`;
  switch (type) {
    case "rate":
      return `${base}#rate-section`;
    case "explore":
    case "count":
      return `${base}#coffees`;
    default:
      return base;
  }
}

/** Copy-paste HTML: a link + hosted SVG. No JS, no iframe. */
export function badgeEmbedHtml(
  siteUrl: string,
  t: BadgeTarget,
  o: {
    type: BadgeType;
    theme: BadgeTheme;
    size: BadgeSize;
    placement: BadgePlacement;
  }
): string {
  const { width, height } = BADGE_DIMENSIONS[o.size];
  const href = escapeXml(`${siteUrl}${badgeLinkPath(t, o)}`);
  const src = escapeXml(`${siteUrl}${badgeImagePath(t, o)}`);
  return `<a href="${href}" target="_blank" rel="noopener"><img src="${src}" alt="${badgeAlt(t.entity, o.type)}" width="${width}" height="${height}" loading="lazy" style="border:0" /></a>`;
}

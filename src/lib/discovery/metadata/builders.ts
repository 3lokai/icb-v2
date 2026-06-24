// src/lib/discovery/metadata/builders.ts
import type { LandingPageConfig } from "../landing-pages";
import { clampDescription } from "@/lib/seo/metadata";
const ROAST_PROFILE_KEYWORD_CAP = 8;

function firstSentence(text: string): string {
  const t = text.trim();
  const m = t.match(/^(.+?[.!?])(\s|$)/);
  return (m ? m[1] : t).trim();
}

function dedupeKeywordsPreserveOrder(keywords: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of keywords) {
    const lower = k.toLowerCase().trim();
    if (!lower || seen.has(lower)) continue;
    seen.add(lower);
    out.push(k.trim());
  }
  return out;
}

/** Append " Coffee" when the entity label does not already include it. */
function withCoffeeSuffix(label: string): string {
  return label.includes("Coffee") ? label : `${label} Coffee`;
}

/**
 * Meta description: intro, plus first sentence of Indian context for roast pages when distinct.
 */
export function buildDiscoveryDescription(config: LandingPageConfig): string {
  if (config.metaDescription) {
    return clampDescription(
      config.metaDescription,
      "Browse Indian specialty coffees with community ratings on Indian Coffee Beans."
    );
  }

  let desc = config.intro.trim();

  if (
    config.type === "roast_level" &&
    config.roastProfile?.flavourProfile.indianContext
  ) {
    const extra = firstSentence(
      config.roastProfile.flavourProfile.indianContext
    );
    if (extra.length > 0) {
      const prefix = extra.slice(0, 48).toLowerCase();
      const introLower = desc.toLowerCase();
      if (!introLower.includes(prefix)) {
        desc = `${desc} ${extra}`.trim();
      }
    }
  }

  return clampDescription(
    desc,
    "Browse Indian specialty coffees with community ratings on Indian Coffee Beans."
  );
}

/**
 * Build SEO title for discovery landing pages
 */
export function buildDiscoveryTitle(config: LandingPageConfig): string {
  // Root layout appends "| Indian Coffee Beans" via title template
  if (config.seoTitle) {
    return config.seoTitle;
  }
  if (config.type === "roast_level") {
    return `${config.entityLabel} Coffee in India – Discover & Compare`;
  }
  if (config.type === "brew_method") {
    return `Best Coffees for ${config.entityLabel} in India – Discover & Compare`;
  }
  if (config.type === "price_bucket") {
    return `Best Coffees ${config.entityLabel} in India – Discover & Compare`;
  }
  if (config.type === "process") {
    return `${withCoffeeSuffix(config.entityLabel)} in India – Discover & Compare`;
  }
  if (config.type === "region") {
    return `${withCoffeeSuffix(config.entityLabel)} in India – Discover & Compare`;
  }
  if (config.type === "bean_type") {
    return `${withCoffeeSuffix(config.entityLabel)} in India – Discover & Compare`;
  }
  return config.h1;
}

/**
 * Build keyword list by page type (expanded for SEO)
 */
export function buildDiscoveryKeywords(config: LandingPageConfig): string[] {
  const base =
    config.type === "price_bucket"
      ? ["Indian coffee", "specialty coffee India", "buy coffee online India"]
      : ["Indian coffee", "specialty coffee India"];

  if (config.type === "brew_method") {
    const methodName = config.entityLabel;
    return [
      ...base,
      methodName,
      `best coffee for ${methodName}`,
      `${methodName} coffee India`,
      `${methodName} beans India`,
    ];
  }
  if (config.type === "roast_level") {
    const roastName = config.entityLabel;
    const core = [
      ...base,
      roastName,
      `${roastName} roast`,
      "roast levels",
      "coffee roast India",
      `${roastName.toLowerCase()} roast beans`,
    ];
    const typical = config.roastProfile?.flavourProfile.typical ?? [];
    const fromProfile = typical
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, ROAST_PROFILE_KEYWORD_CAP);
    return dedupeKeywordsPreserveOrder([...core, ...fromProfile]);
  }
  if (config.type === "price_bucket") {
    const priceText = config.entityLabel;
    const bucketExtras: Record<string, string[]> = {
      budget: [
        "budget coffee India",
        "affordable specialty coffee",
        "coffee under 500 rupees",
      ],
      "mid-range": [
        "mid range coffee India",
        "premium specialty coffee India",
        "coffee between 500 and 1000 rupees",
      ],
      // Distinct from "budget" (≤₹500 / affordable) and "mid-range" (₹500–₹1000 / premium)
      // to avoid cross-page keyword cannibalization between the price buckets.
      "under-1000": [
        "best coffee under 1000",
        "best coffee under 1000 rupees India",
        "best coffee beans in India",
      ],
      premium: [
        "premium coffee India",
        "best premium coffee India",
        "luxury coffee India",
        "coffee over 1000 rupees",
      ],
    };
    const extras = bucketExtras[config.slug] ?? [
      "specialty coffee price India",
      "coffee value",
    ];
    // Exclude keywords owned by sibling price buckets so the price pages
    // (budget / mid-range / under-1000) don't cannibalize each other's terms.
    const siblingExtras = new Set(
      Object.entries(bucketExtras)
        .filter(([slug]) => slug !== config.slug)
        .flatMap(([, kws]) => kws)
        .map((k) => k.toLowerCase())
    );
    return dedupeKeywordsPreserveOrder(
      [
        ...base,
        priceText,
        `${priceText} coffee`,
        "coffee price India",
        ...extras,
      ].filter((k) => !siblingExtras.has(k.toLowerCase()))
    );
  }
  if (config.type === "process") {
    const label = config.entityLabel;
    return [
      ...base,
      label,
      `${label} coffee India`,
      "coffee processing India",
      "Indian coffee processing",
      `${label} process India`,
    ];
  }
  if (config.type === "region") {
    const regionName = config.entityLabel;
    return [
      ...base,
      regionName,
      `${regionName} coffee`,
      `${regionName} arabica`,
      "Indian coffee regions",
      "single origin India",
      "coffee origin India",
    ];
  }
  if (config.type === "bean_type") {
    const beanName = config.entityLabel;
    return dedupeKeywordsPreserveOrder([
      ...base,
      beanName,
      `${beanName} coffee`,
      `${beanName} coffee India`,
      `${beanName} beans India`,
      "coffee bean types India",
    ]);
  }
  return base;
}

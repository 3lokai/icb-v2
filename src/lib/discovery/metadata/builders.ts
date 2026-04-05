// src/lib/discovery/metadata/builders.ts
import type { LandingPageConfig } from "../landing-pages";

const META_DESCRIPTION_MAX = 320;
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

/**
 * Meta description: intro, plus first sentence of Indian context for roast pages when distinct.
 */
export function buildDiscoveryDescription(config: LandingPageConfig): string {
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

  if (desc.length > META_DESCRIPTION_MAX) {
    return `${desc.slice(0, META_DESCRIPTION_MAX - 1).trimEnd()}…`;
  }
  return desc;
}

/**
 * Build SEO title for discovery landing pages
 */
export function buildDiscoveryTitle(config: LandingPageConfig): string {
  if (config.type === "roast_level") {
    const roastName = config.h1.replace(" Coffee in India", "").trim();
    return `${roastName} Coffee in India – Discover & Compare | Indian Coffee Beans`;
  }
  if (config.type === "brew_method") {
    const methodName = config.h1
      .replace("Best Coffees for ", "")
      .replace(" in India", "")
      .trim();
    return `Best Coffees for ${methodName} in India – Discover & Compare | Indian Coffee Beans`;
  }
  if (config.type === "price_bucket") {
    const priceText = config.h1
      .replace("Best Coffees ", "")
      .replace(" in India", "")
      .trim();
    return `Best Coffees ${priceText} in India – Discover & Compare | Indian Coffee Beans`;
  }
  if (config.type === "process") {
    const processName = config.h1.replace(" Coffee in India", "").trim();
    return `${processName} in India – Discover & Compare | Indian Coffee Beans`;
  }
  if (config.type === "region") {
    const regionName = config.h1.replace(" Coffee in India", "").trim();
    return `${regionName} in India – Discover & Compare | Indian Coffee Beans`;
  }
  return `${config.h1} | Indian Coffee Beans`;
}

/**
 * Build keyword list by page type (expanded for SEO)
 */
export function buildDiscoveryKeywords(config: LandingPageConfig): string[] {
  const base = [
    "Indian coffee",
    "specialty coffee India",
    "buy coffee online India",
    "Indian Coffee Beans",
  ];

  if (config.type === "brew_method") {
    const methodName = config.h1
      .replace("Best Coffees for ", "")
      .replace(" in India", "")
      .trim();
    return [
      ...base,
      methodName,
      `${methodName} coffee`,
      `${methodName} India`,
      "brewing methods",
      "coffee brewing India",
      "specialty coffee brewing",
    ];
  }
  if (config.type === "roast_level") {
    const roastName = config.h1.replace(" Coffee in India", "").trim();
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
    return [
      ...base,
      "coffee price India",
      "budget coffee",
      "affordable specialty coffee",
      "coffee under 500",
      "mid range coffee India",
      "coffee value",
    ];
  }
  if (config.type === "process") {
    const label = config.h1.replace(" Coffee in India", "").trim();
    return [
      ...base,
      label,
      `${label} coffee`,
      "coffee processing",
      "coffee process India",
      "Indian coffee processing",
      "coffee fermentation",
      "specialty coffee process",
    ];
  }
  if (config.type === "region") {
    const regionName = config.h1.replace(" Coffee in India", "").trim();
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
  return base;
}

// src/lib/discovery/metadata/builders.ts
import type { LandingPageConfig } from "../landing-pages";

const META_DESCRIPTION_MAX = 158;
const ROAST_PROFILE_KEYWORD_CAP = 8;

/** Strip trailing " in India" from discovery h1 while keeping e.g. "… Coffee". */
function labelWithoutIndiaSuffix(h1: string): string {
  return h1.replace(/\s+in India\s*$/i, "").trim();
}

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
    const processName = labelWithoutIndiaSuffix(config.h1);
    const processTitle = processName.includes("Coffee")
      ? processName
      : `${processName} Coffee`;
    return `${processTitle} in India – Discover & Compare | Indian Coffee Beans`;
  }
  if (config.type === "region") {
    const regionName = labelWithoutIndiaSuffix(config.h1);
    const regionTitle = regionName.includes("Coffee")
      ? regionName
      : `${regionName} Coffee`;
    return `${regionTitle} in India – Discover & Compare | Indian Coffee Beans`;
  }
  return `${config.h1} | Indian Coffee Beans`;
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
    const methodName = config.h1
      .replace("Best Coffees for ", "")
      .replace(" in India", "")
      .trim();
    return [
      ...base,
      methodName,
      `best coffee for ${methodName}`,
      `${methodName} coffee India`,
      `${methodName} beans India`,
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
    const priceText = config.h1
      .replace("Best Coffees ", "")
      .replace(" in India", "")
      .trim();
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
    };
    const extras = bucketExtras[config.slug] ?? [
      "specialty coffee price India",
      "coffee value",
    ];
    return dedupeKeywordsPreserveOrder([
      ...base,
      priceText,
      `${priceText} coffee`,
      "coffee price India",
      ...extras,
    ]);
  }
  if (config.type === "process") {
    const label = labelWithoutIndiaSuffix(config.h1);
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
    const regionName = labelWithoutIndiaSuffix(config.h1);
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

// src/lib/discovery/generate-metadata.ts
import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import type { LandingPageConfig } from "./landing-pages";
import { discoveryPagePath } from "./landing-pages";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

/**
 * Build SEO title for discovery landing pages
 */
function buildDiscoveryTitle(config: LandingPageConfig): string {
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
function buildDiscoveryKeywords(config: LandingPageConfig): string[] {
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
    return [
      ...base,
      roastName,
      `${roastName} roast`,
      "roast levels",
      "coffee roast India",
      `${roastName.toLowerCase()} roast beans`,
    ];
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

/**
 * Generate metadata for discovery landing pages
 */
export function generateDiscoveryMetadata(config: LandingPageConfig): Metadata {
  const title = buildDiscoveryTitle(config);
  const description = config.intro;
  const canonical = `${BASE_URL}${discoveryPagePath(config.slug)}`;
  const keywords = buildDiscoveryKeywords(config);

  return generateSEOMetadata({
    title,
    description,
    keywords,
    type: "website",
    canonical,
    noIndex: false,
  });
}

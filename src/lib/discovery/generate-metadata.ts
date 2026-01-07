// src/lib/discovery/generate-metadata.ts
import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import type { LandingPageConfig } from "./landing-pages";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

/**
 * Generate metadata for discovery landing pages
 * Follows PRD format exactly
 * Uses existing generateSEOMetadata utility for OG images, keywords, etc.
 */
export function generateDiscoveryMetadata(config: LandingPageConfig): Metadata {
  // Build title per PRD format
  let title: string;
  if (config.type === "roast_level") {
    // Format: "{Roast} Roast Coffee in India – Discover & Compare | Indian Coffee Beans"
    const roastName = config.h1.replace(" Coffee in India", "").trim();
    title = `${roastName} Coffee in India – Discover & Compare | Indian Coffee Beans`;
  } else if (config.type === "brew_method") {
    // Format: "Best Coffees for {Method} in India – Discover & Compare | Indian Coffee Beans"
    const methodName = config.h1
      .replace("Best Coffees for ", "")
      .replace(" in India", "")
      .trim();
    title = `Best Coffees for ${methodName} in India – Discover & Compare | Indian Coffee Beans`;
  } else {
    // Format: "Best Coffees Under {Price} in India – Discover & Compare | Indian Coffee Beans"
    const priceText = config.h1
      .replace("Best Coffees ", "")
      .replace(" in India", "")
      .trim();
    title = `Best Coffees ${priceText} in India – Discover & Compare | Indian Coffee Beans`;
  }

  // Build description - decision-oriented, not marketing fluff
  const description = config.intro;

  // Build canonical URL
  const canonical = `${BASE_URL}/${config.slug}`;

  // Build keywords based on page type
  const keywords: string[] = [];
  if (config.type === "brew_method") {
    const methodName = config.h1
      .replace("Best Coffees for ", "")
      .replace(" in India", "")
      .trim();
    keywords.push(methodName, `${methodName} coffee`, "brewing methods");
  } else if (config.type === "roast_level") {
    const roastName = config.h1.replace(" Coffee in India", "").trim();
    keywords.push(roastName, `${roastName} roast`, "roast levels");
  } else {
    keywords.push("coffee price", "budget coffee", "affordable coffee");
  }

  // Use existing SEO metadata generator
  // This handles OG images, keywords merging, robots, OpenGraph, Twitter cards
  return generateSEOMetadata({
    title,
    description,
    keywords,
    type: "website",
    canonical,
    noIndex: false, // All discovery pages should be indexed
  });
}

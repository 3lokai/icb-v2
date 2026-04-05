// src/lib/discovery/metadata/generate-discovery-metadata.ts
import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import type { LandingPageConfig } from "../landing-pages";
import { discoveryPagePath } from "../landing-pages";
import {
  buildDiscoveryDescription,
  buildDiscoveryKeywords,
  buildDiscoveryTitle,
} from "./builders";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

/**
 * Generate metadata for discovery landing pages
 */
export function generateDiscoveryMetadata(config: LandingPageConfig): Metadata {
  const title = buildDiscoveryTitle(config);
  const description = buildDiscoveryDescription(config);
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

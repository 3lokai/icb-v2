// lib/seo/metadata.ts
import type { Metadata } from "next";

/** Root layout title template suffix (see src/app/layout.tsx) */
export const TITLE_TEMPLATE_SUFFIX = " | Indian Coffee Beans";

/** Max rendered title length including template suffix */
export const TITLE_MAX_LENGTH = 60;

/** Meta description length bounds */
export const META_DESCRIPTION_MIN = 120;
export const META_DESCRIPTION_MAX = 160;

/**
 * Clamp a page title so `title + suffix` stays within maxTotalLength.
 * Cuts back to a word boundary before the ellipsis — a raw index slice produced
 * "Naivo Coffee — Bangalore Specialty Ro…" in the SERP.
 * Pass suffix "" for routes that opt out of the root template via `title.absolute`.
 */
export function truncateTitle(
  title: string,
  maxTotalLength: number = TITLE_MAX_LENGTH,
  suffix: string = TITLE_TEMPLATE_SUFFIX
): string {
  const maxPageTitle = maxTotalLength - suffix.length;
  if (title.length <= maxPageTitle) return title;
  if (maxPageTitle <= 1) return title.slice(0, maxTotalLength);
  const cut = title.slice(0, maxPageTitle - 1).trimEnd();
  const lastSpace = cut.lastIndexOf(" ");
  // Only fall back to the hard cut if trimming to the word boundary would gut the title.
  const body = lastSpace > maxPageTitle / 2 ? cut.slice(0, lastSpace) : cut;
  return `${body.replace(/[\s\u2013\u2014:,|-]+$/, "")}…`;
}

/**
 * Clamp meta description to SEO-friendly length (120–160 chars).
 * Pads short descriptions with fallback; trims long ones with ellipsis.
 */
export function clampDescription(
  description: string,
  fallback?: string
): string {
  let desc = description.trim();
  if (desc.length < META_DESCRIPTION_MIN && fallback) {
    desc = `${desc} ${fallback}`.trim();
  }
  if (desc.length > META_DESCRIPTION_MAX) {
    return `${desc.slice(0, META_DESCRIPTION_MAX - 1).trimEnd()}…`;
  }
  return desc;
}

// Define structures for detailed Open Graph types
type OGProductDetails = {
  price?: string;
  currency?: string;
  availability?: boolean; // boolean from your database
};

type OGArticleDetails = {
  publishedTime?: string; // ISO 8601 date string
  modifiedTime?: string; // ISO 8601 date string
  authors?: string[]; // Array of author profile URLs or names
  tags?: string[]; // Array of keywords/tags
};

type MetadataProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "product";
  canonical?: string;
  noIndex?: boolean;
  /** Opt out of the root layout's " | Indian Coffee Beans" template (see src/app/layout.tsx). */
  absoluteTitle?: boolean;
  productDetails?: OGProductDetails;
  articleDetails?: OGArticleDetails;
  other?: Record<string, string | string[] | undefined>;
};

// Helper: Build OG image URL
function buildOGImageUrl(
  baseUrl: string,
  title: string | undefined,
  image: string | undefined,
  type: string
): string {
  // Default to favicon PNG for OG (smaller, no SVG fetch)
  const defaultImage = `${baseUrl}/favicon/android-chrome-512x512.png`;

  if (image) {
    if (image.startsWith("http")) {
      return image;
    }
    return `${baseUrl}/api/og?title=${encodeURIComponent(title || "")}&image=${encodeURIComponent(image)}&type=${type}`;
  }
  return `${baseUrl}/api/og?title=${encodeURIComponent(title || "")}&image=${encodeURIComponent(defaultImage)}&type=${type}`;
}

// Helper: Merge keywords with defaults
function mergeKeywords(keywords: string[] | null | undefined): string[] {
  const defaultKeywords = ["Indian coffee", "specialty coffee India"];
  return [...new Set([...defaultKeywords, ...(keywords ?? [])])];
}

// Helper: Build base OpenGraph object
type OpenGraphParams = {
  title: string | undefined;
  description: string;
  ogImageUrl: string;
  canonical: string | undefined;
  baseUrl: string;
  type: string;
};

function buildBaseOpenGraph(
  params: OpenGraphParams
): NonNullable<Metadata["openGraph"]> {
  const { title, description, ogImageUrl, canonical, baseUrl, type } = params;
  return {
    title,
    description,
    type: (type === "product" ? "website" : type) as "website" | "article",
    url: canonical || baseUrl,
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title || "" }],
    siteName: "Indian Coffee Beans",
  };
}

// Helper: Enhance OpenGraph with article details
function enhanceOpenGraphWithArticle(
  openGraph: NonNullable<Metadata["openGraph"]>,
  articleDetails: OGArticleDetails
): void {
  type ArticleOG = typeof openGraph & {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
  const articleOG = openGraph as ArticleOG;

  if (articleDetails.publishedTime) {
    articleOG.publishedTime = articleDetails.publishedTime;
  }
  if (articleDetails.modifiedTime) {
    articleOG.modifiedTime = articleDetails.modifiedTime;
  }
  if (articleDetails.authors && articleDetails.authors.length > 0) {
    articleOG.authors = articleDetails.authors;
  }
  if (articleDetails.tags && articleDetails.tags.length > 0) {
    articleOG.tags = articleDetails.tags;
  }
}

// Helper: Build product metadata
function buildProductMetadata(
  productDetails: OGProductDetails
): Record<string, string> {
  const productMeta: Record<string, string> = {};

  if (productDetails.price && productDetails.currency) {
    productMeta["product:price:amount"] = productDetails.price;
    productMeta["product:price:currency"] = productDetails.currency;
  }

  if (productDetails.availability !== undefined) {
    productMeta["product:availability"] = productDetails.availability
      ? "instock"
      : "out of stock";
  }

  return productMeta;
}

export function generateMetadata({
  title,
  description = "Discover premium coffee beans and roasters from India. Explore the rich world of Indian specialty coffee.",
  keywords = [],
  image,
  type = "website",
  canonical,
  noIndex = false,
  absoluteTitle = false,
  productDetails,
  articleDetails,
  other,
}: MetadataProps): Metadata {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

  const normalizedDescription = clampDescription(
    description,
    "Explore India's specialty coffee directory — roasters, beans, and brewing guides."
  );

  // Resolve relative canonical paths to absolute URLs
  // e.g. "/about" → "https://www.indiancoffeebeans.com/about"
  const resolvedCanonical = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${baseUrl}${canonical.startsWith("/") ? "" : "/"}${canonical}`
    : undefined;

  const mergedKeywords = mergeKeywords(keywords);

  // Clamp once, here, so no caller can ship an over-length title. Callers that
  // already sized their title correctly pass through untouched.
  const clampedTitle = title
    ? truncateTitle(
        title,
        TITLE_MAX_LENGTH,
        absoluteTitle ? "" : TITLE_TEMPLATE_SUFFIX
      )
    : title;

  const ogImageUrl = buildOGImageUrl(baseUrl, clampedTitle, image, type);
  const openGraph = buildBaseOpenGraph({
    title: clampedTitle,
    description: normalizedDescription,
    ogImageUrl,
    canonical: resolvedCanonical,
    baseUrl,
    type,
  });

  // Add article-specific properties if type is article
  if (type === "article" && articleDetails) {
    enhanceOpenGraphWithArticle(openGraph, articleDetails);
  }

  const metadata: Metadata = {
    title:
      absoluteTitle && clampedTitle ? { absolute: clampedTitle } : clampedTitle,
    description: normalizedDescription,
    keywords: mergedKeywords,
    metadataBase: new URL(baseUrl),
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: resolvedCanonical || undefined,
      ...(resolvedCanonical && {
        languages: {
          en: resolvedCanonical,
          "x-default": resolvedCanonical,
        },
      }),
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: clampedTitle,
      description: normalizedDescription,
      images: [ogImageUrl],
    },
  };

  // Collect all 'other' metadata
  const otherMetadata: Record<string, string | string[]> = {};

  // Add product-specific metadata using the 'other' property for custom meta tags
  if (type === "product" && productDetails) {
    const productMeta = buildProductMetadata(productDetails);
    Object.assign(otherMetadata, productMeta);
  }

  // Merge any additional 'other' metadata (e.g., structured data JSON-LD)
  if (other) {
    // Filter out undefined values to match Next.js Metadata type
    const filteredOther = Object.fromEntries(
      Object.entries(other).filter(([, value]) => value !== undefined)
    ) as Record<string, string | string[]>;

    Object.assign(otherMetadata, filteredOther);
  }

  // Only assign if we have any 'other' metadata
  if (Object.keys(otherMetadata).length > 0) {
    metadata.other = otherMetadata;
  }

  return metadata;
}

// lib/seo/metadata.ts
import type { Metadata } from "next";

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
  if (image) {
    if (image.startsWith("http")) {
      return image;
    }
    return `${baseUrl}/api/og?title=${encodeURIComponent(title || "")}&image=${encodeURIComponent(image)}&type=${type}`;
  }
  return `${baseUrl}/api/og?title=${encodeURIComponent(title || "")}`;
}

// Helper: Merge keywords with defaults
function mergeKeywords(keywords: string[]): string[] {
  const defaultKeywords = [
    "coffee",
    "Indian coffee",
    "coffee beans",
    "specialty coffee",
    "coffee roasters",
    "coffee directory",
  ];
  return [...new Set([...defaultKeywords, ...keywords])];
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
  productDetails,
  articleDetails,
  other,
}: MetadataProps): Metadata {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
  const mergedKeywords = mergeKeywords(keywords);
  const ogImageUrl = buildOGImageUrl(baseUrl, title, image, type);
  const openGraph = buildBaseOpenGraph({
    title,
    description,
    ogImageUrl,
    canonical,
    baseUrl,
    type,
  });

  // Add article-specific properties if type is article
  if (type === "article" && articleDetails) {
    enhanceOpenGraphWithArticle(openGraph, articleDetails);
  }

  const metadata: Metadata = {
    title,
    description,
    keywords: mergedKeywords,
    metadataBase: new URL(baseUrl),
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: canonical || undefined,
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

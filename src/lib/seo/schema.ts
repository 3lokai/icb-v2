// lib/seo/schema.ts

import { getCoffeeDisplayName } from "@/lib/utils/coffee-name";
import type { CoffeeSummary } from "@/types/coffee-types";

/**
 * ItemList entry for a coffee in a directory/discovery/curation ItemList.
 *
 * Emits an `@type: Product` only when it can be valid for Google — i.e. it has a
 * priced `offers` and/or an `aggregateRating`. Google requires one of
 * offers/review/aggregateRating on a Product, and a price-less Offer is itself
 * invalid, so coffees with neither a price nor reviews (e.g. delisted / never
 * priced / permanently out of stock) are emitted as a plain ListItem (name + url)
 * which carries no Product validation obligation.
 */
export function coffeeProductListItem(
  c: CoffeeSummary,
  baseUrl: string,
  position: number
): Record<string, unknown> {
  const url = `${baseUrl}/roasters/${c.roaster_slug}/coffees/${c.slug}`;
  const price = c.min_price_in_stock ?? c.best_normalized_250g;
  const hasRating = c.rating_avg != null && c.rating_count > 0;

  // No price and no rating → no valid Product possible; emit a plain ListItem.
  if (price == null && !hasRating) {
    return {
      "@type": "ListItem",
      position,
      name: getCoffeeDisplayName(c),
      url,
    };
  }

  const product: Record<string, unknown> = {
    "@type": "Product",
    name: getCoffeeDisplayName(c),
    url,
  };
  if (c.roaster_name)
    product.brand = { "@type": "Brand", name: c.roaster_name };
  if (c.image_url) product.image = c.image_url;
  if (price != null) {
    product.offers = {
      "@type": "Offer",
      price,
      priceCurrency: "INR",
      availability:
        (c.in_stock_count ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    };
  }
  if (hasRating) {
    product.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: c.rating_avg,
      ratingCount: c.rating_count,
    };
  }
  return { "@type": "ListItem", position, item: product };
}

/** Base URL for the site; use for absolute breadcrumb and schema URLs */
export function getSeoBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";
}

type SchemaOrgProps = {
  type: "Product" | "LocalBusiness" | "Article" | "WebPage";
  name: string;
  description?: string;
  image?: string;
  url?: string;
  brand?: string;
  price?: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock";
  sku?: string;
  /** Either a pre-joined string (legacy) or structured PostalAddress parts. */
  address?:
    | string
    | {
        streetAddress?: string | null;
        addressLocality?: string | null;
        addressRegion?: string | null;
        addressCountry?: string | null;
      };
  geo?: { latitude: number; longitude: number };
  /** LocalBusiness certifications (e.g. "Organic", "Fair Trade"). */
  certifications?: string[];
  telephone?: string;

  authorName?: string;
  publishDate?: string;

  aggregateRating?: {
    ratingValue: number;
    ratingCount: number;
  };
};

export function generateSchemaOrg({
  type,
  name,
  description,
  image,
  url,
  brand,
  price,
  currency = "INR",
  availability,
  sku,
  aggregateRating,
  address,
  geo,
  certifications,
  telephone,
  authorName,
  publishDate,
}: SchemaOrgProps): Record<string, unknown> {
  // <--- CHANGE return type
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

  // Internal Schema type for better type safety within the function
  type ProductSchemaSpecifics = {
    sku?: string;
    brand?: { "@type": string; name: string };
    offers?: {
      "@type": string;
      price?: number;
      priceCurrency?: string;
      availability: string;
    };
    aggregateRating?: {
      "@type": "AggregateRating";
      ratingValue: number;
      ratingCount: number;
    };
  };

  type PostalAddress = {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  type LocalBusinessSchemaSpecifics = {
    address?: PostalAddress;
    telephone?: string;
    geo?: { "@type": "GeoCoordinates"; latitude: number; longitude: number };
    hasCertification?: Array<{ "@type": "Certification"; name: string }>;
  };

  type ArticleSchemaSpecifics = {
    author?: { "@type": string; name: string };
    datePublished?: string;
    aggregateRating?: {
      "@type": "AggregateRating";
      ratingValue: number;
      ratingCount: number;
    }; // For Article reviews
  };

  type BaseSchema = {
    "@context": string;
    "@type": SchemaOrgProps["type"];
    name: string;
    description?: string;
    url?: string;
    image?: string;
  };

  // Combine BaseSchema with specifics using intersection types for better type checking
  type Schema = BaseSchema &
    ProductSchemaSpecifics &
    LocalBusinessSchemaSpecifics &
    ArticleSchemaSpecifics;

  const schema: Schema = {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
  };
  if (url) {
    schema.url = url.startsWith("http") ? url : `${baseUrl}${url}`;
  }

  if (image) {
    schema.image = image.startsWith("http") ? image : `${baseUrl}${image}`;
  }

  // Add type-specific properties
  if (type === "Product") {
    // No '&& brand' here, a product might not have a brand but still be a product
    if (brand) {
      schema.brand = {
        "@type": "Brand",
        name: brand,
      };
    }
    if (sku) {
      schema.sku = sku; // <--- ADD sku to schema
    }
    // Only emit offers when a price is known. A price-less Offer is invalid to
    // Google ("Either 'price' or 'priceSpecification' should be specified").
    if (price !== undefined) {
      schema.offers = {
        "@type": "Offer",
        price,
        priceCurrency: currency,
        availability: `https://schema.org/${availability || "InStock"}`,
      };
    }
    if (aggregateRating) {
      // <--- ADD aggregateRating to schema for Product
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: aggregateRating.ratingValue,
        ratingCount: aggregateRating.ratingCount,
      };
    }
  }

  if (type === "LocalBusiness") {
    if (address) {
      const parts =
        typeof address === "string" ? { streetAddress: address } : address;
      const postal: PostalAddress = { "@type": "PostalAddress" };
      if (parts.streetAddress) postal.streetAddress = parts.streetAddress;
      if (parts.addressLocality) postal.addressLocality = parts.addressLocality;
      if (parts.addressRegion) postal.addressRegion = parts.addressRegion;
      if (parts.addressCountry) postal.addressCountry = parts.addressCountry;
      // Only attach when we have at least one real field beyond "@type".
      if (Object.keys(postal).length > 1) {
        schema.address = postal;
      }
    }
    if (telephone) {
      schema.telephone = telephone;
    }
    if (geo) {
      schema.geo = {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      };
    }
    if (certifications && certifications.length > 0) {
      schema.hasCertification = certifications.map((name) => ({
        "@type": "Certification",
        name,
      }));
    }
  }

  if (type === "Article") {
    if (authorName) {
      schema.author = {
        "@type": "Person",
        name: authorName,
      };
    }

    if (publishDate) {
      schema.datePublished = publishDate;
    }
    // If aggregateRating is specifically for Article reviews (e.g. user reviews on the article itself)
    // This was how it was implicitly structured before.
    // If aggregateRating in SchemaOrgProps is meant ONLY for products,
    // then this part for Article might need a different prop.
    // For now, assume it can be used if type is Article and it's provided.
    if (aggregateRating && type === "Article") {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: aggregateRating.ratingValue,
        ratingCount: aggregateRating.ratingCount,
      };
    }
  }

  return schema; // <--- RETURN schema object directly
}

/** BlogPosting JSON-LD for learn article pages */
export function blogArticleSchema(props: {
  title: string;
  description?: string;
  image?: string;
  url: string;
  authorName: string;
  datePublished: string;
  dateModified?: string;
}): Record<string, unknown> {
  const baseUrl = getSeoBaseUrl();
  const url = props.url.startsWith("http")
    ? props.url
    : `${baseUrl}${props.url.startsWith("/") ? "" : "/"}${props.url}`;
  const image = props.image?.startsWith("http")
    ? props.image
    : props.image
      ? `${baseUrl}${props.image}`
      : undefined;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: props.title,
    description: props.description ?? undefined,
    url,
    author: {
      "@type": "Person",
      name: props.authorName,
    },
    datePublished: props.datePublished,
    publisher: {
      "@type": "Organization",
      name: "Indian Coffee Beans",
      url: baseUrl,
    },
  };
  if (image) schema.image = image;
  if (props.dateModified) schema.dateModified = props.dateModified;
  return schema;
}

export const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact IndianCoffeeBeans.com",
  description:
    "Connect with the Indian coffee community. Submit roasters, suggest changes, or partner with us.",
  url: "https://www.indiancoffeebeans.com/contact",
  publisher: {
    "@type": "Organization",
    name: "IndianCoffeeBeans.com",
    url: "https://www.indiancoffeebeans.com",
  },
};

export const partnerPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Partner With Us - IndianCoffeeBeans.com",
  description:
    "Join 60+ roasters on India's premier coffee platform. Get discovered by coffee enthusiasts.",
  url: "https://www.indiancoffeebeans.com/roasters/partner",
  publisher: {
    "@type": "Organization",
    name: "IndianCoffeeBeans.com",
    url: "https://www.indiancoffeebeans.com",
  },
};

export const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About IndianCoffeeBeans.com",
  description:
    "Learn what IndianCoffeeBeans is, who it's for, and how our independent directory helps you discover Indian specialty coffee — with answers to common questions.",
  url: "https://www.indiancoffeebeans.com/about",
};

export const howICBWorksPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "How IndianCoffeeBeans Works - Transparency & Neutrality",
  description:
    "Learn about our mission, how we curate coffee, our commitment to neutrality, and how you can use our platform to find your perfect brew.",
  url: "https://www.indiancoffeebeans.com/how-icb-works",
};

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

export const howICBWorksBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About",
      item: `${baseUrl}/about`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "How ICB Works",
      item: `${baseUrl}/how-icb-works`,
    },
  ],
};

export const privacyPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy - IndianCoffeeBeans.com",
  description:
    "How IndianCoffeeBeans.com collects, uses, and protects your personal information.",
  url: "https://www.indiancoffeebeans.com/privacy",
};

export const dataDeletionPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Data Deletion Instructions - IndianCoffeeBeans.com",
  description:
    "How to request deletion of your personal data from IndianCoffeeBeans.com.",
  url: "https://www.indiancoffeebeans.com/data-deletion",
};

export const termsPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service - IndianCoffeeBeans.com",
  description:
    "Terms and conditions for using IndianCoffeeBeans.com directory and services.",
  url: "https://www.indiancoffeebeans.com/terms",
};

export const roastersTermsPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Roaster Partnership Agreement - IndianCoffeeBeans.com",
  description:
    "Terms and conditions for roaster partnerships and subscription services on IndianCoffeeBeans.com.",
  url: "https://www.indiancoffeebeans.com/roasters/terms",
};

// Organization Schema for root layout
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "IndianCoffeeBeans.com",
  alternateName: "Indian Coffee Beans Directory",
  url: "https://www.indiancoffeebeans.com",
  logo: "https://www.indiancoffeebeans.com/images/logo.png",
  description:
    "India's first specialty coffee directory – discover roasters, beans, and brewing tips.",
  foundingDate: "2024",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  sameAs: [
    "https://twitter.com/indcoffeebeans",
    // Add more social links as you create them
  ],
};

// Website Schema for homepage
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "IndianCoffeeBeans.com",
  url: "https://www.indiancoffeebeans.com",
  description:
    "India's first specialty coffee directory – discover roasters, beans, and brewing tips.",
  publisher: {
    "@type": "Organization",
    name: "IndianCoffeeBeans.com",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://www.indiancoffeebeans.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// Collection Page Schema (for directory pages)
export function generateCollectionPageSchema(
  name: string,
  description: string,
  url: string,
  itemListElement: Array<Record<string, unknown>> = []
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      name,
      description,
      itemListElement,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.indiancoffeebeans.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name,
          item: url,
        },
      ],
    },
  };
}

// FAQ Schema generator (for future use)
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Breadcrumb Schema generator (for future [slug] pages)
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function generateHowToSchema({
  name,
  description,
  image,
  totalTime,
  equipment,
  ingredients,
  steps,
}: {
  name: string;
  description: string;
  image?: string;
  totalTime?: string;
  equipment?: string[];
  ingredients?: string[];
  steps: Array<{
    text: string;
    name?: string;
    image?: string;
  }>;
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    image: image
      ? image.startsWith("http")
        ? image
        : `${baseUrl}${image}`
      : undefined,
    totalTime,
    tool: equipment?.map((tool) => ({
      "@type": "HowToTool",
      name: tool,
    })),
    supply: ingredients?.map((ingredient) => ({
      "@type": "HowToSupply",
      name: ingredient,
    })),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step.text,
      name: step.name,
      image: step.image
        ? step.image.startsWith("http")
          ? step.image
          : `${baseUrl}${step.image}`
        : undefined,
    })),
  };
}

/** Convert recipe clock times (e.g. "3:30", "12:00+") to ISO 8601 duration for schema.org */
export function recipeTimeToIsoDuration(totalTime: string): string | undefined {
  const clock = totalTime.match(/^(\d+):(\d{2})\+?$/);
  if (clock) {
    const minutes = Number(clock[1]);
    const seconds = Number(clock[2]);
    return seconds > 0 ? `PT${minutes}M${seconds}S` : `PT${minutes}M`;
  }

  const hours = totalTime.match(/^(\d+)(?:-\d+)?\s*Hours?$/i);
  if (hours) {
    return `PT${hours[1]}H`;
  }

  return undefined;
}

export function generateRecipeSchema({
  name,
  description,
  image,
  author,
  totalTime,
  servings,
  ingredients,
  instructions,
}: {
  name: string;
  description?: string;
  image?: string;
  author?: string;
  totalTime?: string;
  servings?: number;
  ingredients?: string[];
  instructions: Array<{
    text: string;
    name?: string;
  }>;
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name,
    description,
    image: image
      ? image.startsWith("http")
        ? image
        : `${baseUrl}${image}`
      : undefined,
    author: author ? { "@type": "Person", name: author } : undefined,
    totalTime,
    recipeYield: servings,
    recipeIngredient: ingredients,
    recipeInstructions: instructions.map((instruction, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: instruction.text,
      name: instruction.name,
    })),
  };
}

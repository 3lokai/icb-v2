// lib/seo/schema.ts
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
  address?: string;
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
  telephone,
  authorName,
  publishDate,
}: SchemaOrgProps): Record<string, unknown> {
  // <--- CHANGE return type
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

  // Internal Schema type for better type safety within the function
  type ProductSchemaSpecifics = {
    sku?: string;
    brand?: { "@type": string; name: string };
    offers?: {
      "@type": string;
      price: number | undefined;
      priceCurrency: string;
      availability: string;
    };
    aggregateRating?: {
      "@type": "AggregateRating";
      ratingValue: number;
      ratingCount: number;
    };
  };

  type LocalBusinessSchemaSpecifics = {
    address?: { "@type": string; streetAddress: string };
    telephone?: string;
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
      schema.address = {
        "@type": "PostalAddress",
        streetAddress: address,
      };
    }
    if (telephone) {
      schema.telephone = telephone;
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

export const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact IndianCoffeeBeans.com",
  description:
    "Connect with the Indian coffee community. Submit roasters, suggest changes, or partner with us.",
  url: "https://indiancoffeebeans.com/contact",
  publisher: {
    "@type": "Organization",
    name: "IndianCoffeeBeans.com",
    url: "https://indiancoffeebeans.com",
  },
};

export const partnerPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Partner With Us - IndianCoffeeBeans.com",
  description:
    "Join 45+ roasters on India's premier coffee platform. Get discovered by coffee enthusiasts.",
  url: "https://indiancoffeebeans.com/roasters/partner",
  publisher: {
    "@type": "Organization",
    name: "IndianCoffeeBeans.com",
    url: "https://indiancoffeebeans.com",
  },
};

export const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About IndianCoffeeBeans.com",
  description: "India's first independent directory for specialty coffee.",
  url: "https://indiancoffeebeans.com/about",
};

export const privacyPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy - IndianCoffeeBeans.com",
  description:
    "How IndianCoffeeBeans.com collects, uses, and protects your personal information.",
  url: "https://indiancoffeebeans.com/privacy",
};

export const dataDeletionPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Data Deletion Instructions - IndianCoffeeBeans.com",
  description:
    "How to request deletion of your personal data from IndianCoffeeBeans.com.",
  url: "https://indiancoffeebeans.com/data-deletion",
};

export const termsPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service - IndianCoffeeBeans.com",
  description:
    "Terms and conditions for using IndianCoffeeBeans.com directory and services.",
  url: "https://indiancoffeebeans.com/terms",
};

// Organization Schema for root layout
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "IndianCoffeeBeans.com",
  alternateName: "Indian Coffee Beans Directory",
  url: "https://indiancoffeebeans.com",
  logo: "https://indiancoffeebeans.com/images/logo.png",
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
  url: "https://indiancoffeebeans.com",
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
        "https://indiancoffeebeans.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// Collection Page Schema (for directory pages)
export function generateCollectionPageSchema(
  name: string,
  description: string,
  url: string
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
      itemListElement: [], // Will be populated dynamically with actual items
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://indiancoffeebeans.com",
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
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

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
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

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

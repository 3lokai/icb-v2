export type SanityImage = {
  asset: {
    _id: string;
    url: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
      };
    };
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
};

export type Author = {
  _id?: string;
  name: string;
  bio?: string;
  slug?: string;
  avatar?: SanityImage;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  kind?: "pillar" | "topic";
  color?: string;
  articleCount?: number;
};

export type Series = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type TOCItem = {
  title: string;
  url: string;
  items?: TOCItem[];
};

export type Article = {
  _id: string;
  _type: "article";
  title: string;
  description?: string;
  slug: string;
  date: string;
  updatedAt?: string;
  updated?: string; // Kept for backward compatibility during migration
  category: Category;
  topics?: Category[];
  tags?: string[];
  author: Author;
  authorRef?: Author;
  featured: boolean;
  draft: boolean;
  difficulty?: "beginner" | "intermediate" | "advanced";
  cover: SanityImage;
  excerpt: string;
  body: any[]; // Portable Text - can be refined further if needed
  hasFAQ?: boolean;
  faqItems?: FAQItem[];
  hasSteps?: boolean;
  contentType?: "article" | "howto" | "tutorial";
  brewingMethod?: string;
  equipment?: string[];
  ingredients?: string[];
  brewTime?: string;
  servings?: number;
  toneChecklist?: {
    isDescriptive: boolean;
    isFieldNotes: boolean;
    isNeutral: boolean;
  };
  metadata?: {
    readingTime: number;
    wordCount: number;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
  toc?: TOCItem[];
  series?: {
    name: string;
    slug: string;
    part: number;
  };
  seriesRef?: Series;
  _createdAt: string;
  _updatedAt: string;
};

// Block Types for Portable Text
export type PortableTextBlock = {
  _type: "block";
  _key: string;
  children: Array<{
    _type: string;
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: any[];
  style?: string;
};

export type CalloutBlock = {
  _type: "callout";
  _key: string;
  type: "tip" | "info" | "warning" | "success" | "error";
  title?: string;
  content: any[];
};

export type CoffeeCollectionBlock = {
  _type: "coffeeCollection";
  _key: string;
  title?: string;
  type: "dynamic" | "manual";
  coffeeIds?: string[];
  description?: string;
  roastLevel?: string[];
  beanType?: string[];
  limit?: number;
  showMoreButton?: boolean;
  moreUrl?: string;
  moreText?: string;
  columns?: number;
};

export type ImageGalleryBlock = {
  _type: "imageGallery";
  _key: string;
  images: Array<{
    _type: "image";
    _key: string;
    asset: any;
    caption?: string;
    alt?: string;
  }>;
  columns?: number;
  layout?: "grid" | "carousel" | "masonry";
};

export type SpotlightBlock = {
  _type: "coffeeSpotlight" | "roasterSpotlight" | "regionSpotlight";
  _key: string;
  coffeeId?: string;
  roasterId?: string;
  regionId?: string;
};

export type StepListBlock = {
  _type: "stepList";
  _key: string;
  variant?: "default" | "brewing" | "process";
  steps: Array<{
    _key: string;
    title?: string;
    content: any[];
    icon?: string;
    time?: string;
  }>;
};

export type BrewingTableBlock = {
  _type: "brewingTable";
  _key: string;
  title?: string;
  rows: Array<{
    _key: string;
    method: string;
    grind: string;
    ratio: string;
    time: string;
    notes?: string;
  }>;
};

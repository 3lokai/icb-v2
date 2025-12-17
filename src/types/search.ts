// ============================================================================
// SEARCH TYPES
// ============================================================================

export type SearchItemType = "coffee" | "roaster";

export type SearchableItem = {
  id: string;
  type: SearchItemType;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  searchableText: string; // big flattened string
  flavorNotes?: string[];
  tags: string[];
  metadata: {
    coffee?: {
      roasterName: string;
      region?: string;
      price?: number;
      bestNormalized250g?: number;
      rating?: number;
      roastLevel?: string;
      process?: string;
    };
    roaster?: {
      region?: string;
      coffeeCount?: number;
    };
  };
};

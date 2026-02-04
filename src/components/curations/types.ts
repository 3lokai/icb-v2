export type CuratorLink = {
  platform: "instagram" | "website" | "twitter";
  url: string;
};

export type Curator = {
  id: string;
  slug: string;
  name: string;
  logo: string;
  location: string;
  tags: string[];
  story: string;
  philosophy?: string;
  curatorType: "Cafe" | "Barista" | "Community";
  quote?: string;
  links: CuratorLink[];
  gallery: string[];
  recentPicks?: string[];
};

export type CurationSelection = {
  id: string;
  name: string;
  roaster: string;
  note: string;
  image?: string;
  /** When present, selection card links to nested coffee detail page */
  coffeeSlug?: string;
  roasterSlug?: string;
};

export type CurationList = {
  id: string;
  slug: string;
  title: string;
  description: string;
  isDefault?: boolean;
  selections: CurationSelection[];
};

export type CuratorPageData = {
  curator: Curator;
  curations: CurationList[];
};

// Legacy type for backwards compatibility
export type CurationPartner = Curator;
export type CurationData = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  selectionPhilosophy: string;
  partner: CurationPartner;
  gallery: string[];
  selections: CurationSelection[];
};

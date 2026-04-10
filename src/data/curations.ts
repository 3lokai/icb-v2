import "server-only";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import {
  fetchCoffeeImages,
  fetchCoffeeListingImagesFromDirectoryMv,
} from "@/lib/data/fetch-coffees";
import type { LinkPlatformEnum } from "@/types/db-enums";

/**
 * Curator link DTO - matches frontend CuratorLink shape
 */
export type CuratorLinkDTO = {
  platform: "instagram" | "website" | "twitter";
  url: string;
};

/**
 * Curator DTO - safe to pass to Client Components, matches frontend Curator shape
 */
export type CuratorDTO = {
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
  /** Normalized profile URL; column or fallback from curator_links */
  instagramUrl?: string;
  /** Normalized profile URL; column or fallback from curator_links */
  twitterUrl?: string;
  /** Raw address for mailto: */
  contactEmail?: string;
  links: CuratorLinkDTO[];
  gallery: string[];
  recentPicks?: string[];
};

/**
 * Curation selection DTO - matches frontend CurationSelection shape
 */
export type CurationSelectionDTO = {
  id: string;
  name: string;
  roaster: string;
  note: string;
  image?: string;
};

/**
 * Curation list DTO - matches frontend CurationList shape
 */
export type CurationListDTO = {
  id: string;
  slug: string;
  title: string;
  description: string;
  isDefault?: boolean;
  selections: CurationSelectionDTO[];
};

/**
 * Full curator page DTO - curator with all curations (lists and selections)
 */
export type CuratorPageDTO = {
  curator: CuratorDTO;
  curations: CurationListDTO[];
};

function mapPlatform(
  platform: LinkPlatformEnum
): "instagram" | "website" | "twitter" {
  if (
    platform === "instagram" ||
    platform === "website" ||
    platform === "twitter"
  )
    return platform;
  return "website";
}

function mapCuratorType(
  type: "cafe" | "barista" | "community"
): "Cafe" | "Barista" | "Community" {
  return type === "cafe"
    ? "Cafe"
    : type === "barista"
      ? "Barista"
      : "Community";
}

function normalizeCurationCoffeeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeInstagramUrl(raw: string): string {
  const t = raw.trim();
  if (/^https?:\/\//i.test(t)) return t;
  return `https://instagram.com/${t.replace(/^@/, "")}`;
}

function normalizeTwitterUrl(raw: string): string {
  const t = raw.trim();
  if (/^https?:\/\//i.test(t)) return t;
  return `https://twitter.com/${t.replace(/^@/, "")}`;
}

type RawCuratorLinkRow = { platform: LinkPlatformEnum; url: string };

/**
 * Resolve IG/Twitter from columns with fallback to curator_links; email from column only.
 * Strips instagram/twitter from `links` when a resolved URL is shown in the primary row (no duplicates).
 */
function resolveCuratorSocialAndLinks(
  columns: {
    instagram_url: string | null;
    twitter_url: string | null;
    contact_email: string | null;
  },
  rawLinks: RawCuratorLinkRow[]
): Pick<CuratorDTO, "links" | "instagramUrl" | "twitterUrl" | "contactEmail"> {
  const igCol = columns.instagram_url?.trim();
  const twCol = columns.twitter_url?.trim();
  const emailCol = columns.contact_email?.trim();

  const instagramUrl =
    igCol && igCol.length > 0
      ? normalizeInstagramUrl(igCol)
      : (() => {
          const row = rawLinks.find((r) => r.platform === "instagram");
          return row?.url?.trim() ? normalizeInstagramUrl(row.url) : undefined;
        })();

  const twitterUrl =
    twCol && twCol.length > 0
      ? normalizeTwitterUrl(twCol)
      : (() => {
          const row = rawLinks.find((r) => r.platform === "twitter");
          return row?.url?.trim() ? normalizeTwitterUrl(row.url) : undefined;
        })();

  const contactEmail = emailCol && emailCol.length > 0 ? emailCol : undefined;

  const hasResolvedInstagram = Boolean(instagramUrl);
  const hasResolvedTwitter = Boolean(twitterUrl);

  const links: CuratorLinkDTO[] = rawLinks
    .filter((r) => {
      if (hasResolvedInstagram && r.platform === "instagram") return false;
      if (hasResolvedTwitter && r.platform === "twitter") return false;
      return true;
    })
    .map((row) => ({
      platform: mapPlatform(row.platform),
      url: row.url,
    }));

  return {
    links,
    ...(instagramUrl ? { instagramUrl } : {}),
    ...(twitterUrl ? { twitterUrl } : {}),
    ...(contactEmail ? { contactEmail } : {}),
  };
}

/**
 * Get a single curator by slug with all related data (links, gallery, curation lists and selections).
 * Returns null if not found or not visible (RLS applies).
 *
 * @param slug - URL-friendly curator slug
 * @returns CuratorPageDTO or null
 */
export async function getCuratorBySlug(
  slug: string
): Promise<CuratorPageDTO | null> {
  if (typeof slug !== "string" || slug.length === 0) {
    return null;
  }

  const supabase = await createClient();

  const { data: curator, error: curatorError } = await supabase
    .from("curators")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (curatorError || !curator) {
    return null;
  }

  const [linksResult, galleryResult, listsResult] = await Promise.all([
    supabase
      .from("curator_links")
      .select("platform, url, sort_order")
      .eq("curator_id", curator.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("curator_gallery_images")
      .select("image_url, sort_order")
      .eq("curator_id", curator.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("curation_lists")
      .select("id, slug, title, description, is_default, sort_order")
      .eq("curator_id", curator.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const rawLinkRows: RawCuratorLinkRow[] = (linksResult.data ?? []).map(
    (row) => ({
      platform: row.platform,
      url: row.url,
    })
  );

  const social = resolveCuratorSocialAndLinks(
    {
      instagram_url: curator.instagram_url,
      twitter_url: curator.twitter_url,
      contact_email: curator.contact_email,
    },
    rawLinkRows
  );

  const gallery: string[] = (galleryResult.data ?? []).map(
    (row) => row.image_url
  );

  const listRows = listsResult.data ?? [];
  const selectionRowsByList = await Promise.all(
    listRows.map((list) =>
      supabase
        .from("curation_selections")
        .select(
          "id, coffee_id, roaster_id, coffee_name, roaster_name, curator_note, image_url, sort_order"
        )
        .eq("curation_list_id", list.id)
        .order("sort_order", { ascending: true })
    )
  );

  const coffeeIds = [
    ...new Set(
      selectionRowsByList.flatMap((res) =>
        (res.data ?? [])
          .map((row) => row.coffee_id)
          .filter((id): id is string => Boolean(id))
      )
    ),
  ];

  const imageSupabase = process.env.SUPABASE_SECRET_KEY
    ? await createServiceRoleClient()
    : supabase;

  const coffeeImageMap = await fetchCoffeeListingImagesFromDirectoryMv(
    imageSupabase,
    coffeeIds
  );
  const missingCoffeeIds = coffeeIds.filter((id) => !coffeeImageMap.has(id));
  if (missingCoffeeIds.length > 0) {
    const fromImagesTable = await fetchCoffeeImages(
      imageSupabase,
      missingCoffeeIds
    );
    for (const [id, url] of fromImagesTable) {
      coffeeImageMap.set(id, url);
    }
  }

  const allSelectionRows = selectionRowsByList.flatMap((r) => r.data ?? []);
  const roasterIdsForNameMatch = new Set<string>();
  for (const row of allSelectionRows) {
    const manual = row.image_url?.trim();
    if (manual) continue;
    if (row.coffee_id && coffeeImageMap.has(row.coffee_id)) continue;
    if (row.roaster_id && row.coffee_name?.trim()) {
      roasterIdsForNameMatch.add(row.roaster_id);
    }
  }

  const nameKeyToImageUrl = new Map<string, string>();
  if (roasterIdsForNameMatch.size > 0) {
    const { data: mvNameRows } = await imageSupabase
      .from("coffee_directory_mv")
      .select("roaster_id, name, image_url")
      .in("roaster_id", [...roasterIdsForNameMatch]);
    for (const r of mvNameRows ?? []) {
      if (!r.roaster_id || !r.name?.trim() || !r.image_url) continue;
      const key = `${r.roaster_id}|${normalizeCurationCoffeeName(r.name)}`;
      if (!nameKeyToImageUrl.has(key)) {
        nameKeyToImageUrl.set(key, r.image_url);
      }
    }
  }

  const resolveSelectionImage = (row: {
    image_url: string | null;
    coffee_id: string | null;
    roaster_id: string | null;
    coffee_name: string;
  }): string | undefined => {
    const manual = row.image_url?.trim() || undefined;
    if (manual) return manual;
    if (row.coffee_id) {
      const byId = coffeeImageMap.get(row.coffee_id);
      if (byId) return byId;
    }
    if (row.roaster_id && row.coffee_name?.trim()) {
      const nk = `${row.roaster_id}|${normalizeCurationCoffeeName(row.coffee_name)}`;
      return nameKeyToImageUrl.get(nk);
    }
    return undefined;
  };

  const curations: CurationListDTO[] = listRows.map((list, i) => {
    const selections = (selectionRowsByList[i].data ?? []).map((row) => ({
      id: row.id,
      name: row.coffee_name,
      roaster: row.roaster_name,
      note: row.curator_note ?? "",
      image: resolveSelectionImage(row),
    }));
    return {
      id: list.id,
      slug: list.slug,
      title: list.title,
      description: list.description ?? "",
      isDefault: list.is_default ?? false,
      selections,
    };
  });

  const recentPicks = curations
    .flatMap((c) => c.selections)
    .slice(0, 5)
    .map((s) => s.name);

  const curatorDTO: CuratorDTO = {
    id: curator.id,
    slug: curator.slug,
    name: curator.name,
    logo: curator.logo_url ?? "",
    location: curator.location ?? "",
    tags: curator.tags ?? [],
    story: curator.story ?? "",
    philosophy: curator.philosophy ?? undefined,
    curatorType: mapCuratorType(curator.curator_type),
    quote: curator.quote ?? undefined,
    ...social,
    gallery,
    recentPicks: recentPicks.length > 0 ? recentPicks : undefined,
  };

  return {
    curator: curatorDTO,
    curations,
  };
}

/**
 * Get all active curators (list view). Returns minimal curator data without curations.
 *
 * @returns Array of CuratorDTO (with empty curations; use getCuratorBySlug for full page)
 */
export async function getAllCurators(): Promise<CuratorDTO[]> {
  const supabase = await createClient();

  const { data: curators, error } = await supabase
    .from("curators")
    .select(
      "id, slug, name, logo_url, location, curator_type, tags, philosophy, story, quote, instagram_url, twitter_url, contact_email"
    )
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error || !curators) {
    return [];
  }

  const curatorIds = curators.map((c) => c.id);
  const [linksResult, galleryResult] = await Promise.all([
    supabase
      .from("curator_links")
      .select("curator_id, platform, url, sort_order")
      .in("curator_id", curatorIds)
      .order("sort_order", { ascending: true }),
    supabase
      .from("curator_gallery_images")
      .select("curator_id, image_url, sort_order")
      .in("curator_id", curatorIds)
      .order("sort_order", { ascending: true }),
  ]);

  const rawLinksByCurator = new Map<string, RawCuratorLinkRow[]>();
  for (const row of linksResult.data ?? []) {
    const list = rawLinksByCurator.get(row.curator_id) ?? [];
    list.push({ platform: row.platform, url: row.url });
    rawLinksByCurator.set(row.curator_id, list);
  }
  const galleryByCurator = new Map<string, string[]>();
  for (const row of galleryResult.data ?? []) {
    const list = galleryByCurator.get(row.curator_id) ?? [];
    list.push(row.image_url);
    galleryByCurator.set(row.curator_id, list);
  }

  return curators.map((c) => {
    const social = resolveCuratorSocialAndLinks(
      {
        instagram_url: c.instagram_url,
        twitter_url: c.twitter_url,
        contact_email: c.contact_email,
      },
      rawLinksByCurator.get(c.id) ?? []
    );
    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      logo: c.logo_url ?? "",
      location: c.location ?? "",
      tags: c.tags ?? [],
      story: c.story ?? "",
      philosophy: c.philosophy ?? undefined,
      curatorType: mapCuratorType(c.curator_type),
      quote: c.quote ?? undefined,
      ...social,
      gallery: galleryByCurator.get(c.id) ?? [],
    };
  });
}

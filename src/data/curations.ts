import "server-only";

import { createClient } from "@/lib/supabase/server";
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

  const links: CuratorLinkDTO[] = (linksResult.data ?? []).map((row) => ({
    platform: mapPlatform(row.platform),
    url: row.url,
  }));

  const gallery: string[] = (galleryResult.data ?? []).map(
    (row) => row.image_url
  );

  const listRows = listsResult.data ?? [];
  const selectionRowsByList = await Promise.all(
    listRows.map((list) =>
      supabase
        .from("curation_selections")
        .select(
          "id, coffee_name, roaster_name, curator_note, image_url, sort_order"
        )
        .eq("curation_list_id", list.id)
        .order("sort_order", { ascending: true })
    )
  );

  const curations: CurationListDTO[] = listRows.map((list, i) => {
    const selections = (selectionRowsByList[i].data ?? []).map((row) => ({
      id: row.id,
      name: row.coffee_name,
      roaster: row.roaster_name,
      note: row.curator_note ?? "",
      image: row.image_url ?? undefined,
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
    links,
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
      "id, slug, name, logo_url, location, curator_type, tags, philosophy, story, quote"
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

  const linksByCurator = new Map<string, CuratorLinkDTO[]>();
  for (const row of linksResult.data ?? []) {
    const list = linksByCurator.get(row.curator_id) ?? [];
    list.push({ platform: mapPlatform(row.platform), url: row.url });
    linksByCurator.set(row.curator_id, list);
  }
  const galleryByCurator = new Map<string, string[]>();
  for (const row of galleryResult.data ?? []) {
    const list = galleryByCurator.get(row.curator_id) ?? [];
    list.push(row.image_url);
    galleryByCurator.set(row.curator_id, list);
  }

  return curators.map((c) => ({
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
    links: linksByCurator.get(c.id) ?? [],
    gallery: galleryByCurator.get(c.id) ?? [],
  }));
}

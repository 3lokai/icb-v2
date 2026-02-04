"use server";

import {
  getCuratorBySlug as getCuratorBySlugData,
  getAllCurators as getAllCuratorsData,
} from "@/data/curations";
import type { CuratorPageDTO, CuratorDTO } from "@/data/curations";

/**
 * Server action: fetch all active curators (for listing page).
 * Used by useCurators() hook or Server Components can call getAllCurators from data layer directly.
 */
export async function getCuratorsAction(): Promise<CuratorDTO[]> {
  return getAllCuratorsData();
}

/**
 * Server action: fetch a single curator by slug with full curations.
 * Used by useCurator(slug) hook or Server Components can call getCuratorBySlug from data layer directly.
 */
export async function getCuratorBySlugAction(
  slug: string
): Promise<CuratorPageDTO | null> {
  return getCuratorBySlugData(slug);
}

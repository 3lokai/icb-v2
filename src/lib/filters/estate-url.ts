import type { EstateFilters, EstateSort } from "@/types/estate-types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 100;
const DEFAULT_SORT: EstateSort = "name_asc";

/**
 * Parse URL query params into typed filter objects.
 * Pure function - no React, Zustand, or router dependencies.
 */
export function parseEstateSearchParams(searchParams: URLSearchParams): {
  filters: EstateFilters;
  page: number;
  sort: EstateSort;
  limit: number;
} {
  const filters: EstateFilters = {};

  const pageParam = searchParams.get("page");
  const validPage = pageParam ? Number.parseInt(pageParam, 10) : DEFAULT_PAGE;
  const limitParam = searchParams.get("limit");
  const parsedLimit = limitParam
    ? Number.parseInt(limitParam, 10)
    : DEFAULT_LIMIT;
  const validLimit =
    Number.isNaN(parsedLimit) || parsedLimit < 1 ? DEFAULT_LIMIT : parsedLimit;
  const sortParam = searchParams.get("sort") as EstateSort;
  const validSort = sortParam || DEFAULT_SORT;

  const qParam = searchParams.get("q");
  if (qParam) {
    filters.q = qParam;
  }

  const regionsParam = searchParams.get("regions");
  if (regionsParam) {
    const regionSlugs = regionsParam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (regionSlugs.length > 0) {
      filters.region_slugs = regionSlugs;
    }
  }

  return { filters, page: validPage, sort: validSort, limit: validLimit };
}

/**
 * Build URL query string from filter objects.
 * Only includes non-default values.
 */
export function buildEstateQueryString(
  filters: EstateFilters,
  page: number,
  sort: EstateSort,
  limit: number
): string {
  const params = new URLSearchParams();

  if (page !== DEFAULT_PAGE) {
    params.set("page", page.toString());
  }
  if (limit !== DEFAULT_LIMIT) {
    params.set("limit", limit.toString());
  }
  if (sort !== DEFAULT_SORT) {
    params.set("sort", sort);
  }
  if (filters.q && filters.q.trim().length > 0) {
    params.set("q", filters.q.trim());
  }
  if (filters.region_slugs && filters.region_slugs.length > 0) {
    params.set("regions", filters.region_slugs.join(","));
  }

  return params.toString();
}

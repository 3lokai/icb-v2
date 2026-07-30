import type { RegionFilters, RegionSort } from "@/types/region-types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 100;
const DEFAULT_SORT: RegionSort = "name_asc";

/**
 * Parse URL query params into typed filter objects.
 * Pure function - no React, Zustand, or router dependencies.
 */
export function parseRegionSearchParams(searchParams: URLSearchParams): {
  filters: RegionFilters;
  page: number;
  sort: RegionSort;
  limit: number;
} {
  const filters: RegionFilters = {};

  const pageParam = searchParams.get("page");
  const validPage = pageParam ? Number.parseInt(pageParam, 10) : DEFAULT_PAGE;
  const limitParam = searchParams.get("limit");
  const parsedLimit = limitParam
    ? Number.parseInt(limitParam, 10)
    : DEFAULT_LIMIT;
  const validLimit =
    Number.isNaN(parsedLimit) || parsedLimit < 1 ? DEFAULT_LIMIT : parsedLimit;
  const sortParam = searchParams.get("sort") as RegionSort;
  const validSort = sortParam || DEFAULT_SORT;

  const qParam = searchParams.get("q");
  if (qParam) {
    filters.q = qParam;
  }

  const countriesParam = searchParams.get("countries");
  if (countriesParam) {
    const countries = countriesParam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (countries.length > 0) {
      filters.countries = countries;
    }
  }

  const statesParam = searchParams.get("states");
  if (statesParam) {
    const states = statesParam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (states.length > 0) {
      filters.states = states;
    }
  }

  return { filters, page: validPage, sort: validSort, limit: validLimit };
}

/**
 * Build URL query string from filter objects.
 * Only includes non-default values.
 */
export function buildRegionQueryString(
  filters: RegionFilters,
  page: number,
  sort: RegionSort,
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
  if (filters.countries && filters.countries.length > 0) {
    params.set("countries", filters.countries.join(","));
  }
  if (filters.states && filters.states.length > 0) {
    params.set("states", filters.states.join(","));
  }

  return params.toString();
}

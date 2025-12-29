import type { RoasterFilters, RoasterSort } from "@/types/roaster-types";

// Default values for filters
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 15;
const DEFAULT_SORT: RoasterSort = "relevance";

/**
 * Parse URL query params into typed filter objects
 * Provides defaults (page=1, limit=24, sort="relevance")
 * Handles comma-separated arrays (platforms, countries, states)
 * Converts string booleans ("1" → true)
 * Pure function - no React, Zustand, or router dependencies
 */
export function parseRoasterSearchParams(searchParams: URLSearchParams): {
  filters: RoasterFilters;
  page: number;
  sort: RoasterSort;
  limit: number;
} {
  const filters: RoasterFilters = {};

  // Page, limit, sort
  const pageParam = searchParams.get("page");
  const validPage = pageParam ? Number.parseInt(pageParam, 10) : DEFAULT_PAGE;
  const limitParam = searchParams.get("limit");
  const validLimit = limitParam
    ? Number.parseInt(limitParam, 10)
    : DEFAULT_LIMIT;
  const sortParam = searchParams.get("sort") as RoasterSort;
  const validSort = sortParam || DEFAULT_SORT;

  // Text search
  const qParam = searchParams.get("q");
  if (qParam) {
    filters.q = qParam;
  }

  // Array filters (comma-separated)
  const citiesParam = searchParams.get("cities");
  if (citiesParam) {
    const cities = citiesParam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (cities.length > 0) {
      filters.cities = cities;
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

  // Boolean flags (as "1" or omitted)
  const activeOnlyParam = searchParams.get("activeOnly");
  if (activeOnlyParam === "1") {
    filters.active_only = true;
  }

  return {
    filters,
    page: validPage,
    sort: validSort,
    limit: validLimit,
  };
}

/**
 * Build URL query string from filter objects
 * Only includes non-default values
 * Pure function - no React, Zustand, or router dependencies
 */
export function buildRoasterQueryString(
  filters: RoasterFilters,
  page: number,
  sort: RoasterSort,
  limit: number
): string {
  const params = new URLSearchParams();

  // Page (only if not default)
  if (page !== DEFAULT_PAGE) {
    params.set("page", page.toString());
  }

  // Limit (only if not default)
  if (limit !== DEFAULT_LIMIT) {
    params.set("limit", limit.toString());
  }

  // Sort (only if not default)
  if (sort !== DEFAULT_SORT) {
    params.set("sort", sort);
  }

  // Text search
  if (filters.q && filters.q.trim().length > 0) {
    params.set("q", filters.q.trim());
  }

  // Array filters (comma-separated)
  if (filters.cities && filters.cities.length > 0) {
    params.set("cities", filters.cities.join(","));
  }

  if (filters.states && filters.states.length > 0) {
    params.set("states", filters.states.join(","));
  }

  // Only include countries if it's not the default "india"
  if (filters.countries && filters.countries.length > 0) {
    const hasNonDefaultCountry = filters.countries.some(
      (c) => c.toLowerCase() !== "india"
    );
    if (hasNonDefaultCountry || filters.countries.length > 1) {
      params.set("countries", filters.countries.join(","));
    }
  }

  // Boolean flags (as "1" or omitted)
  if (filters.active_only === true) {
    params.set("activeOnly", "1");
  }

  return params.toString();
}

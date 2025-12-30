import type { CoffeeFilters, CoffeeSort } from "@/types/coffee-types";
import type {
  CoffeeStatusEnum,
  ProcessEnum,
  RoastLevelEnum,
} from "@/types/db-enums";

/**
 * Default values for coffee directory filters
 */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 15;
const DEFAULT_SORT: CoffeeSort = "relevance";

/**
 * Helper to parse comma-separated string array
 */
function parseStringArray(param: string | null): string[] | undefined {
  if (!param) {
    return;
  }
  const items = param
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (items.length === 0) {
    return;
  }
  return items;
}

/**
 * Helper to parse enum array from comma-separated string
 */
function parseEnumArray<T extends string>(
  param: string | null
): T[] | undefined {
  const items = parseStringArray(param);
  return items as T[] | undefined;
}

/**
 * Helper to parse page number
 */
function parsePage(searchParams: URLSearchParams): number {
  const pageParam = searchParams.get("page");
  const page = pageParam ? Number.parseInt(pageParam, 10) : DEFAULT_PAGE;
  return Number.isNaN(page) || page < 1 ? DEFAULT_PAGE : page;
}

/**
 * Helper to parse limit number
 */
function parseLimit(searchParams: URLSearchParams): number {
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number.parseInt(limitParam, 10) : DEFAULT_LIMIT;
  return Number.isNaN(limit) || limit < 1 ? DEFAULT_LIMIT : limit;
}

/**
 * Helper to parse sort value
 */
function parseSort(searchParams: URLSearchParams): CoffeeSort {
  const sortParam = searchParams.get("sort");
  const validSorts: CoffeeSort[] = [
    "price_asc",
    "price_desc",
    "newest",
    "best_value",
    "rating_desc",
    "name_asc",
  ];
  return validSorts.includes(sortParam as CoffeeSort)
    ? (sortParam as CoffeeSort)
    : DEFAULT_SORT;
}

/**
 * Helper to parse boolean flag from "1" string
 */
function parseBooleanFlag(
  searchParams: URLSearchParams,
  key: string
): boolean | undefined {
  const param = searchParams.get(key);
  if (param === "1") {
    return true;
  }
  return;
}

/**
 * Helper to parse numeric filter
 */
function parseNumericFilter(
  searchParams: URLSearchParams,
  key: string
): number | undefined {
  const param = searchParams.get(key);
  if (!param) {
    return;
  }
  const value = Number.parseFloat(param);
  return !Number.isNaN(value) && value > 0 ? value : undefined;
}

/**
 * Parse URL search params into typed filter objects
 * Pure function - no React, Zustand, or router dependencies
 */
export function parseCoffeeSearchParams(searchParams: URLSearchParams): {
  filters: CoffeeFilters;
  page: number;
  sort: CoffeeSort;
  limit: number;
} {
  const filters: CoffeeFilters = {};

  // Text search
  const q = searchParams.get("q");
  if (q?.trim()) {
    filters.q = q.trim();
  }

  // Array filters (comma-separated)
  const roastLevels = parseEnumArray<RoastLevelEnum>(
    searchParams.get("roastLevels")
  );
  if (roastLevels) {
    filters.roast_levels = roastLevels;
  }

  const processes = parseEnumArray<ProcessEnum>(searchParams.get("processes"));
  if (processes) {
    filters.processes = processes;
  }

  const statuses = parseEnumArray<CoffeeStatusEnum>(
    searchParams.get("statuses")
  );
  if (statuses) {
    filters.status = statuses;
  }

  const flavorKeys = parseStringArray(searchParams.get("flavorKeys"));
  if (flavorKeys) {
    filters.flavor_keys = flavorKeys;
  }

  const roasterIds = parseStringArray(searchParams.get("roasterIds"));
  if (roasterIds) {
    filters.roaster_ids = roasterIds;
  }

  const regionIds = parseStringArray(searchParams.get("regionIds"));
  if (regionIds) {
    filters.region_ids = regionIds;
  }

  const estateIds = parseStringArray(searchParams.get("estateIds"));
  if (estateIds) {
    filters.estate_ids = estateIds;
  }

  const brewMethodIds = parseStringArray(searchParams.get("brewMethodIds"));
  if (brewMethodIds) {
    filters.brew_method_ids = brewMethodIds;
  }

  // Boolean flags
  if (parseBooleanFlag(searchParams, "inStockOnly")) {
    filters.in_stock_only = true;
  }

  if (parseBooleanFlag(searchParams, "has250gOnly")) {
    filters.has_250g_only = true;
  }

  // Numeric filter
  const maxPrice = parseNumericFilter(searchParams, "maxPrice");
  if (maxPrice !== undefined) {
    filters.max_price = maxPrice;
  }

  return {
    filters,
    page: parsePage(searchParams),
    sort: parseSort(searchParams),
    limit: parseLimit(searchParams),
  };
}

/**
 * Helper to add array filter to params if present
 */
function addArrayFilter(
  params: URLSearchParams,
  key: string,
  values: string[] | undefined
): void {
  if (values && values.length > 0) {
    params.set(key, values.join(","));
  }
}

/**
 * Helper to add text filter to params if present
 */
function addTextFilter(
  params: URLSearchParams,
  key: string,
  value: string | undefined
): void {
  if (value?.trim()) {
    params.set(key, value.trim());
  }
}

/**
 * Helper to add boolean flag to params if true
 */
function addBooleanFlag(
  params: URLSearchParams,
  key: string,
  value: boolean | undefined
): void {
  if (value === true) {
    params.set(key, "1");
  }
}

/**
 * Helper to add numeric filter to params if present and valid
 */
function addNumericFilter(
  params: URLSearchParams,
  key: string,
  value: number | undefined
): void {
  if (value && value > 0) {
    params.set(key, value.toString());
  }
}

/**
 * Build URL query string from filter objects
 * Only includes non-default values
 * Pure function - no React, Zustand, or router dependencies
 */
export function buildCoffeeQueryString(
  filters: CoffeeFilters,
  page: number,
  sort: CoffeeSort,
  limit: number
): string {
  const params = new URLSearchParams();

  // Page, limit, sort (only if not default)
  if (page !== DEFAULT_PAGE) {
    params.set("page", page.toString());
  }
  if (limit !== DEFAULT_LIMIT) {
    params.set("limit", limit.toString());
  }
  if (sort !== DEFAULT_SORT) {
    params.set("sort", sort);
  }

  // Text search
  addTextFilter(params, "q", filters.q);

  // Array filters
  addArrayFilter(params, "roastLevels", filters.roast_levels);
  addArrayFilter(params, "processes", filters.processes);
  addArrayFilter(params, "statuses", filters.status);
  addArrayFilter(params, "flavorKeys", filters.flavor_keys);
  addArrayFilter(params, "roasterIds", filters.roaster_ids);
  addArrayFilter(params, "regionIds", filters.region_ids);
  addArrayFilter(params, "estateIds", filters.estate_ids);
  addArrayFilter(params, "brewMethodIds", filters.brew_method_ids);

  // Boolean flags
  addBooleanFlag(params, "inStockOnly", filters.in_stock_only);
  addBooleanFlag(params, "has250gOnly", filters.has_250g_only);

  // Numeric filter
  addNumericFilter(params, "maxPrice", filters.max_price);

  return params.toString();
}

export interface CoffeeCollectionValue {
  type?: "dynamic" | "manual";
  coffeeIds?: string[];
  roastLevel?: string[];
  beanType?: string[];
  processingMethod?: string[];
  regions?: string[];
  roasters?: string[];
  isSingleOrigin?: boolean;
  isFeatured?: boolean;
  isSeasonal?: boolean;
  tags?: string[];
  limit?: number;
}

export interface RoasterCollectionValue {
  type?: "dynamic" | "manual";
  roasterIds?: string[];
  states?: string[];
  cities?: string[];
  hasPhysicalStore?: boolean;
  hasSubscription?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  limit?: number;
}

/**
 * Builds the same URLSearchParams shape the /api/coffees route expects,
 * shared between the client-side CoffeeCollection block and the server-side
 * article prefetch so both hit fetchCoffees with identical filters.
 */
export function buildCoffeeCollectionParams(
  value: CoffeeCollectionValue
): URLSearchParams {
  const { type = "dynamic", coffeeIds, limit = 3 } = value;
  const params = new URLSearchParams();
  params.set("limit", limit.toString());

  if (type === "manual" && coffeeIds?.length) {
    params.set("coffeeIds", coffeeIds.join(","));
  } else {
    if (value.roastLevel?.length)
      params.set("roastLevels", value.roastLevel.join(","));
    if (value.beanType?.length)
      params.set("beanSpecies", value.beanType.join(","));
    if (value.processingMethod?.length)
      params.set("processes", value.processingMethod.join(","));
    if (value.regions?.length) params.set("regions", value.regions.join(","));
    if (value.roasters?.length)
      params.set("roasters", value.roasters.join(","));
    if (value.isSingleOrigin) params.set("isSingleOrigin", "1");
    if (value.isFeatured) params.set("isFeatured", "1");
    if (value.isSeasonal) params.set("isSeasonal", "1");
    if (value.tags?.length) params.set("tags", value.tags.join(","));
  }

  return params;
}

/**
 * Builds the same URLSearchParams shape the /api/roasters route expects,
 * shared between the client-side RoasterCollection block and the server-side
 * article prefetch so both hit fetchRoasters with identical filters.
 */
export function buildRoasterCollectionParams(
  value: RoasterCollectionValue
): URLSearchParams {
  const { type = "dynamic", roasterIds, limit = 3 } = value;
  const params = new URLSearchParams();
  params.set("limit", limit.toString());

  if (type === "manual" && roasterIds?.length) {
    params.set("roasterIds", roasterIds.join(","));
  } else {
    if (value.states?.length) params.set("states", value.states.join(","));
    if (value.cities?.length) params.set("cities", value.cities.join(","));
    if (value.hasPhysicalStore) params.set("hasPhysicalStore", "1");
    if (value.hasSubscription) params.set("hasSubscription", "1");
    if (value.isFeatured) params.set("isFeatured", "1");
    if (value.isVerified) params.set("isVerified", "1");
    if (value.tags?.length) params.set("tags", value.tags.join(","));
  }

  return params;
}

/**
 * Canonical path for a coffee detail page (nested under roaster).
 * Use this when building links to coffee detail pages.
 */
export function coffeeDetailHref(
  roasterSlug: string,
  coffeeSlug: string
): string {
  return `/roasters/${roasterSlug}/coffees/${coffeeSlug}`;
}

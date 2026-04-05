// src/lib/discovery/landing-pages/paths.ts

/** Canonical path for discovery landing pages (under /coffees) */
export function discoveryPagePath(slug: string): string {
  return `/coffees/${slug}`;
}

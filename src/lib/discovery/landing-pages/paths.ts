// src/lib/discovery/landing-pages/paths.ts
import { z } from "zod";

/** Validates discovery landing page slug segments (kebab-case, no path injection). */
export const discoverySlugSchema = z
  .string()
  .trim()
  .min(1, "Discovery slug cannot be empty")
  .refine((s) => !s.includes(".."), {
    message: "Discovery slug cannot contain path traversal sequences",
  })
  .refine((s) => !s.includes("/") && !s.includes("\\"), {
    message: "Discovery slug cannot contain path separators",
  })
  .regex(/^[a-z0-9-]+$/, {
    message:
      "Discovery slug must contain only lowercase letters, numbers, and hyphens",
  });

/** Canonical path for discovery landing pages (under /coffees) */
export function discoveryPagePath(slug: string): string {
  const parsed = discoverySlugSchema.safeParse(slug);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join("; ");
    throw new Error(`Invalid discovery slug: ${msg}`);
  }
  return `/coffees/${encodeURIComponent(parsed.data)}`;
}

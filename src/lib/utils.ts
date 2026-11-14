import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The type roles from src/app/styles/typography.css. Without this, tailwind-merge
// reads `text-caption` and friends as text colours and silently drops the role
// whenever a real colour follows: cn("text-caption", "text-foreground").
// Their own group, so a role only replaces another role.
// Separate trap, not fixed here: the roles are unlayered CSS, so a role that sets a
// colour, weight or tracking still beats a utility on the same element.
const twMerge = extendTailwindMerge<"type-role">({
  extend: {
    classGroups: {
      "type-role": [
        {
          text: [
            "hero",
            "display",
            "title",
            "heading",
            "subheading",
            "body",
            "body-large",
            "body-muted",
            "caption",
            "overline",
            "eyebrow",
            "label",
            "label-large",
            "micro",
            "ui-label",
            "ui-meta",
            "copy-compact",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Capitalizes the first letter of each word in a string
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
export function capitalizeFirstLetter(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Slugify heading text for anchor IDs. Must match between TOC and ArticleContent.
 */
export function slugifyHeading(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

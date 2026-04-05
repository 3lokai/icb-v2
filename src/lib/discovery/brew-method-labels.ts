/** Display labels for brew-method discovery slugs (e.g. V60, AeroPress). */
export const BREW_METHOD_LABELS: Record<string, string> = {
  v60: "V60",
  aeropress: "AeroPress",
  chemex: "Chemex",
  kalita: "Kalita",
  "french-press": "French Press",
  "filter-coffee": "Filter coffee",
};

export function brewSlugToLabel(slug: string): string {
  return (
    BREW_METHOD_LABELS[slug] ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

/** Shared styles for brew-method pills linking to discovery pages. */
export const brewMethodDiscoveryLinkClassName =
  "group inline-flex items-center rounded-full border border-border/40 bg-background/50 px-4 py-1.5 text-micro font-medium text-muted-foreground transition-all duration-300 hover:border-accent/40 hover:bg-accent/5 hover:text-accent hover:scale-[1.02] hover:shadow-sm";

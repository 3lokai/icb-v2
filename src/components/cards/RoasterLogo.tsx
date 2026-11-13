"use client";
// src/components/cards/RoasterLogo.tsx
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  roasterLogoUrl,
  roasterPlateClass,
} from "@/lib/utils/roaster-logo-plate";
import { TILE_FRAME } from "./tile";

/**
 * The only part of a roaster card that genuinely needs the browser: the initials
 * fallback is driven by the image's own `onError`. The plate tint is no longer
 * computed here — it comes from roasters.logo_is_light, sampled once at ingest.
 *
 * Isolating it here is what lets RoasterCard itself drop "use client" — the card
 * body is static markup, so under a server parent (SimilarRoasters,
 * RoasterDetailPage) only these small islands ship.
 *
 * Default and similar share one framed tile (see ./tile.ts); compact is a bare 40px logo.
 */
type RoasterLogoProps = {
  slug: string;
  name: string;
  /** roasters.logo_is_light; null falls back to the neutral plate. */
  logoIsLight: boolean | null;
  variant: "default" | "compact" | "similar";
};

function initialsFor(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function RoasterLogo({
  slug,
  name,
  logoIsLight,
  variant,
}: RoasterLogoProps) {
  const [hasError, setHasError] = useState(false);

  const logoUrl = roasterLogoUrl(slug);
  const plateClass = roasterPlateClass(logoIsLight);
  const initials = initialsFor(name);
  const altText = name ? `${name} logo` : "Coffee roaster logo";

  // Compact - small square logo, no plate
  if (variant === "compact") {
    return (
      <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded">
        {!hasError && logoUrl ? (
          <Image
            alt={altText}
            className="object-contain"
            fill
            itemProp="logo"
            sizes="40px"
            src={logoUrl}
            onError={() => setHasError(true)}
            unoptimized
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-border">
            <span className="text-caption font-semibold text-muted-foreground">
              {initials}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Default and similar: the logo sits uncropped and unblended on its contrast plate, inside
  // the same pressed frame as the coffee packaging tile. Similar is a shorter tile.
  const isSimilar = variant === "similar";
  return (
    <span
      className={cn(
        TILE_FRAME,
        "flex items-center justify-center",
        isSimilar ? "aspect-[2/1]" : "aspect-[4/3]",
        plateClass
      )}
    >
      <span className="relative block h-1/2 w-3/5">
        {!hasError && logoUrl ? (
          <Image
            alt={altText}
            className="object-contain"
            fill
            itemProp="logo"
            sizes="(max-width: 640px) 50vw, 180px"
            src={logoUrl}
            onError={() => setHasError(true)}
            unoptimized
          />
        ) : (
          <span className="flex size-full items-center justify-center font-serif text-title text-muted-foreground">
            {initials}
          </span>
        )}
      </span>
    </span>
  );
}

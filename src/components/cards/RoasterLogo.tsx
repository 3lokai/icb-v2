"use client";
// src/components/cards/RoasterLogo.tsx
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  roasterLogoUrl,
  roasterPlateClass,
} from "@/lib/utils/roaster-logo-plate";

/**
 * The only part of a roaster card that genuinely needs the browser: the initials
 * fallback is driven by the image's own `onError`. The plate tint is no longer
 * computed here — it comes from roasters.logo_is_light, sampled once at ingest.
 *
 * Isolating it here is what lets RoasterCard itself drop "use client" — the card
 * body is static markup, so under a server parent (SimilarRoasters,
 * RoasterDetailPage) only these small islands ship.
 *
 * Markup per variant is lifted verbatim out of RoasterCard; the variants differ
 * in plate, frame size and fallback scale, so they are spelled out rather than
 * parameterised.
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

  // Compact - small square logo, no plate
  if (variant === "compact") {
    return (
      <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded">
        {!hasError ? (
          <Image
            alt={name || "Coffee roaster logo"}
            className="object-contain"
            fill
            itemProp="logo"
            sizes="40px"
            src={logoUrl ?? ""}
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

  // Similar - logo plate, shorter than the directory tile
  if (variant === "similar") {
    return (
      <div
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden border-b border-border/40 p-6 transition-colors duration-300",
          plateClass
        )}
      >
        <div className="relative flex h-14 w-full max-w-[120px] items-center justify-center">
          {!hasError && logoUrl ? (
            <Image
              alt={name}
              className="object-contain"
              fill
              itemProp="logo"
              sizes="(max-width: 640px) 50vw, 120px"
              src={logoUrl}
              onError={() => setHasError(true)}
              unoptimized
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 border-2 border-accent/20">
              <span className="text-body font-black tracking-tighter text-accent">
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default - directory tile plate with dot texture
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden flex items-center justify-center border-b border-border/40 transition-colors duration-300",
        plateClass
      )}
    >
      {/* Subtle Plate Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.4) 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
      </div>

      {/* Logo Frame: Centered, larger size */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-8">
        <div className="relative flex h-20 w-full items-center justify-center max-w-[160px]">
          {!hasError ? (
            <Image
              alt={name || "Coffee roaster logo"}
              className="object-contain"
              fill
              itemProp="logo"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 160px"
              src={logoUrl ?? ""}
              onError={() => setHasError(true)}
              unoptimized
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 border-2 border-accent/20">
              <span className="text-heading font-black tracking-tighter text-accent">
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

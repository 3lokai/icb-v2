"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CoffeeCollection } from "@/lib/collections/coffee-collections";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

type CollectionCardProps = {
  collection: CoffeeCollection;
  variant?: "default" | "small";
  coffeeCount?: number; // Optional: pass actual count from DB
  onClick?: () => void;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function CollectionCard({
  collection,
  variant = "default",
  coffeeCount,
  onClick,
}: CollectionCardProps) {
  const isSmall = variant === "small";
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      href={collection.filterUrl}
      onClick={handleClick}
      aria-label={`Explore ${collection.name} collection`}
      className={cn(
        "group relative overflow-hidden",
        "surface-1 rounded-lg card-hover",
        "bg-transparent border-transparent hover:border-transparent", // Override surface-1 bg and border to show image
        "transition-colors duration-500",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        "block w-full",
        isSmall ? "aspect-square max-w-[200px]" : "aspect-[9/16] max-w-[280px]"
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {imageError ? (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent/40 to-primary/60" />
        ) : (
          <Image
            src={collection.imageUrl}
            alt={collection.name}
            fill
            className="object-cover rounded-lg transition-transform duration-500 ease-out group-hover:scale-110"
            sizes={
              isSmall
                ? "(max-width: 768px) 50vw, 33vw"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
            priority={collection.featured}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Gradient Overlay */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-t from-black/80 via-black/40 to-black/5"
        )}
      />

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-end">
        <Stack
          gap="2"
          className={cn(
            isSmall ? "card-padding-compact" : "card-padding",
            "transition-opacity group-hover:opacity-100"
          )}
        >
          {/* Heading */}
          <h3
            className={`${
              isSmall ? "text-subheading" : "text-heading"
            } text-white drop-shadow-lg text-balance line-clamp-2`}
          >
            {collection.name}
          </h3>

          {/* Tagline - only show in default variant */}
          {!isSmall && (
            <p className="text-body font-medium text-white/90 drop-shadow-md line-clamp-2">
              {collection.tagline}
            </p>
          )}

          {/* CTA with Coffee Count */}
          <div className="flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">
            <span className={cn(isSmall ? "text-caption" : "text-body")}>
              Explore
            </span>
            {coffeeCount !== undefined && !isSmall && (
              <>
                <span className="text-white/50">·</span>
                <span className="text-caption text-white/70">
                  {coffeeCount} {coffeeCount === 1 ? "coffee" : "coffees"}
                </span>
              </>
            )}
            <Icon
              name="ArrowRight"
              size={isSmall ? 16 : 18}
              color="glass"
              className="ml-1 transition-transform group-hover:translate-x-1"
            />
          </div>
        </Stack>
      </div>
    </Link>
  );
}

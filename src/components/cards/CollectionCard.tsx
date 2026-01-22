"use client";

import Image from "next/image";
import Link from "next/link";
import type { CoffeeCollection } from "@/lib/collections/coffee-collections";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

// ============================================================================
// TYPES
// ============================================================================

type CollectionCardProps = {
  collection: CoffeeCollection;
  variant?: "default" | "hero";
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
  const isHero = variant === "hero";

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      href={collection.filterUrl}
      onClick={handleClick}
      className={`
        collection-card group relative overflow-hidden 
        rounded-3 transition-all duration-200
        hover:scale-[1.02] hover:brightness-110
        focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-primary focus-visible:ring-offset-2
        ${isHero ? "aspect-[21/9]" : "aspect-[4/3]"}
      `}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={collection.imageUrl}
          alt={collection.name}
          fill
          className="object-cover"
          sizes={
            isHero
              ? "100vw"
              : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          }
          priority={isHero || collection.featured}
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 60%)",
        }}
      />

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-end p-6">
        {/* Badges */}
        {collection.badges && collection.badges.length > 0 && (
          <div className="flex gap-2 mb-4">
            {collection.badges.slice(0, 3).map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant || "onMedia"}
                className="backdrop-blur-sm"
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Heading */}
        <h3
          className={`
            font-semibold text-white mb-1 
            drop-shadow-lg
            ${isHero ? "text-5 md:text-6" : "text-4 md:text-5"}
          `}
        >
          {collection.name}
        </h3>

        {/* Tagline */}
        <p className="text-1 text-white/80 mb-3 drop-shadow-md">
          {collection.tagline}
        </p>

        {/* Description (only for hero variant) */}
        {isHero && (
          <p className="text-2 text-white/70 mb-4 max-w-2xl line-clamp-2">
            {collection.description}
          </p>
        )}

        {/* CTA with Coffee Count */}
        <div className="flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">
          <span className="text-2 font-medium">Explore</span>
          {coffeeCount !== undefined && (
            <>
              <span className="text-white/50">·</span>
              <span className="text-1 text-white/70">
                {coffeeCount} {coffeeCount === 1 ? "coffee" : "coffees"}
              </span>
            </>
          )}
          <ArrowRight
            size={20}
            weight="bold"
            className="ml-1 transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

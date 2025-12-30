// src/components/cards/RegionCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RegionSummary } from "@/types/region-types";

type RegionCardProps = {
  region: RegionSummary;
};

export default function RegionCard({ region }: RegionCardProps) {
  if (!(region && region.slug && region.name)) {
    return null;
  }

  return (
    <Link
      aria-label={`Explore coffee from ${region.name}${region.state ? `, ${region.state}` : ""} region`}
      href={`/regions/${region.slug}`}
    >
      <Card
        className={cn("region-card surface-1 hover-lift card-hover")}
        itemScope
        itemType="https://schema.org/Place"
      >
        <Image
          alt={`Coffee plantation in ${region.name}${region.state ? `, ${region.state}` : ""}`}
          className="object-cover"
          fill
          itemProp="image"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 400px"
          src={region.image_url || "/images/default-region.jpg"}
        />

        <div className="region-overlay" />

        {region.ribbon && (
          <div
            className={cn(
              "absolute top-2 left-2 rounded-md px-2 py-1 font-medium text-overline",
              region.ribbon === "featured" && "bg-chart-1 text-white",
              region.ribbon === "popular" && "bg-chart-4 text-white"
            )}
          >
            {region.ribbon === "featured" && "Featured"}
            {region.ribbon === "popular" && "Popular"}
          </div>
        )}

        <div className="region-content">
          <h3 className="text-heading text-white" itemProp="name">
            {region.name}
          </h3>
          {region.state && (
            <p className="text-caption text-white/80" itemProp="address">
              {region.state}
            </p>
          )}
          {region.description && (
            <p
              className="mt-2 line-clamp-2 text-caption text-white/80"
              itemProp="description"
            >
              {region.description}
            </p>
          )}
        </div>
        <meta
          content={`https://indiancoffeebeans.com/regions/${region.slug}`}
          itemProp="url"
        />
      </Card>
    </Link>
  );
}

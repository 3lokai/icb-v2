"use client";

import Image from "next/image";
import type { RoasterDetail } from "@/types/roaster-types";
import { roasterImagePresets } from "@/lib/imagekit";
import Tag from "@/components/common/Tag";

type RoasterHeroProps = {
  roaster: RoasterDetail;
};

export function RoasterHero({ roaster }: RoasterHeroProps) {
  // Build location string
  const locationParts: string[] = [];
  if (roaster.hq_city) locationParts.push(roaster.hq_city);
  if (roaster.hq_state) locationParts.push(roaster.hq_state);
  if (roaster.hq_country) locationParts.push(roaster.hq_country);
  const location = locationParts.length > 0 ? locationParts.join(", ") : null;

  // Build badges
  const badges: string[] = [];
  if (roaster.is_active) {
    badges.push("Active");
  }

  return (
    <div className="card-shell card-padding">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Logo */}
        <div className="flex-shrink-0">
          {roaster.slug ? (
            <div className="relative h-32 w-32 overflow-hidden rounded-lg bg-muted md:h-40 md:w-40">
              <Image
                alt={`${roaster.name} logo`}
                className="object-contain"
                fill
                priority
                sizes="(max-width: 768px) 128px, 160px"
                src={roasterImagePresets.roasterLogo(
                  `roasters/${roaster.slug}-logo`
                )}
              />
            </div>
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-muted text-body-muted md:h-40 md:w-40">
              <span className="text-display">☕</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Name and location */}
          <div>
            <h1 className="text-display mb-2">{roaster.name}</h1>
            {location && (
              <p className="text-body-muted flex items-center gap-1">
                <span>📍</span>
                <span>{location}</span>
              </p>
            )}
          </div>

          {/* Description */}
          {roaster.description && (
            <div className="text-body">
              <p className="whitespace-pre-line">{roaster.description}</p>
            </div>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Tag key={badge} variant="outline">
                  {badge}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

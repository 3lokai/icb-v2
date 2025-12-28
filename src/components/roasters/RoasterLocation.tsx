"use client";

import type { RoasterDetail } from "@/types/roaster-types";

type RoasterLocationProps = {
  roaster: RoasterDetail;
};

export function RoasterLocation({ roaster }: RoasterLocationProps) {
  // Build location info
  const locationParts: string[] = [];
  if (roaster.hq_city) locationParts.push(roaster.hq_city);
  if (roaster.hq_state) locationParts.push(roaster.hq_state);
  if (roaster.hq_country) locationParts.push(roaster.hq_country);
  const location = locationParts.length > 0 ? locationParts.join(", ") : null;

  // If no location or contact info, don't render
  if (!location && !roaster.phone && !roaster.support_email) {
    return null;
  }

  return (
    <div className="card-shell card-padding">
      <h2 className="text-title mb-4">Location & Contact</h2>
      <div className="stack-sm">
        {location && (
          <div>
            <div className="text-caption text-muted-foreground mb-1">
              Headquarters
            </div>
            <div className="text-body">{location}</div>
          </div>
        )}
        {roaster.phone && (
          <div>
            <div className="text-caption text-muted-foreground mb-1">Phone</div>
            <a
              href={`tel:${roaster.phone}`}
              className="text-body text-primary hover:underline"
            >
              {roaster.phone}
            </a>
          </div>
        )}
        {roaster.support_email && (
          <div>
            <div className="text-caption text-muted-foreground mb-1">Email</div>
            <a
              href={`mailto:${roaster.support_email}`}
              className="text-body text-primary hover:underline"
            >
              {roaster.support_email}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

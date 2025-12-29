"use client";

import type { RoasterDetail } from "@/types/roaster-types";
import { Icon } from "@/components/common/Icon";

type RoasterSocialLinksProps = {
  roaster: RoasterDetail;
};

export function RoasterSocialLinks({ roaster }: RoasterSocialLinksProps) {
  const links: Array<{ label: string; url: string; icon?: string }> = [];

  // Website
  if (roaster.website) {
    links.push({
      label: "Website",
      url: roaster.website,
      icon: "🌐",
    });
  }

  // Instagram
  if (roaster.instagram_handle) {
    const instagramUrl = roaster.instagram_handle.startsWith("http")
      ? roaster.instagram_handle
      : `https://instagram.com/${roaster.instagram_handle.replace(/^@/, "")}`;
    links.push({
      label: "Instagram",
      url: instagramUrl,
      icon: "📷",
    });
  }

  // Other social links from social_json
  if (roaster.social_json && typeof roaster.social_json === "object") {
    const social = roaster.social_json as Record<string, unknown>;
    if (social.twitter && typeof social.twitter === "string") {
      links.push({
        label: "Twitter",
        url: social.twitter.startsWith("http")
          ? social.twitter
          : `https://twitter.com/${social.twitter.replace(/^@/, "")}`,
        icon: "🐦",
      });
    }
    if (social.facebook && typeof social.facebook === "string") {
      links.push({
        label: "Facebook",
        url: social.facebook,
        icon: "👥",
      });
    }
    if (social.linkedin && typeof social.linkedin === "string") {
      links.push({
        label: "LinkedIn",
        url: social.linkedin,
        icon: "💼",
      });
    }
  }

  // If no links, don't render
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="card-shell card-padding">
      <h2 className="text-title mb-4">Connect</h2>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {link.icon && <span>{link.icon}</span>}
            <span>{link.label}</span>
            <Icon name="ArrowSquareOut" size={12} className="h-3 w-3" />
          </a>
        ))}
      </div>
    </div>
  );
}

"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DiscordLogoIcon,
  FacebookLogoIcon,
  RedditLogoIcon,
  TelegramLogoIcon,
  UsersThreeIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { Icon } from "@/components/common/Icon";
import { CommunityTrackingLink } from "@/components/common/TrackingLink";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { cn } from "@/lib/utils";
import type { CommunityDTO, CommunityPlatform } from "@/types/community-types";

type CommunityCardProps = {
  community: CommunityDTO;
  className?: string;
};

const platformConfig: Record<
  CommunityPlatform,
  { icon: ComponentType<IconProps>; color: string; label: string }
> = {
  whatsapp: {
    icon: WhatsappLogoIcon,
    color: "text-[#25D366]",
    label: "WhatsApp",
  },
  discord: { icon: DiscordLogoIcon, color: "text-[#5865F2]", label: "Discord" },
  telegram: {
    icon: TelegramLogoIcon,
    color: "text-[#0088cc]",
    label: "Telegram",
  },
  facebook_group: {
    icon: FacebookLogoIcon,
    color: "text-[#1877F2]",
    label: "Facebook",
  },
  reddit: { icon: RedditLogoIcon, color: "text-[#FF4500]", label: "Reddit" },
  other: {
    icon: UsersThreeIcon,
    color: "text-muted-foreground",
    label: "Other",
  },
};

/** Localized digits; preserves trailing "+" (e.g. "5000+") when present. */
function formatMemberCountForDisplay(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const hasPlus = trimmed.endsWith("+");
  const numericPart = (hasPlus ? trimmed.slice(0, -1) : trimmed).replace(
    /,/g,
    ""
  );
  const num = Number(numericPart);
  if (!Number.isFinite(num)) return trimmed;
  return `${num.toLocaleString("en-IN")}${hasPlus ? "+" : ""}`;
}

function CommunityCardComponent({ community, className }: CommunityCardProps) {
  const config = platformConfig[community.platform];
  const isInviteOnRequest =
    community.invite_url.trim().toLowerCase() === "invite on request";

  const memberCountFormatted =
    community.member_count != null && community.member_count !== ""
      ? formatMemberCountForDisplay(community.member_count)
      : "";

  const ariaLabel = isInviteOnRequest
    ? `${community.name} is invite on request`
    : `Join ${community.name} on ${config.label}`;

  const cardContent = (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden",
        "surface-1 rounded-lg card-hover transition-all duration-300",
        isInviteOnRequest && "cursor-default",
        "p-0",
        className
      )}
    >
      <div className="bg-noise pointer-events-none absolute inset-0 z-0 opacity-[0.03]" />

      <CardContent className="relative z-10 flex h-full flex-1 flex-col gap-5 card-padding">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 transition-colors duration-300 group-hover:bg-muted",
              config.color
            )}
          >
            <Icon icon={config.icon} size={28} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="shrink-0 text-overline">
              {config.label}
            </Badge>
            {memberCountFormatted ? (
              <span className="text-micro font-medium text-muted-foreground">
                {memberCountFormatted} members
              </span>
            ) : null}
          </div>
        </div>

        <Stack gap="2">
          <h3 className="text-heading transition-colors duration-300 group-hover:text-accent text-balance line-clamp-2">
            {community.name}
          </h3>
          <p className="text-body text-muted-foreground line-clamp-3">
            {community.description}
          </p>
        </Stack>

        <div className="mt-auto pt-4 flex flex-col gap-4">
          {community.tags.length > 0 && (
            <Cluster gap="2">
              {community.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-micro lowercase"
                >
                  #{tag}
                </Badge>
              ))}
            </Cluster>
          )}

          {community.moderators.length > 0 && (
            <div className="flex items-center gap-2 border-t border-border/10 pt-4">
              <span className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60">
                MODERATED BY
              </span>
              <span className="text-micro font-medium text-muted-foreground italic">
                {community.moderators.join(", ")}
              </span>
            </div>
          )}

          <div
            className={cn(
              "inline-flex h-10 items-center rounded-md border border-input bg-background px-4 py-2 text-label font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              isInviteOnRequest
                ? "justify-start text-muted-foreground border-border/40 bg-muted/30"
                : "justify-center group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground"
            )}
          >
            {isInviteOnRequest ? "Invite on Request" : "Join Community"}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return isInviteOnRequest ? (
    // Non-interactive: no link/keyboard target, so no focus ring. The visible
    // "Invite on Request" pill conveys state; aria-label would not be announced
    // on a non-focusable element.
    <div className="block h-full rounded-lg">{cardContent}</div>
  ) : (
    <CommunityTrackingLink
      ariaLabel={ariaLabel}
      communityId={community.id}
      communityPlatform={community.platform}
      href={community.invite_url}
    >
      {cardContent}
    </CommunityTrackingLink>
  );
}

export const CommunityCard = memo(CommunityCardComponent, (prev, next) => {
  return (
    prev.community.id === next.community.id &&
    prev.community.name === next.community.name &&
    prev.community.description === next.community.description &&
    prev.community.member_count === next.community.member_count &&
    JSON.stringify(prev.community.moderators) ===
      JSON.stringify(next.community.moderators) &&
    JSON.stringify(prev.community.tags) ===
      JSON.stringify(next.community.tags) &&
    prev.className === next.className
  );
});

CommunityCard.displayName = "CommunityCard";

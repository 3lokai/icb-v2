import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRightIcon,
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
        "relative flex h-full flex-col overflow-hidden",
        "surface-1 rounded-lg",
        isInviteOnRequest ? "cursor-default" : "group card-hover",
        "p-0",
        className
      )}
    >
      <CardContent className="relative z-10 flex h-full flex-1 flex-col gap-6 card-padding">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg bg-muted",
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
              <span className="text-ui-meta">
                {memberCountFormatted} members
              </span>
            ) : null}
          </div>
        </div>

        <Stack gap="2">
          <h3 className="text-heading text-balance line-clamp-2 underline-offset-4 group-hover:underline">
            {community.name}
          </h3>
          <p className="text-copy-compact text-muted-foreground line-clamp-3">
            {community.description}
          </p>
        </Stack>

        <div className="mt-auto pt-4 flex flex-col gap-4">
          {community.tags.length > 0 && (
            <Cluster gap="2">
              {community.tags.map((tag) => (
                <span key={tag} className="text-ui-meta lowercase">
                  #{tag}
                </span>
              ))}
            </Cluster>
          )}

          {community.moderators.length > 0 && (
            <p className="border-t border-border pt-4 text-ui-meta">
              Moderated by {community.moderators.join(", ")}
            </p>
          )}

          {isInviteOnRequest ? (
            // Plain text, not a button shape: these cards have no link, and the
            // old pill drew dead clicks (Clarity, /communities?platform=whatsapp).
            <p className="text-ui-meta">
              Invite on request · no public join link
            </p>
          ) : (
            // ↗ because the invite leaves ICB. The whole card is the link.
            <span className="flex items-center gap-1 text-ui-label">
              Join community
              <Icon icon={ArrowUpRightIcon} size={16} />
            </span>
          )}
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
    <a
      aria-label={ariaLabel}
      className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href={community.invite_url}
      rel="noopener noreferrer"
      target="_blank"
    >
      {cardContent}
    </a>
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

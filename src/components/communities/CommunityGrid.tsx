"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Input } from "@/components/ui/input";
import { Icon, type IconName } from "@/components/common/Icon";
import { CommunityCard } from "@/components/cards/CommunityCard";
import { cn } from "@/lib/utils";
import type { CommunityDTO, CommunityPlatform } from "@/types/community-types";

type CommunityGridProps = {
  communities: CommunityDTO[];
};

const PLATFORM_META: Record<
  CommunityPlatform,
  { label: string; icon: IconName }
> = {
  whatsapp: { label: "WhatsApp", icon: "WhatsappLogo" },
  discord: { label: "Discord", icon: "DiscordLogo" },
  telegram: { label: "Telegram", icon: "TelegramLogo" },
  facebook_group: { label: "Facebook", icon: "FacebookLogo" },
  reddit: { label: "Reddit", icon: "RedditLogo" },
  other: { label: "Other", icon: "UsersThree" },
};

const PLATFORM_ORDER: CommunityPlatform[] = [
  "whatsapp",
  "discord",
  "telegram",
  "facebook_group",
  "reddit",
  "other",
];

export function CommunityGrid({ communities }: CommunityGridProps) {
  const reduceMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Only offer filter chips for platforms that actually have communities.
  const availablePlatforms = useMemo(
    () =>
      PLATFORM_ORDER.filter((p) => communities.some((c) => c.platform === p)),
    [communities]
  );

  const platformParam = searchParams.get("platform");
  const [activePlatform, setActivePlatform] = useState<
    CommunityPlatform | "all"
  >(
    platformParam &&
      availablePlatforms.includes(platformParam as CommunityPlatform)
      ? (platformParam as CommunityPlatform)
      : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const selectPlatform = (platform: CommunityPlatform | "all") => {
    setActivePlatform(platform);
    const params = new URLSearchParams(searchParams.toString());
    if (platform === "all") {
      params.delete("platform");
    } else {
      params.set("platform", platform);
    }
    const query = params.toString();
    // Shareable filtered views without polluting history or jumping scroll.
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const filteredCommunities = useMemo(() => {
    let list = communities;

    if (activePlatform !== "all") {
      list = list.filter((c) => c.platform === activePlatform);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some((t) => t.toLowerCase().includes(query)) ||
          c.moderators.some((m) => m.toLowerCase().includes(query))
      );
    }

    return list;
  }, [communities, activePlatform, searchQuery]);

  const isFiltered = activePlatform !== "all" || searchQuery.trim() !== "";

  const resetFilters = () => {
    setSearchQuery("");
    selectPlatform("all");
  };

  // Reduced-motion: render visible immediately, no stagger or travel.
  const containerVariants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
      };

  const itemVariants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98] as const,
          },
        },
      };

  return (
    <Section spacing="default">
      <Stack gap="8">
        {/* Directory header + search */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Stack gap="2">
            <h2 className="text-title text-balance leading-none">
              Explore coffee circles
            </h2>
            <p className="text-body text-muted-foreground" aria-live="polite">
              {isFiltered
                ? `${filteredCommunities.length} of ${communities.length} ${
                    communities.length === 1 ? "community" : "communities"
                  }`
                : `${communities.length} ${
                    communities.length === 1 ? "community" : "communities"
                  }`}
            </p>
          </Stack>

          <div className="relative w-full max-w-sm">
            <Icon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              name="MagnifyingGlass"
              size={18}
            />
            <Input
              className="h-11 border-border/40 bg-muted/30 pl-10 transition-colors focus:bg-background"
              placeholder="Search by name, tags, or mods..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search communities"
            />
          </div>
        </div>

        {/* Platform filter chips */}
        {availablePlatforms.length > 1 && (
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter by platform"
          >
            <FilterChip
              active={activePlatform === "all"}
              onClick={() => selectPlatform("all")}
            >
              All
            </FilterChip>
            {availablePlatforms.map((platform) => (
              <FilterChip
                key={platform}
                active={activePlatform === platform}
                onClick={() => selectPlatform(platform)}
                icon={PLATFORM_META[platform].icon}
              >
                {PLATFORM_META[platform].label}
              </FilterChip>
            ))}
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredCommunities.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: reduceMotion ? 1 : 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-20 text-center"
              >
                <Stack gap="4" className="items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Icon name="Ghost" size={32} color="muted" />
                  </div>
                  <p className="text-body-large text-muted-foreground">
                    No communities match your search.
                  </p>
                  <button
                    className="text-label text-accent hover:underline"
                    onClick={resetFilters}
                  >
                    Clear filters
                  </button>
                </Stack>
              </motion.div>
            ) : (
              filteredCommunities.map((community) => (
                <motion.div
                  key={community.id}
                  layout={!reduceMotion}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
                >
                  <CommunityCard community={community} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </Stack>
    </Section>
  );
}

type FilterChipProps = {
  active: boolean;
  onClick: () => void;
  icon?: IconName;
  children: React.ReactNode;
};

function FilterChip({ active, onClick, icon, children }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-label transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border/60 bg-transparent text-muted-foreground hover:border-accent hover:text-foreground"
      )}
    >
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  );
}

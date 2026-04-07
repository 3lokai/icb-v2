"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Stack } from "@/components/primitives/stack";
import { TagList } from "@/components/common/Tag";
import Tag from "@/components/common/Tag";
import { Icon, type IconName } from "@/components/common/Icon";
import type { TasteProfileData } from "@/types/profile-types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

type EnhancedTasteProfileData = TasteProfileData & {
  roasts: string[];
  methods: string[];
  persona: string;
  tier: number;
};

type ProfileTasteProfileProps = {
  profile: EnhancedTasteProfileData;
  isOwner?: boolean;
  isAnonymous?: boolean;
  /** When false, hides the KPI stat strip (e.g. shown in ProfileAtAGlance). Default true. */
  showStatBar?: boolean;
  /** Total count of coffees in the user's selection list. */
  selectionsCount?: number;
};

type TierTeaserProps = {
  required: number;
  label: string;
  totalReviews: number;
  icon?: IconName;
};

function TierTeaser({ required, label, totalReviews, icon }: TierTeaserProps) {
  const remaining = required - totalReviews;
  const progress = Math.min((totalReviews / required) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-dashed border-border/40 bg-muted/5 transition-colors hover:bg-muted/10 h-full"
    >
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-overline text-muted-foreground/60 tracking-[0.15em] group-hover:text-muted-foreground transition-colors">
          {label}
        </h3>
        <div className="text-muted-foreground/30">
          <Icon name={icon ?? "LockKey"} size={16} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end gap-3">
        <div className="flex items-center justify-between text-micro">
          <span className="text-accent italic">
            Tier {required === 5 ? "2" : "3"}
          </span>
          <span className="text-muted-foreground/50">
            {totalReviews} / {required}
          </span>
        </div>
        <div className="h-1 w-full bg-border/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-accent/30 group-hover:bg-accent/50 transition-colors"
          />
        </div>
        <p className="text-micro italic text-muted-foreground/60 leading-relaxed">
          {remaining} more {remaining === 1 ? "coffee" : "coffees"} to uncover.
        </p>
      </div>
    </motion.div>
  );
}

export function ProfileTasteProfile({
  profile,
  isOwner = false,
  isAnonymous = false,
  showStatBar = true,
  selectionsCount = 0,
}: ProfileTasteProfileProps) {
  const {
    total_reviews,
    avg_rating,
    distinct_roaster_count,
    roasts,
    methods,
    top_flavor_labels,
    top_roasters,
    top_region_names,
    top_processes,
    top_species,
    recommend_rate,
    tier,
    persona,
    rating_distribution,
  } = profile;

  const hasEnoughRatings = total_reviews >= 3;

  return (
    <Card className="bg-muted/10 rounded-3xl p-8 md:p-12 border border-border/20 overflow-hidden relative shadow-sm">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <Stack gap="8" className="relative">
        {/* Section Header */}
        <Stack gap="4">
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-8 md:w-12 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.15em]">
              PALATE JOURNEY
            </span>
          </div>
          <Stack gap="1">
            <h2 className="text-title text-balance leading-[1.1] tracking-tight font-serif m-0">
              {tier === 1
                ? "Taste "
                : tier === 2
                  ? "The Developing "
                  : "The Curated "}
              <span className="text-accent italic">
                {tier === 1
                  ? "Foundations."
                  : tier === 2
                    ? "Palate."
                    : "Identity."}
              </span>
            </h2>
            {hasEnoughRatings && tier < 3 && (
              <p className="text-caption max-w-xl m-0">
                {isAnonymous
                  ? "A glimpse of your local preferences. Sign up to track your evolution over time."
                  : !isOwner
                    ? "Derived from my public rating record — a snapshot of preferences."
                    : "Derived from your rating record. Not an identity, just a glimpse of your current preferences."}
              </p>
            )}
          </Stack>
        </Stack>

        {!hasEnoughRatings ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group py-24 border border-dashed border-border/60 rounded-3xl flex flex-col items-center justify-center text-center gap-6 bg-muted/5 hover:bg-muted/10 transition-colors"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <Icon
                name="Sparkle"
                size={48}
                className="text-accent/40 relative z-10"
              />
            </div>
            <Stack gap="3" className="items-center px-6">
              <p className="text-body-large font-serif italic text-foreground m-0">
                A journey in the making.
              </p>
              <p className="text-caption text-muted-foreground max-w-sm m-0 leading-relaxed">
                {isAnonymous || isOwner
                  ? "Every coffee tells a story. Catalog three experiences to begin unveiling your unique palate identity."
                  : "Not enough public experiences yet to map this palate's journey."}
              </p>
              {(isAnonymous || isOwner) && (
                <Link href="/coffees" className="mt-2">
                  <Tag
                    variant="outline"
                    className="px-8 py-5 rounded-full border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground font-medium transition-all active:scale-95 cursor-pointer shadow-lg shadow-accent/5"
                  >
                    Begin the Journey
                  </Tag>
                </Link>
              )}
            </Stack>
          </motion.div>
        ) : (
          <Stack gap="12">
            {showStatBar && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-px md:bg-border/20 p-4 md:p-0 bg-background/40 md:bg-transparent rounded-2xl md:rounded-none overflow-hidden border border-border/10 md:border-none"
              >
                {[
                  {
                    label: "Library Count",
                    value: total_reviews,
                    suffix: "",
                    icon: "Coffee",
                  },
                  {
                    label: "Palate Standard",
                    value: avg_rating || "—",
                    suffix: "★",
                    icon: "Star",
                  },
                  {
                    label: "Roaster Reach",
                    value: distinct_roaster_count,
                    suffix: "",
                    icon: "MapPin",
                  },
                  {
                    label: "Hall of Fame",
                    value: selectionsCount,
                    suffix: "",
                    icon: "Heart",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-6 bg-background/50 md:bg-background/40 backdrop-blur-md first:rounded-l-2xl last:rounded-r-2xl group/stat transition-colors hover:bg-background/60"
                  >
                    <div className="flex items-center gap-2 opacity-50 group-hover/stat:opacity-80 transition-opacity">
                      <Icon
                        name={stat.icon as IconName}
                        size={10}
                        className="text-accent"
                      />
                      <span className="text-micro uppercase font-medium tracking-wider">
                        {stat.label}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-title md:text-title font-mono tabular-nums text-foreground font-medium">
                        {stat.value}
                      </span>
                      {stat.suffix && (
                        <span className="text-micro font-mono text-muted-foreground/60">
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Persona Section - Tier 3 Hero */}
            <AnimatePresence>
              {tier === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-accent/5 rounded-3xl p-8 md:p-10 border border-accent/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group/persona"
                >
                  {/* Achievement Shimmer/Glow */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-accent/0 via-accent/5 to-accent/0 -translate-x-full group-hover/persona:translate-x-full transition-transform duration-[2000ms] pointer-events-none" />
                  <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-60" />

                  <div className="relative">
                    <div className="bg-background/80 backdrop-blur-xl p-6 rounded-2xl border border-accent/20 shadow-2xl shadow-accent/10 relative z-10">
                      <Icon
                        name="Target"
                        size={40}
                        className="text-accent animate-pulse"
                      />
                    </div>
                    <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-pulse opacity-40 scale-125" />
                  </div>
                  <Stack gap="1" className="flex-1 text-center md:text-left">
                    <span className="text-overline text-muted-foreground tracking-[0.15em]">
                      PROFILE PERSONA
                    </span>
                    <h3 className="text-title italic text-accent m-0 leading-tight">
                      {persona}
                    </h3>
                    <p className="text-body-muted max-w-xl m-0 opacity-80 leading-relaxed italic">
                      Derived from your unique rating record and flavor
                      exploration.
                    </p>
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Insight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
              {/* TIER 1 SECTION */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Methods */}
                <Stack gap="4">
                  <h3 className="m-0 text-overline text-muted-foreground tracking-[0.15em]">
                    BREWING PREFERENCE
                  </h3>
                  <TagList className="flex-wrap">
                    {methods.map((method) => (
                      <Tag
                        key={method}
                        variant="outline"
                        className="px-3 py-1.5 border-accent/10 bg-accent/5 text-accent text-micro font-medium tracking-wider"
                      >
                        {method}
                      </Tag>
                    ))}
                  </TagList>
                </Stack>

                {/* Roast Levels */}
                <Stack gap="4">
                  <h3 className="m-0 text-overline text-muted-foreground tracking-[0.15em]">
                    ROAST AFFINITY
                  </h3>
                  <TagList className="flex-wrap">
                    {roasts.map((roast) => (
                      <Tag
                        key={roast}
                        variant="outline"
                        className="px-3 py-1.5 border-accent/10 bg-accent/5 text-accent text-micro font-medium tracking-wider"
                      >
                        {roast}
                      </Tag>
                    ))}
                  </TagList>
                </Stack>

                {/* TIER 2 Revelation */}
                {tier >= 2 ? (
                  <>
                    {/* Flavors */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex flex-col gap-4"
                    >
                      <h3 className="m-0 text-overline text-muted-foreground tracking-[0.15em]">
                        FLAVOR PALATE
                      </h3>
                      <TagList className="flex-wrap">
                        {top_flavor_labels?.length > 0 ? (
                          top_flavor_labels.map((label) => (
                            <Tag
                              key={label}
                              variant="outline"
                              className="px-3 py-1.5 border-accent/10 bg-accent/5 text-accent text-micro font-medium tracking-wider"
                            >
                              {label}
                            </Tag>
                          ))
                        ) : (
                          <span className="text-micro italic text-muted-foreground/30">
                            Not enough flavor data
                          </span>
                        )}
                      </TagList>
                    </motion.div>

                    {/* Roasters */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col gap-4"
                    >
                      <h3 className="m-0 text-overline text-muted-foreground tracking-[0.15em]">
                        PREFERRED ROASTERS
                      </h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-3">
                        {top_roasters?.map((roaster) => (
                          <Link
                            key={roaster.slug}
                            href={`/roasters/${roaster.slug}`}
                            className="text-caption font-medium text-foreground hover:text-accent border-b border-transparent hover:border-accent/40 transition-all group inline-flex items-center gap-1"
                          >
                            {roaster.name}
                            <Icon
                              name="ArrowUpRight"
                              size={10}
                              className="text-accent opacity-0 group-hover:opacity-100 -translate-y-0.5 transition-opacity"
                            />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <TierTeaser
                      required={5}
                      label="Flavor Palate"
                      totalReviews={total_reviews}
                      icon="MagnifyingGlass"
                    />
                    <TierTeaser
                      required={5}
                      label="Preferred Roasters"
                      totalReviews={total_reviews}
                      icon="Storefront"
                    />
                  </>
                )}

                {/* TIER 3 Revelation */}
                {tier >= 3 ? (
                  <>
                    {/* Regions */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col gap-4"
                    >
                      <h3 className="m-0 text-overline text-muted-foreground tracking-[0.15em]">
                        ORIGIN DEEP-DIVE
                      </h3>
                      <TagList className="flex-wrap">
                        {top_region_names?.map((region) => (
                          <Tag
                            key={region}
                            variant="outline"
                            className="px-3 py-1.5 border-accent/10 bg-accent/5 text-accent text-micro font-medium tracking-wider"
                          >
                            {region}
                          </Tag>
                        ))}
                      </TagList>
                    </motion.div>

                    {/* Processing */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-col gap-4"
                    >
                      <h3 className="m-0 text-overline text-muted-foreground tracking-[0.15em]">
                        PROCESSING PREFERENCE
                      </h3>
                      <TagList className="flex-wrap">
                        {top_processes?.map((process) => (
                          <Tag
                            key={process}
                            variant="outline"
                            className="px-3 py-1.5 border-accent/10 bg-accent/5 text-accent text-micro font-medium tracking-wider capitalize"
                          >
                            {process.replace("_", " ")}
                          </Tag>
                        ))}
                      </TagList>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <TierTeaser
                      required={10}
                      label="Origin Insights"
                      totalReviews={total_reviews}
                      icon="Globe"
                    />
                    <TierTeaser
                      required={10}
                      label="Processing Stats"
                      totalReviews={total_reviews}
                      icon="Flask"
                    />
                  </>
                )}
              </div>

              {/* Sidebar Insights */}
              <div className="lg:col-span-4 flex flex-col gap-10">
                {/* Bean Species Section */}
                {tier >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-6 rounded-3xl bg-background/40 border border-border/10"
                  >
                    <Stack gap="6">
                      <h3 className="m-0 text-overline text-muted-foreground tracking-[0.15em]">
                        BEAN SPECIES
                      </h3>
                      {top_species?.length > 0 ? (
                        <Stack gap="4">
                          {top_species.map((species) => (
                            <div key={species} className="flex flex-col gap-2">
                              <div className="flex items-center justify-between text-micro font-medium">
                                <span className="capitalize text-foreground font-sans">
                                  {species}
                                </span>
                                <span className="text-micro text-accent italic">
                                  TOP CHOICE
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-border/20 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  className="h-full bg-accent/40 rounded-full"
                                />
                              </div>
                            </div>
                          ))}
                        </Stack>
                      ) : (
                        <p className="text-micro italic text-muted-foreground/40 m-0">
                          No species data available yet.
                        </p>
                      )}
                    </Stack>
                  </motion.div>
                )}

                {/* Rating Distribution */}
                <div className="p-6 rounded-3xl bg-background/40 border border-border/10 flex flex-col gap-6">
                  <h3 className="m-0 text-overline text-muted-foreground tracking-[0.15em]">
                    RATING SPREAD
                  </h3>

                  {tier >= 3 ? (
                    <Stack gap="4">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = rating_distribution[star.toString()] || 0;
                        const maxCount = Math.max(
                          ...Object.values(rating_distribution),
                          1
                        );
                        const width = (count / maxCount) * 100;
                        return (
                          <div key={star} className="flex items-center gap-4">
                            <span className="text-micro font-mono text-muted-foreground/60 w-4 text-center shrink-0">
                              {star}★
                            </span>
                            <div className="flex-1 h-2 bg-border/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${width}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={cn(
                                  "h-full rounded-full",
                                  star >= 4
                                    ? "bg-accent/80"
                                    : "bg-muted-foreground/30",
                                  count > 0 ? "opacity-100" : "opacity-20"
                                )}
                              />
                            </div>
                            <span className="text-micro font-mono text-muted-foreground/40 w-6 text-right shrink-0">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                      <div className="mt-2 pt-4 border-t border-border/10">
                        <p className="text-caption italic text-muted-foreground/80 m-0 leading-relaxed">
                          {recommend_rate && recommend_rate > 0.7
                            ? "Generous & enthusiastic rating style."
                            : recommend_rate && recommend_rate < 0.3
                              ? "Discerning & critical palate standards."
                              : "Balanced & realistic rating approach."}
                        </p>
                      </div>
                    </Stack>
                  ) : (
                    <div className="py-2 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-micro italic text-muted-foreground/40">
                        <Icon name="LockKey" size={12} />
                        <span>Analysis unlocks at Tier 3</span>
                      </div>
                      <div className="space-y-3 opacity-20">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-2 bg-border/40 rounded-full w-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

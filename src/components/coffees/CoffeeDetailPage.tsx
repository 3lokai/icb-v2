"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import type { CoffeeDetail } from "@/types/coffee-types";
import { Icon } from "@/components/common/Icon";
import { Cluster } from "@/components/primitives/cluster";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Prose } from "@/components/primitives/prose";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewList, ReviewStats, QuickRating } from "@/components/reviews";
import { useReviews, useReviewStats } from "@/hooks/use-reviews";
import { cn, capitalizeFirstLetter } from "@/lib/utils";
import { SimilarCoffees } from "./SimilarCoffees";
import { CoffeeSensoryProfile } from "./CoffeeSensoryProfile";
import Tag, { TagList } from "@/components/common/Tag";
import CoffeeImageCarousel from "@/components/layout/carousel-image";
import { CoffeePricingTable } from "./CoffeePricingTable";

type CoffeeDetailPageProps = {
  coffee: CoffeeDetail;
  className?: string;
};

export function CoffeeDetailPage({ coffee, className }: CoffeeDetailPageProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: reviews } = useReviews("coffee", coffee.id);
  const { data: stats } = useReviewStats("coffee", coffee.id);

  const handleScrollToRating = useCallback(() => {
    // Scroll to rating section
    const ratingSection = document.getElementById("rating-section");
    if (ratingSection) {
      ratingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className={cn("w-full bg-background min-h-screen", className)}>
      <PageShell maxWidth="5xl">
        <Stack gap="6" className="py-8 md:py-12">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <header className="bg-background pt-4 pb-4 border-b border-border/40">
              <Stack gap="6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <Stack gap="1">
                    <h1 className="text-display font-serif italic leading-none text-balance">
                      {coffee.name}
                    </h1>
                    <Cluster gap="2" align="center">
                      {coffee.roaster && (
                        <Link
                          href={`/roasters/${coffee.roaster.slug}`}
                          className="text-body-muted hover:text-foreground transition-colors font-medium"
                        >
                          {coffee.roaster.name}
                        </Link>
                      )}
                    </Cluster>
                    <div className="text-label uppercase tracking-widest mt-1">
                      {[
                        coffee.estates?.[0]?.name ||
                          coffee.regions?.[0]?.display_name,
                        capitalizeFirstLetter(
                          coffee.process_raw || coffee.process || ""
                        ),
                        capitalizeFirstLetter(
                          coffee.roast_level_raw || coffee.roast_level || ""
                        ),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </Stack>

                  <Cluster gap="3">
                    <Button
                      size="lg"
                      className="shadow-xl bg-primary hover:scale-[1.02] transition-transform min-w-[160px]"
                      onClick={handleScrollToRating}
                    >
                      Rate this coffee
                    </Button>
                    {coffee.direct_buy_url && (
                      <Button
                        variant="outline"
                        size="lg"
                        asChild
                        className="text-muted-foreground min-w-[160px]"
                      >
                        <a
                          href={coffee.direct_buy_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Buy from roaster
                        </a>
                      </Button>
                    )}
                  </Cluster>
                </div>
                <TabsList className="mb-0 bg-muted/20 p-1 rounded-full w-fit">
                  <TabsTrigger value="overview" className="rounded-full px-6">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="details" className="rounded-full px-6">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="flavor" className="rounded-full px-6">
                    Flavor
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="rounded-full px-6">
                    Pricing
                  </TabsTrigger>
                </TabsList>
              </Stack>
            </header>

            {/* 🟦 OVERVIEW TAB (CORE EXPERIENCE) */}
            <TabsContent value="overview">
              <Stack gap="4" className="max-w-4xl">
                {/* Hero: Coffee Image + Stats + Buy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="w-full max-w-sm mx-auto md:mx-0 md:ml-auto order-1 md:order-1">
                    <CoffeeImageCarousel
                      images={coffee.images}
                      coffeeName={coffee.name}
                      className="rounded-3xl"
                    />
                  </div>

                  <Stack
                    gap="6"
                    className="order-2 md:order-2 text-left items-start"
                  >
                    {stats &&
                    stats.review_count !== null &&
                    stats.review_count > 0 ? (
                      <Cluster gap="4" align="center">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20">
                          <Icon
                            name="Star"
                            size={16}
                            className="fill-amber-500"
                          />
                          <span className="text-heading font-bold">
                            {stats.avg_rating?.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-body-muted">
                          {stats.review_count}{" "}
                          {stats.review_count === 1 ? "person" : "people"} rated
                          this coffee
                        </span>
                      </Cluster>
                    ) : (
                      <span className="text-body-muted italic">
                        No community ratings yet
                      </span>
                    )}

                    {coffee.summary.min_price_in_stock && (
                      <div>
                        <p className="text-body-muted">Starting at</p>
                        <p className="text-heading font-bold text-foreground">
                          ₹{coffee.summary.min_price_in_stock}
                        </p>
                      </div>
                    )}

                    {/* At a Glance - Quick Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/20">
                      {coffee.roast_level && (
                        <Stack gap="1">
                          <span className="text-label">Roast</span>
                          <span className="font-medium">
                            {coffee.roast_level_raw || coffee.roast_level}
                          </span>
                        </Stack>
                      )}
                      {coffee.process && (
                        <Stack gap="1">
                          <span className="text-label">Process</span>
                          <span className="font-medium">
                            {coffee.process_raw || coffee.process}
                          </span>
                        </Stack>
                      )}
                      {coffee.regions.length > 0 && (
                        <Stack gap="1">
                          <span className="text-label">
                            Region{coffee.regions.length > 1 ? "s" : ""}
                          </span>
                          <span className="font-medium">
                            {coffee.regions
                              .map(
                                (region) =>
                                  region.display_name ||
                                  [
                                    region.country,
                                    region.state,
                                    region.subregion,
                                  ]
                                    .filter(Boolean)
                                    .join(", ") ||
                                  region.subregion
                              )
                              .join(", ")}
                          </span>
                        </Stack>
                      )}
                      {coffee.estates.length > 0 && (
                        <Stack gap="1">
                          <span className="text-label">
                            Estate{coffee.estates.length > 1 ? "s" : ""}
                          </span>
                          <span className="font-medium">
                            {coffee.estates
                              .map((estate) => estate.name)
                              .join(", ")}
                          </span>
                        </Stack>
                      )}
                    </div>
                  </Stack>
                </div>
              </Stack>
            </TabsContent>

            {/* 🟨 DETAILS TAB (Origin + Production Info) */}
            <TabsContent value="details">
              <Stack gap="6" className="max-w-4xl">
                {coffee.description_md && (
                  <Stack gap="4">
                    <div className="inline-flex items-center gap-4 mb-2">
                      <span className="h-px w-8 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        Coffee Story
                      </span>
                    </div>
                    <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                      About this{" "}
                      <span className="text-accent italic">coffee</span>
                    </h2>
                    <Prose className="max-w-none">
                      <p className="whitespace-pre-line text-body-large text-muted-foreground/80 leading-relaxed">
                        {coffee.description_md}
                      </p>
                    </Prose>
                  </Stack>
                )}

                <div className="border-t border-border/20 pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Stack gap="6">
                      <Stack gap="1">
                        <span className="text-label uppercase tracking-widest font-bold">
                          Region / Estate
                        </span>
                        <span className="text-body font-medium">
                          {[
                            ...coffee.estates.map((e) => e.name),
                            ...coffee.regions
                              .map((r) => r.display_name)
                              .filter(Boolean),
                          ].join(", ") || "—"}
                        </span>
                      </Stack>
                      {coffee.varieties && coffee.varieties.length > 0 && (
                        <Stack gap="1">
                          <span className="text-label uppercase tracking-widest font-bold">
                            Variety
                          </span>
                          <span className="text-body font-medium">
                            {coffee.varieties.join(", ")}
                          </span>
                        </Stack>
                      )}
                    </Stack>

                    <Stack gap="6">
                      {coffee.roast_level && (
                        <Stack gap="1">
                          <span className="text-label uppercase tracking-widest font-bold">
                            Roast Level
                          </span>
                          <span className="text-body font-medium">
                            {coffee.roast_level_raw || coffee.roast_level}
                          </span>
                        </Stack>
                      )}
                      <Stack gap="1">
                        <span className="text-label uppercase tracking-widest font-bold">
                          Processing details
                        </span>
                        <span className="text-body font-medium">
                          {coffee.process_raw || coffee.process || "—"}
                        </span>
                      </Stack>
                      {coffee.bean_species && (
                        <Stack gap="1">
                          <span className="text-label uppercase tracking-widest font-bold">
                            Species
                          </span>
                          <span className="text-body font-medium">
                            {coffee.bean_species}
                          </span>
                        </Stack>
                      )}
                      {coffee.crop_year && (
                        <Stack gap="1">
                          <span className="text-label uppercase tracking-widest font-bold">
                            Crop Year
                          </span>
                          <span className="text-body font-medium">
                            {coffee.crop_year}
                          </span>
                        </Stack>
                      )}
                      {coffee.harvest_window && (
                        <Stack gap="1">
                          <span className="text-label uppercase tracking-widest font-bold">
                            Harvest
                          </span>
                          <span className="text-body font-medium">
                            {coffee.harvest_window}
                          </span>
                        </Stack>
                      )}
                    </Stack>
                  </div>
                </div>

                {/* Tags and Badges */}
                {(coffee.decaf ||
                  coffee.is_limited ||
                  (coffee.tags && coffee.tags.length > 0)) && (
                  <div className="border-t border-border/20 pt-8">
                    <Stack gap="4">
                      <div className="inline-flex items-center gap-4 mb-3">
                        <span className="h-px w-8 bg-accent/60" />
                        <span className="text-overline text-muted-foreground tracking-[0.15em]">
                          Roaster's Classification
                        </span>
                      </div>
                      <h2 className="text-title text-balance leading-[1.1] tracking-tight mb-2">
                        Tags
                      </h2>
                      <TagList>
                        {coffee.decaf && <Tag variant="filled">Decaf</Tag>}
                        {coffee.is_limited && (
                          <Tag variant="filled">Limited</Tag>
                        )}
                        {coffee.tags &&
                          coffee.tags.map((tag, index) => (
                            <Tag key={index} variant="outline">
                              {tag}
                            </Tag>
                          ))}
                      </TagList>
                    </Stack>
                  </div>
                )}
              </Stack>
            </TabsContent>

            {/* 🟥 FLAVOR TAB */}
            <TabsContent value="flavor">
              <Stack gap="6" className="max-w-4xl">
                <CoffeeSensoryProfile coffee={coffee} className="border-0" />

                <div className="border-t border-border/20 pt-8">
                  <Stack gap="6">
                    <div>
                      <div className="inline-flex items-center gap-4 mb-3">
                        <span className="h-px w-8 bg-accent/60" />
                        <span className="text-overline text-muted-foreground tracking-[0.15em]">
                          Roaster's Take
                        </span>
                      </div>
                      <h2 className="text-title text-balance leading-[1.1] tracking-tight mb-2">
                        Tasting{" "}
                        <span className="text-accent italic">Notes</span>
                      </h2>
                      <p className="text-caption text-muted-foreground">
                        Original tasting notes from {coffee.roaster?.name}
                      </p>
                    </div>

                    {coffee.flavor_notes.length > 0 ? (
                      <div className="flex flex-wrap ">
                        {coffee.flavor_notes.map((note) => (
                          <div
                            key={note.id}
                            className="px-4 py-2 rounded-full border border-border/40 bg-muted/20 text-body font-medium text-muted-foreground"
                          >
                            {note.label}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="italic text-muted-foreground">
                        No tasting notes cataloged
                      </p>
                    )}
                  </Stack>
                </div>
              </Stack>
            </TabsContent>

            {/* 💰 PRICING TAB */}
            <TabsContent value="pricing">
              <Stack gap="6" className="max-w-4xl">
                <Stack gap="4">
                  <div className="inline-flex items-center gap-4 mb-2">
                    <span className="h-px w-8 bg-accent/60" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em]">
                      Available Options
                    </span>
                  </div>
                  <h2 className="text-title text-balance leading-[1.1] tracking-tight mb-4">
                    Pricing &{" "}
                    <span className="text-accent italic">Availability</span>
                  </h2>

                  {coffee.variants.length > 0 ? (
                    <CoffeePricingTable variants={coffee.variants} />
                  ) : (
                    <p className="text-body-muted italic">
                      No pricing information available
                    </p>
                  )}
                </Stack>
              </Stack>
            </TabsContent>
          </Tabs>

          {/* Rating Section - Always visible after tabs */}
          <div
            id="rating-section"
            className="scroll-mt-8 mt-12 border-t border-border/20 pt-12 max-w-4xl"
          >
            <Stack gap="4">
              <ReviewStats stats={stats || null} />
              <div className="surface-2 rounded-3xl p-8 border border-accent/20">
                <QuickRating
                  entityType="coffee"
                  entityId={coffee.id}
                  variant="inline"
                />
              </div>
            </Stack>
          </div>
          {/* Community Reviews */}
          {reviews && reviews.length > 0 && (
            <Section
              contained={false}
              spacing="tight"
              className="border-t border-border/20 pt-8"
            >
              <ReviewList entityType="coffee" reviews={reviews.slice(0, 10)} />
            </Section>
          )}
          {/* Similar Coffees */}
          <Section
            contained={false}
            spacing="tight"
            className="border-t border-border/20 pt-8"
          >
            <SimilarCoffees coffee={coffee} />
          </Section>
        </Stack>
      </PageShell>
    </div>
  );
}

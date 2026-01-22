"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { CoffeeDetail } from "@/types/coffee-types";
import CoffeeImageCarousel from "@/components/layout/carousel-image";
import { Icon } from "@/components/common/Icon";
import Tag, { TagList } from "@/components/common/Tag";
import { Cluster } from "@/components/primitives/cluster";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Prose } from "@/components/primitives/prose";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/providers/modal-provider";
import { ReviewCapture } from "@/components/reviews/ReviewCapture";
import { cn, capitalizeFirstLetter } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/coffee-utils";
import { CoffeeSensoryProfile } from "./CoffeeSensoryProfile";
import { ReviewSection } from "@/components/reviews";

type CoffeeDetailPageProps = {
  coffee: CoffeeDetail;
  className?: string;
};

export function CoffeeDetailPage({ coffee, className }: CoffeeDetailPageProps) {
  const minPrice = coffee.summary.min_price_in_stock;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openModal } = useModal();

  // Auto-open rating modal if ?rate=true is in URL
  useEffect(() => {
    const shouldRate = searchParams.get("rate") === "true";
    if (shouldRate && coffee.id) {
      // Small delay to ensure page is fully rendered
      const timer = setTimeout(() => {
        openModal({
          type: "custom",
          component: ReviewCapture,
          props: {
            entityType: "coffee",
            entityId: coffee.id,
            initialRating: undefined,
            onClose: () => {
              // Remove ?rate=true from URL after modal closes
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.delete("rate");
              const newUrl = newSearchParams.toString()
                ? `${window.location.pathname}?${newSearchParams.toString()}`
                : window.location.pathname;
              router.replace(newUrl, { scroll: false });
            },
          },
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchParams, coffee.id, openModal, router]);

  // Group variants by weight
  const variantsByWeight = coffee.variants.reduce(
    (acc, variant) => {
      const weight = variant.weight_g;
      if (!acc[weight]) {
        acc[weight] = [];
      }
      acc[weight].push(variant);
      return acc;
    },
    {} as Record<number, typeof coffee.variants>
  );

  return (
    <div className={cn("w-full bg-background", className)}>
      <PageShell maxWidth="7xl">
        <div className="py-8 md:py-12 lg:py-16">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
            <Cluster gap="2" align="center" className="text-caption">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <Link
                href="/coffees"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Coffees
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-foreground font-medium">{coffee.name}</span>
            </Cluster>
          </nav>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-12 md:gap-16 lg:grid-cols-7">
            {/* Left Column: Image */}
            <div className="order-1 lg:col-span-3">
              <Stack gap="6">
                <CoffeeImageCarousel
                  coffeeName={coffee.name}
                  images={coffee.images}
                />
              </Stack>
            </div>

            {/* Right Column: Details */}
            <div className="order-2 lg:col-span-4">
              <Stack gap="6">
                {/* Header Section */}
                <Stack gap="6">
                  {/* Eyebrow with badges */}
                  <Stack gap="2">
                    <div className="inline-flex items-center gap-4">
                      <span className="h-px w-8 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.2em]">
                        {coffee.bean_species || "Specialty Coffee"}
                        {coffee.decaf && " • Decaf"}
                      </span>
                    </div>
                    {coffee.is_limited && (
                      <Badge
                        variant="outline"
                        className="text-label bg-accent/5 text-accent border-accent/20 w-fit"
                      >
                        <Icon name="Lightning" size={10} className="mr-1" />
                        Limited Release
                      </Badge>
                    )}
                  </Stack>

                  {/* Title */}
                  <Stack gap="6">
                    <h1 className="text-display text-balance leading-[1.1] tracking-tight font-serif italic">
                      {coffee.name}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-4 md:gap-6">
                      {coffee.roaster && (
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full border border-border/60 bg-muted/50 flex items-center justify-center overflow-hidden">
                            <Icon
                              name="Storefront"
                              size={20}
                              className="text-muted-foreground"
                            />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-label text-muted-foreground uppercase tracking-widest leading-none">
                              Roasted By
                            </span>
                            <Link
                              href={`/roasters/${coffee.roaster.slug}`}
                              className="group inline-flex items-center gap-1.5 text-body font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                              {coffee.roaster.name}
                              <Icon
                                name="ArrowRight"
                                size={14}
                                className="transition-transform group-hover:translate-x-0.5"
                              />
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Quick Pricing Summary & CTA */}
                      <div className="flex items-center gap-4 md:gap-6 py-2.5 px-4 md:px-6 rounded-2xl bg-accent/5 border border-accent/10 ml-auto lg:ml-0">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-label text-muted-foreground uppercase tracking-widest">
                            Starts at
                          </span>
                          <span className="text-heading font-serif italic text-accent leading-none">
                            {formatPrice(minPrice || 0)}
                          </span>
                        </div>
                        {coffee.direct_buy_url && (
                          <Button
                            asChild
                            size="sm"
                            className="shadow-md hover-lift"
                          >
                            <a
                              href={coffee.direct_buy_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center"
                            >
                              Buy Now
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Stack>
                </Stack>

                {/* Core Details / Technical Sheet */}
                <div className="py-6 md:py-8 border-y border-border/60 bg-muted/5 rounded-lg md:rounded-xl px-4 md:px-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 md:gap-y-8 gap-x-4 md:gap-x-6 lg:gap-x-8">
                    {(coffee.roast_level_raw ||
                      coffee.roast_style_raw ||
                      coffee.roast_level) && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-label uppercase tracking-widest font-bold text-muted-foreground">
                          Roast
                        </span>
                        <span className="text-body font-medium text-foreground">
                          {capitalizeFirstLetter(
                            coffee.roast_level_raw ||
                              coffee.roast_style_raw ||
                              coffee.roast_level
                          )}
                        </span>
                      </div>
                    )}
                    {(coffee.process_raw || coffee.process) && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-label uppercase tracking-widest font-bold text-muted-foreground">
                          Process
                        </span>
                        <span className="text-body font-medium text-foreground">
                          {capitalizeFirstLetter(
                            coffee.process_raw || coffee.process
                          )}
                        </span>
                      </div>
                    )}
                    {(coffee.estates.length > 0 ||
                      coffee.regions.length > 0) && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-label uppercase tracking-widest font-bold text-muted-foreground">
                          Origin
                        </span>
                        <span
                          className="text-body font-medium text-foreground truncate"
                          title={[
                            ...coffee.estates.map((e) => e.name),
                            ...coffee.regions
                              .map((r) => r.display_name)
                              .filter(Boolean),
                          ].join(", ")}
                        >
                          {[
                            coffee.estates[0]?.name,
                            coffee.regions[0]?.display_name,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                          {(coffee.estates.length > 1 ||
                            coffee.regions.length > 1) &&
                            " + more"}
                        </span>
                      </div>
                    )}
                    {coffee.varieties && coffee.varieties.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-label uppercase tracking-widest font-bold text-muted-foreground">
                          Variety
                        </span>
                        <span
                          className="text-body font-medium text-foreground truncate"
                          title={coffee.varieties.join(", ")}
                        >
                          {coffee.varieties.join(", ")}
                        </span>
                      </div>
                    )}
                    {(coffee.crop_year || coffee.harvest_window) && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-label uppercase tracking-widest font-bold text-muted-foreground">
                          Harvest
                        </span>
                        <span className="text-body font-medium text-foreground">
                          {coffee.crop_year} {coffee.harvest_window}
                        </span>
                      </div>
                    )}
                  </div>

                  {coffee.brew_methods.length > 0 && (
                    <div className="mt-6 md:mt-8 pt-6 border-t border-dashed border-border/40">
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                        <span className="text-label uppercase tracking-widest font-bold text-muted-foreground whitespace-nowrap">
                          Best Brewed With
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {coffee.brew_methods.map((method) => (
                            <span
                              key={method.id}
                              className="text-label px-3 py-1.5 rounded-full border border-border/60 bg-background font-medium hover:border-accent/40 transition-colors"
                            >
                              {method.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Purchase Action (Mobile) */}
                {coffee.direct_buy_url && (
                  <div className="lg:hidden">
                    <Button asChild size="lg" className="w-full hover-lift">
                      <a
                        href={coffee.direct_buy_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        Buy Now
                        <Icon name="ArrowRight" size={14} className="ml-2" />
                      </a>
                    </Button>
                  </div>
                )}
              </Stack>
            </div>
          </div>

          {/* Story Section - Full Width Subsection */}
          {(coffee.description_md ||
            coffee.summary.seo_desc ||
            (coffee.tags && coffee.tags.length > 0)) && (
            <Section
              spacing="default"
              contained={false}
              className="border-t border-border/60 bg-muted/5"
            >
              <Stack gap="6">
                <div>
                  <div className="inline-flex items-center gap-4 mb-3">
                    <span className="h-px w-6 bg-accent/40" />
                    <span className="text-overline text-muted-foreground tracking-[0.2em]">
                      As per the Roaster
                    </span>
                    <span className="h-px w-6 bg-accent/40" />
                  </div>
                  <h2 className="text-title text-balance leading-tight font-serif italic">
                    The Story of{" "}
                    <span className="text-accent">this Coffee.</span>
                  </h2>
                </div>
                {coffee.description_md ? (
                  <Prose className="max-w-none">
                    <p className="text-body-large text-muted-foreground font-serif leading-relaxed whitespace-pre-line italic opacity-90">
                      {coffee.description_md}
                    </p>
                  </Prose>
                ) : (
                  <p className="text-body text-muted-foreground leading-relaxed">
                    {coffee.summary.seo_desc}
                  </p>
                )}

                {/* Tags */}
                {coffee.tags && coffee.tags.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-label text-muted-foreground uppercase tracking-widest font-bold">
                      Tags
                    </span>
                    <TagList>
                      {coffee.tags.slice(0, 8).map((tag, index) => (
                        <Tag
                          key={index}
                          variant="outline"
                          className="text-label"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </TagList>
                  </div>
                )}
              </Stack>
            </Section>
          )}

          {/* Sensory & Pricing Section - 2 Column */}
          <Section
            spacing="default"
            contained={false}
            className="border-t border-border/60"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-start">
              {/* Left Column: Sensory Profile */}
              <div className="flex flex-col">
                <CoffeeSensoryProfile
                  coffee={coffee}
                  className="border-t-0 py-0 md:py-0 lg:py-0"
                />
              </div>

              {/* Right Column: Pricing & Variants */}
              <div className="flex flex-col">
                {coffee.variants.length > 0 && (
                  <Stack gap="6">
                    <div>
                      <div className="inline-flex items-center gap-4 mb-3">
                        <span className="h-px w-8 bg-accent/60" />
                        <span className="text-overline text-muted-foreground tracking-[0.2em]">
                          Purchase Options
                        </span>
                      </div>
                      <h2 className="text-title text-balance leading-[1.1] tracking-tight font-serif italic">
                        Pricing & <span className="text-accent">Variants.</span>
                      </h2>
                    </div>

                    {/* Quick CTA Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 md:p-6 rounded-2xl bg-accent/5 border border-accent/10">
                      <Stack gap="1">
                        <span className="text-label text-muted-foreground uppercase tracking-widest">
                          Starting From
                        </span>
                        <span className="text-heading font-serif italic text-accent">
                          {formatPrice(minPrice || 0)}
                        </span>
                      </Stack>
                      {coffee.direct_buy_url && (
                        <Button
                          asChild
                          size="lg"
                          className="shadow-lg hover-lift h-12 px-6 w-full sm:w-auto"
                        >
                          <a
                            href={coffee.direct_buy_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center"
                          >
                            Get This Coffee
                            <Icon
                              name="ArrowRight"
                              size={16}
                              className="ml-2"
                            />
                          </a>
                        </Button>
                      )}
                    </div>

                    {/* Weight Options List */}
                    <Stack gap="3">
                      <span className="text-label text-muted-foreground uppercase tracking-widest font-bold">
                        Available Weights
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {Object.entries(variantsByWeight)
                          .sort(([a], [b]) => Number(a) - Number(b))
                          .map(([weight, variants]) => {
                            const prices = variants
                              .map((v) => v.price_current)
                              .filter((p): p is number => p !== null);
                            const minPrice =
                              prices.length > 0 ? Math.min(...prices) : null;

                            return (
                              <div
                                key={weight}
                                className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card hover:border-accent/40 hover:bg-card/50 transition-all duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-muted/50 border border-border/40 flex items-center justify-center">
                                    <Icon
                                      name="Handbag"
                                      size={14}
                                      className="text-muted-foreground"
                                    />
                                  </div>
                                  <span className="text-body font-medium text-foreground">
                                    {Number(weight) >= 1000
                                      ? `${Number(weight) / 1000}kg`
                                      : `${weight}g`}
                                  </span>
                                </div>
                                <div className="flex flex-col items-end gap-0.5">
                                  <span className="text-body font-bold text-accent">
                                    {minPrice ? formatPrice(minPrice) : "N/A"}
                                  </span>
                                  {Number(weight) === 250 &&
                                    coffee.summary.best_normalized_250g && (
                                      <span className="text-label text-muted-foreground">
                                        Best Value
                                      </span>
                                    )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </Stack>
                  </Stack>
                )}
              </div>
            </div>
          </Section>

          {/* Reviews Section */}
          <Section
            spacing="default"
            contained={false}
            className="border-t border-border/60"
          >
            <ReviewSection entityType="coffee" entityId={coffee.id} />
          </Section>
        </div>
      </PageShell>
    </div>
  );
}

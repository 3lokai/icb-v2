"use client";

import Link from "next/link";
import type { CoffeeDetail } from "@/types/coffee-types";
import CoffeeImageCarousel from "@/components/layout/carousel-image";
import { Icon } from "@/components/common/Icon";
import Tag, { TagList } from "@/components/common/Tag";
import { Cluster } from "@/components/primitives/cluster";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, capitalizeFirstLetter } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/coffee-utils";
import { CoffeeSensoryProfile } from "./CoffeeSensoryProfile";
import { ReviewSection } from "@/components/reviews";

type CoffeeDetailPageProps = {
  coffee: CoffeeDetail;
  className?: string;
};

export function CoffeeDetailPage({ coffee, className }: CoffeeDetailPageProps) {
  const hasStock = (coffee.summary.in_stock_count ?? 0) > 0;
  const minPrice = coffee.summary.min_price_in_stock;

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
        <div className="py-8 md:py-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8">
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
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-7">
            {/* Left Column: Image & Flavor Profile */}
            <div className="order-1 lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <Stack gap="8">
                  <CoffeeImageCarousel
                    coffeeName={coffee.name}
                    images={coffee.images}
                  />
                  {/* Sensory Profile - Desktop only */}
                  <div className="hidden lg:block">
                    <CoffeeSensoryProfile coffee={coffee} />
                  </div>
                </Stack>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="order-2 lg:col-span-4">
              <Stack gap="8">
                {/* Header Section */}
                <Stack gap="6">
                  {/* Eyebrow with badges */}
                  <div>
                    <div className="inline-flex items-center gap-4 mb-3">
                      <span className="h-px w-8 md:w-12 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        {coffee.bean_species || "Specialty Coffee"}
                      </span>
                    </div>
                    <Cluster gap="2" align="center" className="mt-2">
                      {coffee.decaf && (
                        <Badge variant="secondary" className="text-label">
                          Decaf
                        </Badge>
                      )}
                      {coffee.is_limited && (
                        <Badge variant="outline" className="text-label">
                          <Icon name="Lightning" size={12} className="mr-1" />
                          Limited
                        </Badge>
                      )}
                    </Cluster>
                  </div>

                  {/* Title */}
                  <Stack gap="3">
                    <h1 className="text-display text-balance leading-[1.1] tracking-tight">
                      {coffee.name}
                    </h1>
                    {coffee.roaster && (
                      <div className="flex items-center gap-2">
                        <span className="text-body text-muted-foreground">
                          Roasted by
                        </span>
                        <Link
                          href={`/roasters/${coffee.roaster.slug}`}
                          className="group inline-flex items-center gap-2 text-body font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          <Icon name="Storefront" size={16} />
                          {coffee.roaster.name}
                          <Icon
                            name="ArrowRight"
                            size={14}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </Link>
                      </div>
                    )}
                  </Stack>
                </Stack>

                {/* Core Details Card */}
                <Card>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {(coffee.roast_level_raw ||
                        coffee.roast_style_raw ||
                        coffee.roast_level) && (
                        <div className="stack-xs">
                          <span className="text-caption text-muted-foreground font-medium">
                            Roast Level
                          </span>
                          <span className="text-body">
                            {capitalizeFirstLetter(
                              coffee.roast_level_raw ||
                                coffee.roast_style_raw ||
                                coffee.roast_level
                            )}
                          </span>
                        </div>
                      )}
                      {(coffee.process_raw || coffee.process) && (
                        <div className="stack-xs">
                          <span className="text-caption text-muted-foreground font-medium">
                            Process
                          </span>
                          <span className="text-body">
                            {capitalizeFirstLetter(
                              coffee.process_raw || coffee.process
                            )}
                          </span>
                        </div>
                      )}
                      {coffee.estates && coffee.estates.length > 0 && (
                        <div className="stack-xs">
                          <span className="text-caption text-muted-foreground font-medium">
                            Source
                          </span>
                          <span className="text-body">
                            {coffee.estates
                              .map((estate) => estate.name)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      {coffee.regions &&
                        coffee.regions.length > 0 &&
                        coffee.regions[0]?.display_name && (
                          <div className="stack-xs">
                            <span className="text-caption text-muted-foreground font-medium">
                              Region
                            </span>
                            <span className="text-body">
                              {coffee.regions
                                .map((region) => region.display_name)
                                .filter((name): name is string => name !== null)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                    </div>
                    {coffee.brew_methods.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="stack-xs">
                          <span className="text-caption text-muted-foreground font-medium">
                            Best For
                          </span>
                          <TagList>
                            {coffee.brew_methods.map((method) => (
                              <Tag key={method.id} variant="outline">
                                {method.label}
                              </Tag>
                            ))}
                          </TagList>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Description */}
                {(coffee.description_md || coffee.summary.seo_desc) && (
                  <Stack gap="6">
                    <div>
                      <div className="inline-flex items-center gap-4 mb-3">
                        <span className="h-px w-8 md:w-12 bg-accent/60" />
                        <span className="text-overline text-muted-foreground tracking-[0.15em]">
                          The Story
                        </span>
                      </div>
                      <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                        About This{" "}
                        <span className="text-accent italic">Coffee.</span>
                      </h2>
                    </div>
                    {coffee.description_md ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="text-body text-muted-foreground leading-relaxed whitespace-pre-line">
                          {coffee.description_md}
                        </p>
                      </div>
                    ) : (
                      <p className="text-body text-muted-foreground leading-relaxed">
                        {coffee.summary.seo_desc}
                      </p>
                    )}
                  </Stack>
                )}

                {/* CTA Buttons */}
                {coffee.direct_buy_url && (
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
                )}

                {/* Sensory Profile - Mobile only (appears before pricing) */}
                <div className="lg:hidden">
                  <CoffeeSensoryProfile coffee={coffee} />
                </div>

                {/* Pricing Section */}
                {coffee.variants.length > 0 && (
                  <Stack gap="6">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="inline-flex items-center gap-4 mb-3">
                          <span className="h-px w-8 md:w-12 bg-accent/60" />
                          <span className="text-overline text-muted-foreground tracking-[0.15em]">
                            Purchase Options
                          </span>
                        </div>
                        <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                          Pricing &{" "}
                          <span className="text-accent italic">Variants.</span>
                        </h2>
                      </div>
                      {hasStock ? (
                        <Badge variant="default" className="bg-green-600">
                          <Icon name="Check" size={12} className="mr-1" />
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Out of Stock</Badge>
                      )}
                    </div>

                    {/* Price Range */}
                    {minPrice && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-title font-bold">
                          {formatPrice(minPrice)}
                        </span>
                        {coffee.summary.best_normalized_250g && (
                          <span className="text-caption text-muted-foreground">
                            ({formatPrice(coffee.summary.best_normalized_250g)}/
                            250g)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Variants by Weight */}
                    <Stack gap="3">
                      {Object.entries(variantsByWeight)
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([weight, variants]) => {
                          // Get the minimum price for this weight group
                          const prices = variants
                            .map((v) => v.price_current)
                            .filter((p): p is number => p !== null);
                          const minPrice =
                            prices.length > 0 ? Math.min(...prices) : null;
                          const hasStock = variants.some((v) => v.in_stock);

                          return (
                            <Card key={weight} className="border-muted">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-body font-semibold">
                                    {Number(weight) >= 1000
                                      ? `${Number(weight) / 1000}kg`
                                      : `${weight}g`}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    {hasStock && (
                                      <Badge
                                        variant="secondary"
                                        className="text-label"
                                      >
                                        Available
                                      </Badge>
                                    )}
                                    {minPrice ? (
                                      <span className="text-body font-bold">
                                        {formatPrice(minPrice)}
                                      </span>
                                    ) : (
                                      <span className="text-body text-muted-foreground">
                                        Price N/A
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </Stack>
                  </Stack>
                )}

                {/* Additional Tags */}
                {coffee.tags && coffee.tags.length > 0 && (
                  <Stack gap="3">
                    <span className="text-caption text-muted-foreground font-medium">
                      Tags
                    </span>
                    <TagList>
                      {coffee.tags.slice(0, 8).map((tag, index) => (
                        <Tag
                          key={index}
                          variant="outline"
                          className="text-micro"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </TagList>
                  </Stack>
                )}
              </Stack>
            </div>
          </div>

          {/* Reviews Section */}
          <Section spacing="default" contained={false}>
            <ReviewSection entityType="coffee" entityId={coffee.id} />
          </Section>
        </div>
      </PageShell>
    </div>
  );
}

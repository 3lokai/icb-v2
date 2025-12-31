"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { RoasterDetail } from "@/types/roaster-types";
import { roasterImagePresets } from "@/lib/imagekit";
import { Icon } from "@/components/common/Icon";

import { Cluster } from "@/components/primitives/cluster";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReviewSection } from "@/components/reviews";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { buildCoffeeQueryString } from "@/lib/filters/coffee-url";
import { useCoffeeDirectoryStore } from "@/store/zustand/coffee-directory-store";

type RoasterDetailPageProps = {
  roaster: RoasterDetail;
  className?: string;
};

function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "—";
  return num.toLocaleString("en-IN");
}

function formatRating(num: number | null | undefined): string {
  if (num === null || num === undefined) return "—";
  return num.toFixed(1);
}

type ConnectSectionProps = {
  socialLinks: Array<{ label: string; url: string; icon: string }>;
  location: string | null;
  phone: string | null | undefined;
  supportEmail: string | null | undefined;
};

function ConnectSection({
  socialLinks,
  location,
  phone,
  supportEmail,
}: ConnectSectionProps) {
  if (socialLinks.length === 0 && !location && !phone && !supportEmail) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Stack gap="6">
          {socialLinks.length > 0 && (
            <Stack gap="3">
              <span className="text-caption text-muted-foreground font-medium">
                Connect
              </span>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors"
                    title={link.label}
                  >
                    <Icon name={link.icon as any} size={20} />
                  </a>
                ))}
              </div>
            </Stack>
          )}

          {socialLinks.length > 0 && (location || phone || supportEmail) && (
            <Separator />
          )}

          {(location || phone || supportEmail) && (
            <Stack gap="3">
              <span className="text-caption text-muted-foreground font-medium">
                Location & Contact
              </span>
              <Stack gap="2" className="text-body">
                {location && (
                  <div className="flex items-start gap-2">
                    <Icon
                      name="MapPin"
                      size={16}
                      className="mt-0.5 text-muted-foreground"
                    />
                    <span>{location}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-2">
                    <Icon
                      name="Phone"
                      size={16}
                      className="text-muted-foreground"
                    />
                    <a
                      href={`tel:${phone}`}
                      className="hover:text-primary transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                )}
                {supportEmail && (
                  <div className="flex items-center gap-2">
                    <Icon
                      name="Envelope"
                      size={16}
                      className="text-muted-foreground"
                    />
                    <a
                      href={`mailto:${supportEmail}`}
                      className="hover:text-primary transition-colors"
                    >
                      {supportEmail}
                    </a>
                  </div>
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function RoasterDetailPage({
  roaster,
  className,
}: RoasterDetailPageProps) {
  const router = useRouter();
  const setAll = useCoffeeDirectoryStore((state) => state.setAll);

  // Build location info
  const locationParts: string[] = [];
  if (roaster.hq_city) locationParts.push(roaster.hq_city);
  if (roaster.hq_state) locationParts.push(roaster.hq_state);
  if (roaster.hq_country) locationParts.push(roaster.hq_country);
  const location = locationParts.length > 0 ? locationParts.join(", ") : null;

  // Handle "See More" click - set store before navigation
  const handleSeeMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Set Zustand store with roaster filter
    setAll({
      filters: { roaster_ids: [roaster.id] },
      page: 1,
      sort: "relevance",
      limit: 15,
    });
    // Navigate to coffee directory
    router.push(
      `/coffees?${buildCoffeeQueryString(
        { roaster_ids: [roaster.id] },
        1,
        "relevance",
        15
      )}`
    );
  };

  // Social Links Logic
  const socialLinks: Array<{ label: string; url: string; icon: string }> = [];
  if (roaster.website) {
    socialLinks.push({ label: "Website", url: roaster.website, icon: "Globe" });
  }
  if (roaster.instagram_handle) {
    const instagramUrl = roaster.instagram_handle.startsWith("http")
      ? roaster.instagram_handle
      : `https://instagram.com/${roaster.instagram_handle.replace(/^@/, "")}`;
    socialLinks.push({
      label: "Instagram",
      url: instagramUrl,
      icon: "InstagramLogo",
    });
  }
  if (roaster.social_json && typeof roaster.social_json === "object") {
    const social = roaster.social_json as Record<string, unknown>;
    if (social.twitter && typeof social.twitter === "string") {
      socialLinks.push({
        label: "Twitter",
        url: social.twitter.startsWith("http")
          ? social.twitter
          : `https://twitter.com/${social.twitter.replace(/^@/, "")}`,
        icon: "TwitterLogo",
      });
    }
    if (social.facebook && typeof social.facebook === "string") {
      socialLinks.push({
        label: "Facebook",
        url: social.facebook,
        icon: "FacebookLogo",
      });
    }
    if (social.linkedin && typeof social.linkedin === "string") {
      socialLinks.push({
        label: "LinkedIn",
        url: social.linkedin,
        icon: "LinkedinLogo",
      });
    }
  }

  // Stats Logic
  const stats = [
    {
      label: "Total Coffees",
      value: formatNumber(roaster.coffee_count),
      icon: "Coffee",
    },

    {
      label: "Avg Coffee Rating",
      value: formatRating(roaster.avg_coffee_rating),
      icon: "Star",
    },
    {
      label: "Roaster Rating",
      value: formatRating(roaster.avg_rating),
      icon: "SealCheck",
    },
  ];

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
                href="/roasters"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Roasters
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-foreground font-medium">
                {roaster.name}
              </span>
            </Cluster>
          </nav>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-7">
            {/* Left Column: Image, Socials, Location (Sticky) */}
            <div className="order-1 lg:order-1 lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <Stack gap="8">
                  {/* Brand Image/Logo */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-muted shadow-sm">
                    {roaster.slug ? (
                      <Image
                        alt={`${roaster.name} logo`}
                        className="object-contain p-8"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                        src={roasterImagePresets.roasterLogo(
                          `roasters/${roaster.slug}-logo`
                        )}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Icon name="Storefront" size={64} />
                      </div>
                    )}
                  </div>

                  {/* Connect Section - Desktop only */}
                  <div className="hidden lg:block">
                    <ConnectSection
                      socialLinks={socialLinks}
                      location={location}
                      phone={roaster.phone}
                      supportEmail={roaster.support_email}
                    />
                  </div>
                </Stack>
              </div>
            </div>

            {/* Right Column: Details & Content */}
            <div className="order-2 lg:order-2 lg:col-span-4">
              <Stack gap="12">
                {/* Header */}
                <Stack gap="6">
                  <div>
                    <div className="inline-flex items-center gap-4 mb-3">
                      <span className="h-px w-8 md:w-12 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        {(roaster.active_coffee_count || 0) > 0
                          ? `Active with ${roaster.active_coffee_count} coffees`
                          : "Coffee Roaster"}
                      </span>
                    </div>
                  </div>
                  <h1 className="text-display text-balance leading-[1.1] tracking-tight">
                    {roaster.name}
                  </h1>
                </Stack>

                {/* Stats Ribbon */}
                <Card className="border-muted bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-around gap-6">
                      {stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex flex-col items-center gap-1 min-w-[100px]"
                        >
                          <div className="flex items-center gap-2 text-muted-foreground/80">
                            <Icon name={stat.icon as any} size={14} />
                            <span className="text-caption font-medium uppercase tracking-wider">
                              {stat.label}
                            </span>
                          </div>
                          <span className="text-title font-semibold text-foreground">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* About */}
                {roaster.description && (
                  <Stack gap="6">
                    <div>
                      <div className="inline-flex items-center gap-4 mb-3">
                        <span className="h-px w-8 md:w-12 bg-accent/60" />
                        <span className="text-overline text-muted-foreground tracking-[0.15em]">
                          The Story
                        </span>
                      </div>
                      <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                        About{" "}
                        <span className="text-accent italic">
                          {roaster.name}.
                        </span>
                      </h2>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-body text-muted-foreground leading-relaxed whitespace-pre-line">
                        {roaster.description}
                      </p>
                    </div>
                  </Stack>
                )}

                {/* Visit Website Button */}
                {roaster.website && (
                  <Button asChild size="lg" className="w-full hover-lift">
                    <a
                      href={roaster.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon name="Globe" size={18} className="mr-2" />
                      Visit Roaster Website
                      <Icon name="ArrowRight" size={14} className="ml-2" />
                    </a>
                  </Button>
                )}

                {/* Connect Section - Mobile only (after About) */}
                <div className="lg:hidden order-3">
                  <ConnectSection
                    socialLinks={socialLinks}
                    location={location}
                    phone={roaster.phone}
                    supportEmail={roaster.support_email}
                  />
                </div>
              </Stack>
            </div>
          </div>

          {/* Coffees List Section */}
          {roaster.coffees && roaster.coffees.length > 0 && (
            <div className="order-4 mt-16">
              <Stack gap="12">
                <div>
                  <div className="inline-flex items-center gap-4 mb-3">
                    <span className="h-px w-8 md:w-12 bg-accent/60" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em]">
                      Our Selection
                    </span>
                  </div>
                  <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                    Available{" "}
                    <span className="text-accent italic">Coffees.</span>
                  </h2>
                </div>
                <Stack gap="8">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {roaster.coffees.slice(0, 6).map((coffee) => (
                      <CoffeeCard key={coffee.coffee_id} coffee={coffee} />
                    ))}
                  </div>

                  {roaster.coffees.length > 6 && (
                    <div className="flex justify-center">
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/coffees?${buildCoffeeQueryString(
                            { roaster_ids: [roaster.id] },
                            1,
                            "relevance",
                            15
                          )}`}
                          onClick={handleSeeMoreClick}
                          className="inline-flex items-center gap-2"
                        >
                          See More
                          <Icon name="ArrowRight" size={14} />
                        </Link>
                      </Button>
                    </div>
                  )}
                </Stack>
              </Stack>
            </div>
          )}

          {/* Empty State */}
          {(!roaster.coffees || roaster.coffees.length === 0) && (
            <Section spacing="default" contained={false} className="order-4">
              <div className="text-center">
                <div className="border rounded-lg border-dashed p-12">
                  <p className="text-body text-muted-foreground">
                    No coffees currently listed for this roaster.
                  </p>
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* Reviews Section */}
        <Section spacing="default" contained={false} className="order-5">
          <ReviewSection entityType="roaster" entityId={roaster.id} />
        </Section>

        {/* Claim Your Page CTA */}
        <div className="text-center py-6">
          <p className="text-caption text-muted-foreground">
            If you are the roaster,{" "}
            <Link
              href="/contact?form=claim"
              className="text-accent hover:underline font-medium"
            >
              claim your page now
            </Link>{" "}
            for a verified tag.
          </p>
        </div>
      </PageShell>
    </div>
  );
}

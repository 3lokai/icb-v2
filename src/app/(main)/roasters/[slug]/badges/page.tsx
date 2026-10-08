import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Accent } from "@/components/primitives/accent";
import { RoasterBadges } from "@/components/roasters/RoasterBadges";
import {
  BADGE_DIMENSIONS,
  badgeImagePath,
  type BadgeTarget,
  type BadgeType,
} from "@/lib/badges/badges";
import { fetchBadgeRoasterCached } from "@/lib/data/fetch-badge-data";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

// Public by design (docs/roaster-assets.md §7): one near-duplicate page per
// roaster, so noindex and kept out of the sitemap.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const roaster = await fetchBadgeRoasterCached(slug);
  return generateSEOMetadata({
    title: roaster
      ? `${roaster.name} — IndianCoffeeBeans Badges`
      : "IndianCoffeeBeans Badges",
    description:
      "Free badges for your store: collect independent ratings on each coffee and show customers you're listed on IndianCoffeeBeans.",
    canonical: `/roasters/${slug}/badges`,
    noIndex: true,
  });
}

/** One live badge in the hero, captioned with where it goes. */
function Showcase({
  target,
  type,
  caption,
}: {
  target: BadgeTarget;
  type: BadgeType;
  caption: string;
}) {
  const { width, height } = BADGE_DIMENSIONS.standard;
  return (
    <figure className="flex flex-col gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- hosted SVG */}
      <img
        src={badgeImagePath(target, { type, theme: "light", size: "standard" })}
        alt=""
        width={width}
        height={height}
        className="shadow-lg shadow-black/30 rounded-[10px]"
      />
      <figcaption className="text-caption !text-white/85">{caption}</figcaption>
    </figure>
  );
}

export default async function RoasterBadgesPage({ params }: Props) {
  const { slug } = await params;
  const roaster = await fetchBadgeRoasterCached(slug);
  if (!roaster) notFound();

  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

  // Showcase the most-rated coffee so the hero shows a score where one exists.
  const featured = roaster.coffees.reduce<
    (typeof roaster.coffees)[number] | undefined
  >((a, c) => (!a || c.ratingCount > a.ratingCount ? c : a), undefined);

  return (
    <>
      <PageHeader
        overline={`For ${roaster.name}`}
        title={
          <>
            Add ICB to <Accent>your store.</Accent>
          </>
        }
        description="Collect independent ratings and show customers your coffees are listed on IndianCoffeeBeans. Free, self-updating, and just copy and paste: no app, plugin or script."
        rightSideContent={
          <div className="flex flex-col gap-5">
            {featured && (
              <Showcase
                target={{
                  entity: "coffee",
                  roasterSlug: roaster.slug,
                  coffeeSlug: featured.slug,
                }}
                type="rate"
                caption="On each product page"
              />
            )}
            <Showcase
              target={{ entity: "roaster", roasterSlug: roaster.slug }}
              type="listed"
              caption="In your footer or About page"
            />
          </div>
        }
      />

      <RoasterBadges
        siteUrl={siteUrl}
        roasterSlug={roaster.slug}
        roasterRating={{
          ratingAvg: roaster.ratingAvg,
          ratingCount: roaster.ratingCount,
          coffeeCount: roaster.coffees.length,
        }}
        coffees={roaster.coffees}
      />
    </>
  );
}

import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import StructuredData from "@/components/seo/StructuredData";
import { fetchRegionCoffeeCountsCached } from "@/lib/data/fetch-region-coffee-counts";
import { fetchRegionsCached } from "@/lib/data/fetch-regions";
import { regionBrowseHref } from "@/lib/discovery/landing-pages";
import { generateMetadata } from "@/lib/seo/metadata";
import { generateCollectionPageSchema, getSeoBaseUrl } from "@/lib/seo/schema";
import type { RegionSummary } from "@/types/region-types";

const REGIONS_DESCRIPTION =
  "Every Indian coffee region in the directory, with how many coffees each one has and how much of it is under coffee. Grouped by state, sourced from the ISRO/NRSC plantation atlas.";

export const metadata = generateMetadata({
  title: "Indian Coffee Regions",
  description: REGIONS_DESCRIPTION,
  keywords: [
    "Indian coffee regions",
    "coffee growing regions India",
    "Chikmagalur Coorg Wayanad coffee",
  ],
  canonical: "/regions",
  type: "website",
});

/** The hub is a directory of Indian origins; foreign canon regions never browse. */
const HUB_COUNTRY = "India";

/** `northeast-india` is an aggregate across six states, so it carries no `state`. */
const STATELESS_GROUP = "North-East India";

/**
 * States in Coffee Board order (traditional growing areas first), then anything
 * new falls in alphabetically behind them.
 */
const STATE_ORDER = [
  "Karnataka",
  "Kerala",
  "Tamil Nadu",
  "Andhra Pradesh",
  "Odisha",
  STATELESS_GROUP,
];

/** Sub-region chips per card; the rest collapse into a "+N more" link. */
const CHILD_CHIP_LIMIT = 6;

type RegionCard = {
  region: RegionSummary;
  coffeeCount: number;
  /** Sub-units with coffees of their own, most-stocked first. */
  children: Array<{ region: RegionSummary; coffeeCount: number }>;
};

/** Every descendant of `id` down the `parent_id` edge (the tree is acyclic). */
function descendantsOf(
  id: string,
  childrenByParent: Map<string, RegionSummary[]>
): RegionSummary[] {
  const direct = childrenByParent.get(id) ?? [];
  return direct.flatMap((child) => [
    child,
    ...descendantsOf(child.id, childrenByParent),
  ]);
}

function formatArea(region: RegionSummary): string | null {
  // Never render a figure without its provenance: the Coffee Board's older web
  // figures disagree with NRSC 2024 by up to 65%, so an unattributed number is
  // worse than none. Enforced in the DB by canon_regions_area_needs_source.
  if (!region.area_hectares || !region.area_source || !region.area_as_of) {
    return null;
  }
  const asOf = new Date(region.area_as_of).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
  return `${region.area_hectares.toLocaleString("en-IN")} ha under coffee · ${region.area_source}, ${asOf}`;
}

export default async function RegionsPage() {
  const [{ items }, counts] = await Promise.all([
    fetchRegionsCached({ countries: [HUB_COUNTRY] }, 1, 200, "name_asc"),
    fetchRegionCoffeeCountsCached(),
  ]);

  const rolledBySlug = new Map(
    counts.map((count) => [count.slug, count.rolled_count])
  );
  const childrenByParent = new Map<string, RegionSummary[]>();
  for (const region of items) {
    if (region.parent_id) {
      const siblings = childrenByParent.get(region.parent_id) ?? [];
      siblings.push(region);
      childrenByParent.set(region.parent_id, siblings);
    }
  }

  const cards: RegionCard[] = items
    // `tier` is precision, not page-worthiness: named regions are the consumer-facing
    // unit, and an aggregate earns a card only when it already has a landing page
    // (North-East India does, `malnad` doesn't).
    .filter(
      (region) =>
        region.tier === "region" ||
        (region.tier === "aggregate" &&
          regionBrowseHref(region.slug).startsWith("/coffees/"))
    )
    .map((region) => ({
      region,
      coffeeCount: rolledBySlug.get(region.slug) ?? 0,
      children: descendantsOf(region.id, childrenByParent)
        .map((child) => ({
          region: child,
          coffeeCount: rolledBySlug.get(child.slug) ?? 0,
        }))
        .filter((child) => child.coffeeCount > 0)
        .sort((a, b) => b.coffeeCount - a.coffeeCount),
    }))
    .filter((card) => card.coffeeCount > 0)
    .sort((a, b) => b.coffeeCount - a.coffeeCount);

  // Group from the data, not from STATE_ORDER, so a region in a state nobody has
  // listed yet (Meghalaya, Maharashtra) still gets a card instead of vanishing.
  const cardsByState = new Map<string, RegionCard[]>();
  for (const card of cards) {
    const state = card.region.state ?? STATELESS_GROUP;
    cardsByState.set(state, [...(cardsByState.get(state) ?? []), card]);
  }

  const groups = [...cardsByState.entries()]
    .map(([state, stateCards]) => ({ state, cards: stateCards }))
    .sort((a, b) => {
      const rankA = STATE_ORDER.indexOf(a.state);
      const rankB = STATE_ORDER.indexOf(b.state);
      if (rankA !== -1 && rankB !== -1) return rankA - rankB;
      if (rankA !== -1) return -1;
      if (rankB !== -1) return 1;
      return a.state.localeCompare(b.state);
    });

  const baseUrl = getSeoBaseUrl();
  const schema = generateCollectionPageSchema(
    "Indian Coffee Regions",
    REGIONS_DESCRIPTION,
    `${baseUrl}/regions`,
    cards.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: card.region.display_name,
      url: `${baseUrl}${regionBrowseHref(card.region.slug)}`,
    }))
  );

  return (
    <div className="pb-20">
      <StructuredData schema={schema} />

      <PageHeader
        backgroundImage="/images/discovery/regions-hero.avif"
        backgroundImageAlt="Coffee plantations in the Western Ghats"
        description={REGIONS_DESCRIPTION}
        overline="Regions"
        title="India's Coffee Regions"
      />

      <Section spacing="default">
        <Stack gap="4">
          <p className="text-body-muted">
            445,369 hectares mapped by ISRO across 57 taluks, September 2024.
            Coffee counts include every sub-region, so a district total covers
            the estates and hill belts inside it.
          </p>
          <Link
            className="inline-flex items-center gap-2 text-body font-medium text-accent hover:underline"
            href="/learn/coffee-regions-of-india-complete-guide"
          >
            Read the complete guide to India&apos;s coffee regions
            <Icon
              data-icon="inline-end"
              icon={ArrowRightIcon}
              size={16}
              weight="bold"
            />
          </Link>
        </Stack>
      </Section>

      {groups.map((group) => (
        <Section key={group.state} spacing="tight">
          <Stack gap="6">
            <h2 className="text-title">{group.state}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.cards.map(({ region, coffeeCount, children }) => {
                const area = formatArea(region);
                return (
                  <div
                    className="surface-1 card-padding rounded-2xl flex flex-col gap-3"
                    key={region.id}
                  >
                    <Stack gap="1">
                      <Link
                        className="text-heading transition-colors hover:text-accent"
                        href={regionBrowseHref(region.slug)}
                      >
                        {region.display_name}
                      </Link>
                      <span className="text-caption">
                        {coffeeCount.toLocaleString("en-IN")}{" "}
                        {coffeeCount === 1 ? "coffee" : "coffees"}
                        {region.district ? ` · ${region.district}` : ""}
                      </span>
                    </Stack>

                    {region.signature_profile ? (
                      <p className="text-caption line-clamp-2">
                        {region.signature_profile}
                      </p>
                    ) : null}

                    {area ? <p className="text-micro">{area}</p> : null}

                    {children.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {children.slice(0, CHILD_CHIP_LIMIT).map((child) => (
                          <Link
                            className="text-micro rounded-full border border-border/60 px-3 py-1 transition-colors hover:border-accent/60 hover:text-accent"
                            href={regionBrowseHref(child.region.slug)}
                            key={child.region.id}
                          >
                            {child.region.display_name} ({child.coffeeCount})
                          </Link>
                        ))}
                        {children.length > CHILD_CHIP_LIMIT ? (
                          <Link
                            className="text-micro rounded-full border border-dashed border-border/60 px-3 py-1 transition-colors hover:border-accent/60 hover:text-accent"
                            href={regionBrowseHref(region.slug)}
                          >
                            +{children.length - CHILD_CHIP_LIMIT} more
                          </Link>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Stack>
        </Section>
      ))}
    </div>
  );
}

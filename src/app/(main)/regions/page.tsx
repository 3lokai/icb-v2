import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { RegionCard } from "@/components/cards/RegionCard";
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
 * Page-bearing regions the Coffee Board of India names in their own right, so they earn a
 * card even though an ancestor has a page too. Baba Budangiri sits inside Chikmagalur
 * district by NRSC geography, but the Coffee Board lists Bababudangiris as one of its 13
 * regions, a peer of Chikmagalur — and it carries 142 coffees, more than Coorg, so a chip
 * under-sells it. Its card renders `district: "Chikkamagaluru"`, which keeps the
 * containment legible, and Chikmagalur's own count still includes it because that is what
 * `/coffees/chikmagalur` actually returns.
 */
const PEER_REGIONS = new Set(["baba-budangiri"]);

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

type RegionCardData = {
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

  const regionById = new Map(items.map((region) => [region.id, region]));
  const hasPage = (slug: string) =>
    regionBrowseHref(slug).startsWith("/coffees/");
  /** Does any ancestor already have a page (and therefore a card of its own)? */
  const ancestorHasPage = (region: RegionSummary): boolean => {
    let parent = region.parent_id
      ? regionById.get(region.parent_id)
      : undefined;
    while (parent) {
      if (hasPage(parent.slug)) {
        return true;
      }
      parent = parent.parent_id ? regionById.get(parent.parent_id) : undefined;
    }
    return false;
  };

  // A card is a region that HAS a discovery page and whose ancestors have none, plus the
  // Coffee Board peers above. The page decides, not `tier` — tier is precision, not
  // page-worthiness (`hassan` is a named region with no page, because the Coffee Board's
  // region for that belt is Manjarabad, which maps to the Sakleshpur taluk).
  const cardRegions = items.filter(
    (region) =>
      hasPage(region.slug) &&
      (!ancestorHasPage(region) || PEER_REGIONS.has(region.slug))
  );
  // Chips are derived from the card set, so a region can never render as both.
  const cardIds = new Set(cardRegions.map((region) => region.id));

  const cards: RegionCardData[] = cardRegions
    .map((region) => ({
      region,
      coffeeCount: rolledBySlug.get(region.slug) ?? 0,
      children: descendantsOf(region.id, childrenByParent)
        .filter((child) => !cardIds.has(child.id))
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
  const cardsByState = new Map<string, RegionCardData[]>();
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
            445,369 hectares of coffee mapped by ISRO and the Coffee Board
            across 18 districts, September 2024. Coffee counts include every
            sub-region, so a district total covers the estates and hill belts
            inside it.
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
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {group.cards.map(({ region, coffeeCount, children }) => (
                <RegionCard
                  coffeeCount={coffeeCount}
                  key={region.id}
                  region={region}
                  subRegions={children}
                />
              ))}
            </div>
          </Stack>
        </Section>
      ))}
    </div>
  );
}

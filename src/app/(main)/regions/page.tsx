import { Fragment } from "react";
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

/** Shorter labels for the jump nav, where the full state name would crowd the row. */
const NAV_LABELS: Record<string, string> = {
  [STATELESS_GROUP]: "North-East",
};

/** Anchor id for a state heading, e.g. `North-East India` -> `north-east-india`. */
function stateAnchor(state: string): string {
  return state
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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
    .map(([state, stateCards]) => ({
      state,
      cards: stateCards,
      // Hoisted off the cards so each card can be a single link. Deduped because a
      // descendant can roll up into more than one card in the same state.
      subRegions: [
        ...new Map(
          stateCards
            .flatMap((card) => card.children)
            .map((child) => [child.region.id, child])
        ).values(),
      ].sort((a, b) => b.coffeeCount - a.coffeeCount),
    }))
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

          {/* Jump nav — built from the rendered groups, so a state with no cards never
              gets a link that scrolls nowhere. */}
          <nav
            aria-label="Jump to a state"
            className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/60 pt-4"
          >
            {groups.map((group, index) => (
              <Fragment key={group.state}>
                {index > 0 ? (
                  <span aria-hidden="true" className="text-micro opacity-40">
                    ·
                  </span>
                ) : null}
                <Link
                  className="text-label text-muted-foreground transition-colors hover:text-accent"
                  href={`#${stateAnchor(group.state)}`}
                >
                  {NAV_LABELS[group.state] ?? group.state}
                </Link>
              </Fragment>
            ))}
          </nav>
        </Stack>
      </Section>

      {/*
        One continuous grid for the whole page, not a Section per state: state headers
        are `col-span-full` dividers inside it, so the columns stay on a single track and
        a one-region state costs one row instead of a screenful. `auto-fill` +
        `minmax(15rem, 1fr)` is what lets Karnataka's five sit on one row wherever five
        fit, and fall back to four or three without a breakpoint per case.
      */}
      <Section spacing="tight">
        <div
          className="grid gap-x-4 gap-y-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
          }}
        >
          {groups.map((group) => (
            <Fragment key={group.state}>
              <div
                className="col-span-full flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-border/60 pt-5 first:border-t-0 first:pt-0"
                id={stateAnchor(group.state)}
                style={{ scrollMarginTop: "6rem" }}
              >
                <h2 className="text-title">{group.state}</h2>
                {/*
                  Sub-regions that carry coffees but no card of their own. They used to be
                  chips inside each card, which made the card a nested click target; here
                  they read as the state's index line and every internal link survives.
                */}
                {group.subRegions.length > 0 ? (
                  <p className="text-micro flex flex-wrap gap-x-3 gap-y-1 font-normal">
                    {group.subRegions.map((child) => (
                      <Link
                        className="transition-colors hover:text-accent hover:underline"
                        href={regionBrowseHref(child.region.slug)}
                        key={child.region.id}
                      >
                        {child.region.display_name}{" "}
                        <span className="tabular-nums opacity-70">
                          ({child.coffeeCount})
                        </span>
                      </Link>
                    ))}
                  </p>
                ) : null}
              </div>

              {group.cards.map(({ region, coffeeCount }) => (
                <RegionCard
                  coffeeCount={coffeeCount}
                  key={region.id}
                  region={region}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </Section>
    </div>
  );
}

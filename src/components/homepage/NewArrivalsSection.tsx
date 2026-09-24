import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import CoffeeCard from "@/components/cards/CoffeeCard";
import { Icon } from "@/components/common/Icon";
import { Section } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import { fetchCoffeesCached } from "@/lib/data/fetch-coffees";

const NEWEST_HREF = "/coffees?sort=newest";

/** Cards rendered. Three columns on desktop, so keep it a multiple of 3. */
const CARD_COUNT = 6;

/**
 * Over-fetch so the completeness filter below has headroom without a second
 * round trip — `fetchCoffeesCached` is one cached query either way.
 */
const CANDIDATE_POOL = 24;

/** Below this a row reads as an error rather than a section, so drop the band. */
const MIN_CARDS = 3;

/**
 * New Arrivals — the homepage's scannable recency signal.
 *
 * Complements the `NewAdditionsStrip` marquee rather than replacing it: the
 * strip is a dense ticker of every recent name, this is a small set of real
 * cards carrying image, rating and price. Clarity has the homepage at roughly
 * half the site's average scroll depth across five consecutive windows, with a
 * returning visitor having no scannable evidence the catalog changed.
 *
 * Server component on purpose — one `unstable_cache`d query, no client hook,
 * and the cards are static below the fold.
 */
export default async function NewArrivalsSection() {
  const { items } = await fetchCoffeesCached(
    { in_stock_only: true },
    1,
    CANDIDATE_POOL,
    "newest"
  );

  // ponytail: the completeness gate is simply "would this render as a real
  // card" — an imageless card reads as broken. The other half of the concern
  // (scraped title-tag names like "Kaapi | Buy Online") needs no filter here:
  // the card renders `display_name`, which `getCoffeeDisplayName` has already
  // cleaned upstream.
  const coffees = items
    .filter((coffee) => coffee.image_url && coffee.slug)
    .slice(0, CARD_COUNT);

  if (coffees.length < MIN_CARDS) return null;

  return (
    <Section
      id="new-arrivals"
      spacing="default"
      ground="warm"
      title="New Arrivals"
      description="The latest coffees added to the directory, refreshed as roasters release them."
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {coffees.map((coffee) => (
          <CoffeeCard key={coffee.coffee_id ?? coffee.slug} coffee={coffee} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          asChild
          variant="secondary"
          className="group text-micro font-bold uppercase tracking-[0.15em] text-foreground hover:bg-transparent hover:text-accent transition-all"
        >
          <Link href={NEWEST_HREF}>
            Browse all new arrivals
            <Icon
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              icon={ArrowRightIcon}
            />
          </Link>
        </Button>
      </div>
    </Section>
  );
}

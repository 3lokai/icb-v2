import CoffeeCard from "@/components/cards/CoffeeCard";
import type { CoffeeSummary } from "@/types/coffee-types";
import { Stack } from "@/components/primitives/stack";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

const COFFEE_ID = "01f0da0c-22da-4ea2-b43f-b644f408f1f0";

/**
 * Fetch coffee by ID from coffee_directory_mv
 */
async function fetchCoffeeById(id: string): Promise<CoffeeSummary | null> {
  const supabase = process.env.SUPABASE_SECRET_KEY
    ? await createServiceRoleClient()
    : await createClient();

  const { data, error } = await supabase
    .from("coffee_directory_mv")
    .select("*")
    .eq("coffee_id", id)
    .single();

  if (error || !data) {
    return null;
  }

  // Transform to CoffeeSummary
  return {
    coffee_id: data.coffee_id ?? null,
    slug: data.slug ?? null,
    name: data.name ?? null,
    roaster_id: data.roaster_id ?? null,
    status: data.status ?? null,
    process: data.process ?? null,
    process_raw: data.process_raw ?? null,
    roast_level: data.roast_level ?? null,
    roast_level_raw: data.roast_level_raw ?? null,
    roast_style_raw: data.roast_style_raw ?? null,
    direct_buy_url: data.direct_buy_url ?? null,
    has_250g_bool: data.has_250g_bool ?? null,
    has_sensory: data.has_sensory ?? null,
    in_stock_count: data.in_stock_count ?? null,
    min_price_in_stock: data.min_price_in_stock ?? null,
    best_variant_id: data.best_variant_id ?? null,
    best_normalized_250g: data.best_normalized_250g ?? null,
    weights_available: data.weights_available ?? null,
    sensory_public: data.sensory_public ?? null,
    sensory_updated_at: data.sensory_updated_at ?? null,
    decaf: data.decaf ?? false,
    is_limited: data.is_limited ?? false,
    bean_species: data.bean_species ?? null,
    rating_avg: data.rating_avg ?? null,
    rating_count: data.rating_count ?? 0,
    tags: data.tags ?? null,
    roaster_slug: data.roaster_slug ?? "",
    roaster_name: data.roaster_name ?? "",
    hq_city: data.hq_city ?? null,
    hq_state: data.hq_state ?? null,
    hq_country: data.hq_country ?? null,
    website: data.website ?? null,
    image_url: data.image_url ?? null,
    flavor_keys: data.flavor_keys ?? null,
    brew_method_canonical_keys: data.brew_method_canonical_keys ?? null,
  } as CoffeeSummary;
}

export default async function CoffeeCardDemoPage() {
  const coffee = await fetchCoffeeById(COFFEE_ID);

  if (!coffee) {
    return (
      <PageShell>
        <Section spacing="default" contained={false}>
          <div className="text-center">
            <h1 className="text-title mb-2">Coffee Not Found</h1>
            <p className="text-body text-muted-foreground">
              Coffee with ID {COFFEE_ID} could not be found.
            </p>
          </div>
        </Section>
      </PageShell>
    );
  }

  return (
    <>
      {/* Header Section */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="2">
            <h1 className="text-title">CoffeeCard Component Demo</h1>
            <p className="text-body text-muted-foreground">
              Showcasing all three variants of the CoffeeCard component using
              coffee: <strong>{coffee.name}</strong>
            </p>
          </Stack>
        </PageShell>
      </Section>

      {/* Hero Variant */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">Hero Variant</h2>
              <p className="text-caption text-muted-foreground">
                Large, spacious card with interactive rating footer. Best for
                featured sections.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <CoffeeCard coffee={coffee} variant="hero" />
              <CoffeeCard coffee={coffee} variant="hero" userRating={null} />
              <CoffeeCard coffee={coffee} variant="hero" userRating={5} />
            </div>
          </Stack>
        </PageShell>
      </Section>

      {/* Default Variant */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">Default Variant</h2>
              <p className="text-caption text-muted-foreground">
                Opinion-first hierarchy with stars at the top. Standard card for
                grids.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <CoffeeCard coffee={coffee} variant="default" />
              <CoffeeCard coffee={coffee} variant="default" userRating={null} />
              <CoffeeCard coffee={coffee} variant="default" userRating={4} />
            </div>
          </Stack>
        </PageShell>
      </Section>

      {/* Compact Variant */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">Compact Variant</h2>
              <p className="text-caption text-muted-foreground">
                Dense, horizontal layout with small image. Perfect for lists and
                sidebars.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-4xl">
              <CoffeeCard coffee={coffee} variant="compact" />
              <CoffeeCard coffee={coffee} variant="compact" />
            </div>
          </Stack>
        </PageShell>
      </Section>

      {/* All Variants Comparison */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">All Variants Comparison</h2>
              <p className="text-caption text-muted-foreground">
                Same coffee displayed in all three variants for direct
                comparison.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="flex flex-col self-start">
                <h3 className="text-body font-medium mb-3">Hero</h3>
                <CoffeeCard coffee={coffee} variant="hero" />
              </div>
              <div className="flex flex-col self-start">
                <h3 className="text-body font-medium mb-3">Default</h3>
                <CoffeeCard coffee={coffee} variant="default" />
              </div>
              <div className="flex flex-col self-start">
                <h3 className="text-body font-medium mb-3">Compact</h3>
                <CoffeeCard coffee={coffee} variant="compact" />
              </div>
            </div>
          </Stack>
        </PageShell>
      </Section>
    </>
  );
}

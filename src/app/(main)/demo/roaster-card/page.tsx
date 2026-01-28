import RoasterCard from "@/components/cards/RoasterCard";
import type { RoasterSummary } from "@/types/roaster-types";
import { Stack } from "@/components/primitives/stack";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

const ROASTER_ID = "29dbbe38-eed2-4a70-904b-2566bec259f2";

type RoasterStats = {
  coffee_count: number;
  rated_coffee_count: number;
  avg_coffee_rating: number | null;
};

/**
 * Fetch roaster by ID
 */
async function fetchRoasterById(id: string): Promise<RoasterSummary | null> {
  const supabase = process.env.SUPABASE_SECRET_KEY
    ? await createServiceRoleClient()
    : await createClient();

  // Fetch roaster from roasters table
  const { data: roasterData, error: roasterError } = await supabase
    .from("roasters")
    .select(
      "id, slug, name, website, hq_city, hq_state, hq_country, is_active, instagram_handle, is_featured, is_editors_pick, avg_rating, avg_customer_support, avg_delivery_experience, avg_packaging, avg_value_for_money, total_ratings_count, recommend_percentage"
    )
    .eq("id", id)
    .single();

  if (roasterError || !roasterData) {
    return null;
  }

  // Fetch coffee stats for this roaster
  const { data: coffeeStats } = await supabase
    .from("coffees")
    .select("roaster_id, rating_avg, rating_count")
    .eq("roaster_id", id);

  // Aggregate stats
  const stats: RoasterStats = {
    coffee_count: 0,
    rated_coffee_count: 0,
    avg_coffee_rating: null,
  };

  const ratingSums: { sum: number; count: number } = { sum: 0, count: 0 };

  if (coffeeStats) {
    for (const coffee of coffeeStats) {
      stats.coffee_count += 1;

      if (coffee.rating_avg && coffee.rating_count > 0) {
        stats.rated_coffee_count += 1;
        ratingSums.sum += coffee.rating_avg * coffee.rating_count;
        ratingSums.count += coffee.rating_count;
      }
    }

    if (ratingSums.count > 0) {
      stats.avg_coffee_rating = ratingSums.sum / ratingSums.count;
    }
  }

  // Transform to RoasterSummary
  return {
    id: roasterData.id,
    slug: roasterData.slug,
    name: roasterData.name,
    website: roasterData.website ?? null,
    hq_city: roasterData.hq_city ?? null,
    hq_state: roasterData.hq_state ?? null,
    hq_country: roasterData.hq_country ?? null,
    is_active: roasterData.is_active,
    instagram_handle: roasterData.instagram_handle ?? null,
    is_featured: roasterData.is_featured ?? null,
    is_editors_pick: roasterData.is_editors_pick ?? null,
    coffee_count: stats.coffee_count,
    avg_coffee_rating: stats.avg_coffee_rating,
    rated_coffee_count: stats.rated_coffee_count,
    avg_rating: roasterData.avg_rating ?? null,
    avg_customer_support: roasterData.avg_customer_support ?? null,
    avg_delivery_experience: roasterData.avg_delivery_experience ?? null,
    avg_packaging: roasterData.avg_packaging ?? null,
    avg_value_for_money: roasterData.avg_value_for_money ?? null,
    total_ratings_count: roasterData.total_ratings_count ?? null,
    recommend_percentage: roasterData.recommend_percentage ?? null,
  } as RoasterSummary;
}

export default async function RoasterCardDemoPage() {
  const roaster = await fetchRoasterById(ROASTER_ID);

  if (!roaster) {
    return (
      <PageShell>
        <Section spacing="default" contained={false}>
          <div className="text-center">
            <h1 className="text-title mb-2">Roaster Not Found</h1>
            <p className="text-body text-muted-foreground">
              Roaster with ID {ROASTER_ID} could not be found.
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
            <h1 className="text-title">RoasterCard Component Demo</h1>
            <p className="text-body text-muted-foreground">
              Showcasing the RoasterCard component using roaster:{" "}
              <strong>{roaster.name}</strong>
            </p>
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
                Standard roaster card with logo, name, location, and coffee
                count.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <RoasterCard roaster={roaster} variant="default" />
              <RoasterCard roaster={roaster} variant="default" />
              <RoasterCard roaster={roaster} variant="default" />
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
                Dense, horizontal layout with small logo. Perfect for lists and
                sidebars.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-4xl">
              <RoasterCard roaster={roaster} variant="compact" />
              <RoasterCard roaster={roaster} variant="compact" />
            </div>
          </Stack>
        </PageShell>
      </Section>

      {/* Grid Layout - 2 Columns */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">Grid Layout - 2 Columns</h2>
              <p className="text-caption text-muted-foreground">
                Two-column grid layout for roaster cards.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <RoasterCard roaster={roaster} variant="default" />
              <RoasterCard roaster={roaster} variant="default" />
            </div>
          </Stack>
        </PageShell>
      </Section>

      {/* Grid Layout - 3 Columns */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">Grid Layout - 3 Columns</h2>
              <p className="text-caption text-muted-foreground">
                Three-column grid layout for roaster cards.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <RoasterCard roaster={roaster} variant="default" />
              <RoasterCard roaster={roaster} variant="default" />
              <RoasterCard roaster={roaster} variant="default" />
            </div>
          </Stack>
        </PageShell>
      </Section>

      {/* Grid Layout - 4 Columns */}
      <Section spacing="default" contained={false}>
        <PageShell>
          <Stack gap="6">
            <div>
              <h2 className="text-heading mb-2">Grid Layout - 4 Columns</h2>
              <p className="text-caption text-muted-foreground">
                Four-column grid layout for roaster cards (standard for roaster
                grids).
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <RoasterCard roaster={roaster} variant="default" />
              <RoasterCard roaster={roaster} variant="default" />
              <RoasterCard roaster={roaster} variant="default" />
              <RoasterCard roaster={roaster} variant="default" />
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
                Same roaster displayed in both variants for direct comparison.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="flex flex-col self-start">
                <h3 className="text-body font-medium mb-3">Default</h3>
                <RoasterCard roaster={roaster} variant="default" />
              </div>
              <div className="flex flex-col self-start">
                <h3 className="text-body font-medium mb-3">Compact</h3>
                <RoasterCard roaster={roaster} variant="compact" />
              </div>
            </div>
          </Stack>
        </PageShell>
      </Section>
    </>
  );
}

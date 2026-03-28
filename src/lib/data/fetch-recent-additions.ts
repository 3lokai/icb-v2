import { PUBLIC_COFFEE_STATUSES } from "@/lib/utils/coffee-constants";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

const TWO_WEEKS_IN_DAYS = 14;
const MAX_NEW_COFFEES = 80;
const MAX_NEW_ROASTERS = 40;

export type RecentCoffeeItem = {
  name: string;
  slug: string;
};

export type RecentCoffeeGroup = {
  roasterName: string;
  roasterSlug: string;
  coffees: RecentCoffeeItem[];
};

export type RecentRoasterItem = {
  name: string;
  slug: string;
};

export type RecentAdditions = {
  newCoffees: RecentCoffeeGroup[];
  newRoasters: RecentRoasterItem[];
};

export async function fetchRecentAdditions(): Promise<RecentAdditions> {
  const twoWeeksAgoIso = new Date(
    Date.now() - TWO_WEEKS_IN_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const supabase = process.env.SUPABASE_SECRET_KEY
    ? await createServiceRoleClient()
    : await createClient();

  const [coffeesResult, roastersResult] = await Promise.all([
    supabase
      .from("coffee_directory_mv")
      .select("roaster_name, roaster_slug, name, slug, created_at")
      .in("status", PUBLIC_COFFEE_STATUSES)
      .gte("created_at", twoWeeksAgoIso)
      .order("created_at", { ascending: false })
      .limit(MAX_NEW_COFFEES),
    supabase
      .from("roasters")
      .select("name, slug, created_at")
      .eq("is_active", true)
      .gte("created_at", twoWeeksAgoIso)
      .order("created_at", { ascending: false })
      .limit(MAX_NEW_ROASTERS),
  ]);

  if (coffeesResult.error) {
    throw new Error(
      `Failed to fetch recent coffee additions: ${coffeesResult.error.message}`
    );
  }

  if (roastersResult.error) {
    throw new Error(
      `Failed to fetch recent roaster additions: ${roastersResult.error.message}`
    );
  }

  const groupedByRoaster = new Map<string, RecentCoffeeGroup>();

  for (const row of coffeesResult.data ?? []) {
    if (!row.roaster_name || !row.roaster_slug || !row.name || !row.slug) {
      continue;
    }

    const roasterKey = row.roaster_slug;
    const existing = groupedByRoaster.get(roasterKey);
    if (existing) {
      existing.coffees.push({ name: row.name, slug: row.slug });
      continue;
    }

    groupedByRoaster.set(roasterKey, {
      roasterName: row.roaster_name,
      roasterSlug: row.roaster_slug,
      coffees: [{ name: row.name, slug: row.slug }],
    });
  }

  const newRoasters: RecentRoasterItem[] = (roastersResult.data ?? [])
    .filter((row) => Boolean(row.name && row.slug))
    .map((row) => ({
      name: row.name as string,
      slug: row.slug as string,
    }));

  return {
    newCoffees: Array.from(groupedByRoaster.values()),
    newRoasters,
  };
}

import "server-only";

import { cookies } from "next/headers";
import { getCurrentUser } from "@/data/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

export type RecentlyViewedCoffeeItem = {
  coffeeId: string;
  name: string;
  coffeeSlug: string;
  roasterId: string;
  roasterSlug: string;
  roasterName: string;
  lastViewedAt: string;
  imageUrl: string | null;
};

/**
 * Recent coffee detail views for the current browser session:
 * logged-in users via `user_id`, anonymous via `icb_anon_id` cookie.
 */
export async function fetchRecentlyViewedCoffees(
  limit: number = 12
): Promise<RecentlyViewedCoffeeItem[]> {
  const supabase = await createServiceRoleClient();
  const user = await getCurrentUser();

  let qb = supabase.from("coffee_views").select(
    `
      last_viewed_at,
      coffees!inner (
        id,
        name,
        slug,
        roaster_id,
        roasters!inner (
          name,
          slug
        )
      )
    `
  );

  if (user) {
    qb = qb.eq("user_id", user.id);
  } else {
    const cookieStore = await cookies();
    const anonId = cookieStore.get("icb_anon_id")?.value ?? null;
    if (!anonId || !isUuid(anonId)) {
      return [];
    }
    qb = qb.eq("anon_id", anonId);
  }

  const { data: rows, error } = await qb
    .order("last_viewed_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[fetchRecentlyViewedCoffees]", error);
    return [];
  }

  if (!rows?.length) {
    return [];
  }

  type Row = {
    last_viewed_at: string;
    coffees: {
      id: string;
      name: string;
      slug: string;
      roaster_id: string;
      roasters: { name: string; slug: string };
    };
  };

  const coffeeIds = rows.map((r) => (r as unknown as Row).coffees.id);

  const { data: imageRows } = await supabase
    .from("coffee_images")
    .select("coffee_id, imagekit_url, url")
    .in("coffee_id", coffeeIds)
    .order("sort_order", { ascending: true });

  const imageByCoffee = new Map<string, string>();
  for (const imageRow of imageRows ?? []) {
    const href = imageRow.imagekit_url || imageRow.url;
    if (imageRow.coffee_id && href && !imageByCoffee.has(imageRow.coffee_id)) {
      imageByCoffee.set(imageRow.coffee_id, href);
    }
  }

  return (rows as unknown as Row[]).map((row) => {
    const c = row.coffees;
    const r = c.roasters;
    return {
      coffeeId: c.id,
      name: c.name,
      coffeeSlug: c.slug,
      roasterId: c.roaster_id,
      roasterSlug: r.slug,
      roasterName: r.name,
      lastViewedAt: row.last_viewed_at,
      imageUrl: imageByCoffee.get(c.id) ?? null,
    };
  });
}

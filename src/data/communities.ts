import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  CommunityPlatformSchema,
  type CommunityDTO,
} from "@/types/community-types";
import { unstable_cache } from "next/cache";

/**
 * Get all active communities for the directory page.
 * Ordered by sort_order ascending, then name.
 * Cached for 10 minutes with the 'communities' tag.
 */
export const getAllCommunities = unstable_cache(
  async (): Promise<CommunityDTO[]> => {
    const supabase = await createClient();

    const { data: communities, error } = await supabase
      .from("communities")
      .select(
        "id, slug, name, description, platform, invite_url, icon_url, member_count, moderators, language, tags"
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error || !communities) {
      console.error("Error fetching communities:", error);
      return [];
    }

    return communities.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description ?? "",
      platform: CommunityPlatformSchema.parse(c.platform),
      invite_url: c.invite_url,
      icon_url: c.icon_url ?? undefined,
      member_count: c.member_count ?? undefined,
      moderators: c.moderators ?? [],
      language: c.language,
      tags: c.tags ?? [],
    }));
  },
  ["communities-list"],
  { revalidate: 600, tags: ["communities"] }
);

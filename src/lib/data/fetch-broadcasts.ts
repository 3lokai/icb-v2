import { unstable_cache } from "next/cache";
import {
  getBroadcastById,
  listCompletedBroadcasts,
} from "@/lib/convertkit/broadcasts";
import type { KitBroadcast } from "@/types/newsletter-types";

/**
 * Completed newsletters from Kit for the /newsletter archive, newest first.
 * Cached for an hour so page renders don't hit the Kit API on every request.
 */
export const fetchBroadcasts = unstable_cache(
  async (): Promise<KitBroadcast[]> => listCompletedBroadcasts(),
  ["kit-broadcasts"],
  { revalidate: 3600, tags: ["newsletters"] }
);

/**
 * A single newsletter with its full HTML content for /newsletter/[id].
 */
export const fetchBroadcastById = unstable_cache(
  async (id: number): Promise<KitBroadcast | null> => getBroadcastById(id),
  ["kit-broadcast"],
  { revalidate: 3600, tags: ["newsletters"] }
);

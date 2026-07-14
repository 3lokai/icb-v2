import "server-only";

import { isConvertKitConfigured } from "@/lib/convertkit/client";
import type { KitBroadcast } from "@/types/newsletter-types";

/**
 * ConvertKit/Kit API v4 — Broadcasts
 *
 * Read-only access to sent newsletters ("broadcasts") for the on-site
 * newsletter archive. Uses the same KIT_API_KEY as the subscriber sync
 * in ./client.ts and degrades gracefully when the key is missing.
 */

interface KitBroadcastListResponse {
  broadcasts: KitBroadcast[];
  pagination: {
    has_next_page: boolean;
    end_cursor: string | null;
  };
}

interface KitBroadcastResponse {
  broadcast: KitBroadcast;
}

const KIT_API_BASE = "https://api.kit.com/v4";

function kitHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-Kit-Api-Key": process.env.KIT_API_KEY!,
  };
}

/**
 * List all completed (sent) broadcasts, newest first.
 *
 * Uses slim mode (omits content/subscriber_filter/etc.) and follows cursor
 * pagination until exhausted. Returns [] if the API key is not configured
 * or the API errors.
 */
export async function listCompletedBroadcasts(): Promise<KitBroadcast[]> {
  if (!isConvertKitConfigured()) {
    console.log("[ConvertKit] API key not configured, skipping broadcasts");
    return [];
  }

  const broadcasts: KitBroadcast[] = [];
  let cursor: string | null = null;

  try {
    do {
      const params = new URLSearchParams({
        status: "completed",
        slim: "true",
      });
      if (cursor) params.set("after", cursor);

      const response = await fetch(
        `${KIT_API_BASE}/broadcasts?${params.toString()}`,
        { headers: kitHeaders() }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[ConvertKit] Failed to list broadcasts (${response.status}):`,
          errorText
        );
        return broadcasts;
      }

      const data = (await response.json()) as KitBroadcastListResponse;
      broadcasts.push(...data.broadcasts);
      cursor = data.pagination.has_next_page
        ? data.pagination.end_cursor
        : null;
    } while (cursor);
  } catch (error) {
    console.error(
      "[ConvertKit] Network error listing broadcasts:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return broadcasts;
  }

  return broadcasts.sort(
    (a, b) =>
      new Date(b.send_at ?? b.published_at ?? b.created_at).getTime() -
      new Date(a.send_at ?? a.published_at ?? a.created_at).getTime()
  );
}

/**
 * Fetch a single broadcast by ID, including its full HTML content.
 * Returns null if not configured, not found, or on API error.
 */
export async function getBroadcastById(
  id: number
): Promise<KitBroadcast | null> {
  if (!isConvertKitConfigured()) {
    console.log("[ConvertKit] API key not configured, skipping broadcast");
    return null;
  }

  try {
    const response = await fetch(`${KIT_API_BASE}/broadcasts/${id}`, {
      headers: kitHeaders(),
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[ConvertKit] Failed to fetch broadcast ${id} (${response.status}):`,
        errorText
      );
      return null;
    }

    const data = (await response.json()) as KitBroadcastResponse;
    return data.broadcast;
  } catch (error) {
    console.error(
      `[ConvertKit] Network error fetching broadcast ${id}:`,
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
}

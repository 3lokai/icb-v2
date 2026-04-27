import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/server";

function utcCalendarDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Server-only: invokes sync-to-sequenzy Edge Function (Sequenzy API key stays server-side).
 * Pass SEQUENZY_INTERNAL_SYNC_SECRET (same value as Edge INTERNAL_SEQUENZY_SYNC_SECRET and Vault sequenzy_internal_sync_secret).
 */
export async function trackLifecycleEvent(
  userId: string,
  eventName: string,
  source: "live" | "backfill" | "trigger" = "live"
): Promise<void> {
  const secret = process.env.SEQUENZY_INTERNAL_SYNC_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[sequenzy] SEQUENZY_INTERNAL_SYNC_SECRET not set; skipping",
        eventName
      );
    } else {
      console.error(
        "[sequenzy] SEQUENZY_INTERNAL_SYNC_SECRET is not configured; cannot emit event",
        { eventName, envVar: "SEQUENZY_INTERNAL_SYNC_SECRET" }
      );
    }
    return;
  }

  const supabase = await createServiceRoleClient();
  const { error } = await supabase.functions.invoke("sync-to-sequenzy", {
    body: { user_id: userId, event_name: eventName, source },
    headers: { "x-icb-sequenzy-sync": secret },
  });

  if (error) {
    console.error("[sequenzy] trackLifecycleEvent", eventName, error);
  }
}

/**
 * Throttle server-side caller: at most one session_started per UTC calendar day.
 */
export async function trackSessionStartedIfNeeded(
  userId: string
): Promise<void> {
  const supabase = await createServiceRoleClient();
  const now = new Date();
  const todayStart = `${utcCalendarDay(now)}T00:00:00.000Z`;

  const { data: updated, error } = await supabase
    .from("user_profiles")
    .update({ sequenzy_last_session_event_at: now.toISOString() })
    .eq("id", userId)
    .or(
      `sequenzy_last_session_event_at.is.null,sequenzy_last_session_event_at.lt.${todayStart}`
    )
    .select("id");

  if (error) {
    console.error("[sequenzy] trackSessionStartedIfNeeded update", error);
    return;
  }

  if (!updated || updated.length === 0) return;

  await trackLifecycleEvent(userId, "session_started");
}

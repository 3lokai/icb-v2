import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/server";

function utcCalendarDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Server-only: invokes sync-to-loops Edge Function (Loops API key stays server-side).
 * Pass LOOPS_INTERNAL_SYNC_SECRET (same value as Edge INTERNAL_LOOPS_SYNC_SECRET and Vault loops_internal_sync_secret).
 */
export async function trackLifecycleEvent(
  userId: string,
  eventName: string
): Promise<void> {
  const secret = process.env.LOOPS_INTERNAL_SYNC_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[loops] LOOPS_INTERNAL_SYNC_SECRET not set; skipping",
        eventName
      );
    } else {
      console.error(
        "[loops] LOOPS_INTERNAL_SYNC_SECRET is not configured; cannot emit event",
        { eventName, envVar: "LOOPS_INTERNAL_SYNC_SECRET" }
      );
    }
    return;
  }

  const supabase = await createServiceRoleClient();
  const { error } = await supabase.functions.invoke("sync-to-loops", {
    body: { user_id: userId, event_name: eventName },
    headers: { "x-icb-loops-sync": secret },
  });

  if (error) {
    console.error("[loops] trackLifecycleEvent", eventName, error);
  }
}

/**
 * Throttle client-side: at most one session_started per UTC calendar day (Edge also enforces).
 */
export async function trackSessionStartedIfNeeded(
  userId: string
): Promise<void> {
  const supabase = await createServiceRoleClient();
  const now = new Date();
  const todayStart = `${utcCalendarDay(now)}T00:00:00.000Z`;

  const { data: updated, error } = await supabase
    .from("user_profiles")
    .update({ loops_last_session_event_at: now.toISOString() })
    .eq("id", userId)
    .or(
      `loops_last_session_event_at.is.null,loops_last_session_event_at.lt.${todayStart}`
    )
    .select("id");

  if (error) {
    console.error("[loops] trackSessionStartedIfNeeded update", error);
    return;
  }

  if (!updated || updated.length === 0) return;

  await trackLifecycleEvent(userId, "session_started");
}

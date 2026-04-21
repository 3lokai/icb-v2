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
  const { data, error } = await supabase
    .from("user_profiles")
    .select("loops_last_session_event_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[loops] trackSessionStartedIfNeeded select", error);
    return;
  }

  const last = data?.loops_last_session_event_at;
  if (last) {
    const lastDay = utcCalendarDay(new Date(last));
    const today = utcCalendarDay(new Date());
    if (lastDay === today) return;
  }

  await trackLifecycleEvent(userId, "session_started");
}

import { getCurrentUser } from "@/data/auth";
import { trackSessionStartedIfNeeded } from "@/lib/sequenzy";

/**
 * Render once in authenticated shells (e.g. dashboard layout) to send throttled session_started.
 */
export async function SequenzySessionTracker() {
  const user = await getCurrentUser();
  if (!user) return null;

  void trackSessionStartedIfNeeded(user.id).catch((err) => {
    console.error("[sequenzy] SequenzySessionTracker", err);
  });
  return null;
}

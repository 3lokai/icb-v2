// Server-side persist of the visitor's first-touch UTM attribution at signup.
//
// The `icb_attribution` cookie is written client-side by storeAttributionData
// (./index.ts) and survives tab close for 90 days, which is the whole point: the
// rating -> gate -> signup funnel is cross-session, so the campaign that earned a
// signup is usually from an earlier visit.
//
// Consent is already handled upstream — storeAttributionData refuses to write the
// cookie without analytics consent, so no cookie means nothing to persist here.

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { captureServerEvent } from "@/lib/posthog-server";
import { ATTRIBUTION_COOKIE, type AttributionData } from "@/lib/analytics";

const readAttributionCookie = async (): Promise<AttributionData | null> => {
  const raw = (await cookies()).get(ATTRIBUTION_COOKIE)?.value;
  if (!raw) {
    return null;
  }
  // Client-writable input: anything unparseable is dropped, not trusted.
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return typeof parsed?.original_source === "string" ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Write the visitor's attribution onto their profile and PostHog person.
 *
 * Idempotent and first-touch: the update is guarded on `attribution is null`, so
 * a second signup-path call (OAuth callback and onboarding can both fire) is a
 * no-op rather than an overwrite.
 *
 * Never throws — attribution failing must not fail a signup.
 */
export async function persistSignupAttribution(userId: string): Promise<void> {
  try {
    const attribution = await readAttributionCookie();
    if (!attribution) {
      return;
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("user_profiles")
      .update({ attribution })
      .eq("id", userId)
      .is("attribution", null);

    if (error) {
      console.error("[persist-attribution] profile update:", error);
    }

    // Person properties, not event properties, so PostHog cohorts can filter by
    // acquisition source. $set_once pins the first touch; $set tracks the latest.
    captureServerEvent(userId, "attribution_captured", {
      $set_once: {
        original_source: attribution.original_source,
        original_campaign: attribution.original_campaign,
        original_content: attribution.original_content,
        first_visit_time: attribution.first_visit_time,
      },
      $set: {
        touchpoints: attribution.touchpoints,
        last_visit_time: attribution.last_visit_time,
      },
    });
  } catch (err) {
    console.error("[persist-attribution]", err);
  }
}

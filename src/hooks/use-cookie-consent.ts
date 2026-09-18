import {
  updateAnalyticsConsent,
  updateMarketingConsent,
} from "@/lib/analytics";
import { type CookiePreferences, writeStoredPreferences } from "@/lib/consent";

// Parsing and storage live in @/lib/consent so that @/lib/analytics can read
// consent without importing this module (which imports it). Re-exported here
// because this is the path the consent UI already imports from.
export {
  STORAGE_KEY,
  CONSENT_VERSION,
  getStoredPreferences,
  hasStoredConsent,
  type CookiePreferences,
} from "@/lib/consent";

export const savePreferences = (prefs: CookiePreferences) => {
  if (typeof window === "undefined") {
    return;
  }
  writeStoredPreferences(prefs);
  updateAnalyticsConsent(prefs.analytics);
  updateMarketingConsent(prefs.marketing);
  window.dispatchEvent(new Event("storage"));
};

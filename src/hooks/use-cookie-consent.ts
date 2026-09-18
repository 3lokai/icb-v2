import {
  updateAnalyticsConsent,
  updateMarketingConsent,
} from "@/lib/analytics";

export const STORAGE_KEY = "icb-cookie-consent";

// Bumped when the shape of the stored value changes in a way that must not be
// read as consent. v2 introduced `marketing`: a pre-v2 value carries no
// marketing consent, whatever its (differently-scoped) old `marketing` field said.
const CONSENT_VERSION = 2;

export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

// analytics is opt-out (defaults true), marketing is opt-IN (defaults false).
const DEFAULTS: CookiePreferences = {
  necessary: true,
  analytics: true,
  marketing: false,
};

export const getStoredPreferences = (): CookiePreferences => {
  if (typeof window === "undefined") {
    return DEFAULTS;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return DEFAULTS;
  }
  try {
    const parsed = JSON.parse(stored);
    return {
      necessary: parsed.necessary ?? true,
      // Pre-v2 values may carry an older `marketing` flag that was folded into
      // analytics; keep honouring it as an analytics answer.
      analytics:
        parsed.analytics !== undefined
          ? parsed.analytics
          : (parsed.marketing ?? true),
      // Only a v2 value can express marketing consent. Anything older reads as
      // false — a legal basis cannot be retrofitted to an existing preference.
      marketing: parsed.v === CONSENT_VERSION && parsed.marketing === true,
    };
  } catch {
    return DEFAULTS;
  }
};

export const savePreferences = (prefs: CookiePreferences) => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...prefs, v: CONSENT_VERSION })
  );
  updateAnalyticsConsent(prefs.analytics);
  updateMarketingConsent(prefs.marketing);
  window.dispatchEvent(new Event("storage"));
};

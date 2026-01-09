import { updateAnalyticsConsent } from "@/lib/analytics";

export const STORAGE_KEY = "icb-cookie-consent";

export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
};

export const getStoredPreferences = (): CookiePreferences => {
  if (typeof window === "undefined") {
    return { necessary: true, analytics: true };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Default to analytics enabled (opt-out model)
    return { necessary: true, analytics: true };
  }
  try {
    const parsed = JSON.parse(stored);
    // Handle migration from old format that included marketing
    if (parsed.marketing !== undefined) {
      // If old format exists, treat marketing as analytics
      return {
        necessary: parsed.necessary ?? true,
        analytics:
          parsed.analytics !== undefined
            ? parsed.analytics
            : (parsed.marketing ?? true),
      };
    }
    // Default to true if not explicitly set (opt-out model)
    return {
      necessary: parsed.necessary ?? true,
      analytics: parsed.analytics !== undefined ? parsed.analytics : true,
    };
  } catch {
    // Default to analytics enabled on error
    return { necessary: true, analytics: true };
  }
};

export const savePreferences = (prefs: CookiePreferences) => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  updateAnalyticsConsent(prefs.analytics);
  window.dispatchEvent(new Event("storage"));
};

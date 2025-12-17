import { updateAnalyticsConsent } from "@/lib/analytics";

export const STORAGE_KEY = "icb-cookie-consent";

export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
};

export const getStoredPreferences = (): CookiePreferences => {
  if (typeof window === "undefined") {
    return { necessary: true, analytics: false };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { necessary: true, analytics: false };
  }
  try {
    const parsed = JSON.parse(stored);
    // Handle migration from old format that included marketing
    if (parsed.marketing !== undefined) {
      // If old format exists, treat marketing as analytics
      return {
        necessary: parsed.necessary ?? true,
        analytics: parsed.analytics || parsed.marketing,
      };
    }
    return {
      necessary: parsed.necessary ?? true,
      analytics: parsed.analytics ?? false,
    };
  } catch {
    return { necessary: true, analytics: false };
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

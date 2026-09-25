/**
 * Cookie-consent storage and parsing — the single source of truth.
 *
 * Deliberately dependency-free. `@/hooks/use-cookie-consent` needs the consent
 * side-effects from `@/lib/analytics`, and `@/lib/analytics` needs to read
 * consent, so the parse cannot live in either without a cycle. It lived in both
 * for a while instead, and the two copies drifted: one honoured a legacy
 * marketing opt-out as an analytics refusal and the other did not, so a visitor
 * who had declined under the old UI still got an attribution cookie.
 *
 * The one reader that cannot import this is the beforeInteractive consent-init
 * script in app/layout.tsx, which is a stringified inline script. Keep its
 * conditions in step with `parsePreferences` by hand.
 */

export const STORAGE_KEY = "icb-cookie-consent";

// Bumped when the shape of the stored value changes in a way that must not be
// read as consent. v2 introduced `marketing`: a pre-v2 value carries no
// marketing consent, whatever its (differently-scoped) old `marketing` field said.
export const CONSENT_VERSION = 2;

export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

// analytics is opt-out (defaults true), marketing is opt-IN (defaults false).
export const DEFAULTS: CookiePreferences = {
  necessary: true,
  analytics: true,
  marketing: false,
};

export const parsePreferences = (raw: string | null): CookiePreferences => {
  if (!raw) {
    return { ...DEFAULTS };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      necessary: parsed.necessary ?? true,
      // Pre-v2 values may carry an older `marketing` flag that was folded into
      // analytics; keep honouring it as an analytics answer, including when it
      // is a refusal.
      analytics:
        parsed.analytics !== undefined
          ? parsed.analytics
          : (parsed.marketing ?? true),
      // Only a v2 value can express marketing consent. Anything older reads as
      // false — a legal basis cannot be retrofitted to an existing preference.
      marketing: parsed.v === CONSENT_VERSION && parsed.marketing === true,
    };
  } catch {
    return { ...DEFAULTS };
  }
};

// In-memory copy of the last answer, for when storage is blocked: without it a
// refusal made before PostHog loads is lost, and init reads the opt-out default.
let sessionValue: string | null = null;

const read = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return localStorage.getItem(STORAGE_KEY) ?? sessionValue;
  } catch {
    // Private browsing / blocked storage.
    return sessionValue;
  }
};

export const getStoredPreferences = (): CookiePreferences =>
  parsePreferences(read());

/**
 * Has the visitor answered at all? Distinct from `getStoredPreferences`, which
 * cannot say — it returns defaults for an absent value. This is what decides
 * whether the consent banner is shown.
 */
export const hasStoredConsent = (): boolean => read() !== null;

export const writeStoredPreferences = (prefs: CookiePreferences): void => {
  if (typeof window === "undefined") {
    return;
  }
  sessionValue = JSON.stringify({ ...prefs, v: CONSENT_VERSION });
  try {
    localStorage.setItem(STORAGE_KEY, sessionValue);
  } catch {
    // Storage blocked; sessionValue keeps the choice for this page session.
  }
};

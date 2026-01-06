/**
 * Anonymous user identity management for reviews
 *
 * Generates and manages a stable UUID for anonymous users that persists
 * across browser sessions via localStorage and cookies.
 *
 * Strategy:
 * - Generate UUID on first interaction (client-side only)
 * - Store in localStorage (primary) AND cookie (1 year expiry, NOT httpOnly)
 * - Always read from localStorage first; fallback to cookie
 * - Heal mismatches: localStorage is source of truth
 */

const STORAGE_KEY = "icb_anon_id";
const COOKIE_NAME = "icb_anon_id";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

const REVIEW_COUNT_STORAGE_KEY = "icb_review_count";
const REVIEW_COUNT_COOKIE_NAME = "icb_review_count";

// Generic UUID (accepts v1-v8-ish variants, not just v4)
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * Generate a UUID
 * Uses crypto.randomUUID() if available, otherwise falls back
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback (still v4-shaped)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Set cookie (adds Secure automatically on HTTPS)
 */
function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === "undefined") return;

  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") cookie = cookie.substring(1);
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

/**
 * Get anonymous ID from localStorage (preferred) or cookie (fallback).
 * Heals mismatch by overwriting cookie from localStorage.
 * Returns null on server.
 */
export function getAnonId(): string | null {
  if (typeof window === "undefined") return null;

  let lsValue: string | null = null;

  // 1) localStorage first
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isUuid(stored)) {
      lsValue = stored;
    } else if (stored) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore (private browsing, blocked storage, etc.)
  }

  // 2) cookie fallback
  const cookieValue = getCookie(COOKIE_NAME);
  const cookieValid = cookieValue && isUuid(cookieValue) ? cookieValue : null;

  // Heal mismatch: localStorage is source of truth
  if (lsValue) {
    if (cookieValid !== lsValue) {
      setCookie(COOKIE_NAME, lsValue, COOKIE_MAX_AGE);
    }
    return lsValue;
  }

  // If only cookie exists, mirror it into localStorage
  if (cookieValid) {
    try {
      localStorage.setItem(STORAGE_KEY, cookieValid);
    } catch {
      // ignore
    }
    return cookieValid;
  }

  return null;
}

/**
 * Ensure anon ID exists, generating if missing.
 * Returns null on server.
 */
export function ensureAnonId(): string | null {
  if (typeof window === "undefined") return null;

  const existing = getAnonId();
  if (existing) return existing;

  const newId = generateUUID();

  try {
    localStorage.setItem(STORAGE_KEY, newId);
  } catch {
    // ignore
  }

  setCookie(COOKIE_NAME, newId, COOKIE_MAX_AGE);

  return newId;
}

/**
 * Get review count from localStorage (preferred) or cookie (fallback).
 * Heals mismatch by overwriting cookie from localStorage.
 * Returns null on server or if count doesn't exist.
 */
export function getReviewCount(): number | null {
  if (typeof window === "undefined") return null;

  let lsValue: number | null = null;

  // 1) localStorage first
  try {
    const stored = localStorage.getItem(REVIEW_COUNT_STORAGE_KEY);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        lsValue = parsed;
      } else {
        localStorage.removeItem(REVIEW_COUNT_STORAGE_KEY);
      }
    }
  } catch {
    // ignore (private browsing, blocked storage, etc.)
  }

  // 2) cookie fallback
  const cookieValue = getCookie(REVIEW_COUNT_COOKIE_NAME);
  const cookieParsed = cookieValue !== null ? parseInt(cookieValue, 10) : NaN;
  const cookieValid =
    !isNaN(cookieParsed) && cookieParsed >= 0 ? cookieParsed : null;

  // Heal mismatch: localStorage is source of truth
  if (lsValue !== null) {
    if (cookieValid !== lsValue) {
      setCookie(REVIEW_COUNT_COOKIE_NAME, String(lsValue), COOKIE_MAX_AGE);
    }
    return lsValue;
  }

  // If only cookie exists, mirror it into localStorage
  if (cookieValid !== null) {
    try {
      localStorage.setItem(REVIEW_COUNT_STORAGE_KEY, String(cookieValid));
    } catch {
      // ignore
    }
    return cookieValid;
  }

  return null;
}

/**
 * Set review count in both localStorage and cookie.
 * Returns null on server.
 */
export function setReviewCount(count: number): void {
  if (typeof window === "undefined") return;

  if (count < 0 || !Number.isInteger(count)) {
    console.warn("Invalid review count:", count);
    return;
  }

  const countStr = String(count);

  try {
    localStorage.setItem(REVIEW_COUNT_STORAGE_KEY, countStr);
  } catch {
    // ignore (private browsing, blocked storage, etc.)
  }

  setCookie(REVIEW_COUNT_COOKIE_NAME, countStr, COOKIE_MAX_AGE);
}

/**
 * Increment review count by 1 and return new count.
 * Returns null on server.
 */
export function incrementReviewCount(): number {
  if (typeof window === "undefined") return 0;

  const current = getReviewCount() ?? 0;
  const newCount = current + 1;
  setReviewCount(newCount);
  return newCount;
}

/**
 * Reset review count (clear from localStorage and cookie).
 * Useful when user logs in or for testing.
 */
export function resetReviewCount(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(REVIEW_COUNT_STORAGE_KEY);
  } catch {
    // ignore
  }

  // Clear cookie by setting it with past expiry
  setCookie(REVIEW_COUNT_COOKIE_NAME, "", -1);
}

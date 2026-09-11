/**
 * Pure parse of the posthog-js persistence cookie (`ph_<token>_posthog`).
 *
 * Kept free of `next/headers` so it stays testable — see
 * `scripts/check-posthog-session-cookie.ts`. Read by `posthog-server.ts` to
 * attach `$session_id` to server-side captures; without it those events carry
 * no session and every attribution JOIN drops them silently.
 */
export function sessionIdFromCookie(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    // posthog-js stores `$sesid: [activityTimestamp, sessionId, startTimestamp]`.
    const sesid = JSON.parse(decodeURIComponent(raw))?.$sesid;
    return Array.isArray(sesid) && typeof sesid[1] === "string"
      ? sesid[1]
      : null;
  } catch {
    // Malformed or not-yet-written cookie. An absent session id is correct;
    // a fabricated one would poison the attribution it is meant to fix.
    return null;
  }
}

/** Cookie name posthog-js persists under, for the given project token. */
export function posthogCookieName(token: string | undefined): string {
  return `ph_${token}_posthog`;
}

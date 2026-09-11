import { cookies, headers } from "next/headers";
import { after } from "next/server";
import { PostHog } from "posthog-node";
import {
  posthogCookieName,
  sessionIdFromCookie,
} from "@/lib/posthog-session-cookie";

let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!,
      {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        flushAt: 1,
        flushInterval: 0,
      }
    );
  }
  return posthogClient;
}

/**
 * Browser session context for a server-side capture, read from the posthog-js
 * cookie (`ph_<token>_posthog` → `$sesid`) and the request's Referer.
 *
 * Server events that ship no `$session_id` cannot be joined to the session's
 * entry page, and a NULL never satisfies a JOIN — so every attribution query
 * silently *drops* them rather than mis-counting them. `review_submitted` read
 * 0 of 97 events for three months that way, which made pages look like they
 * converted nothing.
 *
 * Returns `{}` when posthog-js has not written its cookie yet (first paint,
 * cookies declined, or a bot): an absent property is correct, a fabricated
 * session id is not.
 */
async function browserSessionContext(): Promise<Record<string, string>> {
  try {
    const store = await cookies();
    const ctx: Record<string, string> = {};

    const sessionId = sessionIdFromCookie(
      store.get(
        posthogCookieName(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN)
      )?.value
    );
    if (sessionId) ctx.$session_id = sessionId;

    // The page that invoked the action — the closest server-side equivalent of
    // the client's `$current_url`.
    const referer = (await headers()).get("referer");
    if (referer) ctx.$current_url = referer;

    return ctx;
  } catch {
    /* Outside a request scope. Telemetry never throws at the caller. */
    return {};
  }
}

/**
 * Capture a server-side event WITH browser session context attached. Use this
 * instead of `getPostHogClient().capture()` in any server action or route
 * handler that runs inside a request — otherwise the event is unattributable
 * (see `browserSessionContext`).
 */
export function captureServerEvent(
  distinctId: string,
  event: string,
  properties: Record<string, unknown> = {}
): void {
  // Scheduled with `after`, not fire-and-forget: reading the cookie is async, so
  // an un-awaited call can still be suspended at that await when the action
  // returns — and the runtime is free to freeze the function there, dropping the
  // event. `after` keeps the work alive past the response instead.
  // `capture()` only enqueues, so flush() is what actually puts it on the wire.
  after(async () => {
    try {
      const client = getPostHogClient();
      client.capture({
        distinctId,
        event,
        properties: { ...(await browserSessionContext()), ...properties },
      });
      await client.flush();
    } catch (error) {
      // Telemetry never breaks the request it belongs to.
      console.error("PostHog capture failed:", error);
    }
  });
}

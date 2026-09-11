/**
 * Self-check for `sessionIdFromCookie` — the parse that decides whether a
 * server-side PostHog event is attributable at all. Run: npx tsx
 * scripts/check-posthog-session-cookie.ts
 */
import assert from "node:assert/strict";
import { sessionIdFromCookie } from "../src/lib/posthog-session-cookie";

const SID = "0198f2c1-1a2b-7000-9c3d-4e5f60718293";

// A real posthog-js cookie: URI-encoded JSON, $sesid = [activity, id, start].
const real = encodeURIComponent(
  JSON.stringify({
    distinct_id: "abc",
    $sesid: [1757000000000, SID, 1756999000000],
    $epp: true,
  })
);
assert.equal(sessionIdFromCookie(real), SID);

// The two-element legacy shape posthog-js still migrates from.
assert.equal(
  sessionIdFromCookie(
    encodeURIComponent(JSON.stringify({ $sesid: [1757000000000, SID] }))
  ),
  SID
);

// Everything unparseable or session-less must yield null, never a guess —
// a fabricated session id would silently mis-attribute the conversion.
for (const bad of [
  undefined,
  "",
  "not-json",
  encodeURIComponent(JSON.stringify({ distinct_id: "abc" })), // no $sesid yet
  encodeURIComponent(JSON.stringify({ $sesid: [1757000000000, null, 0] })),
  encodeURIComponent(JSON.stringify({ $sesid: "not-an-array" })),
  encodeURIComponent(JSON.stringify(null)),
]) {
  assert.equal(sessionIdFromCookie(bad), null, `expected null for ${bad}`);
}

console.log("posthog session cookie parse: ok");

/**
 * Self-check for cookie consent + UTM attribution — the two paths where a wrong
 * answer is a legal problem, not just a bug: a pre-v2 stored preference must
 * never read as marketing consent, and no attribution may be written without
 * analytics consent. Run: npx tsx scripts/check-consent-attribution.mts
 */
import assert from "node:assert/strict";

// Minimal browser shim: a real localStorage + a document.cookie jar that behaves
// like the browser's (last-write-wins per name, attributes stripped on read).
const store = new Map<string, string>();
const jar = new Map<string, string>();
(globalThis as any).window = globalThis;
(globalThis as any).location = { protocol: "http:" };
(globalThis as any).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
};
(globalThis as any).sessionStorage = { ...(globalThis as any).localStorage };
(globalThis as any).performance = { now: () => 0 };
(globalThis as any).document = {
  documentElement: { scrollTop: 0, scrollHeight: 1 },
  get cookie() {
    return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
  },
  set cookie(raw: string) {
    const [pair, ...attrs] = raw.split(";");
    const i = pair.indexOf("=");
    const name = pair.slice(0, i).trim();
    // A browser drops the cookie on max-age=0; model that, or an expiry reads
    // as an empty-but-present value and the revoke assertions below pass falsely.
    if (attrs.some((a) => a.trim().toLowerCase() === "max-age=0")) {
      jar.delete(name);
      return;
    }
    jar.set(name, pair.slice(i + 1));
  },
};
(globalThis as any).dispatchEvent = () => true;
(globalThis as any).Event = class {};

const { getStoredPreferences, savePreferences, STORAGE_KEY } =
  await import("../src/hooks/use-cookie-consent.ts");
const { storeAttributionData, getStoredAttribution } =
  await import("../src/lib/analytics/index.ts");
const { attributionSchema } =
  await import("../src/lib/validations/attribution.ts");

// --- consent: defaults ---
assert.deepEqual(getStoredPreferences(), {
  necessary: true,
  analytics: true,
  marketing: false,
});

// --- consent: a pre-v2 stored value never grants marketing, and keeps analytics ---
store.set(STORAGE_KEY, JSON.stringify({ necessary: true, marketing: true }));
assert.equal(
  getStoredPreferences().marketing,
  false,
  "pre-v2 marketing must not carry over"
);
assert.equal(
  getStoredPreferences().analytics,
  true,
  "pre-v2 marketing still answers analytics"
);

// A pre-v2 refusal expressed only through the old `marketing` flag is still a
// refusal. analytics/index.ts used to re-implement this check and got it wrong,
// writing an attribution cookie for a visitor who had declined.
store.set(STORAGE_KEY, JSON.stringify({ necessary: true, marketing: false }));
assert.equal(
  getStoredPreferences().analytics,
  false,
  "legacy marketing:false must read as an analytics refusal"
);
jar.clear();
storeAttributionData({ utm_source: "legacy-optout", utm_campaign: "nope" });
assert.equal(
  jar.get("icb_attribution"),
  undefined,
  "a legacy refusal must block the attribution cookie"
);

store.set(
  STORAGE_KEY,
  JSON.stringify({ necessary: true, analytics: false, marketing: true })
);
assert.equal(getStoredPreferences().marketing, false);
assert.equal(
  getStoredPreferences().analytics,
  false,
  "explicit analytics opt-out preserved"
);

// --- consent: v2 round-trips marketing ---
savePreferences({ necessary: true, analytics: true, marketing: true });
assert.deepEqual(getStoredPreferences(), {
  necessary: true,
  analytics: true,
  marketing: true,
});
assert.equal(
  JSON.parse(store.get(STORAGE_KEY)!).v,
  2,
  "savePreferences stamps the version"
);

// --- attribution: first touch wins, later touches only append ---
storeAttributionData({ utm_source: "newsletter", utm_campaign: "launch" });
let a = getStoredAttribution();
assert.equal(a.original_source, "newsletter");
assert.equal(a.touchpoints, 1);

storeAttributionData({ utm_source: "google-ads", utm_campaign: "later" });
a = getStoredAttribution();
assert.equal(
  a.original_source,
  "newsletter",
  "first touch must not be overwritten"
);
assert.equal(a.original_campaign, "launch");
assert.equal(a.touchpoints, 2, "later touches increment");

// --- attribution: survives a cookie round-trip through the raw jar (JSON is encoded) ---
assert.ok(
  !jar.get("icb_attribution")!.includes(","),
  "cookie value must be encoded"
);
assert.equal(
  JSON.parse(decodeURIComponent(jar.get("icb_attribution")!)).original_source,
  "newsletter"
);

// --- attribution: revoking consent clears attribution already on disk ---
// The cookie outlives the toggle by 90 days and is read server-side at signup,
// so revoking must delete it, not merely stop writing new ones.
assert.ok(
  jar.get("icb_attribution"),
  "precondition: a cookie exists to revoke"
);
savePreferences({ necessary: true, analytics: false, marketing: false });
assert.equal(
  jar.get("icb_attribution"),
  undefined,
  "revoking analytics consent must drop the existing attribution cookie"
);
assert.equal(getStoredAttribution().original_source, undefined);

// --- attribution: no analytics consent => nothing written ---
storeAttributionData({ utm_source: "blocked", utm_campaign: "nope" });
assert.equal(
  jar.get("icb_attribution"),
  undefined,
  "no cookie without analytics consent"
);

// --- attribution schema rejects a hand-edited cookie ---
savePreferences({ necessary: true, analytics: true, marketing: false });
storeAttributionData({ utm_source: "real", utm_campaign: "c" });
const good = JSON.parse(decodeURIComponent(jar.get("icb_attribution")!));
assert.equal(
  attributionSchema.safeParse(good).success,
  true,
  "real cookie validates"
);

for (const bad of [
  { ...good, touchpoints: -1 },
  { ...good, touchpoints: "many" },
  { ...good, original_source: "x".repeat(300) },
  { ...good, original_source: "" },
  { ...good, session_quality_score: 99 },
  { original_source: "only-a-source" },
  "not-an-object",
  null,
]) {
  assert.equal(
    attributionSchema.safeParse(bad).success,
    false,
    `expected rejection for ${JSON.stringify(bad)?.slice(0, 60)}`
  );
}
// Unknown keys are stripped, not persisted into the jsonb column.
assert.equal(
  "injected" in attributionSchema.parse({ ...good, injected: "payload" }),
  false,
  "unknown keys must be stripped"
);

console.log("consent + attribution: ok");

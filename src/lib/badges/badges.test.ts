import assert from "node:assert/strict";
import { test } from "node:test";
import {
  badgeDestinationPath,
  badgeEmbedHtml,
  badgeLead,
  combineRatings,
  escapeXml,
  isValidSlug,
  MIN_RATINGS_FOR_BADGE,
  parseBadgeParams,
  renderBadgeSvg,
  resolveBadgeType,
} from "./badges";

const thin = { ratingAvg: 4.9, ratingCount: MIN_RATINGS_FOR_BADGE - 1 };
const rated = { ratingAvg: 4.66, ratingCount: 42, coffeeCount: 18 };

test("rate badge shows the score only above the threshold", () => {
  assert.equal(badgeLead("coffee", "rate", thin), "Rate this coffee on");
  assert.equal(
    badgeLead("coffee", "rate", rated),
    "★ 4.7 · 42 ratings · Rate it on"
  );
  assert.equal(
    badgeLead("roaster", "rate", rated),
    "★ 4.7 · 42 ratings · Rate us on"
  );
});

test("count badge degrades to listed with no coffees", () => {
  assert.equal(
    resolveBadgeType("roaster", "count", { ratingAvg: null, ratingCount: 0 }),
    "listed"
  );
  assert.equal(badgeLead("roaster", "count", rated), "18 coffees listed on");
});

test("query params are enum-validated", () => {
  const p = parseBadgeParams(
    "coffee",
    new URLSearchParams("type=count&theme=<x>&size=huge&placement=footer")
  );
  assert.deepEqual(p, {
    type: "listed", // count is roaster-only
    theme: "light",
    size: "standard",
    placement: "footer",
  });
});

test("slugs reject path tricks", () => {
  assert.ok(isValidSlug("blue-tokai"));
  for (const bad of ["", "../x", "a/b", "//evil.com", "a b", "<x>"])
    assert.ok(!isValidSlug(bad), bad);
});

test("svg escapes and destinations stay on-site", () => {
  assert.equal(
    escapeXml(`<a href="x">&'`),
    "&lt;a href=&quot;x&quot;&gt;&amp;&#39;"
  );
  const svg = renderBadgeSvg({
    entity: "roaster",
    type: "rate",
    theme: "dark",
    size: "compact",
    data: rated,
  });
  assert.match(svg, /^<svg [^>]*width="196" height="40"/);
  assert.ok(!svg.includes("<script"));
  assert.equal(
    badgeDestinationPath(
      { entity: "coffee", roasterSlug: "araku", coffeeSlug: "signature" },
      "rate"
    ),
    "/roasters/araku/coffees/signature#rate-section"
  );
  const html = badgeEmbedHtml(
    "https://www.indiancoffeebeans.com",
    { entity: "roaster", roasterSlug: "araku" },
    { type: "rate", theme: "light", size: "standard", placement: "footer" }
  );
  assert.ok(
    html.includes(
      'href="https://www.indiancoffeebeans.com/go/roaster/araku?source=badge&amp;type=rate&amp;placement=footer"'
    )
  );
  assert.ok(!/nofollow|ugc|sponsored|<script|<iframe/.test(html));
});

test("roaster rating combines roaster and coffee ratings", () => {
  assert.deepEqual(
    combineRatings([
      { ratingAvg: 5, ratingCount: 2 },
      { ratingAvg: 4, ratingCount: 6 },
      { ratingAvg: null, ratingCount: 0 },
    ]),
    { ratingAvg: 4.25, ratingCount: 8 }
  );
  assert.deepEqual(combineRatings([{ ratingAvg: null, ratingCount: 0 }]), {
    ratingAvg: null,
    ratingCount: 0,
  });
});

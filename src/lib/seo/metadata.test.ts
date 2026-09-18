import assert from "node:assert/strict";
import { test } from "node:test";

import {
  TITLE_MAX_LENGTH,
  TITLE_TEMPLATE_SUFFIX,
  formatAltitudeLabel,
  fitTitle,
  truncateTitle,
} from "./metadata";

test("leaves a title that already fits untouched", () => {
  const title = "Arabica Coffee in India";
  assert.equal(truncateTitle(title), title);
});

test("never exceeds the budget once the suffix is appended", () => {
  const title = "Naivo Coffee — Bangalore Specialty Roastery";
  const out = truncateTitle(title);
  assert.ok(
    out.length + TITLE_TEMPLATE_SUFFIX.length <= TITLE_MAX_LENGTH,
    `${out.length + TITLE_TEMPLATE_SUFFIX.length} > ${TITLE_MAX_LENGTH}`
  );
});

test("cuts at a word boundary, not mid-word", () => {
  // The live regression: a raw index slice yielded "…Specialty Ro…".
  const out = truncateTitle("Naivo Coffee — Bangalore Specialty Roastery");
  assert.ok(!out.includes("Ro…"), out);
  assert.equal(out.endsWith("…"), true);
  const body = out.slice(0, -1);
  assert.equal(body, body.trimEnd());
  // Every word kept must be a whole word from the input.
  const words = new Set(
    "Naivo Coffee — Bangalore Specialty Roastery".split(" ")
  );
  for (const w of body.split(" "))
    assert.ok(words.has(w), `partial word: ${w}`);
});

test("does not leave dangling punctuation before the ellipsis", () => {
  const out = truncateTitle(
    "Coorg vs Chikmagalur vs Araku: Flavor Differences Explained"
  );
  assert.ok(!/[\s–—:,|-]…$/.test(out), out);
});

test("an empty suffix spends the whole budget (title.absolute routes)", () => {
  const title = "Honey Process Coffee in India: Yellow, Red & Black Honey";
  assert.equal(truncateTitle(title, TITLE_MAX_LENGTH, ""), title);
  assert.ok(truncateTitle(title).length < title.length);
});

test("falls back to a hard cut rather than gutting the title", () => {
  // One very long word: no usable word boundary past the halfway mark.
  const out = truncateTitle("Supercalifragilisticexpialidocious".repeat(2));
  assert.ok(out.length + TITLE_TEMPLATE_SUFFIX.length <= TITLE_MAX_LENGTH, out);
  assert.ok(out.length > 1, out);
});

test("altitude: an estate with no altitude yields null, not an empty string", () => {
  // Must be null so `.filter(Boolean)` drops it and the meta line has no
  // dangling " · " separator — the reason the helper does not return "".
  assert.equal(formatAltitudeLabel(null, null), null);
  assert.equal(formatAltitudeLabel(undefined, undefined), null);
});

test("altitude: renders a range when the bounds differ", () => {
  assert.equal(formatAltitudeLabel(950, 1000), "950–1,000 m");
});

test("altitude: collapses to a single value when only one bound is known", () => {
  assert.equal(formatAltitudeLabel(1500, null), "1,500 m");
  assert.equal(formatAltitudeLabel(null, 1400), "1,400 m");
  assert.equal(formatAltitudeLabel(1200, 1200), "1,200 m");
});

test("altitude: normalizes inverted bounds rather than emitting a backwards range", () => {
  assert.equal(formatAltitudeLabel(1000, 950), "950–1,000 m");
});

test("fitTitle keeps the richest candidate that fits", () => {
  const out = fitTitle([
    "Naivo Coffee — Bangalore Specialty Roastery",
    "Naivo Coffee — Bangalore Roastery",
    "Naivo Coffee — Bangalore",
    "Naivo Coffee",
  ]);
  assert.equal(out, "Naivo Coffee — Bangalore Roastery");
  assert.ok(out.length + TITLE_TEMPLATE_SUFFIX.length <= TITLE_MAX_LENGTH);
});

test("fitTitle never ellipses a brand name that fits on its own", () => {
  // The live regression: "KCRoasters - By Koinonia — Mumbai… | Indian Coffee Beans".
  const name = "KCRoasters - By Koinonia";
  const out = fitTitle([
    `${name} — Mumbai Specialty Roastery`,
    `${name} — Mumbai Roastery`,
    `${name} — Mumbai`,
    name,
  ]);
  assert.ok(!out.includes("…"), out);
  assert.ok(out.startsWith(name), out);
  assert.ok(out.length + TITLE_TEMPLATE_SUFFIX.length <= TITLE_MAX_LENGTH);
});

test("fitTitle falls back to truncating when even the barest candidate is too long", () => {
  const huge = "A".repeat(80);
  const out = fitTitle([huge]);
  assert.ok(out.endsWith("…"), out);
  assert.ok(out.length + TITLE_TEMPLATE_SUFFIX.length <= TITLE_MAX_LENGTH);
});

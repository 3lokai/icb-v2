import assert from "node:assert/strict";
import { test } from "node:test";

import {
  TITLE_MAX_LENGTH,
  TITLE_TEMPLATE_SUFFIX,
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

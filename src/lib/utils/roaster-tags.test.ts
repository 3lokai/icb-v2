import assert from "node:assert/strict";
import { test } from "node:test";

import { labelForTag } from "./roaster-tags";

test("maps enum-backed tags to their canonical labels", () => {
  assert.equal(labelForTag("roast:medium_dark"), "Medium Dark roast");
  assert.equal(labelForTag("roast:light"), "Light roast");
  assert.equal(
    labelForTag("process:carbonic_maceration"),
    "Carbonic Maceration"
  );
  assert.equal(labelForTag("process:washed"), "Washed");
  assert.equal(
    labelForTag("species:arabica_80_robusta_20"),
    "80% Arabica, 20% Robusta"
  );
});

test("title-cases tags with no enum table", () => {
  assert.equal(labelForTag("sourcing:direct-trade"), "Direct Trade");
  assert.equal(labelForTag("focus:espresso-focused"), "Espresso Focused");
  assert.equal(labelForTag("species:arabica"), "Arabica");
  assert.equal(labelForTag("cert:Fair Trade"), "Fair Trade");
});

test("leaves variety codes intact", () => {
  assert.equal(labelForTag("variety:SLN 9"), "SLN 9");
  assert.equal(labelForTag("variety:SLN 795"), "SLN 795");
});

test("falls back on unknown enum values rather than dropping them", () => {
  // A new roast_level/process enum value must still render, not vanish.
  assert.equal(labelForTag("roast:extra_dark"), "Extra Dark roast");
  assert.equal(labelForTag("process:sun_dried"), "Sun Dried");
  assert.equal(labelForTag("species:stenophylla"), "Stenophylla");
});

test("survives a tag with no prefix", () => {
  assert.equal(labelForTag("micro-lot"), "Micro Lot");
});

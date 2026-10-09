// node --import tsx --test scripts/gear-match.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";

import { brewMethodPages } from "../src/lib/discovery/landing-pages/brew-method-pages";

import { GEAR_SEED } from "./gear-catalog.data";
import { matchName } from "./gear-match";

const slugOf = (name: string) => {
  const m = matchName(name, GEAR_SEED);
  return m.kind === "match" ? m.slug : m.kind;
};

test("most specific alias wins", () => {
  assert.equal(slugOf("AeroPress Coffee Maker - Go"), "aeropress-go");
  assert.equal(
    slugOf("Aeropress GO plus travel coffee press- Cream"),
    "aeropress-go-plus"
  );
  assert.equal(slugOf("AEROPRESS COFFEE MAKER CLEAR"), "aeropress-clear");
  assert.equal(slugOf("New Aeropress Coffee Maker"), "aeropress-original");
  assert.equal(slugOf("AeroPress Metal Filter"), "aeropress-metal-filter");
  assert.equal(
    slugOf("Aeropress Paper Filters &#8211; 350 Per Pack"),
    "aeropress-paper-filters"
  );
  assert.equal(slugOf("Origami dripper AIR (Small, Black)"), "origami-air-s");
  assert.equal(
    slugOf("Chemex Glass Handle Six Cups"),
    "chemex-glass-handle-6-cup"
  );
  assert.equal(
    slugOf("Timemore Fish Smart Pro Electric Pour‑Over Kettle – 900 ml"),
    "timemore-fish-smart-pro-kettle"
  );
});

test("only words before 'for' count", () => {
  assert.equal(
    slugOf("Hario Drip Scale for Espresso and Manual Brewing"),
    "hario-v60-drip-scale"
  );
  assert.equal(slugOf("Pour Over Filter Papers for V60 Type Brewers"), "none");
});

test("filters are their own products", () => {
  assert.equal(
    slugOf("CAFEC Medium-Dark Roast Coffee Paper Filter"),
    "cafec-medium-dark-roast-filters"
  );
  assert.equal(
    slugOf("CAFEC Dark Roast Coffee Paper Filter"),
    "cafec-dark-roast-filters"
  );
  assert.equal(slugOf("Timemore B75 Filter Paper"), "timemore-b75-filters");
  assert.equal(
    slugOf("Timemore Paper Filter V02 100 Pieces"),
    "timemore-paper-filters"
  );
  assert.equal(
    slugOf("Hario V60 Paper Filters - Size 03 Brown"),
    "hario-v60-paper-filters"
  );
});

test("normalizes store-feed noise", () => {
  assert.equal(slugOf("Hario V 60 Filter Paper"), "hario-v60-paper-filters");
  assert.equal(
    slugOf("[PRE ORDER] 1Zpresso K-Ultra Manual Coffee Grinder"),
    "1zpresso-k-ultra"
  );
  assert.equal(slugOf("Kalita Filters #155"), "kalita-wave-filters");
});

test("bundles, merch, third-party and clones are not matched", () => {
  assert.equal(
    slugOf("Hario V60-02 Ceramic Coffee Dripper Set, White"),
    "stopword"
  );
  assert.equal(slugOf("Cloth Filters for AeroPress"), "none");
  assert.equal(
    slugOf("Brewed Under Pressure Tee — AeroPress Edition"),
    "stopword"
  );
  assert.equal(slugOf("Espressa ABS Aeropress"), "stopword");
  assert.equal(slugOf("Bincoo V60 Ceramic Coffee Dripper"), "stopword");
});

test("replacement parts are not matched to the product they fit", () => {
  assert.equal(slugOf("AeroPress Go Replacement Cap"), "stopword");
  assert.equal(slugOf("AeroPress Plunger Seal"), "stopword");
  assert.equal(slugOf("AeroPress Spare Gasket"), "stopword");
});

test("listings without enough detail are left for review", () => {
  assert.equal(slugOf("Hario V60 Dripper"), "none"); // material unknown
  assert.equal(slugOf("Chemex Coffee Maker"), "none"); // size unknown
  assert.equal(slugOf("Comandante C40 MK3 Nitro Blade"), "none"); // not the seeded MK4
});

test("seed data is internally consistent", () => {
  const slugs = GEAR_SEED.map((g) => g.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  const brewSlugs = new Set(brewMethodPages.map((p) => p.slug));
  for (const g of GEAR_SEED) {
    assert.match(g.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    for (const m of g.brew_methods)
      assert.ok(brewSlugs.has(m), `${g.slug}: unknown brew method ${m}`);
  }
});

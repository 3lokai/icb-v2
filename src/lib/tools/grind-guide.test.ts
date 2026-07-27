import assert from "node:assert/strict";
import { test } from "node:test";

import {
  BREW_METHODS,
  GRINDERS,
  type Grinder,
  formatSetting,
  getBrewMethod,
  getGrinder,
  micronForSetting,
  publishedRangeForMethod,
  settingPositionForMicron,
  settingRangeForMethod,
} from "./grind-guide";

const withRanges = GRINDERS.filter((g) => g.brewRanges?.length);

test("every grinder key is unique", () => {
  const keys = GRINDERS.map((g) => g.key);
  assert.equal(new Set(keys).size, keys.length);
});

test("published ranges are structurally sound", () => {
  for (const g of GRINDERS) {
    for (const r of g.brewRanges ?? []) {
      const where = `${g.key}/${r.method}`;
      assert.ok(getBrewMethod(r.method), `${where}: unknown brew method`);
      assert.ok(r.settingMin <= r.settingMax, `${where}: min > max`);
      assert.ok(
        r.settingMin >= g.settingMin && r.settingMax <= g.settingMax,
        `${where}: ${r.settingMin}–${r.settingMax} outside grinder scale ${g.settingMin}–${g.settingMax}`
      );
    }

    const pairs = (g.brewRanges ?? []).map((r) => `${r.method}:${r.source}`);
    assert.equal(new Set(pairs).size, pairs.length, `${g.key}: duplicate rows`);

    if (g.brewRanges?.length) {
      assert.ok(g.sources?.length, `${g.key}: has ranges but no sources`);
      assert.ok(g.confidence, `${g.key}: has ranges but no confidence`);
    }
  }
});

test("manufacturer adjustment specs are cited and internally consistent", () => {
  const manufacturerHost =
    /^https:\/\/(www\.)?(1zpresso\.coffee|kingrinder\.com|baratza\.com|timemore\.com|comandantegrinder\.com)\//;

  for (const g of GRINDERS) {
    const a = g.adjustment;
    if (!a) continue;

    // The block exists only for manufacturer-published figures.
    assert.match(
      a.source,
      manufacturerHost,
      `${g.key}: adjustment.source is not a manufacturer URL`
    );
    assert.ok(
      g.sources?.includes(a.source),
      `${g.key}: adjustment.source missing from sources[]`
    );

    // Where the manufacturer states a scale, it must match the one we render.
    if (a.stepsPerRotation !== undefined && g.perRotation !== undefined) {
      assert.equal(
        a.stepsPerRotation,
        g.perRotation,
        `${g.key}: manufacturer says ${a.stepsPerRotation} steps/rotation, display uses ${g.perRotation}`
      );
    }
    if (a.stepsPerNumber !== undefined && g.perNumber !== undefined) {
      assert.equal(a.stepsPerNumber, g.perNumber, `${g.key}: steps/number`);
    }
    if (a.rpm) {
      assert.equal(
        a.rpm.type === "manual",
        g.driveType === "manual",
        `${g.key}: rpm.type contradicts driveType`
      );
    }
  }
});

test("calibration families share one setting scale and one map", () => {
  const families = new Map<string, Grinder[]>();
  for (const g of GRINDERS) {
    if (!g.calibrationFamily) continue;
    const members = families.get(g.calibrationFamily) ?? [];
    members.push(g);
    families.set(g.calibrationFamily, members);
  }

  assert.ok(families.size > 0, "no calibration families declared");

  for (const [family, members] of families) {
    assert.ok(members.length > 1, `${family}: a family of one is not a family`);

    const [head, ...rest] = members;
    const scale = (g: Grinder) =>
      [g.settingMin, g.settingMax, g.micronMin, g.micronMax, g.style].join("/");
    // Compare the map by (method, settings) — sources legitimately differ.
    const map = (g: Grinder) =>
      (g.brewRanges ?? [])
        .map((r) => `${r.method}:${r.settingMin}-${r.settingMax}`)
        .sort()
        .join(",");

    for (const g of rest) {
      assert.equal(scale(g), scale(head), `${family}: ${g.key} scale differs`);
      assert.equal(map(g), map(head), `${family}: ${g.key} map differs`);
    }
  }
});

// The acceptance gate. Each published range implies a micron span under the
// grinder's own linear model; that span must at least touch the brew method's
// canonical band. A scraped row that lands in the wrong neighbourhood entirely
// means either the row or the grinder's micron span is wrong.
test("published ranges overlap their brew method's micron band", () => {
  for (const g of withRanges) {
    for (const r of g.brewRanges ?? []) {
      const m = getBrewMethod(r.method)!;
      const lo = micronForSetting(g, r.settingMin);
      const hi = micronForSetting(g, r.settingMax);
      assert.ok(
        lo <= m.micronMax && hi >= m.micronMin,
        `${g.key}/${r.method}: settings ${r.settingMin}–${r.settingMax} ⇒ ${Math.round(lo)}–${Math.round(hi)}µm, ` +
          `outside the ${m.micronMin}–${m.micronMax}µm ${m.name} band`
      );
    }
  }
});

test("settingRangeForMethod prefers a published range over interpolation", () => {
  const c2 = getGrinder("timemore-c2")!;
  const v60 = getBrewMethod("v60")!;
  const res = settingRangeForMethod(c2, v60);

  assert.equal(res.source, "honest-coffee-guide");
  assert.equal(res.rangeLabel, "13–22 clicks");
  assert.equal(res.outOfRange, false);
  assert.equal(res.partial, false);
  assert.match(res.sourceUrl ?? "", /honestcoffeeguide\.com/);
});

test("manufacturer data wins over honest-coffee-guide", () => {
  const base = getGrinder("timemore-c2")!;
  const g: Grinder = {
    ...base,
    brewRanges: [
      ...(base.brewRanges ?? []),
      {
        method: "v60",
        settingMin: 14,
        settingMax: 19,
        source: "manufacturer",
        url: "https://example.test/spec",
      },
    ],
  };

  const res = settingRangeForMethod(g, getBrewMethod("v60")!);
  assert.equal(res.source, "manufacturer");
  assert.equal(res.rangeLabel, "14–19 clicks");
  assert.equal(publishedRangeForMethod(g, "v60")?.settingMin, 14);

  // And in the real dataset: Baratza's own espresso band (1–20) must beat
  // HCG's (0–13) for the Encore ESP.
  const esp = getGrinder("baratza-encore-esp")!;
  const espResult = settingRangeForMethod(esp, getBrewMethod("espresso")!);
  assert.equal(espResult.source, "manufacturer");
  assert.equal(espResult.rangeLabel, "1 – 20");
  assert.match(espResult.sourceUrl ?? "", /baratza\.com/);
});

test("falls back to interpolation when a method has no published range", () => {
  const generic = getGrinder("generic")!;
  const v60 = getBrewMethod("v60")!;
  const res = settingRangeForMethod(generic, v60);

  // generic: settings 1–40 over 0–1400µm ⇒ 1 + (µ/1400)*39.
  assert.equal(res.source, "estimated");
  assert.equal(res.minLabel, "12"); // 400µm → 12.14 → 12
  assert.equal(res.maxLabel, "20.5"); // 700µm → 20.5
  assert.equal(res.outOfRange, false);
  assert.equal(res.partial, false);
});

test("interpolation flags unreachable and partially reachable bands", () => {
  const skerton = getGrinder("hario-skerton-pro")!; // 350–1400µm, no turkish row
  const turkish = getBrewMethod("turkish")!; // 40–220µm

  const res = settingRangeForMethod(skerton, turkish);
  assert.equal(res.source, "estimated");
  assert.equal(res.outOfRange, true);

  // Espresso (180–380µm) only partly overlaps 350–1400µm — but it has a
  // published row, so build a copy without one to exercise the partial flag.
  const stripped: Grinder = { ...skerton, brewRanges: [] };
  const partial = settingRangeForMethod(stripped, getBrewMethod("espresso")!);
  assert.equal(partial.partial, true);
  assert.equal(partial.outOfRange, false);
});

test("micronForSetting and settingPositionForMicron round-trip", () => {
  for (const g of GRINDERS) {
    for (let i = 0; i <= 10; i++) {
      const s = g.settingMin + ((g.settingMax - g.settingMin) * i) / 10;
      const back = settingPositionForMicron(g, micronForSetting(g, s));
      assert.ok(
        Math.abs(back - s) < 1e-9,
        `${g.key}: ${s} → ${micronForSetting(g, s)}µm → ${back}`
      );
    }
  }
});

test("micronForSetting clamps outside the grinder's scale", () => {
  const c2 = getGrinder("timemore-c2")!;
  assert.equal(micronForSetting(c2, -50), c2.micronMin);
  assert.equal(micronForSetting(c2, 9999), c2.micronMax);
  assert.equal(settingPositionForMicron(c2, -50), c2.settingMin);
  assert.equal(settingPositionForMicron(c2, 9999), c2.settingMax);
});

test("formatSetting renders each native notation", () => {
  const k6 = getGrinder("kingrinder-k6")!; // compound, 60 clicks/rotation
  assert.equal(formatSetting(k6, 5), "0.05"); // zero-padded, not "0.5"
  assert.equal(formatSetting(k6, 162), "2.42");

  const jx = getGrinder("1zpresso-jx")!; // triple, 30 ticks/rot, 3 per number
  assert.equal(formatSetting(jx, 45), "1.5.0");
  assert.equal(formatSetting(jx, 77), "2.5.2");

  const jmax = getGrinder("1zpresso-jmax")!; // triple, 90 ticks/rot, 10 per number
  assert.equal(formatSetting(jmax, 261), "2.8.1");
  assert.equal(formatSetting(jmax, 450), "5.0.0");

  const sculptor = getGrinder("timemore-078")!; // numbered, half steps
  assert.equal(formatSetting(sculptor, 6.5), "6.5");
  assert.equal(formatSetting(sculptor, 18), "18");

  const c2 = getGrinder("timemore-c2")!;
  assert.equal(formatSetting(c2, 13), "13 clicks");
});

test("every brew method resolves for every grinder without throwing", () => {
  for (const g of GRINDERS) {
    for (const m of BREW_METHODS) {
      const res = settingRangeForMethod(g, m);
      assert.ok(res.rangeLabel.length > 0, `${g.key}/${m.key}: empty label`);
    }
  }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { processMixSentence } from "./process-mix";

test("leads with the largest process and lists the rest by size", () => {
  assert.equal(
    processMixSentence("Koraput", 30, {
      washed: 12,
      natural: 5,
      honey: 3,
      anaerobic: 4,
    }),
    "On ICB, 12 of the 30 in-stock Koraput lots are washed, with 5 natural, 4 anaerobic and 3 honey."
  );
});

test("drops zero counts and handles a single trailing process", () => {
  assert.equal(
    processMixSentence("Coorg", 10, {
      washed: 0,
      natural: 6,
      honey: 2,
      anaerobic: 0,
    }),
    "On ICB, 6 of the 10 in-stock Coorg lots are natural, with 2 honey."
  );
});

test("stays silent on thin or unlabelled samples", () => {
  const none = { washed: 0, natural: 0, honey: 0, anaerobic: 0 };
  assert.equal(processMixSentence("X", 3, { ...none, washed: 3 }), undefined);
  assert.equal(processMixSentence("X", 40, none), undefined);
});

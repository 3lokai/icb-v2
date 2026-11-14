import assert from "node:assert/strict";
import { test } from "node:test";
import { nextRatingFocus } from "./rating-keyboard";

test("arrow keys move star focus without submitting or wrapping", () => {
  assert.equal(nextRatingFocus("ArrowRight", 2), 3);
  assert.equal(nextRatingFocus("ArrowUp", 5), 5);
  assert.equal(nextRatingFocus("ArrowLeft", 1), 1);
  assert.equal(nextRatingFocus("ArrowDown", 4), 3);
});

test("Home and End jump to the first and last action", () => {
  assert.equal(nextRatingFocus("Home", 4), 1);
  assert.equal(nextRatingFocus("End", 2), 5);
});

test("Enter, Space, Tab and unrelated keys leave activation to native button behavior", () => {
  for (const key of ["Enter", " ", "Tab", "Escape", "x"]) {
    assert.equal(nextRatingFocus(key, 3), null);
  }
});

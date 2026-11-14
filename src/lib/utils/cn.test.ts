import assert from "node:assert/strict";
import { test } from "node:test";
import { cn } from "../utils";

test("cn keeps a type role when a text colour follows", () => {
  assert.equal(
    cn("text-ui-label", "text-foreground"),
    "text-ui-label text-foreground"
  );
  assert.equal(
    cn("text-foreground", "text-caption"),
    "text-foreground text-caption"
  );
});

test("cn lets a later type role replace an earlier one", () => {
  assert.equal(cn("text-caption", "text-body"), "text-body");
});

test("cn still merges real text colours and sizes", () => {
  assert.equal(cn("text-foreground", "text-accent"), "text-accent");
  assert.equal(cn("text-sm", "text-base"), "text-base");
});

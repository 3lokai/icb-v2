import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const css = readFileSync(
  new URL("../../app/styles/typography.css", import.meta.url),
  "utf8"
);

test("typography roles are layered so explicit Tailwind utilities can override them", () => {
  const layerStart = css.indexOf("@layer components {");
  assert.ok(layerStart >= 0, "the stylesheet must contain a components layer");
  const roleStart = css.indexOf(".text-hero {");
  assert.ok(roleStart > layerStart, "role styles must be inside the component layer");
  assert.ok(
    css.trimEnd().endsWith("}"),
    "the component layer must close after the role declarations"
  );
  for (const selector of [
    ".text-caption {",
    ".text-label {",
    ".text-ui-label {",
    ".text-ui-meta {",
    ".text-copy-compact {",
  ]) {
    assert.ok(css.includes(selector), `missing role ${selector}`);
  }
});

test("approved compact metadata and label sizes are preserved", () => {
  assert.match(css, /\.text-ui-label\s*\{[^}]*text-sm leading-5/s);
  assert.match(css, /\.text-ui-meta\s*\{[^}]*0\.8125rem/s);
  assert.match(css, /\.text-copy-compact\s*\{[^}]*0\.875rem/s);
});

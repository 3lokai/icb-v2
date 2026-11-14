import assert from "node:assert/strict";
import { test } from "node:test";
import { getAllLandingPageSlugs } from "../discovery/landing-pages";
import { FOOTER_NAV, HEADER_NAV } from "./index";

test("every /coffees/<slug> nav link points at a real landing page", () => {
  const slugs = new Set(getAllLandingPageSlugs());
  const links = [
    ...HEADER_NAV.flatMap((item) => item.groups ?? []),
    ...FOOTER_NAV,
  ].flatMap((group) => group.items.map((item) => item.link));
  const landing = links.filter((link) => /^\/coffees\/[^?]/.test(link));

  assert.ok(landing.length > 0);
  for (const link of landing) {
    assert.ok(slugs.has(link.slice("/coffees/".length)), `no page: ${link}`);
  }
});

# Refactor: seo/schema.ts

**Goal:** edit safety. **Type:** refactor, behavior-preserving. **Risk:** medium
— fan-in 27 means many callers depend on its exact output; SEO regressions are
silent (you won't see them until crawlers do).

## Why

`src/lib/seo/schema.ts` — **676 LOC**, `generateSchemaOrg` cognitive **53**,
**fan-in 27** (27 modules import from it). One big function that branches per
schema type (Product, Organization, BreadcrumbList, FAQPage, Article, etc.) to
emit JSON-LD. Hard to edit without reading all 676 lines, and a wrong edit
silently breaks structured data for whichever entity types you didn't test.

## What it does (context)

Produces JSON-LD structured data objects injected into pages (paired with
`src/components/seo/StructuredData.tsx` and metadata from
`src/lib/seo/metadata.ts`). Consumed by coffee detail, roaster detail, blog
articles, FAQ sections, breadcrumbs, insights, etc.

## Suggested split (per schema type)

The seams are clean here — it's a dispatcher over schema types:

- One builder function per schema type: `buildProductSchema`,
  `buildOrganizationSchema`, `buildBreadcrumbSchema`, `buildFAQSchema`,
  `buildArticleSchema`, … each pure `(input) → object`.
- `generateSchemaOrg` becomes a thin dispatcher that calls the right builder.
- Keep the **public export surface identical** — 27 callers import specific
  names; do not rename or change signatures. This is an internal split behind a
  stable API, nothing more.

Because fan-in is high, the safe move is: extract builders **into the same file
first** (or a co-located `schema/` folder with a barrel that re-exports the exact
same names), so no import site changes. Only after type-check is green should you
consider moving files.

## Verify

- `npm run type-check && npm run lint` (catches signature drift across all 27
  callers).
- **Snapshot the JSON-LD before and after.** In `npm run dev`, view-source (or
  the `StructuredData` output) on: a coffee detail page, a roaster detail page, a
  blog article, a page with an FAQ, and any breadcrumb. Diff the emitted JSON-LD
  strings — they must be byte-identical (modulo key order if you can't help it).
  A quick way: `curl` the route, grep `application/ld+json`, `python -m json.tool`
  both sides, diff.
- Optionally validate a sample against Google's Rich Results test.

## Do not

- Change any exported name or signature (silent break across 27 files).
- "Improve" the schema shape while refactoring — behavior-preserving only. Schema
  content changes are a separate, deliberate SEO task.

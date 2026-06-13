# Product

## Register

brand

> Editorial-first is the default lens: the discovery and reading experience leads, and product
> surfaces (directory filters, dashboard, tools) inherit the same magazine voice rather than
> reverting to utility-grade chrome. Register can be overridden per task — when working purely on
> dense product UI (filter panels, dashboard tables, form-heavy flows), treat that surface as
> `product` and optimize for the task — but the brand voice still frames it.

## Users

People exploring Indian specialty coffee — from curious newcomers who don't yet know the
vocabulary to enthusiasts comparing roasters, origins, and processes. They arrive in a browsing,
discovery-driven mindset (often from search or social), usually on mobile or a relaxed desktop
session, not under time pressure. Their job-to-be-done splits two ways and the design must serve
both equally:

- **Discover & trust** — find the right coffee or roaster and feel confident enough to buy from the
  roaster's own site (ICB converts outward, it does not sell).
- **Learn & build taste** — turn curiosity into knowledge through the `/learn` field guide,
  glossary, and interactive tools (calculator, flavor compass, expert recipes), and come back as
  they go deeper.

Secondary: roasters who want to be listed well, and signed-in members managing reviews, preferences,
and curations in the dashboard.

## Product Purpose

The Indian Coffee Beans Directory is the reference platform for discovering Indian specialty coffee
— a curated, filterable directory of coffees and roasters wrapped in an editorial layer (Sanity-
backed blog/learn, glossary, community, curations) and interactive tools. It exists because Indian
specialty coffee lacked a single trustworthy, opinionated home that treats it with magazine-grade
care. Success looks like: a visitor finds a coffee they trust and clicks through to the roaster, or
leaves knowing more than they arrived — and returns because the place earned their attention.

## Brand Personality

**Refined, confident, editorial.** Magazine-grade polish with a clear point of view — a taste-maker
that has done the work and isn't hedging. The voice is design-led and self-assured without being
loud: quiet authority, not salesmanship. Warm (it is coffee, and Indian coffee specifically), never
cold or transactional; knowledgeable, never snobbish or gatekeeping. Emotional goal: the reader
feels they're in expert hands and that this corner of coffee is being taken seriously.

Carried visually by the established system — Fraunces display serif + DM Sans, a warm OKLCH palette
(cream ground, coffee-brown primary, terracotta accent), coffee-tinted shadows, fine film-grain
texture, and the locked `<Accent>` brush-smear as the single brand signature.

## Anti-references

- **Generic SaaS / startup marketing.** No hero-metric template (big number + label + gradient), no
  identical icon-heading-text card grids repeated endlessly, no eyebrow above every section, no
  gradient accents. (This is an active cleanup target — see `frontend-update/`.)
- **Hipster / third-wave coffee cliché.** No kraft-paper, chalkboard, faux-rustic stamp aesthetic,
  and no "coffee snob" gatekeeping tone. Approachable expertise, not exclusivity.
- **Cold marketplace / Amazon.** Not a transactional, price-first, dense-product-grid e-commerce
  feel with no editorial point of view. ICB has opinions; a marketplace doesn't.
- **Corporate / sterile.** No flat gray soulless enterprise UI. Warmth and personality are
  non-negotiable, including on product surfaces.

## Design Principles

1. **Editorial over templated.** Vary section rhythm and layout family; a page should read like a
   designed spread, not a stack of interchangeable card grids. Converge on the primitive layer
   (`Section`, `PageShell`, `Stack`, `Prose`) rather than inlining bespoke headers and decoration.
2. **Quiet authority.** Confidence comes from typography, spacing, and restraint — not from louder
   color, bigger numbers, or more decoration. One accent, one radius, one theme per page.
3. **Preserve the brand, elevate the craft.** Fraunces + DM Sans, the warm OKLCH palette, coffee-
   tinted shadows, and the `<Accent>` brush-smear are the committed identity. Improvements raise
   execution; they do not rebrand. (Fraunces is kept deliberately despite generic-default flags.)
4. **Approachable expertise.** Serve the newcomer and the enthusiast in the same surface — never
   gatekeep with jargon; let the glossary and learn layer carry depth so the directory stays
   welcoming.
5. **Discovery and education are co-equal.** The directory and the field guide reinforce each other;
   neither is decoration for the other. Design both to the same standard.

## Accessibility & Inclusion

Committed to **WCAG 2.1 AA.** Body text meets ≥4.5:1 contrast and large text ≥3:1 against its
background in both light and dark themes (the tokens already encode contrast-tuned primary, accent,
and muted-foreground values). Full keyboard navigation and visible focus rings. Every animation has
a `prefers-reduced-motion: reduce` alternative that collapses to static or a crossfade (including
the film-grain overlay and theme-toggle view transition). Semantic heading hierarchy is enforced
(h1→h4 contract in `typography.css`); no skipped levels. Dark and light modes are both first-class
and must be walked for every change.

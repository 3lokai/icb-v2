# IndianCoffeeBeans Roaster & Coffee Badge System

## 1. Objective

Build a lightweight badge and media-kit system that lets coffee roasters showcase their presence on IndianCoffeeBeans directly on their own websites.

The system should support both:

- **Roaster-level badges**
- **Individual coffee/SKU-level badges**

The core value exchange is:

**Roaster website → ICB discovery / ratings / independent coffee information → ICB sends purchase traffic back to the roaster**

This should work with Shopify, WooCommerce, Webflow, and regular HTML sites without requiring an app, plugin, JavaScript widget, or iframe.

---

# 2. Goals

The system should help ICB:

- acquire relevant backlinks from official roaster domains
- increase traffic to roaster and coffee pages
- increase coffee ratings/reviews
- strengthen individual coffee pages in search
- build recognition for ICB ratings as independent social proof
- deepen relationships with roasters
- create measurable partner engagement
- make roaster outreach materially more valuable

For roasters, the system should provide:

- independent rating/social-proof badges
- a way to collect more coffee ratings
- easy links to structured coffee information
- a third-party discovery presence
- direct purchase links from ICB back to their store
- zero-maintenance dynamic badges

---

# 3. Core Principle

Installation must be extremely simple.

A roaster should ideally:

1. open their ICB media-kit page
2. choose a badge
3. copy one HTML snippet
4. paste it into Shopify/WooCommerce
5. be done

No JavaScript bundle.

No Shopify app.

No WooCommerce plugin.

No iframe.

The embed should essentially be:

**HTML link + hosted SVG image**

---

# 4. Entity Types

The system supports two badge scopes.

## A. Roaster

Existing ICB roaster entity.

Conceptual route:

`/roasters/[slug]`

## B. Coffee

Existing ICB coffee entity.

Current route format:

`/roasters/[slug]/coffees/[coffeeSlug]`

Coffee pages should be treated as first-class badge destinations.

The ICB coffee record should remain the canonical entity.

Do not rely exclusively on matching product names or slugs forever.

Where available, retain associations such as:

- ICB coffee ID
- ICB coffee slug
- roaster ID
- original product name
- source product URL
- source platform
- Shopify product handle if available
- WooCommerce product slug/ID if available
- active/discontinued status

This allows badges to remain stable even if a roaster later renames a product.

---

# 5. Roaster-Level Badges

## 5.1 Listed badge

Text:

**Listed on IndianCoffeeBeans**

Destination:

Roaster ICB profile.

---

## 5.2 Rate badge

Text:

**Rate us on IndianCoffeeBeans**

Destination:

Roaster rating/review experience.

If an appropriate deep-link mechanism exists, use it.

---

## 5.3 Explore badge

Text:

**Explore our coffees on IndianCoffeeBeans**

Destination:

Roaster catalog/profile.

---

## 5.4 Dynamic rating badge

Example:

**★ 4.7 on IndianCoffeeBeans · 42 ratings**

Use actual rating data.

Do not show if insufficient rating data exists.

Do not fabricate or extrapolate ratings.

---

## 5.5 Catalog badge

Example:

**18 coffees listed on IndianCoffeeBeans**

Use the current count of active/listed coffees.

---

# 6. Coffee-Level / SKU-Level Badges

Coffee-level badges are a core part of the product.

Each ICB coffee page should be able to generate its own badge/embed.

Example destination:

`/roasters/araku/coffees/signature-natural`

## 6.1 Coffee listing badge

Text:

**View this coffee on IndianCoffeeBeans**

or:

**Listed on IndianCoffeeBeans**

Destination:

Specific coffee page.

---

## 6.2 Coffee rating CTA

Text:

**Rate this coffee on IndianCoffeeBeans**

Destination:

Specific coffee page, preferably deep-linked to its rating UI.

This is particularly important for coffees with low/no rating volume.

---

## 6.3 Dynamic coffee rating badge

Example:

**★ 4.8 · 26 ratings on ICB**

Use the individual coffee's rating data.

Only show if enough rating data exists to make the badge useful.

---

## 6.4 Coffee discovery badge

Text:

**Explore tasting notes on ICB**

Destination:

Specific coffee page.

This can later evolve into richer discovery experiences.

---

## 6.5 Coffee metadata badge — future

Potential future format:

**Washed · Light Roast · Fruity**

This should NOT be part of the initial MVP unless trivial.

The primary MVP should remain focused on:

- listing
- rating
- discovery
- social proof

---

# 7. Media Kit Pages

## Roaster media kit

Conceptual route:

`/roasters/[slug]/badges`

Page title:

**IndianCoffeeBeans Media Kit**

Suggested intro:

> Showcase your presence on IndianCoffeeBeans, collect independent ratings, and help customers discover your coffees.

The page should contain:

- roaster-level badges
- coffee/SKU badge management
- Shopify instructions
- WooCommerce instructions
- download assets
- embed previews

## Visibility

The media kit is public and needs no login. Anyone with the URL can open any roaster's media kit, and that is intended:

- everything it shows (coffees, ratings, source product URLs) is already public on the roaster and coffee pages
- a badge is just an image that links to ICB, so a third party embedding one only sends traffic to ICB and the roaster
- a login would block the one step that matters (copy-paste) and most roasters have no ICB account

Constraints that follow from it being public:

- `noindex` the page and keep it out of the sitemap. There will be one per roaster, all near-duplicates, and they are not search content.
- Show nothing internal. Data-quality states such as "Match needs review" (§9) are admin-only; the public page shows "Matched to store product ✓" or nothing.
- Anything private (partner analytics §14, per-roaster badge click counts) is never added to this page. It goes behind roaster claiming/auth when that ships.

## Entry points

The media kit is the canonical page. It is linked from:

1. **Outreach emails** — the per-roaster media-kit URL with UTMs (see §25). This is the primary entry point.
2. **The roaster profile** (`/roasters/[slug]`) — a small, low-emphasis link: "Are you the roaster? Get badges for your store". It lets roasters who check their own listing find it without an email.
3. **`/roasters/partner`** — a short section explaining badges, linking out to the media kits. Keep it visually separate from the paid tiers: badges are free for every listed roaster, and presenting them inside the tier pitch would undermine the zero pay-to-play position.

---

# 8. Coffee/SKU Management Inside Media Kit

The media kit should list all currently active coffees associated with the roaster.

Example:

| Coffee | ICB status | Rating | Badge |
| --- | --- | --- | --- |
| Ratnagiri Naturals | Active | ★ 4.6 · 12 | Copy embed |
| Baarbara Washed | Active | No ratings | Rate this coffee |
| Kerehaklu Natural | Active | ★ 4.8 · 27 | Copy embed |

Each coffee row should expose:

- coffee name
- ICB coffee page
- original roaster product URL
- rating count
- average rating
- active/discontinued state
- available badge types
- Copy Embed
- Copy Badge URL
- Download SVG

This lets a roaster immediately see:

**"ICB already knows my catalogue."**

That is part of the value proposition.

---

# 9. Product Matching

ICB already ingests roaster product pages.

When available, surface the existing relationship between:

**Roaster store product → ICB coffee record**

For Shopify, a source may resemble:

`roaster.com/products/ratnagiri-estate-natural`

For WooCommerce:

`roaster.com/product/ratnagiri-estate-natural`

Do not assume URL patterns alone are authoritative.

Use existing scraped/canonical source data wherever possible.

Eventually provide a visual indicator:

**Matched to store product ✓**

If uncertain:

**Match needs review**

The "needs review" state is admin-only. The public media kit (§7 Visibility) shows the ✓ or nothing.

Do not automatically connect ambiguous products.

---

# 10. Dynamic SVG Architecture

Use server-generated SVGs.

Conceptual endpoint:

`/badges/coffee/[slug]/[coffeeSlug].svg`

or:

`/api/badges/coffee/{coffee-id}`

with query parameters such as:

`?type=rating&theme=light&size=compact`

Roaster badges should follow the same renderer architecture.

Avoid duplicated SVG implementations.

Create one configurable badge rendering system with:

- entity type
- badge type
- theme
- size
- dynamic data

---

# 11. Badge Themes

Support:

- Light
- Dark
- Monochrome

Sizes:

- Compact
- Standard

Approximate dimensions:

180–240px wide

40–56px high

Requirements:

- readable at small sizes
- retina-safe
- responsive SVG
- visually compatible with ecommerce stores
- clearly branded as IndianCoffeeBeans
- restrained rather than ad-like

Use existing ICB brand assets.

---

# 12. Embed Format

Generate copy-paste HTML.

Example concept:

```html
<a href="https://www.indiancoffeebeans.com/go/...">
  <img
    src="https://www.indiancoffeebeans.com/badges/..."
    alt="Rate this coffee on IndianCoffeeBeans"
    width="..."
    height="..."
  />
</a>
```

No:

- JavaScript
- iframes
- script loaders
- external dependencies

---

# 13. Click Tracking

Badge links should use an ICB tracking redirect.

Conceptually:

`/go/{entity}?source=badge&type=rating&placement=product-page`

Track:

- roaster ID
- coffee ID if applicable
- entity type
- badge type
- placement
- source
- destination
- timestamp

Reuse existing PostHog/database analytics infrastructure where appropriate.

The redirect must:

- be server-side
- be extremely fast
- avoid open redirects
- use only approved ICB destinations
- degrade gracefully

---

# 14. Partner Analytics — Future

The architecture should support future partner reports such as:

**This month**

- 186 visitors came to ICB from your website
- 74 visited coffee pages
- 32 ratings were submitted
- 91 visitors clicked through from ICB to your store

This does NOT need to be exposed in MVP unless existing analytics makes it trivial.

However, event architecture should make this possible later.

---

# 15. Reverse Link to Roaster

Every individual coffee page on ICB should prominently retain its official source/purchase destination.

Example:

**Buy from Roaster →**

This completes the value exchange.

Where appropriate, indicate that the link points to the official roaster product page.

The badge system should not create a one-directional traffic funnel.

---

# 16. SEO

Badges should use natural branded links.

Appropriate text:

- Listed on IndianCoffeeBeans
- View this coffee on IndianCoffeeBeans
- Rate this coffee on IndianCoffeeBeans
- Explore our coffees on IndianCoffeeBeans

Avoid keyword-stuffed text.

Do not automatically add:

- `nofollow`
- `ugc`
- `sponsored`

unless required by the nature of a specific partnership.

Links should remain visible and voluntary.

Coffee-level badges should link directly to coffee-level pages rather than sending everything to the roaster homepage.

---

# 17. Shopify Installation

Provide a simple installation guide.

Typical workflow:

1. Online Store
2. Themes
3. Customize
4. Open the relevant product/page/footer section
5. Add Custom Liquid
6. Paste the ICB embed
7. Save

For SKU-level badges, explicitly recommend placement near:

- reviews/social proof
- product information
- brewing/tasting notes

Do not build a Shopify app yet.

---

# 18. WooCommerce / WordPress Installation

Typical workflow:

1. Edit the product/page/template
2. Add Custom HTML block
3. Paste the ICB embed
4. Publish/update

Do not build a WordPress plugin yet.

---

# 19. Media-Kit Configurator

For both roaster and coffee badges allow:

## Badge type

Roaster:

- Listed
- Rate us
- Explore
- Rating
- Coffee count

Coffee:

- Listed
- Rate this coffee
- View coffee
- Rating

## Theme

- Light
- Dark
- Monochrome

## Size

- Compact
- Standard

## Placement

- Product page
- About page
- Footer
- Reviews section
- Other

Show the actual hosted SVG in preview.

Actions:

- Copy Embed
- Copy Badge URL
- Download SVG
- Download PNG

PNG can be deferred if implementation requires a disproportionate dependency.

---

# 20. Social Assets

Later phase.

Support downloadable assets such as:

1080 × 1080

1080 × 1920

Examples:

**We're listed on IndianCoffeeBeans**

**Our coffees are on IndianCoffeeBeans**

**Rate our coffees on ICB**

**Rated ★4.8 on IndianCoffeeBeans**

Avoid building a full social editor initially.

---

# 21. QR Assets

Optional extension.

QR codes can point to:

- roaster ICB page
- individual coffee
- rating flow

Potential usage:

- coffee packaging
- café counters
- popups/events
- printed cards
- subscription boxes

If inexpensive to implement, expose QR download from the media kit.

Otherwise keep it as a clean follow-up.

---

# 22. Dynamic Badge Data

Badges may use:

- rating count
- average rating
- active coffee count
- coffee name
- roaster name

Dynamic values must be safely escaped.

Never insert arbitrary HTML into SVG.

Cache dynamic badge output.

A 1–6 hour cache is acceptable.

---

# 23. Security

Protect against:

- SVG injection
- malformed slugs
- invalid badge types
- arbitrary redirect URLs
- open redirects
- analytics spam
- unescaped dynamic content
- invalid themes/sizes
- excessive badge generation requests

All query values should be validated against enums.

---

# 24. Performance

The badge should impose effectively negligible overhead on the roaster.

Requirements:

- one image request
- small SVG payload
- aggressive CDN caching
- no JavaScript
- no iframe
- no client API calls
- no render-blocking dependencies

---

# 25. Roaster Outreach Positioning

The product should make outreach materially stronger.

The messaging should NOT primarily be:

**"Please link to ICB."**

Instead:

**"Your coffees are already indexed on IndianCoffeeBeans. We've created free embeds you can add to your store to collect independent ratings and let customers explore each coffee on ICB."**

Different roasters can receive different hooks.

## High-rating roasters

Lead with:

**Display your existing independent ICB ratings on your store.**

## Low-rating roasters

Lead with:

**Add a Rate this coffee button and start building independent customer ratings.**

## Large catalog roasters

Lead with:

**Your catalogue is already mapped on ICB. Every product now has its own ready-to-use badge.**

## Hook selection rule

Rating data is thin today: of 116 roasters in the outreach dataset (2026-10-07), 65 have zero SKU ratings, 40 have 1–4, and only 11 have 5 or more. The ratings hook therefore fits about ten roasters; for most, the hook is the Rate this coffee CTA.

The hook is chosen deterministically, not by the copywriter, so no email implies ratings a roaster doesn't have. First match wins:

1. **Ratings** — `sku_ratings_count ≥ 5` and the dynamic rating badge would actually render (same threshold as §5.4 / §6.3)
2. **Catalogue** — `coffee_count_active ≥ 20` (23 roasters today)
3. **Rate this coffee** — everyone else

The threshold of 5 is a starting value; keep it in one constant shared with the badge renderer so the email hook and the badge can never disagree.

## Placement in the outreach sequence

The outreach sequence is four emails (icb-claude `outreach-drafter` skill):

- **Email 1 (Introduction): no badge.** It carries the founding-tier ask and closes on a single question. A second link plus an install ask dilutes it and reads as a link request.
- **Email 2 (The Hook): the media kit is the hook.** This email already offers a free fix regardless of payment and asks "Want me to send you what it'd look like?" — the per-roaster media-kit link answers that directly, using the hook selected above.
- **Email 4 (Soft Pivot): one-line reminder** — the page stays free, and the badges are theirs either way.

The outreach side is not updated until the media-kit route is live in production; outreach copy never promises unbuilt features.

---

# 26. Strategic Flywheel

The intended loop is:

Roaster product page

→ coffee-specific ICB page

→ user explores/rates coffee

→ ICB coffee page gains engagement and authority

→ ICB sends users back to official roaster product

→ roaster sees value

→ more roasters install ICB embeds

→ ICB becomes more recognizable

→ independent ICB ratings gain additional meaning

The long-term objective is for:

**★ 4.7 on ICB**

to become recognizable social proof within the Indian specialty-coffee ecosystem.

---

# 27. MVP Scope

Build now:

- roaster media-kit page
- roaster badges
- coffee/SKU badges
- reusable dynamic SVG renderer
- light/dark/mono themes
- compact/standard sizes
- copy embed
- badge URLs
- tracking redirects
- analytics events
- Shopify instructions
- WooCommerce instructions
- source-product association display
- media kit `noindex` + sitemap exclusion
- entry links from the roaster profile and `/roasters/partner` (§7)

If inexpensive:

- SVG download
- QR generation

Defer:

- Shopify app
- WordPress plugin
- full partner dashboard
- richer metadata widgets
- coffee awards
- verification program
- social graphic editor
- complex automated theme installation

---

# 28. Implementation Process

## Step 1 — Repository audit

Inspect:

- current Next.js structure
- existing roaster routes
- existing coffee routes
- Supabase schema
- coffee/roaster relationship
- source product URLs
- Shopify/WooCommerce fields currently captured
- ratings schema
- PostHog implementation
- existing CDN/image handling
- brand/logo components

Before writing code, summarize findings.

---

## Step 2 — Architecture proposal

Provide:

- proposed routes
- components
- renderer architecture
- analytics design
- cache strategy
- any required schema changes
- exact files expected to change

Prefer no schema changes if existing data already supports the feature.

---

## Step 3 — Build core renderer

Build and test the generic SVG renderer first.

Verify both:

- roaster badge
- coffee badge

work through normal `<img>` embedding.

Do this before building secondary features such as PNG or QR.

---

## Step 4 — Media kit

Build the media-kit UI and coffee listing/configurator.

---

## Step 5 — Tracking

Implement redirect + analytics.

---

## Step 6 — Validation

Run:

- type checks
- lint
- tests
- production build

Fix anything introduced by this work.

---

# 29. Acceptance Criteria

The feature is complete when:

1. A roaster can open their ICB media-kit page.
2. Their active coffees are automatically shown.
3. Every eligible coffee can generate a unique badge.
4. Badges link to the correct ICB roaster/coffee pages.
5. A Shopify or WooCommerce merchant can install one by copying HTML.
6. The badge needs no JavaScript on the merchant site.
7. Dynamic rating/count values update without the merchant changing code.
8. Badge clicks are measurable.
9. Existing source-product links remain intact so ICB can send users back to the official roaster.
10. The system introduces no meaningful performance penalty to merchant sites.

---

# 30. Future Extensions

Once adoption exists, this architecture may evolve into:

- Verified on IndianCoffeeBeans
- Top-rated coffee badges
- individual coffee awards
- seasonal awards
- tasting-note widgets
- brewing-information widgets
- Shopify Theme App Extension
- WooCommerce plugin
- partner analytics dashboard
- rating widgets embedded directly inside stores
- roaster claiming/verification
- API-driven partner integrations

Do not build these before the core badge system proves adoption.
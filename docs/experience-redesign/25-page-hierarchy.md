# 25 — Page-Level Information Hierarchy (Phase B)

**Status (2026-11-11): Phase B content hierarchy approved as the design baseline, with explicit open implementation/component details.** Coffee cards, directory, discovery landing, coffee detail, homepage, roaster, regions, estates, articles, tools and Profile/Settings have agreed content structure. Account Profile submenu children remain OPEN for the component phase. This document specifies content and sequence, not pixel layout or motion implementation. Builds on [24](24-information-architecture.md); no production change is authorized.

This document decides **what appears and in what order**, not how it looks. Wording is working copy.

Field sources: **R** roaster's own listing · **I** ICB-derived (normalised, computed or counted) · **D** drinkers (ratings) · **E** ICB editorial.

## 1. Coffee card (shared by every grid)

**Research addendum (PROPOSED 2026-11-14):** The existing wishlist heart and rating footer already provide two distinct actions; preserve both without adding a third full-size Tried button to cards. Consider clearer accessible labelling for the save intent (“Want to try” / “Saved”). A save is not a purchase or a tasting. See [28](28-research-lifecycle-and-future-cafes.md).

**Revised 2026-11-11 after reading `CoffeeCard.tsx` and `CardRatingFooter.tsx` and owner feedback.** The existing card already captures ratings in place, on purpose. That stays. The redesign changes the look, not this contract.

### What the card shows (existing behaviour, kept)

| Order | Field | Shown when | Source | Rule |
|---|---|---|---|---|
| 1 | Pack image | always | R | Largest element. Fallback plate when missing |
| 2 | Origin badge | foreign origin only | R | "Ethiopia origin", so a non-Indian coffee does not read as Indian |
| 3 | Wishlist button | always | — | Top corner of the image |
| 4 | Coffee name | always | I (cleaned `display_name`) | Never the raw scraped name |
| 5 | Roaster name | always | R | Text inside the card's single link to the coffee |
| 6 | Roast | if known | I | Today a five-bean scale; the form is a Phase C question |
| 7 | Process | if known | I | Never print "Other" |
| 8 | Flavour notes | if any | R, normalised by I | Up to three, then "+N" |
| 9 | Price | if priced | R | "From ₹450 / 250g" |
| 10 | **Rating footer** | always | D | See below. Sits outside the card link, so tapping it never opens the coffee |

### Rating footer states (kept; wording to confirm)

| State | Left | Right | Tap |
|---|---|---|---|
| Rated by others | "4.3 · 12 ratings" | Stars + "Tried this? Rate it." | A star opens the quick-rating sheet pre-filled; the text opens it empty |
| Viewer has rated | "4.3 · 12 ratings" | Viewer's stars + "Your rating: 4" | Opens the sheet to edit |
| **Unrated** | — | Today: "Unrated · Rate it". No hollow stars | Opens the sheet |

Unrated wording (owner decision 2026-11-11): **"No ratings yet · Tried it? Rate it"**.

### Variants (existing)

| Variant | Used for | Differences |
|---|---|---|
| Hero / default | Directory, landing grids, homepage | Everything above |
| Similar | Similar coffees | Name, roaster, up to three "why it matches" chips, compact rating row |
| Compact | Dense lists | Small image, one or two lines, display-only rating |

### Rules

- **No Buy on cards.** Buy lives on the coffee page.
- Rating on the card is a quiet text-and-stars control, not a filled button, so the grid stays led by packaging. This is consistent with the decision log ("cards need not carry both" actions); the summary line in [20](20-direction.md) that says cards carry neither should be read as "no buttons".
- No rank or "Top rated" badge on a card.
- One optional heading per grid states why the coffees are together ("Just added", "Also from Ratnagiri Estate", "Similar by flavour and roast").

## 2. Coffee directory — `/coffees`

The same template serves three arrivals: plain browsing, a doorway link (one filter pre-applied), and a "See all" from a landing page.

### Order (desktop and mobile are the same sequence)

| # | Block | Required | Content | Notes |
|---|---|---|---|---|
| 1 | Breadcrumb | yes | Home › Coffees | |
| 2 | Title and count | yes | Plain: "Coffees" + "1,678 coffees from 122 roasters". Filtered: "Washed coffees from Chikmagalur" + "86 coffees" | Count is live and dated by the data, never a hard-coded number. The single h1 |
| 3 | **Context link** | when one filter has a page | "About Chikmagalur coffee →" to `/coffees/chikmagalur`, or to the estate page | New. This is what joins a filtered view to its landing page. Shown only for a single attribute with an indexable page |
| 4 | Search within directory | yes | "Search coffees by name, roaster or note" | Same matching as global search |
| 5 | Filters | yes | Roast, process, brew method first; then flavour, region, estate, roaster, bean type, price; toggles for in stock, decaf, works with milk, 250g | Mobile: one "Filters (3)" button opening a sheet with a visible "Show 86 coffees" button |
| 6 | Active filter chips | when filtered | One chip per filter, each removable; "Clear all" | |
| 7 | Sort | yes | Just added (default) · Top rated · Price low–high · Price high–low · Best value · A–Z | "Top rated" shows a note: "Ranked by average rating; coffees with fewer than 3 ratings are listed after" (rule to confirm) |
| 8 | Grid | yes | Coffee cards | 2 columns on mobile |
| 9 | Pagination | when needed | Numbered pages | Keeps the indexable `?page=N` behaviour |
| 10 | Related doorways | optional | For a filtered view: 3–5 neighbouring attributes, e.g. other regions in the same state | Links only to existing pages or filters |

### Actions

- Primary: open a coffee. Secondary: change filters.
- No Buy here. Rating is available from each card's footer.

### Empty and edge states

| State | What shows |
|---|---|
| No results | "No coffees match all of these." Then the filters listed with the number of coffees each one alone would return, so the visitor can drop the one that empties the list. "Clear all" stays |
| Only sold-out matches | Show them, badged, with "Show in stock only" off; say "All 4 are currently sold out" |
| Doorway to a value with one coffee | Show it, plus the related-doorways block |
| Loading | Card skeletons in the final grid shape; title and filters render immediately |
| Error | "We couldn't load coffees. Try again." with a retry button; filters stay usable |

### SEO contract (unchanged)

Bare `/coffees` and `?page=N` indexable; any filter is `noindex, follow` with canonical `/coffees`. The filtered title (block 2) changes the visible h1 only, not indexability.

## 3. Discovery landing — `/coffees/<slug>` (42 pages)

The top organic template, mostly reached on mobile. Today the order is: breadcrumb, h1, intro, the type-specific profile, a 12-coffee teaser, recipe or roast scale or value tips, utility card, article links, FAQ, related links.

**Proposed change: move coffees above the long profile.** A visitor who searched "V60 coffee India" currently scrolls past an explainer before seeing a single coffee. All existing copy stays on the page and in the DOM; only its position changes.

### Order

| # | Block | Required | Source | Content |
|---|---|---|---|---|
| 1 | Breadcrumb | yes | I | Home › Coffees › V60 |
| 2 | h1 and intro | yes | E (config-owned) | Unchanged text. Intro capped at about three lines on mobile with the rest lower in block 6 |
| 3 | Key facts strip | by type | E / I | Three or four facts. Brew: ratio, grind, time. Region: state, altitude range, area with source and year. Process: one-line effect on flavour. Price: the range. Roast: position on the scale |
| 4 | **Coffees** | yes | R, I, D | Heading with live count: "214 coffees for V60 · 180 in stock". 12 cards, in stock first. Sort note: "Newest first" |
| 5 | See all | yes | — | "See all 214 →" to the filtered directory, carrying the same filter **and** the in-stock setting the teaser used |
| 6 | Profile / explainer | yes | E | The existing type-specific section (brew method, roast, process, region overview, bean type, price bucket) |
| 7 | Type extras | by type | E / I | Recipe (brew), roast scale (roast), flavour impact (process), region detail and roasters sourcing from it (region), value tips (price) |
| 8 | Estates here | region pages, once estates exist | I | Qualified estates in this region, each with coffee count |
| 9 | Read more | if curated | E | Existing `learnLinks`; two to four articles |
| 10 | Tool handoff | if relevant | E | Existing utility card (e.g. calculator for brew pages) |
| 11 | Related | yes | E / I | Existing related links: sibling values and nearby regions |
| 12 | **FAQ — final content block** | yes | E (config-owned) | Unchanged FAQ content, at the end of the page before the footer; preserve existing valid structured data |

### Actions

- Primary: open a coffee. Secondary: See all in the directory.
- No Buy. Rating is available from each card's footer.

### Provenance rules

- Area figures appear only with source and year (ADR-013).
- "Roasters sourcing from here" lists every roaster with matching coffees, ordered by number of matching coffees, and says so. No hand-picked order.
- Counts are live; region counts include child regions once the roll-up is fixed.

### Empty and edge states

| State | What shows |
|---|---|
| No in-stock coffees | Show sold-out ones, badged, with "None in stock right now" |
| Fewer than 4 coffees | Show them, then the Related block moves up directly under the grid |
| No coffees at all | Keep the page (it ranks on its editorial content); replace the grid with Related and Read more. Flag the page for review |
| No `learnLinks` | Block 9 is omitted, not padded |

### SEO contract

- h1, intro, FAQ and related links stay config-owned and unchanged.
- CollectionPage, BreadcrumbList and FAQPage schema unchanged.
- The reorder moves explanatory copy below the grid. It remains server-rendered. Because this is the top organic template, roll the new order out on a few pages first and compare Search Console before applying it to all 42.

## 4. Decisions needed

| # | Decision | Recommendation |
|---|---|---|
| B1 | Cards keep the in-place rating footer. Unrated wording: "Be the first to rate" or "No ratings yet · Tried it? Rate it" | Decided 2026-11-11: keep footer; "No ratings yet · Tried it? Rate it" |
| B2 | Roaster name on cards is text; the whole card is one link | Yes |
| B3 | Landing pages put coffees above the long explainer, tested on a few pages first | **Accepted 2026-11-11** |
| B4 | Filtered directory views get a descriptive title and a link to the matching landing or estate page | Yes |
| B5 | "Top rated" lists coffees with fewer than 3 ratings after the rest, and says so | **Accepted 2026-11-11**, threshold 3 |
| B6 | Empty results show what each filter alone would return | Yes |

## 5. Coffee detail — `/roasters/<slug>/coffees/<coffeeSlug>`

**Research addendum (PROPOSED 2026-11-14):** Test a *secondary*, explicit “Mark as tried” state near personal actions or review evidence. It must **not** displace the already approved Buy + Rate mobile sticky bar, require a rating, infer a purchase, or generate an extra public review. The rating flow remains directly usable for people who already tried a coffee.

The centre of Find, Rate, Buy. Today's order: section tabs, hero (name, roaster, wishlist, Buy), story and production details, flavour, pricing and availability, rate and review, FAQ, more from roaster, similar coffees, plus a floating Rate button and an exit-intent rating pop-up.

### Order (mobile sequence; desktop places 2 beside 3–6)

| # | Block | Shown when | Source | Content and rule |
|---|---|---|---|---|
| 1 | Breadcrumb | always | I | Matches the existing `BreadcrumbList` schema |
| 2 | Pack images | always | R | Largest element. Fallback plate when missing |
| 3 | Name, roaster, rating | always | I, R, D | h1 name; roaster as a link; "4.3 · 12 ratings" jumps to block 11, or "No ratings yet" |
| 4 | Key facts | if known | I | Roast · process · region, each a doorway. One line |
| 5 | Price and availability | if priced | R | "From ₹450 / 250g", pack sizes, in stock or sold out, and the date the price was last checked if we hold it |
| 6 | **Actions** | always | — | **Buy from [roaster] ↗** (filled) · **Rate** (outline) · wishlist. On mobile these two sit in a sticky bar at the bottom of the screen |
| 7 | Flavour | if any | R notes; I profile | Notes as doorway chips to the directory. Sensory profile labelled with who it comes from (roaster's description, or ICB's reading of it) |
| 8 | Origin and production | if any | R, I | Region, estate, altitude, variety, bean type, process detail. Each follows the doorway rule: page, else filtered directory, else plain text. Variety links to the varieties article until it is a filter |
| 9 | Roaster's description | if any | R | Labelled as the roaster's words |
| 10 | Brewing | if any | R / I | Suited brew methods as doorways; works with milk; link to the matching tool |
| 11 | Ratings and reviews | always | D | Average, count, up to ten reviews, rate in place. With none: "No ratings yet · Tried it? Rate it" |
| 12 | Read about this | if curated links exist | E | One to three articles from the process, region and brew-method landing configs. Omitted if none |
| 13 | In curations | if any | E (partner) | Curations that include this coffee |
| 14 | More from this roaster | if any | I | Grid, newest first |
| 15 | Similar coffees | if any | I (computed) | Heading says how: "Similar by flavour, roast and process". Up to four |
| 16 | FAQ | always | I | Unchanged; keeps FAQPage schema |

### Actions

- **Buy** opens the roaster's own product page in a new tab, marked ↗. It records a consented click event. It is never described or counted as a purchase.
- **Rate** opens the rating sheet on the page. Anonymous visitors can rate up to three coffees or roasters; the limit is stated in the sheet before they reach it.
- After a rating: optional context (brew method, notes), then a link to Your ratings.

### States

| State | What changes |
|---|---|
| Sold out | Price block says "Sold out at the roaster". Buy becomes "View at [roaster] ↗". Rate unchanged |
| No longer listed | Banner "No longer listed by the roaster". No Buy. Still rateable. Similar coffees moves up under the actions |
| No product link | Buy becomes "Visit [roaster] ↗" to the roaster's site |
| No price | Block 5 shows availability only |
| Viewer has rated | Rate becomes "Your rating: 4 · Edit" |
| Returning visitor who viewed but has not rated | One quiet line above the reviews: "Have you tried this coffee?" Never shown because of a Buy click alone |
| Anonymous at the three-rating limit | Rate opens sign-in with the reason stated |
| Missing sections | Omitted entirely; no empty headings |

### What I would remove

- **The exit-intent rating pop-up.** It interrupts someone who is leaving, and may not have tried the coffee. The sticky Rate button and the returning-visitor question do the same job without assuming.
- **The separate floating Rate button**, replaced by the sticky bar.
- **Section tabs on mobile**, since the page becomes one clear sequence. Keep them on desktop.

### SEO contract

Product (with Brand, Offer, AggregateRating), BreadcrumbList and FAQPage schema unchanged. One h1. All doorway links and the editorial strip are server-rendered.

### Decisions needed

| # | Decision | Recommendation |
|---|---|---|
| B7 | Sticky Rate and Buy bar on mobile, replacing the floating Rate button | **Accepted 2026-11-11** |
| B8 | Remove the exit-intent rating pop-up | **Accepted 2026-11-11: remove** (owner said yes to the recommendation; confirm if the returning-visitors-only variant was meant) |
| B9 | Buy is filled, Rate is outline on this page | Yes (already proposed in the decision log) |
| B10 | Discontinued coffees stay rateable, with no Buy | **Accepted 2026-11-11** |
| B11 | Price and facts come before the roaster's description | Yes |

## 6. Homepage — `/`

Mainly a door for direct and returning traffic (second-highest landing sessions, best engagement, but average scroll depth of 13% across today's 14 sections). The approved v2 sequence is: actions, new coffees, recent ratings, new roasters, field guide; an origins band was added at the owner's request. This section fixes what each band contains and what happens to today's sections.

### Traffic evidence (ops workspace snapshots, read 2026-11-11)

- **No section-level tracking exists for the homepage.** PostHog records only `hero_cta_clicked`; nothing below the hero is instrumented. Clarity (three days to 6 Nov) gives the homepage 19% average scroll depth and 24.7% quick-backs, so most visitors never reach the lower sections.
- Hero clicks over 90 days (950): Explore coffees 580, **Top rated coffees 337**, Continue with last viewed 14, the rest under 10 each. Top rated is nearly as popular as Explore among new visitors, so when it leaves the homepage as a section it must stay as a clear link in the Arrival band.
- Landing sessions by site section (GA4, 1 Aug–30 Oct, top 200 landing pages, 11,123 of 17,678 sessions): landing pages 2,511 · Learn 2,357 · Home 2,171 · roaster detail 1,011 · coffee detail 915 · coffee directory 440 · Communities 353 · roaster directory 350 · Tools 187. `/regions` and `/curations` do not appear in the top 200.
- Recommended before the redesign ships: add view and click events per homepage section, so the new bands can be compared with a baseline.

### Experience composition principle: connected bands, not isolated sections (owner clarification, 2026-11-11)

The bands below define **required content and narrative order, not visually independent section boxes**. The owner is comfortable with technically separate sections, provided their transitions, scroll-driven motion and continuous visual language make the page feel like one evolving story. Modern scroll-linked animations are explicitly in scope for composition/prototyping, not approved as a particular library or scroll-hijacking mechanism. Preserve native scroll, readable content, reduced-motion alternatives, SEO-visible DOM content and mobile performance. The FAQ remains the final content block. Design the transitions *between* bands, not just motion *inside* each band.

### Principle: show, don't tell (owner direction, 2026-11-11)

Each band demonstrates the breadth of what ICB covers through real data, not through statements about it, while still leading into one of the three journeys. The test for every band in the design phases: could a visitor infer the scale and depth of the directory from what is on screen, without reading a claim? Sentences such as "India's most comprehensive coffee directory" fail it; a row of real packs, a live count beside each region, or a dated rating passes.

| Band | What it shows instead of saying | Journey it feeds |
|---|---|---|
| Arrival | Real packs from many roasters; live counts beside each way in ("Washed · 514") | Find |
| Just added | Actual coffees with their added dates | Find |
| Recent ratings | Real scores, reviewers and dates | Rate |
| Origins | Every region with its coffee count, and estates when live | Discover |
| New roasters | Real roasters with their coffee counts | Find |
| Field guide | The articles themselves, each tied to coffees or an origin | Discover |
| Community | The actual groups and curations | Discover |

### Order (anonymous visitor)

| # | Band | Source | Content | Links out |
|---|---|---|---|---|
| 1 | **Arrival** | I | h1; search field; two actions: **Browse coffees** and **Rate a coffee you've tried**; a row of ways in (roast, brew method, process, origin, flavour, price); real pack images; "1,678 coffees from 122 roasters" as a live count | `/coffees`; search in rating mode; landing pages; `/regions` |
| 2a | **Start here** ("How do you like your coffee?") | E, I | The existing core collections: plain-language starting points, each a saved filter combination with its live coffee count. Corrected 2026-11-11 after reading `coffee-collections.ts` | Filtered directory |
| 2 | **New this week** | R, I | The coffees added in the most recent weekly import (scrapers run every Saturday), in a sideways-scrolling row, headed with the real date: "New this week · added 8 Nov · 46 coffees". Owner direction 2026-11-11 | "See all new coffees →" `/coffees` (newest first) |
| 3 | **Recent ratings** | D | Latest ratings: coffee, score, a line of the review if any, date. Sample sizes shown | Coffee pages; "Top rated →" directory sort; Rate |
| 4 | **Origins** | I, E | Where Indian coffee grows: the main regions, each with its live coffee count, on a simple map or list. Added 2026-11-11 at the owner's request | Region landing pages; "All regions →" `/regions`; estates when live |
| 5 | **New roasters** | I | Roasters most recently listed, with coffee count. Wording is "listed", not "joined" | `/roasters` |
| 6 | **Field guide** | E | Three or four articles and one tool | `/learn`, `/tools` |
| 7 | **Community** | E (partners) | A few communities, the current curation, newsletter sign-up | `/communities`, `/curations`, `/newsletter` |
| 8 | **Close** | E | One line on independence ("ICB lists roasters independently and takes no payment for placement") with a link to How ICB works; Rate once more | `/how-icb-works` |
| 9 | **FAQ** | E | The existing homepage FAQ, kept as the last block for search and AI-answer visibility | — |

### What happens to today's 14 sections

| Today | Proposed |
|---|---|
| Hero (video, chips, CTAs, stats, ticker) | Becomes band 1. Pack imagery replaces the video |
| Top Rated | Leaves the homepage; it is a directory sort with sample sizes (confirmed 2026-11-10) |
| Fresh From Community | Band 3 |
| New Arrivals | Band 2 |
| Discovery accordion (Roast, Brew method, Process, Bean type, Budget, Region → landing pages) | Becomes the **ways-in row in band 1**, with a live count beside each value. The same config (`DISCOVERY_PILL_ROWS`) also feeds the header "Browse by" panel and the mobile menu, so there is one list in three places. The Region row moves to the Origins band |
| "How do you like your coffee?" collection grid (Beginner-friendly, Milk-friendly, Fruity filter, South Indian filter, Balanced medium) | **Kept as its own band** (2a, "Start here"), directly under Arrival. These are plain-language starting points for visitors who do not know roast or process vocabulary, which the attribute row cannot serve. Each card shows its live coffee count and the rule that defines it |
| How It Works | One line in band 8 linking to `/how-icb-works` |
| Top Profiles | Removed as a section; reviewer names appear on their ratings in band 3 |
| Roaster Infrastructure | Moves to `/roasters/partner`; footer link |
| Education | Band 6 |
| Curator Spotlight | Band 7 |
| Testimonials | Removed. Real ratings in band 3 do this job |
| FAQ | **Stays, as the last block** (owner direction 2026-11-11) |
| CTA | Band 8 |

### Neutrality rules for this page

- **New this week is the last weekly batch, nothing else.** No older filler. If a week adds nothing, the band shows the previous batch under its own date, never under "this week". If one roaster accounts for many of the batch, show a group card ("12 new from [roaster]") rather than hiding or reshuffling them. Order within the batch is rotated so no roaster is always first.
- **Arrival pack images** are not a recommendation. Selection rule, stated in the docs and applied automatically: most recently added in-stock coffees with an image, at most one per roaster, refreshed daily. No caption implies endorsement.
- **Ways in** list attributes only, never roasters or products.
- **Start here** collections are filter rules, not hand-picked coffees. Each card states its rule in plain words ("Medium roast · washed · in stock"), and results use the directory's normal sort.
- **Origins** lists regions in a stated order (by number of coffees, counting child regions), shows only regions that have a page, and prints an area figure only with its source and year.
- No paid placement anywhere on the page.

### Returning visitors (same URL, band 1 changes; bands 2–8 do not)

**Research addendum (PROPOSED):** For authenticated visitors, consider separate “Want to try” and explicit “Tried but not rated” continuations. Never prompt “rate the coffee you bought” from an outbound click. Homepage search, neutral catalogue facts and standard navigation remain unchanged.

| Visitor | Band 1 shows |
|---|---|
| Anonymous, has viewed coffees | "Pick up where you left off": recently viewed coffees, each with "Have you tried it?" |
| Anonymous, has rated | Their ratings and how many remain before sign-in is needed (of three) |
| Signed in | Greeting, recently viewed, wishlist, their ratings |

Personalisation changes what is shown first. It never changes facts, ratings or access to the full directory, and a Buy click is never treated as having tried a coffee. Search and Browse stay in the same position in every state.

### Empty and edge states

| State | What shows |
|---|---|
| No ratings in the last 30 days | Band 3 shows the most recent ones with their real dates, not "this week" |
| Region counts unavailable | Band 4 shows region names without counts |
| No new roasters recently | Band 5 is omitted |
| Live count unavailable | Count line omitted; never a hard-coded number |

### SEO contract

One h1. Organization and WebSite schema unchanged. Every band is server-rendered and links to existing URLs. The sideways row keeps all cards in the page markup. Removing the video should help mobile loading speed.

### Decisions needed

| # | Decision | Recommendation |
|---|---|---|
| B12 | Remove Testimonials and Top Profiles; move Roaster Infrastructure to the partner page | **Accepted 2026-11-11** |
| B13 | New arrivals show the most recent weekly batch under its real date, with group cards when one roaster dominates | **Accepted 2026-11-11** (weekly batch per owner) |
| B14 | Arrival image rule: recent, in stock, one per roaster, daily refresh | **Accepted 2026-11-11** |
| B15 | Community band holds communities, the current curation and the newsletter | **Accepted 2026-11-11** |
| B16 | Homepage FAQ | **Decided 2026-11-11: stays at the bottom.** Rule for all templates below |

### Site-wide rule: every rating shows who gave it (owner direction, 2026-11-11)

Wherever someone's rating or review is displayed (coffee detail, roaster detail, the homepage Recent ratings band, a member's profile), it carries the reviewer's **avatar and name** beside the score and date. The existing review list and the homepage community section already do this; the redesign must keep it and apply it to every new place a rating appears.

| Reviewer | Shown as | Links to |
|---|---|---|
| Member with a public profile | Avatar (or initials) and username | Their profile |
| Member without a photo | Initials and name | Their profile |
| Anonymous | Neutral placeholder and "Anonymous" | Nothing |

Aggregate figures ("4.3 · 12 ratings") carry no avatars; this rule is for individual ratings.

### Site-wide rule: FAQ last (owner direction, 2026-11-11)

For pages **with an existing or editorially justified FAQ**, place it as the **last content block before the footer**: homepage, existing discovery landings, coffee detail, roaster detail, and articles/tools where present. Estate pages may add an FAQ **only if substantiated questions and answers exist**; a new estate FAQ is not mandatory. Preserve genuine FAQ content, internal links, current SEO metadata and appropriate structured data. Do not assume FAQPage rich-result display or add thin/templated FAQs solely for schema. The discovery landing Related block moves **before** FAQ (§3); nothing follows FAQ except the footer. Avoid hiding FAQ text from rendered HTML.

## 7. Roaster, regions and estates

"Show, don't tell" applies here too: each page leads with the real things it contains and their counts, and explanatory prose follows.

### 7.1 Roaster detail — `/roasters/<slug>`

Today: hero with site and social links, about, coffee grid with breakdown and paging, reviews, similar roasters, partner call-to-action, badges link, FAQ.

| # | Block | Shown when | Source | Content |
|---|---|---|---|---|
| 1 | Breadcrumb | always | I | Home › Roasters › [roaster] |
| 2 | Identity | always | R | Logo, name (h1), city and state, rating with count, "42 coffees listed" |
| 3 | Actions | always | — | **Visit [roaster] ↗** (filled) · **Rate this roaster** (outline) · social links |
| 4 | **What they roast** | if 3+ coffees | I | The catalogue at a glance, as counts that are also doorways: roast levels, processes, regions and estates they source from. Each opens this roaster's coffees with that filter |
| 5 | Coffees | always | R, I, D | Grid of cards, newest first, with sort; paging keeps the existing `?page=N` |
| 6 | About | if any | R | The roaster's own description, labelled as theirs |
| 7 | Ratings and reviews | always | D | Average, count, reviews; rate in place. "No ratings yet · Tried them? Rate them" |
| 8 | Read about them | if an article features them | E | Only articles that explicitly feature this roaster |
| 9 | Similar roasters | if any | I (computed) | Heading states the basis |
| 10 | For this roaster | always | — | One quiet line: "Is this your roastery? Claim or update it" and the badge kit link |
| 11 | FAQ | always | I | Unchanged; keeps schema |

Change from today: the coffees and the "what they roast" summary move above the About text; the partner call-to-action shrinks to one line.

States: no coffees currently listed (show "No coffees listed right now", keep ratings and About); inactive roaster (existing noindex behaviour kept); no website (Visit button omitted).

### 7.2 Regions hub — `/regions` (the Origins destination)

**Owner direction 2026-11-11: keep this close to the existing regions page** (map, state groups, region cards). The redesign restyles it and adds the estates block; it does not restructure it. The estate index and the homepage Origins band follow the same pattern.

| # | Block | Source | Content |
|---|---|---|---|
| 1 | Breadcrumb, h1, one-line intro | E | Unchanged text |
| 2 | Map of India's growing regions | I | Each region marked with its live coffee count; tapping one opens its landing page |
| 3 | Regions by state | I | Existing state groups and region cards: name, coffee count, estate count, area with source and year |
| 4 | Estates | once estate pages exist | I | Qualified estates grouped by region, with coffee counts; link to `/estates` |
| 5 | Read more | E | The regions guide and the regions series |

Rules: India only. A region without a landing page links to the filtered directory, never to an invented URL. Counts include child regions.

Individual region pages are the `/coffees/<region>` landing pages in §3; they gain the "Estates here" block.

### 7.3 Estate detail — `/estates/<slug>` (new)

Published only for estates that pass the ADR-013 gate (India, has a description, 3+ public coffees). Others return 404 and stay reachable as filtered directory views.

| # | Block | Shown when | Source | Content |
|---|---|---|---|---|
| 1 | Breadcrumb | always | I | Home › Origins › [region] › [estate] |
| 2 | Identity | always | I | Name (h1), region as a doorway, "18 coffees from 6 roasters" |
| 3 | Key facts | if known | I, sourced | Altitude range, varieties grown, processing methods, certifications, founded year |
| 4 | **Coffees from this estate** | always | R, I, D | Grid of cards; "See all 18 →" to the filtered directory |
| 5 | Roasters who source here | always | I | Every roaster with a coffee from the estate, ordered by number of coffees, with that rule stated |
| 6 | About the estate | always | E | Description; owner or family story and quote if held, attributed |
| 7 | Photos | if held | E | With credit |
| 8 | In this region | always | I | Other qualified estates nearby; link to the region page |
| 9 | Read more | if an article features it | E | Explicit references only |
| 10 | FAQ — final block | only if meaningful FAQ content exists | E | Original, factual estate questions and answers; omit otherwise. Do not add boilerplate merely for schema |

No Buy and no estate rating: an estate is an origin, not a product. Rating happens on its coffees.

States: fewer than 3 public coffees after launch (page drops out at the next build, link reverts to the filtered view); no photo (contour motif placeholder, not a stock image); unknown facts omitted, never guessed.

SEO: one h1, breadcrumb schema, canonical self, in the sitemap only while eligible.

### 7.4 Estate index — `/estates`

A directory in the same template as `/coffees` and `/roasters`: title with live count, estates grouped or filterable by region, each card showing name, region, coffee count and roaster count. Only qualified estates. If fewer than about ten qualify at launch, the index ships anyway but is linked from Origins rather than promoted.

### Decisions needed

| # | Decision | Recommendation |
|---|---|---|
| B17 | Roaster page: coffees and the "what they roast" summary above the About text | **Accepted 2026-11-11** |
| B18 | Roaster partner call-to-action reduced to one line | **Accepted 2026-11-11** |
| B19 | Estates are not rateable; ratings stay on coffees and roasters | **Accepted 2026-11-11** |
| B20 | Estate page lists every sourcing roaster, ordered by coffee count | **Accepted 2026-11-11** |
| B21 | Add per-band homepage tracking before the redesign ships | Approved requirement. Local/uncommitted work on `home_section_viewed` and `home_section_clicked` was reported; GitHub branch and production status not verified. Owner is handling urgent production fixes in a separate PR |

## 8. Articles, tools and account

### 8.1 Article — `/learn/<slug>`

Second-largest entry point (2,357 landing sessions), mostly mobile, and the slowest template to load.

| # | Block | Shown when | Source | Content |
|---|---|---|---|---|
| 1 | Breadcrumb | always | I | Home › Learn › [category] |
| 2 | Title, author, dates | always | E | h1; published and updated dates; reading time |
| 3 | Lead image | if any | E | Espresso wash allowed here (editorial photo) |
| 4 | Body | always | E | **The existing embeds are the catalogue links**: coffee, roaster and region spotlights, collections and charts, placed by the editor. They are restyled to use the shared coffee card; no automatic strip duplicates them (owner direction 2026-11-11) |
| 5 | Closing link | always | I | One link derived from the category (Origins → `/regions`; Brewing → the brew landings; Processing → the process landings), so an article with no embeds still leads into the directory |
| 6 | Series and related | if any | E | Previous and next in series; related articles |
| 7 | Author | always | E | Name, short bio, link to author page |
| 8 | FAQ | if the article has one | E | Last, with schema |

Listing pages (`/learn`, category, series, author) keep their structure: title, short intro, article cards, paging. The Learn index adds a row of the five categories under the title.

Glossary: each term gets a stable anchor so attribute labels elsewhere can link to it; where a term matches a landing page, the entry links to it ("Washed → washed coffees").

Insights (`/learn/insights`): the charts first, each with its date and sample size, then method notes. This is where future research reports attach.

### 8.2 Tools — `/tools/*`

Highest engagement on the site (72%) from a small audience.

| # | Block | Content |
|---|---|---|
| 1 | Breadcrumb, h1, one-line purpose | Unchanged |
| 2 | **The tool itself** | First on the page, usable without scrolling |
| 3 | Handoff | "Coffees for [method] →" to the matching brew-method landing, chosen from what the visitor selected in the tool. Becomes a gear handoff too when `/gear` ships |
| 4 | How it works, tips | Existing explanatory content |
| 5 | Related tools and articles | Existing |
| 6 | FAQ | Last, where one exists |

The `/tools` hub stays a simple list of the four tools with one line each.

### 8.3 Profile and Settings — two separate things (owner direction, 2026-11-11)

**Research addendum (PROPOSED):** Extend the owner's coffee-history composition to distinguish private *Want to Try*, self-marked *Tried*, and independent *Rated*. This should reuse the existing Profile rather than introducing a separate “My Coffee” app or moving things back into Settings. Keep public ratings and private personal signals distinct; final tab/grouping design is an approval item.

Revised after reading `ProfilePage.tsx` and the dashboard. They stay separate, with different purposes. **The profile is the one place a member sees everything about their coffees. The dashboard is labelled "Settings"** everywhere a visitor sees it; its `/dashboard/*` URLs can stay, since they are not indexed.

| | **Profile** | **Settings** (today's dashboard) |
|---|---|---|
| URLs | `/profile/<username>`, `/profile/anon`, `/profile` (redirect) | `/dashboard/*` |
| Purpose | Their coffee life: what they have rated, their taste, their picks and gear. Made to be looked at and shared | Managing the account |
| Audience | The member, and anyone they share it with | The member only |
| Indexing | Public profiles as today; anonymous profile noindex | noindex, blocked in robots |

#### Profile (existing structure kept)

| # | Block | Source | Content |
|---|---|---|---|
| 1 | Header | member | Name, avatar, location, joined date. Owner sees Edit |
| 2 | At a glance | D (their own) | Counts shown, not described: coffees rated, roasters tried, regions and processes covered |
| 3 | Section tabs | — | Existing |
| 4 | Taste profile | I, from their ratings | Sensory summary, with the number of ratings it rests on. With too few ratings: "Rate 3 more coffees to see your taste profile" |
| 5 | Selections | member | Their picked coffees; shareable, with its own share image |
| 6 | Ratings | D (their own) | All their ratings, coffees and roasters, as cards with score and date, newest first, with "Show all". Today the profile shows only the six most recent and the full list sits in My reviews; the full list moves here. Editing stays as it works now: the card opens the coffee or roaster, where the rating sheet shows their rating to change |
| 7 | **Wishlist** | member | Saved coffees as cards with stock and price. **Owner only**: private by default and never shown to other visitors or in share images. Moved here from the dashboard |
| 8 | Gear station | member | Their equipment; shareable. Links to `/gear` pages when those exist |
| 9 | Share | — | Existing share controls |

Viewer states (existing `isOwner` and `isAuthenticated` behaviour kept):

| Viewer | Difference |
|---|---|
| Owner | Edit, add selection, add gear, share buttons; a link to the dashboard |
| Anonymous owner (`/profile/anon`) | Same page built from their device's ratings, plus "2 of 3 ratings used — sign in to keep your profile and rate more" |
| Another visitor | Read-only; "Rate a coffee to start your own" at the end |

Rules: "tried" is only ever set by the member (a rating or selection). Views and Buy clicks never appear here. The taste profile is labelled as derived from their ratings.

#### Settings (today's dashboard)

| Page | URL | Holds |
|---|---|---|
| Overview | `/dashboard` | Profile completion and shortcuts |
| Profile details | `/dashboard/profile` | Name, username, avatar, location |
| Coffee preferences | `/dashboard/preferences` | Stated preferences (roast, process, flavour, milk, decaf) |
| Notifications | `/dashboard/notifications` | Email settings |
| Privacy and data | `/dashboard/privacy` | Consent, export, deletion |
| Developer | `/dashboard/developer` | API keys and usage, for members with access |

Leaving Settings: **Wishlist** moves to the profile (decided). **My reviews** follows (decided): its full list of coffee and roaster ratings becomes the profile's Ratings section. `/dashboard/wishlist` and `/dashboard/my-reviews` then redirect to the matching profile section.

#### Account menu (header avatar)

| Item | Goes to | Status |
|---|---|---|
| **Profile ▸** | `/profile` (parent entry) | **APPROVED** expandable parent; its important child shortcuts and exact labels are **OPEN**, to decide in the account-menu component phase |
| **Settings** | `/dashboard` | **APPROVED** |
| **Sign out** | Existing sign-out action | **APPROVED** |

Do not introduce My ratings, Wishlist or Developer as competing top-level avatar-menu items: they live in Profile or Settings. Anonymous visitors who have rated see "Your profile" (`/profile/anon`) and Sign in. Make the Profile parent a usable link as well as an accessible submenu trigger; the exact interaction pattern is part of component design.

Other rules: sign-in is asked for when it is needed (fourth rating, wishlist), with the reason stated, never on arrival. Onboarding stays two steps and skippable. Empty profile: "You haven't rated anything yet. Find a coffee you've tried →" opening search in rating mode.

### 8.4 System pages

| Page | Content |
|---|---|
| 404 | Message, **search field**, links to Coffees, Roasters, Origins, Learn |
| Error | Message and retry; header and search stay usable |

### Decisions needed

| # | Decision | Recommendation |
|---|---|---|
| B22 | Articles: no automatic "In this article" strip; existing spotlight and collection embeds do that job, plus one category link at the end | **Decided 2026-11-11** |
| B23 | Tools put the tool first, explanation after | **Accepted 2026-11-11.** Each tool may be redesigned individually later for better use; out of scope here |
| B24 | Profile holds members' coffee activity including private Wishlist; dashboard is labelled Settings. Avatar menu: expandable Profile (children TBD), Settings, Sign out | **Approved 2026-11-11**; submenu children OPEN until component phase |
| B26 | My reviews folds into the profile's Ratings section (full list, coffees and roasters) | **Accepted 2026-11-11** |
| B25 | 404 gains a search field | Approved design requirement; not implemented |

## 9. Lifecycle acceptance and edge-state matrix (PROPOSED 2026-11-14)

**This supplements, rather than supersedes, the approved page sequence and component sizes.** Detail is in [28](28-research-lifecycle-and-future-cafes.md). Component agents should not apply it before the next interaction gate.

| Condition | Coffee card | Coffee detail | Owner Profile / returning Home |
|---|---|---|---|
| Visitor has no history | Neutral pack + wishlist heart + honest rating footer | Buy, Rate; proposed quiet Tried | Ordinary neutral discovery |
| Wishlisted, not tried | Heart filled; no implied check-in | “Saved” + optional Mark as tried | Private Want to Try; resume coffee |
| Tried, not rated | Card still presents neutral public rating | Tried state; optional Add rating, dismissible | Private Tried list and optional reminder |
| Rated | Existing “Your rating: N” footer | Edit rating; Tried is implied by actual self-rating | Ratings remain distinct from individual brew logs |
| Saved and tried | Both retained unless user explicitly un-saves | Both indicators can coexist | May appear in both personal views |
| Sold out/discontinued | Honest availability | Follow approved Buy suppression/alternative rules; Rate remains | History preserved; alternative suggestions aren't same item |
| Signed out | Save currently requests sign-in; existing rating allowance applies | No promise of cross-device saved state | Anonymous ratings remain separate from authenticated personal collection |

**Review QA:** show mobile 375px and desktop in both themes; focus/hover/tap, no extra card height, no CTA crowding, no forced modal, no inferred purchase, no fake “verified tasting”, and accessible labels. Real persistence/schema only after an audit of current `wishlists`, `user_coffees`, anonymous review merge and moderation.

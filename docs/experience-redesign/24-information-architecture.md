# 24 — Information Architecture: Audit, Proposed Sitemap and Navigation

**Status (2026-11-11): APPROVED design baseline (Phase A).** Navigation, sitemap and discovery architecture are approved for design, not yet deployed. The owner is handling urgent production fixes in a separate PR to `main`; do not treat local tests or this design document as proof of a deployed fix. Section 6 is the authoritative navigation contract, and [25](25-page-hierarchy.md) defines account-menu hierarchy and page content.

**Summary.** The URL structure is sound and should stay almost entirely as it is. What needs to change is navigation, the dead-end attributes on coffee pages, the separation between editorial and the directory, and a handful of orphaned pages. One new entity template (estate) is justified; everything else is reorganisation or deferral.

## 0. Method and what was verified

| Checked | Result |
|---|---|
| `src/` history | Last change 2026-10-28. The [2026-11-07 audit](current-state-audit.md) still matches the code; header, footer, sitemap, robots, redirects, coffee-detail linking and search scope were re-read and agree with it. |
| Live `sitemap.xml` (fetched today) | 1,311 URLs: 1,000 coffee detail, 119 roaster, 97 article, 42 landing, 23 static, 16 newsletter issues, 8 series, 5 categories, 1 curation. |
| Live `/api/coffees/filter-meta` (fetched today) | Facet counts used in §4. They cover the directory view, which includes discontinued coffees. |
| Database | **Not re-queried** (the SQL connector refused permission). Estate-gate and public-coffee counts below are the 7 Nov audit figures. |
| Search Console, analytics | Not re-fetched; the audit's 2 Nov snapshot is used. |

### Defects found during the audit (historical evidence; production fixes handled in a separate PR)

1. **The audited live sitemap listed exactly 1,000 coffee pages.** `src/app/sitemap.ts` selects coffees without paging, so PostgREST truncates at 1,000 rows (the problem ADR-011 describes). With 1,688 public coffees on 7 Nov, roughly 690 coffee URLs are absent from the sitemap. This is the largest SEO issue found and is independent of the redesign.
2. `/tools/grind-size-converter` is not in the sitemap although it was the eighth-ranked organic page (85 clicks). `/developers`, `/learn/insights` and `/learn/author/*` are also absent.
3. The header's Explore parent links to `/explore`, which does not exist, and it carries a disabled "Estates — Coming Soon" item pointing at a route that does not exist.
4. The homepage "Fruity" chip goes to `/coffees?q=fruity`, which is a name search, not the flavour facet.
5. `/budget-coffee` is declared twice in the redirects.
6. `/coffees/chikmagalur` filters on its own slug and omits coffees tagged to child regions (documented in `CLAUDE.md`; 206 coffees at the time of writing there).

## 1. Three separate things

| Layer | What it is | Verdict |
|---|---|---|
| **URL sitemap** | What crawlers and deep links see | Keep. Add estate URLs only. |
| **Navigation** | What visitors see in header, footer, search, breadcrumbs and links inside pages | Reorganise substantially. |
| **Templates** | The page types that render those URLs | 13 families; one new (estate). |

## 2. Current URL sitemap

| Family | URL pattern | Count | Indexable | In sitemap | Organic role (2 Nov snapshot, top-100 pages) |
|---|---|---|---|---|---|
| Home | `/` | 1 | yes | yes | 327 clicks; main direct-traffic door |
| Coffee directory | `/coffees`, `?page=N` | 1 | yes; any filter is noindex, canonical `/coffees` | yes | 13 clicks |
| **Discovery landing** | `/coffees/<slug>` | 42 | yes | yes | **1,034 clicks, the top template** |
| Roaster directory | `/roasters` | 1 | as above | yes | 161 |
| Roaster detail | `/roasters/<slug>` | 119 | page 1 only | yes | 537 |
| **Coffee detail (canonical)** | `/roasters/<slug>/coffees/<coffeeSlug>` | 1,688 public | yes | **1,000 only** | 432 |
| Regions hub | `/regions` | 1 | yes | yes | not in top 100 |
| Learn index | `/learn`, `/learn/page/N` | 1 + pages | yes | index only | — |
| Article | `/learn/<slug>` | 97 | yes | yes | 919 |
| Learn groupings | `/learn/category/<slug>` (5), `/learn/series` + `/<slug>` (8), `/learn/author/<slug>` | — | yes | authors missing | — |
| Reference | `/learn/glossary`, `/learn/insights` | 2 | yes | insights missing | — |
| Tools | `/tools` + 4 tools | 5 | yes | grind converter missing | 104 |
| Community | `/communities`, `/curations`, `/curations/<slug>` (1) | 3 | yes | yes | 97 |
| Company and legal | about, contact, press, how-icb-works, newsletter (+16 issues), privacy, terms, data-deletion, developers | 10 + 16 | yes | developers missing | — |
| For roasters | `/roasters/partner`, `/roasters/terms`, `/roasters/<slug>/badges` | — | badges noindex | first two | — |
| Account | `/profile`, `/profile/anon`, `/profile/<username>`, `/dashboard/*` (8), `/auth/*` (4) | — | no, except public profiles | no | — |
| Redirect and tracking | `/roasters/<slug>/coffees` → roaster; `/go/*`; `/badges/*`; ~40 permanent redirects (11 legacy slugs, 14 region aliases, newsletter ids) | — | — | no | Equity to preserve |

Planned but absent: `/estates`, `/estates/<slug>` (ADR-013), `/gear` (plan only), variety pages, flavour pages.

## 3. Current navigation

**Header (desktop and the mobile sheet carry the same groups):**

```
Profile                → /profile (signed in) or /profile/anon
Explore ▾  (/explore does not exist)
  Coffees · Roasters · Communities · Estates (disabled) · Regions
Learn ▾    Articles · Series · Glossary
Tools ▾    All tools · Brew Calculator · Expert Recipes · Coffee Compass · Grind Size Converter
[Search ⌘K]  [For Roasters]  [Login]   or avatar menu → dashboard pages
```

**Footer:** Discover (Coffees, Roasters, Communities) · Learn (3) · Tools (4) · Company (About, Contact, Press, How ICB works, Newsletter, Partner) · legal · social.

**Search:** one command palette on every main page; coffees and roasters only. It already has a rating-intent mode. The directory's own `q` box is a separate name-only match.

**What is wrong with it**

| Problem | Why it matters |
|---|---|
| Coffees and Roasters, the two main destinations, sit inside a dropdown called Explore | One extra step for the most common task; the label says nothing |
| The 42 landing pages are in neither header nor footer | The best-performing organic template is reachable only from the homepage accordion and inline links |
| Rating has no header entry | It is one of the two primary actions |
| "Profile" is the first nav item for anonymous visitors | It leads to an anonymous-profile page before the visitor has done anything |
| `/regions`, `/curations`, `/learn/insights`, `/developers`, `/tools` are missing from the footer; insights and curations from the header too | Orphaned or near-orphaned pages |
| Communities is in the primary group | An index of external groups is not part of Find, Rate, Buy |
| Breadcrumbs are visible only on landing pages and two Learn templates | A mobile visitor arriving on a coffee page from search has no way up |
| No bottom bar on mobile, and no persistent Buy/Rate bar is part of the chrome | To be resolved at the coffee-page level, not globally (§6) |

## 4. Entity relationships: where each attribute leads today

Counts are from today's directory facets.

| Attribute on a coffee | Today | Data available | Proposed doorway |
|---|---|---|---|
| Roaster | Link | 122 roasters | Keep |
| Roast level | Link to landing | 5 of 5 values have pages | Keep |
| Brew method | Link to landing | 9 pages | Keep |
| Species / bean type | Link to landing | 7 pages | Keep |
| Process | Link only if a page exists | 5 pages. No page: experimental (211), carbonic maceration (60), washed-natural (65), double fermented (40), others | Page if it exists, otherwise filtered directory |
| Region | Link only if a page exists | 12 pages; Hassan (101 coffees rolled up) has none | Page if it exists, otherwise filtered directory. Fix the roll-up first |
| **Estate** | **Plain text** | 340 estate labels, 83 with 3+ coffees; 15 passed the ADR-013 gate on 7 Nov | Filtered directory now; estate page once it exists |
| **Flavour note** | **Tag, not a link** | 226 canonical descriptors in use, 38 with 50+ coffees, 15 families | Filtered directory (`?flavors=`) |
| **Variety** | Tooltip | Text array on 42% of coffees; not a directory facet | Link to the varieties article now; a directory link after variety becomes a facet |
| Altitude | Fetched, not shown | — | Show as a fact. Not a doorway |
| Articles, glossary | None | 97 articles; landing configs already hold curated `learnLinks` | "Read about this" strip (§5.3) |

Editorial points at the catalogue through spotlight and collection blocks inside articles. Nothing points back.

## 5. Proposed architecture

### 5.1 One rule for every doorway

Every attribute shown on a coffee, roaster, estate or article resolves through the same three steps:

1. **An indexable page exists for this value** → link to it (`/coffees/<slug>`, `/roasters/<slug>`, later `/estates/<slug>`).
2. **Otherwise, the value is a directory facet** → link to the filtered directory (`/coffees?estates=…`, `?flavors=…`, `?processes=…`). These stay noindex with canonical `/coffees`, as today.
3. **Otherwise** → plain text. No link to nowhere.

Consequences:

- Every attribute becomes a doorway with **no new URLs**. Visitors always land on the familiar directory or a landing page, never on a graph.
- A value earns an indexable page later by moving from step 2 to step 1. The interface does not change when it does.
- Destination labels state what they are: "42 coffees from Ratnagiri Estate", not "Explore".

### 5.2 Proposed sitemap

`=` unchanged URL · `+` new URL · `~` same URL, changed content or links · `…` deferred

```
/                                   ~ homepage v2: anonymous, and a returning-member state at the same URL
├─ /coffees                         = directory (filters, sort, shareable URLs)
│  ├─ /coffees/<slug>               = 42 discovery landings, flat namespace kept
│  │    brew (9) · roast (5) · process (5) · price (4) · region (12) · bean type (7)
│  │    … further values only when coverage and search demand justify them
│  └─ ?filters                      = noindex views; now the target of doorway links
├─ /roasters                        = directory
│  └─ /roasters/<slug>              ~ adds breadcrumbs and editorial strip
│     └─ /coffees/<coffeeSlug>      ~ canonical coffee detail; every attribute a doorway
├─ /regions                         ~ hub; adds links to estates when they exist
├─ /estates                         + index (ADR-013)
│  └─ /estates/<slug>               + only estates passing the ADR-013 gate
├─ /learn                           = index, paging
│  ├─ /learn/<slug>                 ~ article; adds a closing doorway strip
│  ├─ /learn/category/<slug>        = 5
│  ├─ /learn/series, /<slug>        = 8
│  ├─ /learn/author/<slug>          = (add to sitemap)
│  ├─ /learn/glossary               ~ terms become link targets from attribute labels
│  └─ /learn/insights               ~ home for data and future research reports; add to nav and sitemap
├─ /tools + 4 tools                 ~ each tool hands off to the matching brew-method landing
├─ /communities, /curations(/slug)  = partnership surfaces; More ▾ in the header
├─ /gear, /gear/<slug>, /gear/<group>/<value>   … own plan (docs/gear-directory-plan.md); enters nav as Brew ▾
├─ /profile/<username>, /profile, /profile/anon, /dashboard/*, /auth/*   = grouped under one account menu
├─ company, legal, newsletter, /developers, /roasters/partner|terms|badges  =
└─ … variety pages · flavour-family landings · compare · Concierge
```

### 5.3 Editorial and catalogue, joined without new schema

| From | To | Mechanism |
|---|---|---|
| Coffee detail | 1–3 articles | Reuse the `learnLinks` already curated on the landing config for that coffee's process, region and brew method. No Sanity change. |
| Roaster detail, estate page | Articles that feature it | Reverse lookup of existing spotlight blocks (audit §11). Show nothing if there are none. |
| Article | Directory | A closing strip: the coffees or landing pages the article already embeds, plus one link derived from its category (Origins → `/regions`, Brewing → the brew landings). |
| Attribute label | Glossary | A small "what is this?" link to the glossary anchor. |
| Tool | Coffees | Brew tools link to `/coffees/<brew-method>`. |
| Region landing | Estates | Estates in that region, once estate pages exist. |

Reverse links use **explicit references only** (spotlight and manual collection blocks, curated `learnLinks`). An article is never linked because its text happens to contain a name; dynamic collection blocks need their own matching rule. Internally, keep four relationship types distinct: factual (grown in), catalogue-matched (same process), computed (similar), editorial (featured in).

Typed references in Sanity are the better long-term answer, but they need editor effort on 97 articles. Start with what exists.

### 5.4 What happens to each area

| Change type | Items |
|---|---|
| **Keep unchanged** | All existing URLs, slugs, canonicals, noindex rules, JSON-LD, the ~40 redirects, the flat `/coffees/<slug>` namespace, coffee detail under the roaster path, `/regions` as hub only, Learn URL structure, filter URL parameters |
| **Reorganise within existing pages** | Coffee detail (doorways, breadcrumbs, editorial strip, altitude); roaster detail (same); landing pages (estate links, fuller grid handoff); articles (closing strip); homepage (content bands combined into one coherent scroll-led story, without requiring visually isolated sections); tools (handoff); 404 (add search) |
| **Add to navigation** | Coffees, Roasters and Origins as top-level; landing pages via a "Browse by" panel; Rate via search/home/mobile menu; Insights via Learn; footer links for regions, curations, tools hub, developers |
| **New templates** | Estate detail and estate index. A returning-member homepage state (same URL). Grouped search results (no URL). |
| **Merge or simplify** | Explore dropdown removed. Profile (with nested shortcuts), Settings and Sign out in one account menu; URLs kept. Tools dropdown reduced to one link. Communities and Curations to the footer. Two search behaviours (palette and directory `q`) given the same matching. |
| **Defer** | Variety pages (no table, 42% coverage); flavour-family landings (need demand research and a slug rule, since `honey` is already a process slug); extra process and region landings; `/gear`; a research section (use `/learn/insights`); compare; Concierge; `/regions/<slug>` (rejected by ADR-013, no reason to reopen) |

## 6. Recommended navigation

### Desktop header — final (owner-approved 2026-11-11)

```
Now:        [ICB]  Coffees ▾   Roasters   Origins ▾   Learn ▾   Tools    More ▾     [ Search coffees, roasters, origins… ]   Sign in
With gear:  [ICB]  Coffees ▾   Roasters   Origins ▾   Brew ▾    Learn ▾  More ▾     [ Search… ]   Sign in
```

Every label is itself a link; panels add secondary discovery.

| Label | Goes to | Panel |
|---|---|---|
| Coffees | `/coffees` | "Browse by" roast, brew method, process, bean type, price; All coffees, Just added, Top rated. All existing landing URLs, server-rendered |
| Roasters | `/roasters` | none |
| Origins | `/regions` | Top regions (their `/coffees/<slug>` landings), All regions, Estates when live. A label only; no new URL hierarchy |
| Learn | `/learn` | Five categories, Series, Glossary, Insights |
| Tools | `/tools` | none. Becomes **Brew** (Gear + tools) when `/gear` ships |
| More | — | Communities, Curations, Newsletter, future partnership surfaces. New items join here, not the top level |

- **No Rate button in the header.** Rating is an action, not a page, and has no URL. It is offered in the search panel ("Rate a coffee you've tried"), on the homepage as one of the two main actions, in the mobile menu, and on every coffee page. Add a header button later only if rating data shows people cannot find it.
- **Account — owner-approved structure:** Sign in for signed-out visitors; for members, **Profile ▸** (expandable submenu of important profile destinations), **Settings**, **Sign out**. The Profile submenu destinations and exact labels are **OPEN until the account-menu component phase**; do not hard-code My ratings, Wishlist or Developer as additional top-level account items. Anonymous visitors who have rated can access `/profile/anon` via "Your profile" and can Sign in. Profile content and Settings remain distinct; see [25 §8.3](25-page-hierarchy.md).
- "For Roasters" moves to the footer.
- Communities and Curations also appear in the homepage community band and contextually (a curation that includes a coffee is shown on that coffee's page). The "Missing a community?" request path on `/communities` stays prominent.

### Mobile

- Top bar: logo, search, menu. The menu sheet opens with the search field, then the six destinations (Coffees expands to the same "Browse by" groups), Rate a coffee, and account.
- **No global bottom tab bar.** The coffee page owns the bottom edge with its sticky Rate and Buy bar; a second bar would compete with it. Most mobile visits are deep links that need the page, not app chrome.
- Breadcrumbs on every detail template are the way back up.

### Secondary navigation

| Where | What |
|---|---|
| Coffee, roaster, estate, article | Visible breadcrumbs matching the existing `BreadcrumbList` JSON-LD |
| Directories | Filter bar and active-filter chips, as today |
| Coffee detail | Existing section tabs |
| Learn | Category row on the index and on articles |
| Account | Existing dashboard sidebar, relabelled |

### Footer

| Directory | Learn | Tools | Community | For roasters | About |
|---|---|---|---|---|---|
| Coffees | Articles | All tools | Communities | List or claim your roastery | About |
| Roasters | Series | Brew calculator | Curations | Badge kit | How ICB works |
| Regions | Glossary | Expert recipes | Newsletter | Roaster terms | Press |
| Estates (when live) | Insights | Coffee compass | | Developers and API | Contact |
| Top rated | | Grind size converter | | | |

Legal row: Privacy · Terms · Data deletion. On mobile the columns collapse to accordions.

### Search scope

Results grouped in this order: **Coffees**, **Roasters**, **Browse** (landing pages, regions, estates, flavours and processes that match the query, e.g. "natural" → "Natural process coffees"), then **Articles and glossary**. One interface, separate sources (the search RPC stays coffee and roaster; Browse is static config; articles come from Sanity). In rating mode only coffee results lead into the rating flow. A region without a landing page links to a validated directory filter or an anchor on `/regions`, never an invented `/regions/<slug>`. The Browse group needs only the landing configs and the flavour taxonomy, which are small static lists. Articles need a Sanity query and can follow. No `/search` page is proposed.

## 7. Journeys

### 7.1 Find and buy

```
Google ─► landing page (/coffees/v60) ─► "See all" ─► /coffees?brewMethodIds=… ─► coffee page ─► Buy ↗ roaster site
Google ─► coffee page ────────────────────────────────────────────────────────────┘
Home   ─► search or Coffees ▸ Browse by ─► directory ─► coffee page
```

| | Today | Proposed |
|---|---|---|
| Anonymous, mobile deep link | Lands on a coffee page with no breadcrumb and several dead attributes | Breadcrumb up to roaster and directory; every attribute opens related coffees |
| Landing → directory | "See all" keeps the filter, drops the in-stock filter | Carry both, and say how many coffees there are |
| Back button | Filter changes replace history, so Back leaves the directory | Push history on facet change (already an open item) |
| Returning | Recently viewed in the hero | Same, in the returning homepage state |
| Buy | Direct external link, untracked | Same link, marked ↗, with a consented click event. A click is purchase intent, never a purchase |

Neutrality rules that the structure must hold: default sort stays newest; Top rated is a sort that shows sample sizes; "Browse by" lists attributes, never roasters; any rail that picks coffees states its rule.

### 7.2 Rate and contribute

```
Homepage / search / mobile menu "Rate a coffee" ─► search (rating mode) ─► coffee ─► rating sheet ─► optional context (brew, notes) ─► Your ratings
Coffee page ─► Rate ──────────────────────────────────────┘
Return visit ─► "Have you tried it?" on coffees viewed ─► rating sheet
```

| | Today | Proposed |
|---|---|---|
| Entry | Coffee page and the palette's rating mode; nothing in the header | Homepage, search panel and mobile menu; no separate desktop-header Rate button |
| Anonymous | Up to three entities, then sign-in | Same; the limit is stated before the visitor hits it |
| After rating | Modal closes | Offer context fields, then link to Your ratings |
| Returning | Hero segment | Asks, never assumes, and never on the strength of a Buy click |
| Coffee not listed | Dead end | "Can't find it?" link to the contact form. Small, new |

### 7.3 Discover and learn

```
Article ─► embedded coffees / closing strip ─► landing page or directory ─► coffee ─► estate ─► other coffees from it
/regions ─► region landing ─► estates in the region ─► estate page ─► coffees
Coffee ─► flavour chip ─► directory filtered by flavour ─► another coffee ─► "Read about this process" ─► article
```

| | Today | Proposed |
|---|---|---|
| Article → catalogue | Only where an editor embedded a block | Every article ends with a doorway strip |
| Catalogue → article | None | Strips on coffee, roaster, landing and estate pages |
| Estate | Plain text | Filtered directory, then estate page |
| Search | Cannot find an article or a region | Browse and Articles groups |
| Mobile | Articles are the slowest template and rarely scrolled | The closing strip must not be the only doorway; place one after the introduction too |

## 8. Templates

| # | Template | URLs | Status | Shares with |
|---|---|---|---|---|
| T1 | Home | `/` (anonymous, returning) | Redesign | Coffee card, rating snippet, article card |
| T2 | Directory | `/coffees`, `/roasters`, `/estates` | Keep structure | Filter bar, cards, pagination, empty state |
| T3 | Attribute landing | `/coffees/<slug>` ×42 | Keep, restyle | Page header, coffee grid, FAQ, related links, editorial strip; region variant shares the origin profile with T5 |
| T4 | Coffee detail | `/roasters/<slug>/coffees/<coffeeSlug>` | Redesign | Doorway chips, rating block, editorial strip, coffee grid |
| T5 | Roaster detail | `/roasters/<slug>` | Restyle | Coffee grid, rating block, editorial strip, FAQ |
| T6 | **Estate detail** | `/estates/<slug>` | **New** | Origin profile (from T3 region), coffee grid, editorial strip |
| T7 | Hub | `/regions`, `/tools`, `/learn/series`, `/curations`, `/communities` | Restyle | Page header, card grids |
| T8 | Article | `/learn/<slug>` | Restyle | Embeds use the coffee card; closing doorway strip |
| T9 | Editorial listing | `/learn`, category, series detail, author | Restyle | Article card, pagination |
| T10 | Reference | glossary, insights | Restyle | — |
| T11 | Tool | 4 tools | Restyle | Handoff strip |
| T12 | Account | profile, anon profile, dashboard ×8, auth ×4, onboarding | Restyle later | Rating list, coffee card |
| T13 | Static and system | company, legal, newsletter, developers, roaster pages, 404, error | Restyle | Page header |

Shared components this implies: coffee card and grid; doorway chip with the §5.1 rule built in; rating summary with sample size; editorial strip; origin profile; breadcrumbs; page header; FAQ; empty state.

## 9. SEO implications

| Change | Effect | Risk and guard |
|---|---|---|
| No URL changes | Rankings and redirects untouched | Crawl diff of every sitemap URL before and after |
| "Browse by" panel in the header | Site-wide internal links to the 42 landing pages, the top organic template | Must be server-rendered links, not built on hover |
| Doorway links to filtered directory URLs | More crawl paths into noindex pages | Already `noindex, follow` with canonical `/coffees`. Watch crawl stats; add `nofollow` to these links only if crawl budget suffers |
| Regions leaves the top level for the Coffees panel | None if the panel is server-rendered | `/regions` keeps site-wide header and footer links |
| Visible breadcrumbs | Matches existing JSON-LD; better mobile exits | Keep one h1; breadcrumb text must equal the schema |
| `/estates` and `/estates/<slug>` | New indexable pages for "coffee estate" demand (1,116 impressions) | ADR-013 gate enforced in page generation **and** sitemap, 404 for ineligible slugs, recounted at launch; unqualified estates stay as filtered views |
| Editorial strips | Links from 1,700 catalogue pages to articles and back | Render server-side; show nothing rather than a weak match |
| Search grouping | None | — |
| Sitemap repairs (defects 1–2) | About 690 coffee pages and the grind converter become discoverable | Page the query (ADR-011) |

## 10. New pages and capabilities, in priority order

| Priority | Item | Type |
|---|---|---|
| 0 | Sitemap paging; add missing URLs; remove `/explore` and the disabled Estates item; fix the Fruity chip | Fix, no design dependency |
| 1 | Doorway rule on coffee detail (estate, flavour, unconfigured process and region) | Capability, no new URL |
| 1 | Header and mobile navigation as in §6, including Rate a coffee | Navigation |
| 1 | Visible breadcrumbs on coffee, roaster and article | Component |
| 1 | Editorial strips from existing `learnLinks` and embeds | Capability |
| 2 | Estate detail and index (ADR-013) | New template |
| 2 | Search "Browse" group, then articles and glossary | Capability |
| 2 | Region roll-up fix; landing → directory handoff; history on filter change | Fix |
| 2 | Returning-member homepage state | Template state |
| 3 | Variety as a directory facet, then reconsider pages | Data first |
| 3 | Flavour-family landings; extra process and region landings | Needs demand research |
| Later | `/gear`, research reports, compare, Concierge | Own plans |

## 11. Decision register (reconciled 2026-11-11; §6 and [25 §8.3](25-page-hierarchy.md) govern navigation/account details)

Phase B order: discovery landing and directory, coffee detail, homepage, then roaster/region/estate, then articles, tools and account. Homepage bands are a **content inventory and narrative order**, not a mandate for visually separate stacked sections. Scroll-driven transitions may connect them into a single story; specify and validate motion in the composition phase, respecting performance, keyboard access and reduced motion.

| # | Decision | Recommendation |
|---|---|---|
| 1 | Accept "URLs unchanged; estates are the only new URL family" as the baseline | Yes |
| 2 | Primary navigation: Coffees ▾ · Roasters · Origins ▾ · Learn ▾ · Tools · More ▾ | Approved; see §6 |
| 3 | "Browse by" panel exposing the landing pages | Yes |
| 4 | Rating-intent search from homepage, search panel and mobile menu; no desktop-header Rate button | Approved in §6 |
| 5 | Communities and Curations sit in a More ▾ menu with Newsletter and future partnership surfaces, plus homepage and contextual placement | Yes (owner direction 2026-11-11) |
| 6 | Mobile: no global bottom bar; coffee page owns the sticky Rate and Buy bar | Yes |
| 7 | The doorway rule in §5.1, including links to noindex filtered views | Yes |
| 8 | Estates: ship detail and index together with the redesign; link to filtered views until then; remove the "Coming Soon" item now | Yes. Confirm the gate count first (15 on 7 Nov) |
| 9 | Origins is a top-level label linking to `/regions`, with regions and qualifying estates in its panel | Approved; see §6 |
| 10 | Keep the label "Learn" in navigation; "Field guide" stays editorial language on the homepage | Keep "Learn" |
| 11 | Search scope: add Browse group first, articles and glossary second | Yes |
| 12 | Editorial links: start from existing `learnLinks` and embeds; typed Sanity references later | Yes |
| 13 | Flavour: filtered-directory doorways now; family landing pages only after keyword research and a slug rule | Yes |
| 14 | Variety: no pages; make it a facet first | Yes |
| 15 | `/learn/insights` becomes the home for research, with no separate section | Yes |
| 16 | `/gear` takes the Tools slot as Brew ▾ when it ships; Compare and Concierge stay out | Yes |
| 17 | Urgent production defects in §0 | Owner is working on a separate PR to `main`. Historical local sitemap pagination test reported 1,678 coffee URLs; merge/deployment and other fixes must be verified through that PR, not claimed complete here |

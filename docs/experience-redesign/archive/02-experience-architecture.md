# 02 — Experience and Information Architecture

## Business-led experience architecture (confirmed mission; proposed UX mechanics)

**Discovery is the acquisition engine, independent reviews are the proprietary intelligence engine, trust is the moat, and ethical monetization funds sustained coverage.** The Atlas is a route from curiosity to real coffees and ultimately to meaningful contribution—not a destination to admire and leave.

**Contribution is a cross-cutting action across the three intent paths, not another compulsory homepage tile.** A user who finds a coffee can check independent reviews and their sample sizes, mark it tried only if actually tasted, submit a quick personal rating and optionally record brew/sensory observations. Returning members can revisit genuinely tried-but-unrated coffees if recorded evidence exists. Logging, saving and wishlisting are not the same as reviewing or proof of tasting.

Design every coffee-detail/deep-link and Atlas coffee-focus state around **discover → assess independent evidence → rate after tasting / log an experience → return** while preserving neutral exploration and technical filters. The rating flow must be voluntary, fast, genuine, accessible and compatible with existing anonymous/login limits, authenticity safeguards and privacy.

Commercial routes (proposals, not approved products): permissioned aggregate consumer insights, API/data licensing, research reports, and secondary disclosed affiliate/sponsor inventory. Never sell preferential organic ranks, ratings, review removal, graph edges or model answers. For measurement and buyer validation, see [17](../17-review-intelligence-and-monetization.md).

## Fundamental principle
**Design hospitality, not pages.** Preserve clear, indexable entity pages and precise professional tools beneath a fluid discovery layer. The experience should feel connected even with animations turned off.

## Three simultaneous intent paths (not separate sites)
1. **Guide me** — user knows a mood, desired sensation or occasion, not specialist terminology. A lightweight and optional set of prompts gradually reveals taste; no compulsory quiz.
2. **I know my coffee** — user wants immediate, powerful search and filters. Brew method, processing, roast, variety, origin/region, flavour, roaster, price and relevant technical facts must remain visible or one intentional action away.
3. **Let me explore** — narrative, articles, estates, regions, people, varietals, research, community and unexpected relationships.

The user can cross between paths without losing search, filters or reading context. Global search stays accessible. Logged-in/returning users are not forced through theatrical arrival.

## Canonical product objects / relationships
- **Coffees** — canonical coffee detail, process, roast, price, availability, tasting notes, ratings, purchase outbound links, relationships to other entities.
- **Roasters** — profiles, catalogue, methods, stories, outbound links, potentially community and review information.
- **Regions** — geographic and contextual relationships, coffee profiles, linked estates.
- **Estates** — growers, locations, varieties, cultivation and provenance when actually available.
- **Varietals / varieties** — botanical and cultural context, comparisons, linked coffees and estates.
- **Flavour notes** — structured sensory language, discovery entry points, user tastes and visualization.
- **Processing methods and roast levels** — technical filters, explanations, comparisons and entry points.
- **Brew methods** — discovery filter, equipment/recipes, and brew guidance.
- **Articles/learn/glossary/reports** — interleaved editorial depth, not a disconnected blog.
- **Tools** — compass, calculators, grind guidance, expert recipes and future helpful utilities.
- **Community** — ratings/reviews, curated selections, discussions and expertise when available.
- **Personalization** — preferences, equipment, tried/wishlist/disliked coffees, saved choices and transparent recommendations.
- **Gear** — equipment listings and discovery if implemented; not the centre of the coffee experience.

These are conceptual entities. Before building new routes or schemas, check existing DB tables, Sanity schemas and page coverage. Do not infer non-existent provenance from imperfect roaster descriptions.

## Relationships drive serendipity
From a coffee one could travel to its estate, region, process, varietal, typical flavour, related brew guidance, roaster, interviews and community experiences. A thoughtful related story should feel like overhearing a worthwhile conversation nearby, never a random recommendation carousel.

Relationships should have semantics and evidence. Examples: **grown at**, **roasted by**, **processed using**, **related variety**, **tastes of**, **can be brewed with**, **featured in**, **reviewed by**. Differentiate *known data*, *inferred similarity* and *editorial suggestion*.

## Visitor journey skeleton
**Newcomer:** atmospheric but fast welcome → choose guide/explore/search → concise contextual prompts → coffee suggestions with reasons → details and price link → adjacent origin/story invitation → optionally save tastes.

**Expert:** arrive via landing page or search → apply multiple technical facets instantly (e.g. V60 + natural + light + particular region) → results update with URL state and coherent transition → compare or open coffee details → use brewing tool → save or share without losing constraints.

**Organic-search visitor:** deep link to coffee/roaster/region/learn page → immediately receives fully meaningful HTML content → can see the context of ICB's universe and continue browsing without required homepage visit.

**Returning visitor:** immediate access to saved gear, ratings, preferences, wishlists and last discovery context. Offer new or unexpected suggestions without limiting choice.

## Navigation principles
- Direct routes and search are first-class citizens.
- Editorial journeys never obscure clear breadcrumbs, back navigation or browser semantics.
- A coffee detail page should work beautifully without WebGL, JavaScript-heavy animations or login.
- The 'menu' metaphor means layered, progressively disclosed information with rich context — not literal page flipping everywhere.
- Explore, Discover, Wander describe **intent modes**, not silos or mandatory navigation labels.

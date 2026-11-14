# 17 — Business North Star: Independent Reviews, Coffee Intelligence and Monetization

**Status:** Product mission **CONFIRMED** by owner on 2026-11-09; specific UX interventions, KPIs, monetization products and targets are **PROPOSED** pending validation. This document adds a business requirement to the Atlas redesign, not permission to change production or sell user data.

## 0. The mission that must not be lost

> **ICB exists to become the independent authority on Indian specialty coffee through credible consumer ratings, reviews and structured coffee intelligence.** Discovery brings coffee drinkers in; contributions create an increasingly trustworthy first-party evidence base; that evidence creates the right to publish valuable insights and develop ethical B2B data products.

**The Atlas is a discovery and contribution engine, not the end product.** The AI Concierge, sitewide content and visual identity must make honest independent reviews more likely, more useful and more representative, while creating viable monetization opportunities.

**Business flywheel:**
1. **Attract:** SEO, exhaustive neutral catalogue, Atlas exploration, technical filters, educational content and AI assistance bring relevant coffee enthusiasts.
2. **Experience:** people identify, buy externally, save or mark coffee as tried, and track what/how they brewed, when they choose.
3. **Contribute:** quick independent rating → optional contextual review (brew method, sensory observations, roast/batch if known, personal preference) without mandatory surveys.
4. **Establish authority:** trustworthy, provenance-aware consumer insights, meaningful aggregate comparisons and honest acknowledgement of uncertainty/coverage. More trustworthy data improves discovery and reputation.
5. **Monetize independently:** appropriately priced research, commercial APIs, aggregate roaster/industry intelligence and adjacent channels that do not distort reviews or organic recommendations.
6. **Reinvest:** strengthen coverage, verification, trust/safety and acquisition. Avoid prioritizing paid influence over independent evidence.

**Value is not identical to volume:** review quality, independent sources, recency, coverage across less-popular roasters, fraud resistance and selection bias all matter. A high volume of sparse, skewed ratings is not a credible national benchmark.

## 1. Guardrails — confirmed neutrality and trust

- ICB is independent of sellers. No paid positive reviews, no pay-for-ranking, no alteration/removal of legitimate criticism in exchange for money, no paid changes to factual relationships, AI answers, ratings or organic recommendation scores.
- A publicly neutral homepage is not a roaster ad. Logged-in viewers may see saved/previously tried coffees because **they** chose them, never as covert paid endorsements.
- Separate clearly disclosed advertising/sponsorship inventory from organic discovery. Sponsorship on the homepage, catalogue or reports is an **OPEN** commercial policy question, not approved.
- Publish methodology and uncertainty for scores, ranks, sample sizes and inferred taste. Reviews must be genuine user opinions and editable/reportable under moderation rules. Incentives, if any, must not be contingent on a favourable review; disclose them.
- Don't sell personally identifiable review histories or individual taste profiles. Commercial products should use appropriately anonymized/aggregated data with minimum group sizes, consent and privacy assessment, including relevant India data/privacy duties.
- Check contractual/licensing rights in catalogued third-party information before reselling or relicensing it; a public directory doesn't automatically grant redistribution rights.
- Never treat AI-generated tasting descriptions as independent user reviews. AI can help clarify a question or summarize **labelled aggregate facts**, but must not submit reviews for visitors, fabricate content or mask provenance.

## 2. Review contribution as a first-class UX journey

### A. At every relevant coffee focus

Coffee detail or focused Atlas node must make **independent ratings and review evidence visible and legible**, alongside product facts. Show rating summary with sample size, review recency and clear empty states. Keep an easy `Rate this coffee` / `Log a tasting` path accessible without forcing it as a modal interruption. A coffee with zero independent reviews should say so openly.

**Micro-contribution, not homework:**
- **Step 1 (seconds):** quick rating after genuinely trying the coffee; show user context: `Tried it? Add your rating`. Don't prompt before they experience it.
- **Step 2 (optional):** a concise sensory note, brew method, grinder/recipe, roast/batch/date or what they liked/disliked *when known*; strong distinction between `I tasted`, `roaster claims` and `ICB estimates`.
- **Step 3 (optional):** `Save`, `Tried`, wishlist, personal tasting log, and post-rating change/edit. A wishlist/coffee view is **not** a verified tasting.
- Respect existing anonymous rating behaviour and 3-entity anonymous limit; preserve anonymous-to-login merge and existing review tables unless an explicit decision changes them.
- Do not insert gamified contribution spam, guilt, dark patterns, over-aggressive sign-up gates, or forced AI conversation.

### B. In the open-ended graph

`Coffee` nodes may link to a **Reviews / Community observations** view with attributed aggregate and independently submitted entries. Other edge types should include `Reviewed by people` / `Has independent reviews` only when the review is genuine and public. Avoid exposing personal reviewer identities, showing fake certainty, or inventing an entity node for every reviewer.

The graph should help contributors find coffees they've **actually tried** that still need a rating, and help them compare their own structured notes with a broader honest sample. Keep review action prominent but not an equal-size orbiting object beside every attribute.

### C. Homepage states

- **Public/anonymous:** neutral, category-led entry, clear explanation that ICB hosts independent coffee ratings; no branded promoted coffee/roaster, no fabricated consensus.
- **Logged in, newly onboarded:** saved brew method/gear and explicit tastes, if present; optional `Log a tasting` pathway.
- **Logged in, returning:** contextual `You marked these tried—want to rate one?` **only if actual tried/logged evidence exists**, plus recent contributions, saved items and next relevant exploration; do not label a mere view or wishlist item as tried.
- **Contributor:** acknowledge meaningful contribution respectfully and show updated review impact without invented leaderboards or authority claims.

### D. AI Concierge

Can help a user **find a coffee to rate**, offer a neutral sensory vocabulary explanation or ask optional structured prompts to help articulate their **own** experience. It must not invent, suggest favourable scores, auto-post, alter a submitted sentiment or treat its own generative prose as first-party review data. `Summarize reviews` is permitted only from genuinely retrieved entries with accurate sample sizes and caveats.

## 3. Current baseline (audit snapshot, not live)

The Phase 0 audit (`current-state-audit.md`, 2026-11-07) reports:
- **397 total review rows** at the audited database snapshot. This is not the same measure as **118 reviews** recorded in a **90-day** PostHog/analytics analysis. Both are historical and may have different scopes/time ranges; recheck the live DB and event definitions before making statements.
- PostHog 90 days: **183 `rating_started`** and **102 `rating_form_submitted`** event counts, plus an **110 `abandoned`** count reported by audit. These are **events**, not necessarily unique users or directly comparable funnel cohorts. Never claim a precise submission conversion rate without deduplicating and defining the denominator.
- **40 anonymous reviews out of the audit's reported 118 review total** for that window, subject to verifying source, event mapping and time bounds.
- **1,688 public coffees** and **122 active roasters** in the same audited DB snapshot; review distribution, unique reviewers, per-coffee sample sizes, moderation status and review recency remain **unknown**.
- Existing: `reviews`, quick rating flow, exit-intent rating CTA, signed-in `user_coffees`, wishlists, `coffee_views`, post-login anonymous review merge, 3-entity anonymous rating cap, basic rating aggregates; not all are necessarily optimal. See audit §9, §10, §12 and §13a.
- Existing instrumentation lacks search/filter events; end-to-end discovery → purchase → tasting → rating funnel cannot currently be measured. Purchase is outbound, so don't claim purchase/consumption from clicks.
- The source audit indicates saved taste preferences are not used for recommendations today; don't assume personalization is live.
- **Verify review ownership and availability:** are all 397 independent coffee reviews, or a mix of coffee and roaster entities? Validate entity breakdown, submitted/published/rejected states, contributor IDs, duplicates, reviews per public coffee and rolling time window before setting targets.

## 4. Success metrics — proposed, baseline must be queried

**North-star candidate:** monthly count of **trustworthy, distinct, published independent coffee reviews**, paired with **breadth of coffee coverage** and **distinct contributors**, not total raw ratings alone.

| Layer | Proposed metric | Definition/guardrail |
| --- | --- | --- |
| Acquisition | Organic qualified coffee discovery visitors | Real human sessions to coffee/article/landing routes; by mobile/desktop and entry |
| Activation | Visitor → saved/tried/first independent rating | Separate saved, tried and reviewed; measure voluntary contribution without pressuring |
| Contribution | Unique coffee reviewers per month + independent published coffee reviews | Deduplicate user/anonymous identity and review entity; distinguish roaster ratings |
| Quality | % of public coffees with >=1, >=3 and >=5 *independent* recent coffee reviews | Report by roaster, region, active status and sampled cohort; never imply coverage where sparse |
| Completeness | % reviews with optional sensory/brew context; edit/report/moderation and suspected abuse rate | Optional inputs, not a coercive barrier to initial rating |
| Retention | Repeat reviewers, repeat tasting logs, contributor return within 30/90 days | Real unique cohorts, not clickcounts |
| Trust | Provenance/source labelling correctness, spam/duplicate detection, moderation transparency | Ability to inspect/report/edit; score confidence/sample sizes shown |
| Discovery usefulness | Verified visit → real coffee detail → reviewed later (where trackable) | Attribution is uncertain across offsite purchasing; never pretend a buy click equals tasting |
| B2B readiness | Organizations requesting and paying for research/API/aggregate insights | Interviews, pilots, willingness to pay, data-rights/privacy review first |
| Economic health | Revenue, gross margin, recurring retention, buyer concentration and support costs | Separate revenue from sponsorship, data rights, and affiliate commissions |

No fabricated growth target. Next chat should request a **read-only baseline query** and event taxonomy before setting growth targets.

## 5. Monetization: concrete pathways, staged, not promises

### A — Aggregated Roaster Intelligence (pilot candidate)

B2B subscribers or research buyers: consumer review distribution and trend summaries (with **sample sizes and confidence caveats**), flavour preferences, fair comparator groups, pricing/offer trend signals and category coverage. Roasters cannot buy favourable placement, review editing or selectively hidden criticism. Publishing comparative sentiment requires minimum coverage to avoid misleading thin samples. **Validate buyer demand and contractual/privacy feasibility first.**

### B — Data/API licensing (pilot candidate)

Commercial access to normalized coffee taxonomy, product metadata, region/estate links, in-stock availability and pricing signals, **permitted** aggregate review intelligence and change history. Clearly separate *ICB-created normalization/insight IP* from roaster-origin descriptions or imagery that may require licensing rights. Existing `/api/v1/coffees` and API key/rate-limiting infrastructure are a starting point, not proof of a commercial licence or a sellable dataset.

### C — Research and industry reports (pilot candidate)

Annual `State of Indian Specialty Coffee` plus smaller category or method reports; transparent samples, known gaps, conflicts of interest, methodology and sponsor disclosures. Distinguish market-wide claims from ICB's self-selected site audience.

### D — Complementary channels (explore separately)

Affiliate purchase referrals; clearly labelled sponsorship/inventory separated from recommendation logic; relevant tools/services. Homepage paid product showcase is **not approved** and conflicts with neutral entrance. Shopify/Woo review-sharing integration can increase coverage only with **user opt-in**, authentic attribution, verified independent consent and safeguards against merchant filtering/manipulation.

**Commercial learning plan:** interview roasters, equipment partners, cafes, market researchers and relevant buyers; price/test small paid pilots with explicit deliverables rather than assuming analytics dashboards sell. Study rights, representativeness, costs and repeat demand before selling mature intelligence.

## 6. Revised UX review gate / prototype acceptance

Every proposed redesign must be evaluated for five jobs:
1. **Discover:** find a relevant coffee or knowledge object with explainable connections, search and technical constraints.
2. **Contribute:** after a real tasting, reach a neutral quick rating easily, with an optional richer note; return later to contribute from legitimate tried/logged history.
3. **Trust:** understand where review counts/aggregates come from, what is a roaster claim vs consumer opinion vs ICB inference, and whether data is sparse.
4. **Return:** see one's own saved/tried/reviewed history without fabricated personalization.
5. **Build commercial evidence:** capture privacy-safe aggregate metrics and define sellable research/data products that do not affect ratings or organic ranking.

**Prototype path requirements (when separately approved):**
- Anonymous neutral homepage → meaningful graph exploration → *actual* coffee → see independent review summary and `Rate this coffee` → optional personal tasting note.
- Logged-in returning user with **actual** saved/tried context → resume → see `Rate an unreviewed coffee you tried` only when verified → contribute.
- Expert direct-filter path and deep-link coffee path also reach the same review contribution affordance; no mandatory cinematic detour.
- Existing review storage, auth/anonymous cap, moderation, anti-abuse, privacy and analytics semantics preserved.
- For zero-rating coffees, show zero honestly; do not fabricate aggregate scores and do not put low-volume products at a fake disadvantage.
- Keep visuals neutral, accessible, performant and SEO-compatible, with no pay-for-influence.

**Acceptance:** We must be able to trace the discovery-to-contribution loop, observe credible review data capture, and make a trustworthy business case. If users admire the Atlas but leave without contributing, the redesign has failed its core mission even if delight scores are high.

## 7. Decisions to make before implementation vs later

**Before the first graph/review prototype (minimal blockers):**
- Confirm the difference between rating, review, tasting log, saved/wishlist and `tried` in current code and UX.
- Audit the actual review funnel, entity types and anti-abuse/moderation gates (read-only); define 2–3 review entry points without increasing coercion.
- Confirm baseline measurement definitions and non-invasive events for the prototype.
- Choose one complete neutral → discovery → review test flow, with a revisiting member variant.

**Can wait until later:** final visual identity, full species/variety ontology, AI copy features, sophisticated recommendation ranking, paid placements, exact commercial price list, full report schema, revenue forecasts, sponsorship policy and subscription checkout.

## 8. Agent handoff

Read this document with `16-alignment-review-and-next-session.md` and `07-decisions.md` **before** proposing coding. Treat the commercial north star and review contribution flow as first-class acceptance requirements; do not bury them under UI refinement or claim instant ownership of data that ICB may not have the rights to license.

**Next step:** a read-only source-of-truth check for current review UX/data/events and a bounded browser prototype plan. No code changes to the production app until explicitly approved.

## 9. Research-driven lifecycle and attributable commerce (PROPOSED 2026-11-14)

The product research in [28](28-research-lifecycle-and-future-cafes.md) supports separating **Want to Try / wishlist**, **Tried**, **Rating / Review**, optional repeat **Brew log**, and **Referral click**. These are independent, observable signals: a wishlist save is not proof of purchase, a tried flag is not necessarily a rating, multiple brew entries are not multiple independent reviewers, and a merchant click is not a sale.

**Existing code reality:** `CoffeeCard` already shows a wishlist heart and rating footer; `use-wishlist.ts` and `src/app/actions/wishlist.ts` currently demand sign-in and persist to `wishlists`. The server already logs `wishlist_added` and `wishlist_removed`. Keep them and audit data/event semantics before changing the account or storage model. Keep the existing three-anonymous-rating rule; do not conflate it with wishlist limits.

**Proposed additional measurement:** unique users who save, explicit Tried events (if implemented), Tried → Rate within properly defined cohorts, independently published distinct-coffee ratings, user return/rediscovery, and outbound merchant clicks. Use only confirmed merchant-side orders for paid commission accounting. Reconcile `rating_started` and `rating_form_submitted` definitions and duplication before claiming conversion. No raw review content or private user taste lists in general analytics.

**Attribution pilot:** a small set of consenting roaster partners; explicit disclosure of any commercial relationship, privacy-safe tracked links/codes, agreement on commissionable sales and attribution limits. ICB continues to rank products and publish reviews independently. Wishlist demand is **not** a roaster lead list for sale. Aggregated insights require sufficiently large, privacy-protected samples, legitimate data rights and buyer validation.

**Deferred niche café option:** study a curated `café serves roaster` relationship and time-stamped `coffee on bar` information only when partner updates can be trusted. No generic cafés, menus, reservations, delivery or primary-nav expansion now.

**Repository evidence, 2026-11-14:** `user_coffees` already exists for a tried/tasted lifecycle (`logged/brewing/finished/rated`), while `wishlists` is separate. Reuse-first: audit the actual writes, status meanings, profile RPC and repeat-brew constraints before proposing any new field/table. Importantly, both table-creation migrations allow SELECT for public-profile owners as well as the owner; **verify effective deployed RLS and restrict personal wishlist/tried access as intended before promising privacy**. This is a trust gate, not approval to migrate data.

**Approval gate:** do not repurpose `user_coffees`, change `wishlists`, infer tasting from a `logged` row, or claim conversion from outbound clicks without the read-only implementation audit and an explicit feature decision. Keep the Phase C UI agents' scope untouched.

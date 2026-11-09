# 18 — Phase 1: Review-first Living Coffee Atlas prototype contract

**Date:** 2026-11-09
**Status:** OWNER APPROVED Phase 1 (design refinement and isolated prototype only). **NOT approved:** production edits, releases, database changes, auth changes, new framework dependencies, paid ranking or commercialization of user data.
**Implementation:** `design/atlas-phase1-prototype`, derived from `design/experience-redesign`.
**Artifact:** `prototype/atlas-phase1/index.html` — independent, self-contained browser experiment.

## A. Design decisions now embodied in the prototype

| Decision | Current prototype | Production constraint |
|---|---|---|
| Discovery vs independent authority | Atlas exploration leads to clearly labelled community review evidence and a respectful invitation to contribute. | No score without sample count; no roaster marketing copy passed off as an ICB verdict. |
| Anonymous homepage neutrality | No branded hero coffee before explicit selection. The centre illustrates relationships, not a seller. | Avoid paid/default branded placements without explicit commercial policy. |
| Hospitality + direct utility | Three entry paths: precise filters, optional guide, voluntary coffee thread. | Advanced search, visible escape routes and deep links stay first class. |
| Semantic graph | Coffee → estate → other roaster is deliberate selection; type of link is named. | Joins must be grounded in canonical entity relationships. Never imply flavour equivalence from shared estate. |
| User-contributed evidence | Both zero-rating and low-sample cards. Real data snapshots labelled with date; never invent review scores. | Validate current review view, sample count, edits/deletes, moderation and abuse prevention before rollout. |
| No coercive review incentives | “Tried this coffee?” and one voluntary star action, optional tasting detail. | No reward for positive ratings; contributors can edit/remove under safe tombstone semantics. |
| Actual personalized returning journey | Clearly labelled **illustrative preview** only. | Build only from explicit private account signals with consent and successful identity reconciliation; no false “tried” history. |
| Motion | CSS motion only, focus changes on explicit click; no scroll hijacking or default WebGL. | Motion design must be accessible and pass mobile performance budget. |
| Search independence | Search/filter action is always available, including from the visual journey. | Preserve existing typed URL facets, `/coffees` routes, SSR/SEO, actual results and browser history. |

## B. Evidence cases — database read only, 9 Nov 2026

**Catalogue:** 1,714 active coffees. Current independent coffee reviews cover 147 active products; 16 have >=3 current submissions. These are coverage indicators, *not* claims of representativeness or review verification.

**Sample path:** `Baarbara Coffee / Naturals Roasted Coffee Beans` (0 current ratings) → `Baarbara Estate` → `BrewClan / Baarbara Naturals` (0). A third example, `Blue Tokai / Baarbara Estate`, had 2 current ratings (mean 4.5). All three named coffee-to-estate edges were verified on 2026-11-09 against `coffee_estates → estates → canon_estates` (canonical Baarbara Estate ID `3b403012-d145-4bb9-ba2c-c3256bf6d4dc`). This does **not** verify every future Atlas relationship.

**Other cases:** `Grey Soul / Mogra` 6 current ratings, mean 4.5; `Blue Tokai / Amaltas Blend` 11 current ratings, mean 3.73.

**Warnings:** identities are not verified distinct drinkers; current ratings may include anonymous contributions; the implementation currently has review delete/revision integrity risks. Historical and active review rows are not equivalent to one current person opinion.

## C. Flow and state contract

```
Public homepage (neutral)
  ├─ Expert: search/facets → real result → coffee
  ├─ Guide: optional preference → result → coffee
  └─ Voluntary thread → coffee
Coffee focus (facts + provenance + current reviews + rate-when-tried)
  ├─ Estate/region provenance → place → another roaster interpretation
  ├─ Independent reviews → evidence methodology/other examples
  ├─ Buy/view canonical route (secondary to trust, never covert sponsorship)
  └─ Rate-when-tried → single star action → optional context → publishing gate
```

**Navigation invariants:** explicit navigation changes focus; Back/Forward returns meaningfully; preserve current filter state when following a link; focus is visible for keyboard users; reduced motion has full functional parity; site search remains one action away.

**Provenance requirements:** every nontrivial connection is tagged as factual catalogue link, seller assertion, editorial reference, inferred metric, or community opinion. “Same estate” ≠ “same sensory experience”. A model-generated summary must not masquerade as a user review.

**Trust requirements:** render count plus mean only when valid and not misleading; show honest zero evidence; don't truncate negative reviews selectively; provide contribution edit/report provenance. Shopping links must not compete with impartial review evidence as though they were the objective.

## D. Isolated browser prototype — current limitations

- Five validated **static** coffee fixtures, not live catalogue fetching or full-text search.
- Sampled scores and coverage are dated snapshots; no real-time updates.
- No login, no user identity, no private data, no actual user history. The “returning” toggle is a design simulation.
- Review form lives entirely in client memory and **does not submit**; demonstrated rating is never counted.
- CSS art is placeholder illustration, not product photography or an estate image.
- No production routing, Supabase writes, schema updates, tracking events, review submission, automated SSR/SEO tests or production LCP assessment.
- Tested with desktop and mobile Chromium render/interactions via headless Playwright in-memory page; production build and CI remain untested.

## E. Acceptance gate to advance past Phase 1

**UX & product**
- [x] Neutral anonymous first screen; branded example shown only on deliberate selection.
- [x] Coffee and roaster identities are real catalogue entries, correctly distinguished from editorial/example imagery.
- [x] Real rated/unrated examples; empty state does not imply consensus.
- [x] Rating is initiated only after trying; optional context fields; no live write.
- [x] Coffee → estate → roaster journey, with visible relationship provenance.
- [x] Voluntary guide and expert paths; filter panel accessible.
- [x] Desktop + 390px mobile and keyboard controls tested; reduced-motion CSS.
- [ ] Owner visual/interaction critique using actual browser prototype.
- [ ] Validate canonical estate/variety mappings per edge, including missing/unverified relation behaviour.
- [ ] Document exact current production review and authentication handoff.
- [ ] Test with representative users (novice, expert, active reviewer, returning member).

**Before connecting to live review submission or launching**
- [ ] Fix latest-reviewed-then-deleted record resurrection; ensure expected identity uniqueness.
- [ ] Replace anonymous review limit fail-open error behaviour and check user/anon merge.
- [ ] Finalize abuse reporting, duplicate review rules, and published-review definitions.
- [ ] Add privacy/consent-compliant telemetry: detail impressions → rating started → published (deduped by identity) → repeat contribution.
- [ ] Preserve canonical SEO/structured data and route parity with SSR.
- [ ] Meet field mobile p75 **LCP <= 2.5s**, **INP <= 200ms**, **CLS <= 0.1** without hiding content to achieve metrics.
- [ ] Validate no new data rights or commercial licence assumptions.

## F. Subsequent implementation sequence (after prototype review)

1. **G1: evidence contract and review integrity** — GT (product) + implementation agent (code) + independent reviewer (security); no redesign writes until gate.
2. **G2: renderer spike in Next.js on an isolated preview route** — semantic graph interface from read-only catalogue and review aggregate; unchanged URL/canonical contracts; no new WebGL dependency by default.
3. **G3: staged contribution/auth handoff** — safely test zero-review state, submit/edit/delete, anon→member merge, abuse cases and consented events.
4. **G4: controlled mobile deep-link rollout first** — compare qualifying review submissions, unique contributors, page LCP/INP, review distribution and SEO performance against existing baseline.
5. **G5: monetization validation separate from UX gate** — buyer interviews and product legality for permissible aggregate research and data licensing; no user PII sale or pay-to-influence rankings.

**Owner/roles:** GT decides product and release approval; UX lead owns design contract and prototype; Codex implements integration; Claude independently reviews behaviour, data safeguards and performance; privacy/legal assessment precedes any B2B insight launch.

## G. Explicit owner feedback questions

1. Does the neutral entrance still feel *premium and inviting*, or did we lose too much warmth by removing the default branded bag?
2. Is the review block appropriately prominent relative to product facts and buy links?
3. Does the spatial connection metaphor feel fluid and intelligible enough to invest in animation? The current demo proves navigation, **not** the finished choreography.
4. Should a signed-in returning member resume their last explicitly chosen thread, or first see a “Your tasting journal” evidence path?
5. Which of the two review states should we optimize first — zero reviews for acquisition, or existing reviews for trust/retention?

**Next action:** collect GT's critique from the prototype before promoting any concept into the production Next.js application.

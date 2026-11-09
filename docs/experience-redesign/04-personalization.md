# 04 — Personalization, Taste Memory and Trust

## Promise
The experience should increasingly feel like being recognized by a knowledgeable host **without acting like a human or becoming intrusive**. Remember useful choices, explain suggestions and remain easy to correct.

## Taste Profile data types (proposed)
- Explicit profile choices: preferred brew methods, equipment, roast levels, processing methods, favourite origins/regions, favourite flavour families, price bands, tolerance for experimentation.
- Intent signals: saved and wishlisted coffees, coffees marked tried or disliked, ratings and reviews, meaningful tool results when user explicitly saves them.
- Contextual signals: selected filters, current mood/occasion, recent browsing context. Treat transient intent separately from lasting preference.
- Existing anonymous-to-account merge paths should be checked before changes. Respect the existing anonymous identity/auth design and 3-free-ratings/login gate if still active.

## Contributor memory and review integrity (business requirement)

Personalization serves **repeat authentic contribution** as well as relevant discovery. Treat `saved`, `wishlisted`, `viewed`, `tried`, `rated`, `reviewed` and `logged a brew` as distinct states; one must not imply another. If a member explicitly logged a coffee as tried but has not rated it, the returning experience *may* offer a quiet `Rate a coffee you've tried` action. Never infer consumption solely from catalogue views, affiliate clicks or a wishlist.

Quick independent ratings should be easy; rich tasting context (brew method, grinder/recipe, flavour perception, harvest/batch where known) remains optional and user-authored. No AI-generated reviews, favourable-score nudges, automatic publishing or pressure to contribute. Review contribution may improve profile context, but individual review histories are not a sellable product. Any aggregate commercial insights require appropriate consent, privacy thresholds, fraud checks and sample-size disclosures.

The existing three-entity anonymous review limit and merge logic are production behaviour to evaluate, not silently change. Use [17](17-review-intelligence-and-monetization.md) for proposed measurement and monetization guardrails.

## Ranking and recommendations
- **Explicit filters are hard constraints** unless clearly shown otherwise. Personalization never silently overrides a user-selected brew method/process/roast/price filter.
- Separate suitability (brewer compatibility) from objective attributes and from subjective taste predictions.
- Clearly identify facts sourced from the catalogue vs model-derived explanations.
- Explain 'why this coffee'; allow dismissal, correction and 'show me something different.'
- Include *serendipity*: adjacent unexpected choices, not an endless preference echo chamber.
- Prefer structured catalogue retrieval and transparent rules first; LLM can help explain/contextualize, never fabricate stock, origin, estate, variety, ratings or flavour.

## Control and privacy
- Users can inspect and edit saved tastes, equipment, likes, dislikes and wishlists.
- Provide opt-out / reset of personalization and clear separation between current session signals and long-lived account data.
- Consent and analytics logic must preserve `docs/decisions/012-consent-and-attribution.md` and current `src/lib/consent.ts`; no hidden behavioural surveillance.
- Personalization features must be optional. Logged-out users get a complete experience.

## Questions requiring product decisions
What exactly is stored anonymously? How long? What merges on signup? Are recommendation explanations deterministic? Which user choices are permanent by default? How are inferred preferences confirmed or corrected? How do we measure helpful discovery vs clickbait?

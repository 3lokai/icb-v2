# Plan: "Fresh from the community" homepage section

## Context
The homepage shows aggregate stats and coffee cards but no actual human review
text. This section surfaces real signed-in reviewers' written comments — 3 review
cards + an aggregate "N ratings and counting" line — directly after "Top rated
coffees". Goal: social proof with real voices, statically server-rendered, one DB
round trip, on the existing dark/warm design system. Renders nothing if it can't
show a full, real set (never placeholder cards).

## Key findings from exploration (reuse, don't reinvent)
- **Section rhythm**: `TopRated` uses `ground="warm"` (`bg-card border-y`). Adjacent
  sections alternate ground → this new section uses **default (cream) ground**.
- **Primitives** (`src/components/primitives/`): `Section` (spacing `default`
  = `py-10/14/20`), `Stack`, `Reveal`. Container padding comes only from `PageShell`
  (via `Section`, `contained` default true). Headings use `text-title` utility (serif).
- **Star display**: reuse `StarRating` from `src/components/common/StarRating.tsx`
  (read-only mode, `size="sm"`). Site convention = amber stars, not beans.
- **Brew label**: reuse `formatBrewMethodLabels(keys: string[]): string[]` from
  `src/lib/utils/coffee-card-utils.ts` (underscore-enum keyed — matches DB). Call
  `formatBrewMethodLabels([brew_method])[0]`.
- **Relative date**: `formatDistanceToNow(new Date(created_at), { addSuffix: true })`
  from `date-fns` (installed; used inline everywhere — no wrapper, match convention).
- **Avatar**: `Avatar`/`AvatarImage`/`AvatarFallback` from `src/components/ui/avatar.tsx`.
  Initials computed inline (no shared helper exists; not extracting one — out of scope).
- **Coffee link**: `coffeeDetailHref(roasterSlug, coffeeSlug)` from
  `src/lib/utils/coffee-url.ts` → `/roasters/{roaster}/coffees/{coffee}`. **The RPC
  must return roaster slug too** (`coffees.roaster_id → roasters.slug`).
- **CTA href**: reuse the established `"/coffees?sort=rating_desc"` (same as TopRated's
  "Browse all by rating").
- **Data fetch convention**: `unstable_cache` (NOT React `cache()`) wrapping
  `createAnonServerClient().rpc(...)`, `{ revalidate, tags: ["reviews"] }`, returns
  null/[] + `console.error` on failure. Model files:
  `src/lib/data/fetch-top-coffee-reviewers.ts`, `fetch-community-coffee-review-count.ts`.
- **RPC convention**: public-read RPCs return `jsonb`, `LANGUAGE sql STABLE
  SECURITY DEFINER SET search_path = public`, then `GRANT EXECUTE ... TO anon,
  authenticated, service_role`. Model: `get_top_coffee_reviewers` migration
  `20260613120000`. SECURITY DEFINER is needed (matches sibling RPC reading
  `user_profiles`). No `REVOKE FROM PUBLIC` here — this is public-readable.
- **Genuinely missing helpers**: HTML-entity decode + marketing-suffix strip for
  coffee names, and word-boundary truncation. Only these two are new code.
- `latest_reviews_per_identity` view is already `WHERE status='active'` and dedupes
  one row per identity per entity → correct source for "ratings" totals (auth+anon),
  and matches the number TopRated already shows.

## Files to create/modify

### 1. Migration — `supabase/migrations/20260718120000_add_review_featured_and_get_featured_reviews.sql`
- `ALTER TABLE public.reviews ADD COLUMN featured boolean NOT NULL DEFAULT false;`
  (No index — ~19 candidate rows; ponytail: add partial index `WHERE featured` only
  if the pool ever grows large.)
- `CREATE OR REPLACE FUNCTION public.get_featured_reviews(p_limit int default 3)
  RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public`
  returning ONE object (single round trip):
  ```
  {
    "reviews": [ { id, rating, comment, brew_method, created_at, featured,
                   coffee_name, coffee_slug, roaster_slug, username, avatar_url,
                   reviewer_coffee_count } ... ],   -- jsonb_agg, [] fallback
    "total_ratings":    <int>,   -- count(latest_reviews_per_identity where entity_type='coffee')
    "ratings_last_30d": <int>    -- same + created_at > now() - interval '30 days'
  }
  ```
  - Featured-row selection (inner subquery on `reviews rv`
    `JOIN coffees c ON c.id = rv.entity_id`
    `JOIN roasters ro ON ro.id = c.roaster_id`
    `JOIN user_profiles up ON up.id = rv.user_id`):
    `rv.status='active' AND rv.entity_type='coffee' AND rv.user_id IS NOT NULL
     AND char_length(btrim(rv.comment)) > 10
     AND (rv.featured OR rv.created_at > now() - interval '90 days')`
    — 90-day window (not 7); `featured=true` bypasses the window so an admin pick
    always shows.
  - Order: `rv.featured DESC, rv.created_at DESC`; `LIMIT greatest(coalesce(p_limit,3),0)`.
  - `reviewer_coffee_count` = correlated
    `(SELECT count(*)::int FROM latest_reviews_per_identity l
      WHERE l.user_id = rv.user_id AND l.entity_type='coffee')` — coffees this
    reviewer has rated ("{n} coffees rated").
  - `GRANT EXECUTE ON FUNCTION public.get_featured_reviews(int) TO anon,
    authenticated, service_role;` + `COMMENT ON FUNCTION`.
- **Show the SQL to the user before applying** (per request). Apply via
  `npm run supabase:migration:up`, then `npm run supabase:types`.

### 2. Fetch — `src/lib/data/fetch-featured-reviews.ts` (new)
- `"server-only"` + `unstable_cache`, key `["featured-reviews"]`,
  `{ revalidate: 900, tags: ["reviews"] }`.
- `createAnonServerClient().rpc("get_featured_reviews", { p_limit: 3 })` using the
  untyped-cast escape hatch (same as `fetch-top-coffee-reviewers.ts`) until
  `npm run supabase:types` is run.
- Export `type FeaturedReview` and `type FeaturedReviewsPayload`.
- Returns `null` on error / non-object (component then renders nothing).

### 3. Display-name helper — `src/lib/utils/clean-coffee-name.ts` (new)
- `cleanCoffeeName(raw: string): string` — decode the handful of HTML entities that
  actually occur (`&#8217;`/`&#039;`/`&amp;`/`&quot;`/`&#8211;` etc. via a small map)
  then strip marketing suffix: `.split(/\s[|–—-]\s/)[0].trim()`.
- `truncateAtWord(text: string, max = 140): string` — slice to `max`, cut back to
  last space, append `…` only if truncated.
- One `__tests__`-free inline `assert` self-check (per ponytail): a tiny
  `if (require.main === module)` / small colocated test is overkill for a pure
  string fn — instead add a one-line `demo()` assert block guarded so it doesn't run
  in the bundle, OR a minimal `clean-coffee-name.test.ts` if the repo has a test
  runner (it has none — `type-check` is the test equiv). Decision: colocated
  `assert`-based checks skipped; rely on `type-check`. (Trivial string logic.)

### 4. Component — `src/components/homepage/FreshFromCommunitySection.tsx` (new, server)
- Plain `async` server component (no `"use client"`; no `*Server.tsx` wrapper needed
  since the whole section is static). `await fetchFeaturedReviews()`.
- **Empty/failure gate**: `if (!data || data.reviews.length < 3) return null;`
- `<Section spacing="default">` (cream ground). Hand-rolled header (flex, like
  TopRated): left = `<h2 className="text-title text-balance">Fresh from the
  community</h2>` + muted subline (uses `ratings_last_30d`, e.g. "N new ratings in the
  last 30 days — here's what people are saying"); right = `<Link
  href="/coffees?sort=rating_desc">All ratings →</Link>`. (No `<Accent>` — respect
  the ≤1-per-page ration already spent by TopRated.)
- Grid: `<Reveal className="grid grid-cols-1 md:grid-cols-3 gap-8">`, one card per
  review.
- **Card** (inline, bordered `bg-card` to read on cream): header row = `Avatar`
  (image or initials fallback) + username + `"{reviewer_coffee_count} coffees rated ·
  {relative date}"`; body = `truncateAtWord(comment,140)` as a serif pull-quote
  (`text-title`/serif class, wrapped in `"…"`); footer = coffee name
  (`cleanCoffeeName`, linked via `coffeeDetailHref(roaster_slug, coffee_slug)`) +
  brew label, with `<StarRating rating size="sm" />` right-aligned.
- Wire into homepage.

### 5. Homepage — `src/app/(main)/page.tsx`
- Insert `<FreshFromCommunitySection />` between line 153 (`</Suspense>` after
  `TopRatedSectionServer`) and line 154 (`<HomeCollectionGridLazy tier="core" />`).
  No `<Suspense>` needed (own await); import at top.

## Verification
1. `npm run type-check` (repo's test equivalent) — zero errors.
2. `npm run lint` — zero warnings (`--max-warnings=0`).
3. Apply migration on a branch/local, run RPC directly:
   `select public.get_featured_reviews(3);` — confirm 3 review objects with
   `roaster_slug`, non-empty comments >10 chars, correct `total_ratings` (should
   equal the number TopRated shows) and `ratings_last_30d`.
4. `npm run dev`, load `/`, verify section renders after Top Rated: 3 cards, decoded
   coffee names (no `&#8217;`, no "| Auto Discounted"), working coffee links, stars,
   relative dates, and the bottom "{total} ratings and counting … add yours" line.
5. Negative check: temporarily lower data / force fetch error → section returns null
   (no placeholder cards).

## Explicitly NOT doing (guardrails)
- No changes to anon rating cap logic or any review-write path.
- No new dependency; no shared `getInitials` refactor (8 dup sites left as-is).
- No client JS beyond the already-`"use client"` display primitives
  (`Section`/`Stack`/`Reveal`/`StarRating`) the rest of the homepage already ships.

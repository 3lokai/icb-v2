import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/primitives/page-shell";

export const metadata: Metadata = {
  title: "API Documentation | Indian Coffee Beans",
  description:
    "Use the Indian Coffee Beans API to access coffee and roaster data. Get an API key and integrate with your app.",
};

const BASE_URL = "https://indiancoffeebeans.com";

export default function DevelopersPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-14 py-12">
        <header>
          <h1 className="text-heading font-bold">API Documentation</h1>
          <p className="mt-2 text-muted-foreground text-body">
            Access coffee and roaster data via our REST API. Use it to build
            apps, chatbots, or integrations.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-subheading font-bold">Getting started</h2>
          <ol className="list-decimal space-y-2 pl-5 text-body">
            <li>
              <Link href="/auth?mode=signup" className="text-accent underline">
                Sign up
              </Link>{" "}
              or{" "}
              <Link href="/auth?mode=login" className="text-accent underline">
                log in
              </Link>
              .
            </li>
            <li>
              Go to{" "}
              <Link
                href="/dashboard/developer"
                className="text-accent underline"
              >
                Dashboard → Developer
              </Link>{" "}
              and create an API key. Copy it immediately — you won&apos;t see it
              again.
            </li>
            <li>
              Send requests to{" "}
              <code className="rounded bg-muted px-1">{BASE_URL}/api/v1</code>{" "}
              with the key in the{" "}
              <code className="rounded bg-muted px-1">Authorization</code>{" "}
              header.
            </li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-subheading font-bold">Authentication</h2>
          <p className="text-body text-muted-foreground">
            Include your API key on every request (except{" "}
            <code className="rounded bg-muted px-1">GET /health</code>). Use
            either header:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
            {`Authorization: Bearer icb_live_<your-key>
# or
X-API-Key: icb_live_<your-key>`}
          </pre>
          <p className="text-body text-muted-foreground">
            Missing or invalid keys receive <strong>401 Unauthorized</strong>:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
            {`{ "error": "Invalid or missing API key" }`}
          </pre>
        </section>

        <section className="space-y-6">
          <h2 className="text-subheading font-bold">Endpoints</h2>
          <p className="text-body text-muted-foreground">
            Base URL:{" "}
            <code className="rounded bg-muted px-1">{BASE_URL}/api/v1</code>.
            All responses are JSON.
          </p>

          {/* --- Health --- */}
          <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
            <div>
              <span className="font-mono text-caption font-semibold text-accent">
                GET /health
              </span>
              <span className="ml-2 text-caption text-muted-foreground">
                (no auth)
              </span>
            </div>
            <p className="text-body text-muted-foreground">
              Service health check. Use this to verify the API is reachable. No
              API key required.
            </p>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Response 200
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
                {`{
  "status": "ok",
  "timestamp": "2026-02-26T10:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}`}
              </pre>
            </div>
          </div>

          {/* --- GET /coffees --- */}
          <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
            <div>
              <span className="font-mono text-caption font-semibold text-accent">
                GET /coffees
              </span>
            </div>
            <p className="text-body text-muted-foreground">
              Returns a paginated list of coffees with optional filters and
              sorting. Use this to power search, discovery, or recommendation
              flows.
            </p>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Query parameters
              </p>
              <ul className="space-y-1 text-body text-muted-foreground">
                <li>
                  <code className="rounded bg-muted px-1">page</code> (number) —
                  Page number, default 1
                </li>
                <li>
                  <code className="rounded bg-muted px-1">limit</code> (number)
                  — Items per page, default 15
                </li>
                <li>
                  <code className="rounded bg-muted px-1">sort</code> — One of:{" "}
                  <code className="rounded bg-muted px-1">price_asc</code>,{" "}
                  <code className="rounded bg-muted px-1">price_desc</code>,{" "}
                  <code className="rounded bg-muted px-1">newest</code>,{" "}
                  <code className="rounded bg-muted px-1">best_value</code>,{" "}
                  <code className="rounded bg-muted px-1">rating_desc</code>,{" "}
                  <code className="rounded bg-muted px-1">name_asc</code>.
                  Default: relevance
                </li>
                <li>
                  <code className="rounded bg-muted px-1">q</code> (string) —
                  Full-text search on name and description
                </li>
                <li>
                  <code className="rounded bg-muted px-1">roastLevels</code> —
                  Comma-separated: light, light_medium, medium, medium_dark,
                  dark
                </li>
                <li>
                  <code className="rounded bg-muted px-1">processes</code> —
                  Comma-separated: washed, natural, honey, etc.
                </li>
                <li>
                  <code className="rounded bg-muted px-1">regions</code> —
                  Comma-separated region slugs
                </li>
                <li>
                  <code className="rounded bg-muted px-1">roasters</code> —
                  Comma-separated roaster slugs
                </li>
                <li>
                  <code className="rounded bg-muted px-1">flavors</code> —
                  Comma-separated flavor slugs
                </li>
                <li>
                  <code className="rounded bg-muted px-1">inStockOnly</code> —
                  Set to <code className="rounded bg-muted px-1">1</code> to
                  only return in-stock coffees
                </li>
                <li>
                  <code className="rounded bg-muted px-1">minPrice</code>,{" "}
                  <code className="rounded bg-muted px-1">maxPrice</code> —
                  Numeric price filters (INR)
                </li>
                <li>
                  <code className="rounded bg-muted px-1">decafOnly</code>,{" "}
                  <code className="rounded bg-muted px-1">worksWithMilk</code> —
                  Set to <code className="rounded bg-muted px-1">1</code> for
                  true
                </li>
              </ul>
            </div>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Response 200
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
                {`{
  "items": [
    {
      "coffee_id": "uuid",
      "slug": "example-single-origin",
      "name": "Example Single Origin",
      "roaster_id": "uuid",
      "roaster_slug": "blue-tokai",
      "roaster_name": "Blue Tokai",
      "hq_city": "Mumbai",
      "hq_country": "India",
      "process": "washed",
      "roast_level": "medium",
      "rating_avg": 4.2,
      "rating_count": 15,
      "min_price_in_stock": 450,
      "best_normalized_250g": 450,
      "in_stock_count": 2,
      "direct_buy_url": "https://...",
      "decaf": false,
      "is_limited": false,
      "tags": ["featured"],
      "flavor_keys": ["berry", "chocolate"]
    }
  ],
  "page": 1,
  "limit": 15,
  "total": 120,
  "totalPages": 8
}`}
              </pre>
            </div>
          </div>

          {/* --- GET /coffees/:slug --- */}
          <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
            <div>
              <span className="font-mono text-caption font-semibold text-accent">
                GET /coffees/:slug
              </span>
            </div>
            <p className="text-body text-muted-foreground">
              Returns a single coffee by its URL slug (e.g.{" "}
              <code className="rounded bg-muted px-1">
                example-single-origin
              </code>
              ). Includes full details: variants, images, flavor notes, regions,
              estates, brew methods, and embedded roaster.
            </p>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Path parameters
              </p>
              <ul className="space-y-1 text-body text-muted-foreground">
                <li>
                  <code className="rounded bg-muted px-1">slug</code> (string) —
                  Coffee slug from the list or website URL
                </li>
              </ul>
            </div>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Response 200
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
                {`{
  "id": "uuid",
  "slug": "example-single-origin",
  "name": "Example Single Origin",
  "description_md": "Full markdown description...",
  "roaster": { "id": "uuid", "slug": "blue-tokai", "name": "Blue Tokai", "website": "https://..." },
  "variants": [
    { "id": "uuid", "weight_g": 250, "price_current": 450, "in_stock": true, "grind": "filter" }
  ],
  "images": [{ "url": "https://...", "alt": "..." }],
  "flavor_notes": [{ "descriptor": "Berry", "family": "Fruity" }],
  "regions": [{ "region_id": "uuid", "display_name": "Chikmagalur", "pct": 100 }],
  "rating_avg": 4.2,
  "rating_count": 15,
  "process": "washed",
  "roast_level": "medium",
  "summary": { "coffee_id": "uuid", "process": "washed", ... }
}`}
              </pre>
            </div>
            <p className="text-caption text-muted-foreground">
              Response <strong>404</strong> if slug not found:{" "}
              <code className="rounded bg-muted px-1">{`{ "error": "Coffee not found" }`}</code>
            </p>
          </div>

          {/* --- GET /coffees/filter-meta --- */}
          <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
            <div>
              <span className="font-mono text-caption font-semibold text-accent">
                GET /coffees/filter-meta
              </span>
            </div>
            <p className="text-body text-muted-foreground">
              Returns available filter options and counts (e.g. roast levels,
              processes, regions) and total coffee count. Accepts the same query
              parameters as{" "}
              <code className="rounded bg-muted px-1">GET /coffees</code> so
              counts can be scoped to the current filters.
            </p>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Response 200 (simplified)
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
                {`{
  "totals": { "coffees": 120 },
  "roast_levels": [{ "value": "medium", "label": "Medium", "count": 45 }],
  "processes": [{ "value": "washed", "label": "Washed", "count": 60 }],
  "regions": [...],
  "flavors": [...]
}`}
              </pre>
            </div>
          </div>

          {/* --- GET /roasters --- */}
          <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
            <div>
              <span className="font-mono text-caption font-semibold text-accent">
                GET /roasters
              </span>
            </div>
            <p className="text-body text-muted-foreground">
              Returns a paginated list of roasters with optional filters and
              sorting.
            </p>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Query parameters
              </p>
              <ul className="space-y-1 text-body text-muted-foreground">
                <li>
                  <code className="rounded bg-muted px-1">page</code>,{" "}
                  <code className="rounded bg-muted px-1">limit</code> —
                  Pagination (default 1, 15)
                </li>
                <li>
                  <code className="rounded bg-muted px-1">sort</code> — One of:{" "}
                  <code className="rounded bg-muted px-1">relevance</code>,{" "}
                  <code className="rounded bg-muted px-1">name_asc</code>,{" "}
                  <code className="rounded bg-muted px-1">name_desc</code>,{" "}
                  <code className="rounded bg-muted px-1">
                    coffee_count_desc
                  </code>
                  , <code className="rounded bg-muted px-1">rating_desc</code>,{" "}
                  <code className="rounded bg-muted px-1">newest</code>
                </li>
                <li>
                  <code className="rounded bg-muted px-1">q</code> — Text search
                  on roaster name
                </li>
                <li>
                  <code className="rounded bg-muted px-1">cities</code>,{" "}
                  <code className="rounded bg-muted px-1">states</code>,{" "}
                  <code className="rounded bg-muted px-1">countries</code> —
                  Comma-separated values
                </li>
                <li>
                  <code className="rounded bg-muted px-1">activeOnly</code> —
                  Set to <code className="rounded bg-muted px-1">1</code> for
                  active roasters only
                </li>
              </ul>
            </div>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Response 200
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
                {`{
  "items": [
    {
      "id": "uuid",
      "slug": "blue-tokai",
      "name": "Blue Tokai",
      "website": "https://bluetokaicoffee.com",
      "hq_city": "Mumbai",
      "hq_state": "Maharashtra",
      "hq_country": "India",
      "is_active": true,
      "instagram_handle": "bluetokaicoffee",
      "coffee_count": 24,
      "avg_coffee_rating": 4.1,
      "rated_coffee_count": 18
    }
  ],
  "page": 1,
  "limit": 15,
  "total": 45,
  "totalPages": 3
}`}
              </pre>
            </div>
          </div>

          {/* --- GET /roasters/:slug --- */}
          <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
            <div>
              <span className="font-mono text-caption font-semibold text-accent">
                GET /roasters/:slug
              </span>
            </div>
            <p className="text-body text-muted-foreground">
              Returns a single roaster by slug with full profile and embedded
              list of their coffees.
            </p>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Path parameters
              </p>
              <ul className="space-y-1 text-body text-muted-foreground">
                <li>
                  <code className="rounded bg-muted px-1">slug</code> (string) —
                  Roaster slug (e.g.{" "}
                  <code className="rounded bg-muted px-1">blue-tokai</code>)
                </li>
              </ul>
            </div>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Response 200 (simplified)
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
                {`{
  "id": "uuid",
  "slug": "blue-tokai",
  "name": "Blue Tokai",
  "description": "Roaster bio...",
  "website": "https://...",
  "logo_url": "https://...",
  "hq_city": "Mumbai",
  "hq_country": "India",
  "avg_rating": 4.2,
  "total_ratings_count": 120,
  "coffees": [ /* array of CoffeeSummary */ ]
}`}
              </pre>
            </div>
            <p className="text-caption text-muted-foreground">
              Response <strong>404</strong>:{" "}
              <code className="rounded bg-muted px-1">{`{ "error": "Roaster not found" }`}</code>
            </p>
          </div>

          {/* --- GET /usage --- */}
          <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
            <div>
              <span className="font-mono text-caption font-semibold text-accent">
                GET /usage
              </span>
            </div>
            <p className="text-body text-muted-foreground">
              Returns usage statistics for the API key used in the request:
              today&apos;s request count, hourly breakdown for today, and daily
              totals for the past days (from Redis).
            </p>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Response 200
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
                {`{
  "todayTotal": 42,
  "hourlyToday": [
    { "hour": "00", "count": 0 },
    { "hour": "09", "count": 12 },
    ...
  ],
  "dailyTotals": [
    { "date": "20260225", "count": 100 },
    { "date": "20260224", "count": 85 }
  ]
}`}
              </pre>
            </div>
          </div>

          {/* --- POST /users (Phase 2) --- */}
          <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
            <div>
              <span className="font-mono text-caption font-semibold text-accent">
                POST /users
              </span>
              <span className="ml-2 text-caption text-muted-foreground">
                (Phase 2)
              </span>
            </div>
            <p className="text-body text-muted-foreground">
              Register an external user and get a stable{" "}
              <code className="rounded bg-muted px-1">anon_id</code> (UUID) to
              use when submitting reviews. Call this once per user in your
              system; store the returned{" "}
              <code className="rounded bg-muted px-1">anon_id</code> and send it
              with <code className="rounded bg-muted px-1">POST /reviews</code>{" "}
              so multiple reviews from the same user are attributed correctly.
            </p>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Request body (JSON)
              </p>
              <ul className="space-y-1 text-body text-muted-foreground mb-2">
                <li>
                  <code className="rounded bg-muted px-1">
                    external_user_id
                  </code>{" "}
                  (string, required) — Your internal user ID (e.g. from your
                  auth). Stored hashed; same ID always returns the same{" "}
                  <code className="rounded bg-muted px-1">anon_id</code>.
                </li>
                <li>
                  <code className="rounded bg-muted px-1">display_name</code>{" "}
                  (string, optional) — Not stored currently; reserved for future
                  use.
                </li>
              </ul>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
                {`{
  "external_user_id": "usr_abc123",
  "display_name": "Optional"
}`}
              </pre>
            </div>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Response 200
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
                {`{
  "anon_id": "550e8400-e29b-41d4-a716-446655440000"
}`}
              </pre>
            </div>
          </div>

          {/* --- POST /reviews (Phase 2) --- */}
          <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
            <div>
              <span className="font-mono text-caption font-semibold text-accent">
                POST /reviews
              </span>
              <span className="ml-2 text-caption text-muted-foreground">
                (Phase 2)
              </span>
            </div>
            <p className="text-body text-muted-foreground">
              Submit a review for a coffee or roaster on behalf of one of your
              users. You must provide either{" "}
              <code className="rounded bg-muted px-1">anon_id</code> (from{" "}
              <code className="rounded bg-muted px-1">POST /users</code>) or{" "}
              <code className="rounded bg-muted px-1">external_user_id</code>;
              if you send{" "}
              <code className="rounded bg-muted px-1">external_user_id</code>,
              an identity is created or looked up automatically. Reviews are
              stored with status{" "}
              <code className="rounded bg-muted px-1">pending_external</code>{" "}
              for moderation; entity rating aggregates update via existing
              triggers.
            </p>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Request body (JSON)
              </p>
              <ul className="space-y-1 text-body text-muted-foreground mb-2">
                <li>
                  <code className="rounded bg-muted px-1">entity_type</code>{" "}
                  (string, required) —{" "}
                  <code className="rounded bg-muted px-1">"coffee"</code> or{" "}
                  <code className="rounded bg-muted px-1">"roaster"</code>
                </li>
                <li>
                  <code className="rounded bg-muted px-1">entity_id</code>{" "}
                  (string, required) — UUID of the coffee or roaster
                </li>
                <li>
                  <code className="rounded bg-muted px-1">rating</code> (number,
                  optional) — 1–5
                </li>
                <li>
                  <code className="rounded bg-muted px-1">recommend</code>{" "}
                  (boolean, optional)
                </li>
                <li>
                  <code className="rounded bg-muted px-1">value_for_money</code>
                  ,{" "}
                  <code className="rounded bg-muted px-1">works_with_milk</code>{" "}
                  (boolean, optional)
                </li>
                <li>
                  <code className="rounded bg-muted px-1">brew_method</code>{" "}
                  (string, optional) — One of: whole, filter, espresso, drip,
                  other, turkish, moka_pot, cold_brew, aeropress, channi
                </li>
                <li>
                  <code className="rounded bg-muted px-1">comment</code>{" "}
                  (string, optional) — Max 5000 characters
                </li>
                <li>
                  <code className="rounded bg-muted px-1">anon_id</code>{" "}
                  (string, optional) — UUID from{" "}
                  <code className="rounded bg-muted px-1">POST /users</code>.
                  Omit if using{" "}
                  <code className="rounded bg-muted px-1">
                    external_user_id
                  </code>
                  .
                </li>
                <li>
                  <code className="rounded bg-muted px-1">
                    external_user_id
                  </code>{" "}
                  (string, optional) — Your user ID; identity is created or
                  resolved. Omit if using{" "}
                  <code className="rounded bg-muted px-1">anon_id</code>.
                </li>
              </ul>
              <p className="text-caption text-muted-foreground mb-2">
                At least one of:{" "}
                <code className="rounded bg-muted px-1">rating</code>,{" "}
                <code className="rounded bg-muted px-1">recommend</code>,{" "}
                <code className="rounded bg-muted px-1">value_for_money</code>,{" "}
                <code className="rounded bg-muted px-1">works_with_milk</code>,
                or <code className="rounded bg-muted px-1">comment</code> is
                required.
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
                {`{
  "entity_type": "coffee",
  "entity_id": "550e8400-e29b-41d4-a716-446655440000",
  "rating": 4,
  "recommend": true,
  "value_for_money": true,
  "works_with_milk": false,
  "brew_method": "filter",
  "comment": "Great single origin.",
  "external_user_id": "usr_abc123"
}`}
              </pre>
            </div>
            <div>
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                Response 200
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
                {`{
  "id": "uuid-of-created-review"
}`}
              </pre>
            </div>
            <p className="text-caption text-muted-foreground">
              Responses <strong>400</strong> for validation errors (e.g. missing
              entity_id, invalid rating, or missing both anon_id and
              external_user_id).
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-subheading font-bold">Rate limits</h2>
          <p className="text-body text-muted-foreground">
            Default: 60 requests per minute per key (sliding window). When
            exceeded you receive <strong>429 Too Many Requests</strong> with a{" "}
            <code className="rounded bg-muted px-1">Retry-After</code> header
            (seconds until reset):
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
            {`{ "error": "Rate limit exceeded", "retry_after": 45 }`}
          </pre>
        </section>

        <section className="space-y-4">
          <h2 className="text-subheading font-bold">Errors</h2>
          <p className="text-body text-muted-foreground">
            All error responses use a JSON body with an{" "}
            <code className="rounded bg-muted px-1">error</code> string. Common
            status codes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-body text-muted-foreground">
            <li>
              <strong>400</strong> — Bad request (invalid params or body)
            </li>
            <li>
              <strong>401</strong> — Invalid or missing API key
            </li>
            <li>
              <strong>404</strong> — Resource not found (e.g. coffee or roaster
              slug)
            </li>
            <li>
              <strong>429</strong> — Rate limit exceeded; check{" "}
              <code className="rounded bg-muted px-1">Retry-After</code> header
            </li>
            <li>
              <strong>500</strong> — Server error;{" "}
              <code className="rounded bg-muted px-1">error</code> may contain a
              message
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-subheading font-bold">Code examples</h2>

          <div>
            <p className="mb-2 text-caption font-medium">JavaScript (fetch)</p>
            <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
              {`const res = await fetch(
  \`${BASE_URL}/api/v1/coffees?limit=5&roastLevels=medium&sort=rating_desc\`,
  {
    headers: {
      Authorization: \`Bearer \${process.env.ICB_API_KEY}\`,
    },
  }
);
const data = await res.json();
if (!res.ok) throw new Error(data.error || res.statusText);
console.log(data.items); // coffee list`}
            </pre>
          </div>

          <div>
            <p className="mb-2 text-caption font-medium">Python (requests)</p>
            <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
              {`import os
import requests

resp = requests.get(
    "${BASE_URL}/api/v1/coffees",
    params={"limit": 5, "sort": "rating_desc"},
    headers={"Authorization": f"Bearer {os.environ['ICB_API_KEY']}"},
)
resp.raise_for_status()
data = resp.json()
print(data["items"])`}
            </pre>
          </div>

          <div>
            <p className="mb-2 text-caption font-medium">curl</p>
            <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-caption">
              {`curl -H "Authorization: Bearer icb_live_YOUR_KEY" \\
  "${BASE_URL}/api/v1/coffees?limit=5"
curl -H "Authorization: Bearer icb_live_YOUR_KEY" \\
  "${BASE_URL}/api/v1/coffees/example-single-origin"`}
            </pre>
          </div>
        </section>

        <p className="text-muted-foreground text-caption">
          Questions? Email{" "}
          <a
            href="mailto:support@indiancoffeebeans.com"
            className="text-accent underline hover:no-underline"
          >
            support@indiancoffeebeans.com
          </a>
          .
        </p>
      </div>
    </PageShell>
  );
}

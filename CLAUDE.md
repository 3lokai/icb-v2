# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Indian Coffee Beans Directory (ICB v2) — a Next.js 16 App Router application for discovering Indian specialty coffee. The platform lists coffees and roasters, supports advanced filtering, has a Sanity-backed blog/learn section, community features, user profiles, and interactive tools (coffee calculator, flavor compass, expert recipes).

**Stack:** Next.js 16 + React 19 + TypeScript (strict) + Tailwind CSS v4 + shadcn/ui + Supabase (PostgreSQL) + Sanity CMS + TanStack Query + Fuse.js

## Commands

```bash
npm run dev          # Dev server with Turbopack (http://localhost:3000)
npm run build        # Production build (Turbopack)
npm run type-check   # tsc --noEmit (no tests; this is the test equivalent)
npm run lint         # ESLint (zero warnings policy — --max-warnings=0)
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Prettier write
npm run check        # lint + format:check (runs before commits via husky)
npm run analyze      # Bundle analyzer (uses --webpack, not Turbopack)

# Supabase
npm run supabase:types            # Regenerate src/types/supabase-types.ts from linked project
npm run supabase:migration:new    # Create migration file
npm run supabase:migration:up     # Apply pending migrations
npm run supabase:db:push          # Push local schema to Supabase
```

Husky runs `lint-staged` on commit (ESLint + Prettier on staged `*.{js,jsx,ts,tsx}`).

## Path Aliases

`@/*` maps to `./src/*` — use `@/components/...`, `@/lib/...`, etc. throughout.

## Architecture

### Route Groups

```
src/app/
  (auth)/          # Auth pages (sign-in, sign-up, callbacks)
  (main)/          # Main site behind shared layout
    (public)/      # Static/marketing pages (about, contact, etc.)
    coffees/       # Directory listing + [slug] detail
    roasters/      # Directory listing + [slug] detail
    learn/         # Blog/editorial (Sanity-powered): [slug], category, author, series, glossary, insights
    tools/         # coffee-calculator, coffee-compass, expert-recipes
    dashboard/     # Authenticated user area: profile, preferences, my-reviews, notifications, privacy, developer
    communities/   # Community features
    curations/     # Curated collections
  actions/         # Server actions (account, profile, reviews, gear, curations, forms, newsletter…)
  api/             # Internal + public REST API
    v1/            # Versioned public API (coffees, roasters, reviews, users, usage)
    og/            # Dynamic OG image generation
    search-index/  # Returns Fuse.js search index payload
```

### Data Layer

**Server-side fetches** live in `src/lib/data/fetch-*.ts` — each file wraps a Supabase query, often with `unstable_cache`. These are called directly from Server Components.

**Client-side fetches** go through TanStack Query via domain hooks in `src/hooks/` (`use-coffees.ts`, `use-roasters.ts`, `use-reviews.ts`, etc.), each wrapping `useQuery`/`useMutation` directly.

**Query key registry:** `src/lib/query-keys.ts` — always use these constants for TanStack Query keys, never inline strings.

### Supabase Client Variants

| Import | Use case |
|--------|----------|
| `createClient()` from `@/lib/supabase/client` | Browser/client components |
| `createClient()` from `@/lib/supabase/server` | Server components / Server Actions (respects RLS + cookies) |
| `createAnonServerClient()` from `@/lib/supabase/server` | `unstable_cache` contexts where `cookies()` is forbidden |
| `createServiceRoleClient()` from `@/lib/supabase/server` | Privileged server-only operations that bypass RLS |

### State Management

- **Auth**: React Context `AuthProvider` — consume via `useAuth()` from `@/components/providers/auth-provider`. Server code resolves the user from cookies via `getCurrentUser()` (`@/data/auth`). See [`docs/auth.md`](docs/auth.md) — read it before touching auth.
- **TanStack Query**: all server/async state.
- **URL params**: filter state for the coffee and roaster directories is serialized into URL search params (`src/lib/filters/coffee-url.ts`, `src/lib/filters/roaster-url.ts`) so filters are shareable and bookmarkable.

### Filter System

Filters derive from URL search params → parsed in `src/lib/filters/coffee-url.ts` → passed to `fetchCoffees` in `src/lib/data/fetch-coffees.ts`. The Supabase `get_coffee_filter_meta` RPC returns available facets dynamically. A materialized view (`coffee_directory_mv`) powers the listing queries for performance.

### Discovery / Landing Pages

`src/lib/discovery/landing-pages/` defines static configs for SEO landing pages (brew method, roast level, process, price bucket, region). These generate `generateStaticParams` entries and reuse the main coffee directory UI with pre-applied filters.

### Content (Sanity)

`/learn` routes are backed by Sanity CMS. GROQ queries live in `src/lib/sanity/queries.ts`. The Sanity client is in `src/lib/sanity/client.ts`. Blog/editorial images use `@sanity/image-url` via `src/lib/sanity/image.ts`.

### SEO & OG Images

- Metadata helpers: `src/lib/seo/metadata.ts` (builds `Metadata` objects) and `src/lib/seo/schema.ts` (JSON-LD structured data).
- Dynamic OG images: `src/app/api/og/route.tsx` renders React to image at request time.
- Non-production deployments get `X-Robots-Tag: noindex` automatically via `next.config.ts`.

### Analytics & Notifications

- PostHog (EU endpoint) is proxied via `/ingest/*` rewrites in `next.config.ts`. Server-side client: `src/lib/posthog-server.ts`.
- Analytics event helpers: `src/lib/analytics/`.
- Slack webhooks for activity/forms/roasters: `src/lib/notifications/slack.ts`.
- Rate limiting via Upstash Redis (`@upstash/ratelimit`).

### Public API (v1)

`src/app/api/v1/` exposes a versioned REST API authenticated via API keys (`src/lib/api/validate-api-key.ts`). Usage is tracked in Supabase and rolled up via a cron job (`api/cron/usage-rollup`).

## Environment Variables

Validated at startup by Zod in `env.ts`. Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Server-only: `SUPABASE_SECRET_KEY`. Copy `.env.local.example` to `.env.local`.

## Key Conventions

- **Server Components first** — only add `"use client"` when interactivity or browser APIs are needed.
- **Server Actions** for mutations (`src/app/actions/`), not API routes.
- **Zod** for all form and API input validation; schemas live in `src/lib/validations/`.
- **shadcn/ui** components live in `src/components/ui/` and are not modified directly — extend via wrappers.
- `console.*` calls are stripped in production builds except `error` and `warn`.
- Database schema changes require a migration: `npm run supabase:migration:new`, then `npm run supabase:types` after applying.

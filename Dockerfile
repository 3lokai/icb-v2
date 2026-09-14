# icb-v2 — container image for self-hosted deployment (Coolify + Traefik on the ICB VPS).
# See icb-claude/docs/vercel-imagekit-to-vps-migration.md §A2.
#
# node:24-slim deliberately: package.json declares `engines: { node: ">=22.12.0" }`, and that
# open-ended range makes Vercel run 24.x today regardless of the project's "22.x" setting. Pinning
# 24 here keeps the container on the same major the site already runs, so moving host does not
# silently also move Node major. Unlike the Vercel range, this pin does not auto-upgrade.

# ── Builder ─────────────────────────────────────────────────────────────────
FROM node:24-slim AS builder
WORKDIR /app

# The slim image ships no CA bundle. @posthog/nextjs-config runs the PostHog CLI (a Rust
# binary) during next build's runAfterProductionCompile hook to upload source maps; without
# this it dies with `No CA certificates were loaded from the system` and fails the build.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Dependency layer FIRST — cached independently of source, so npm ci does not re-run
# on every content or component change. Only the manifest/lockfile bust it.
COPY package.json package-lock.json ./
# `npm ci` runs install scripts: sharp needs its prebuilt binary fetched here, and
# next/image optimization fails at runtime without it.
RUN npm ci

# Source layer — busts on code changes, leaves the npm ci layer above cached.
COPY . .

# next build is memory-hungry on Next 16 / React 19 and OOM-kills on a small VPS.
# Cap the heap to ~75% of available build RAM; override with
# --build-arg NODE_BUILD_MEMORY=<MB>.
ARG NODE_BUILD_MEMORY=3072
ENV NODE_OPTIONS=--max-old-space-size=${NODE_BUILD_MEMORY}

# APP_ENV must be a BUILD arg, not just a runtime env var. Both gates that depend on it
# resolve during `next build`, not per request:
#   - next.config.ts headers() is baked into routes-manifest.json (the production
#     noindex X-Robots-Tag gate)
#   - src/app/robots.txt/route.ts is `export const dynamic = "force-static"`
# Left unset, a production build ships `X-Robots-Tag: noindex` on every page.
ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}

# PostHog source-map upload happens during the build; without these, stacks stay minified.
ARG POSTHOG_API_KEY=""
ARG POSTHOG_PROJECT_ID=""
ENV POSTHOG_API_KEY=${POSTHOG_API_KEY}
ENV POSTHOG_PROJECT_ID=${POSTHOG_PROJECT_ID}

# NEXT_PUBLIC_* values are inlined into the client bundle at build time, so they cannot be
# supplied at runtime — Coolify must pass every one of these as a BUILD argument. Names
# enumerated from `grep -rhoE 'NEXT_PUBLIC_[A-Z0-9_]+' src/ next.config.ts`; a missing one
# does not fail the build, it ships a client bundle with `undefined` baked in.
ARG NEXT_PUBLIC_APP_URL=""
ARG NEXT_PUBLIC_CLARITY_PROJECT_ID=""
ARG NEXT_PUBLIC_ENABLE_ANALYTICS=""
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=""
ARG NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=""
ARG NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=""
ARG NEXT_PUBLIC_POSTHOG_HOST=""
ARG NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=""
ARG NEXT_PUBLIC_SANITY_DATASET=""
ARG NEXT_PUBLIC_SANITY_PROJECT_ID=""
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=""
ARG NEXT_PUBLIC_SUPABASE_URL=""
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXT_PUBLIC_CLARITY_PROJECT_ID=${NEXT_PUBLIC_CLARITY_PROJECT_ID} \
    NEXT_PUBLIC_ENABLE_ANALYTICS=${NEXT_PUBLIC_ENABLE_ANALYTICS} \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID} \
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=${NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY} \
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=${NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT} \
    NEXT_PUBLIC_POSTHOG_HOST=${NEXT_PUBLIC_POSTHOG_HOST} \
    NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=${NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN} \
    NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET} \
    NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID} \
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY} \
    NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}

# SUPABASE_SECRET_KEY is needed AT BUILD TIME: generateStaticParams/prerender for the
# ~43 /coffees/[slug] discovery pages and the dynamic sitemap read tables that public RLS
# does not grant (`permission denied for table regions` without it).
#
# Mounted as a BuildKit secret rather than passed as ARG/ENV on purpose — this key bypasses
# every RLS policy, and ARG values persist in image metadata (`docker history`). A secret
# mount exists only for the lifetime of this RUN and is never written to a layer.
RUN --mount=type=secret,id=supabase_secret_key \
    SUPABASE_SECRET_KEY="$(cat /run/secrets/supabase_secret_key 2>/dev/null || true)" \
    npm run build

# ── Runner ──────────────────────────────────────────────────────────────────
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
# Docker defaults HOSTNAME to the container id; the standalone server would bind to it
# and never answer the proxy. Bind all interfaces instead.
ENV HOSTNAME=0.0.0.0

# output: "standalone" — server.js plus only the traced node_modules.
# --chown matters: without it these land root-owned, and the unprivileged runtime user
# cannot create /app/.next/cache. Next then fails EVERY incremental-cache write with
# `EACCES: permission denied, mkdir '/app/.next/cache'` — silently, since pages still
# render 200. The result is a server with no ISR or Data Cache at all, re-querying
# Supabase on every request.
COPY --from=builder --chown=node:node /app/.next/standalone ./
# standalone deliberately omits these two; without them every asset and image 404s.
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Create the cache dir up front so the first write does not depend on mkdir permissions.
RUN mkdir -p .next/cache && chown -R node:node .next

USER node
EXPOSE 3000

CMD ["node", "server.js"]

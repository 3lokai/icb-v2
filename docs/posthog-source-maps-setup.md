# PostHog source map upload setup

## Summary

PostHog source-map generation, chunk-ID injection, upload, and post-upload cleanup are now integrated into the Next.js production build with `@posthog/nextjs-config`.

The integration reads upload credentials at build time from environment variables. No credential values are stored in source or in this report.

## Files changed

- `.github/workflows/ci.yml`
- `.env.local`
- `next.config.ts`
- `package-lock.json`
- `package.json`

## Environment variables configured locally

- `POSTHOG_API_KEY`
- `POSTHOG_PROJECT_ID`
- `POSTHOG_HOST`

These keys are present in `.env.local`. Next.js loads that file automatically at build time.

## Commands

Production build and source-map upload:

```bash
npm run build
```

There is no separate upload command. `withPostHogConfig` generates, injects, uploads, and deletes source maps during `npm run build`.

Run the built application:

```bash
npm run start
```

## CI/CD follow-up required

### GitHub Actions

The existing build step in `.github/workflows/ci.yml` now reads these GitHub Actions secrets:

- `POSTHOG_API_KEY`
- `POSTHOG_PROJECT_ID`
- `POSTHOG_HOST`

Create all three under **GitHub repository → Settings → Secrets and variables → Actions** before the next build on the default branch. Use project ID `122076` and API host `https://eu.posthog.com` for the corresponding non-secret values; use the personal API key with the **Source map upload** preset for `POSTHOG_API_KEY`.

### Vercel

The linked Vercel project `indiacoffeebeans.com` runs `npm run build`, but repository files cannot create Vercel environment variables. Add these variables in **Vercel project → Settings → Environment Variables** for every environment that performs a deploy build (at minimum Production):

- `POSTHOG_API_KEY`
- `POSTHOG_PROJECT_ID`
- `POSTHOG_HOST`

Without them, the guarded PostHog wrapper leaves the build working but skips source-map upload.

## Verification

1. Add the GitHub Actions and Vercel variables above.
2. Run or deploy a production build with `npm run build`.
3. Open the PostHog Symbol sets page: https://eu.posthog.com/project/122076/error_tracking/configuration
4. Confirm a new symbol set appears after the build.
5. Trigger a captured production exception and confirm its stack trace points to real source files rather than minified bundle paths.

The local temporary test affordance was offered but not added. The TypeScript check (`npm run type-check`) completed successfully. The production build was not run by the wizard, so the first upload still needs to be confirmed after your next credentialed build.

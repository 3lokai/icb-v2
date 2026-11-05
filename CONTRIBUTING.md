# Contributing to Indian Coffee Beans

Thanks for helping improve ICB. This repository powers a live specialty-coffee directory, so small, reviewable changes are especially useful.

## Before you start

- Look through existing issues and pull requests to avoid duplicating work.
- For larger changes, open an issue first to discuss the intended behavior and scope.
- Good starting points include accessibility improvements, documentation corrections, regression tests, performance fixes, and clearer coffee-discovery experiences.
- Do not scrape, import, or redistribute third-party roaster content without verifying permission. The MIT code license does not necessarily cover catalog content or images.

## Local setup

1. Use Node.js 22.12.0+ and npm 10.8.2+.
2. Clone or fork the repository and run `npm ci`.
3. Copy `.env.local.example` to `.env.local`, then configure **your own development** Supabase project and any integrations needed for your change.
4. Run `npm run dev` and open http://localhost:3000.

The live catalog, media, and editorial data are not shipped as a fixture dataset. A fresh instance may show empty or incomplete results; some routes require third-party services.

**Never** use a production database for development, run migrations on production, or commit API keys, tokens, customer information, or environment files. Read migrations before applying them in a safe development environment.

## Working on a change

- Prefer small, focused PRs that explain the problem and solution.
- Follow existing patterns in the relevant components, hooks, and libraries.
- Keep TypeScript types accurate, handle loading/error states, and consider keyboard and screen-reader accessibility.
- Add or update tests for behavior changes when practical.
- When changing a database schema, include and explain a reviewed migration. Keep schema changes separate from unrelated UI cleanup.
- Keep documentation consistent with the implementation rather than repeating outdated feature plans.

## Validate your work

Run the relevant checks:

```bash
npm run type-check
npm run lint
npm run test
npm run format:check
```

Some checks or production builds need configured external services. In your PR, describe what you ran and any environmental limitations; do not claim unrun checks passed.

## Opening a pull request

ICB uses `main` for production and a `dev` branch for development work. For a new feature or fix, confirm the appropriate target with the maintainer if it is unclear.

Include:

- What changed and why
- How it was tested (and any checks that could not run)
- Screenshots for visible UI changes, if useful
- Any new environment variables, migrations, or operational implications
- Links to related issues

Expect feedback and revisions. External contributions are welcome, but a proposal may not be merged if it conflicts with project direction or maintenance capacity.

## Issues, security, and conduct

- For bugs, include steps to reproduce, expected and observed behavior, and relevant browser or device details.
- For feature ideas, explain the user problem before prescribing a specific implementation.
- **Do not publicly disclose vulnerabilities.** Follow [SECURITY.md](SECURITY.md) for private reporting.
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md). Concerns can be raised privately via [support@indiancoffeebeans.com](mailto:support@indiancoffeebeans.com).

## Licensing

By submitting a contribution, you agree that your contributed **code** may be distributed under the repository's [MIT License](LICENSE). Please only contribute material you have the right to submit.

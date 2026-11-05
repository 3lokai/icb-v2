# Indian Coffee Beans (ICB)

**An independent, open-source directory for India's specialty coffee ecosystem.**

[Live website](https://indiancoffeebeans.com) · [Contribute](CONTRIBUTING.md) · [Security](SECURITY.md) · [License](LICENSE)

ICB helps coffee drinkers discover Indian roasters and coffees, understand origin and processing, compare available options, and share community ratings. It is a directory and discovery resource, **not a coffee marketplace**. The code behind the site is public and MIT-licensed.

## Status and impact

**Live in production; actively maintained.** As of November 2026, the live website serves approximately **10,000 unique visitors over 90 days** and has around **100 registered users**. Its directory covers **100+ Indian specialty coffee roasters** and **1,500+ coffees**. These are approximate website and catalog figures, **not** GitHub downloads, forks, or third-party deployments.

Catalog coverage changes as coffees appear or are discontinued. The purpose of opening the code is to make the implementation inspectable and to welcome contributions to discovery, accessibility, content presentation, tooling, and maintenance.

## Features

- **Coffee discovery:** browse and filter coffees by roaster, origin, process, roast, tasting notes, and other attributes.
- **Roaster directory:** independent profiles and links to roasters' own websites.
- **Community participation:** accounts, preferences, and coffee ratings.
- **Coffee tools and education:** interactive brewing utilities, coffee-region information, and learning content.
- **Search and sharing:** searchable listings, shareable filtered URLs, and search-friendly pages.
- **Developer-facing functionality:** API routes and related infrastructure for integrations.

The production catalog and editorial content depend on external services and are **not bundled as a redistributable dataset** with this repository.

## Technology

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, Radix UI/shadcn/ui, Motion
- Supabase (PostgreSQL, authentication and row-level security)
- Sanity for editorial content; ImageKit for media
- Upstash Redis for API rate limiting; PostHog for product analytics

See [package.json](package.json) for the current versions and available scripts. Source code is the reference if an older design document differs from the implementation.

## Local development

### Requirements

- Node.js **22.12.0 or newer**, npm **10.8.2 or newer**
- Your **own** Supabase project for local development
- Optional third-party accounts for features backed by Sanity, ImageKit, Redis, and other integrations

### Start

```bash
git clone https://github.com/3lokai/icb-v2.git
cd icb-v2
npm ci
cp .env.local.example .env.local
# Replace example values with your own development credentials.
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Important:** Do not use production credentials or a production database for local development. Review [the environment example](.env.local.example) and [env.ts](env.ts), and supply the services relevant to the feature you are working on. A fresh database may not include the coffee catalog, editorial material, images, or other data used by the live site. As a result, some pages and integrations may not function in a standalone local install.

If your change requires database schema work, inspect [supabase/migrations](supabase/migrations) first and only apply migrations to a local or disposable development project. Do not run migrations against the live database.

## Quality checks

```bash
npm run type-check
npm run lint
npm run test
npm run format:check
```

Production builds may require additional environment variables and access to configured services. See the scripts in [package.json](package.json). In a pull request, say which checks you ran and which you could not run.

## Repository map

| Path                             | Purpose                                                  |
| -------------------------------- | -------------------------------------------------------- |
| [src/app](src/app)               | Next.js routes, APIs, and server actions                 |
| [src/components](src/components) | Feature and shared UI components                         |
| [src/lib](src/lib)               | Data access, business logic, utilities, and integrations |
| [src/hooks](src/hooks)           | React hooks                                              |
| [src/types](src/types)           | Domain and generated database types                      |
| [supabase](supabase)             | Database migrations and Supabase functions/configuration |
| [docs](docs)                     | Technical documentation and architecture decisions       |
| [scripts](scripts)               | Maintenance and data-operation scripts                   |

## Contributing and maintenance

Bug reports, documentation fixes, accessibility improvements, focused tests, and proposals to make coffee discovery better are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request, and follow our [Code of Conduct](CODE_OF_CONDUCT.md). Security concerns should be reported privately using [SECURITY.md](SECURITY.md), not as public issues.

This is a small, independently maintained project. The `main` branch reflects production development; the `dev` branch is also used for ongoing work. Check the contribution guidelines and existing pull requests before choosing a target branch.

## Licensing and data

The **source code** is available under the [MIT License](LICENSE). That does not automatically license third-party coffee descriptions, photographs, roaster names/logos, editorial assets, or external datasets for redistribution. Verify the applicable rights before republishing non-code material.

---

Built for the Indian specialty coffee community. [Explore the live site](https://indiancoffeebeans.com).

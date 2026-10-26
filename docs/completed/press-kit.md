# PRD: ICB Press & Media Hub

**Project:** IndianCoffeeBeans (ICB)  
**Route:** `/press`  
**Priority:** High — ahead of TechSparks and upcoming YourStory coverage  
**Status:** Ready for repository audit and implementation  
**Scope:** Public-facing press hub, media assets, editorial discovery, and media enquiries

---

## 1. Objective

Build a permanent, professional Press & Media Hub for IndianCoffeeBeans.com.

The page should make it effortless for journalists, researchers, event organizers, content creators, and potential partners to understand ICB, access verified platform information, discover original research, and download approved media assets.

The hub must establish ICB's credibility as an independent Indian specialty coffee discovery platform while highlighting its growing catalog, community contributions, original data, and editorial content.

This is **not** another Roaster Kit, About page, Insights dashboard, or blog directory. It connects those existing resources in a media-friendly experience.

### Success criteria

A journalist visiting `/press` should be able to:

1. Understand what ICB does within 15 seconds.
2. Find an approved description and key platform statistics.
3. Discover relevant industry research and editorial series.
4. Download logos, screenshots, and founder photographs.
5. Find media coverage and founder information.
6. Contact ICB for interviews, quotes, or additional data.

No signup, authentication, or email capture should be required.

---

## 2. Mandatory Repository Audit

Before implementation, inspect the existing codebase.

### Examine

- `/about` page and current founder information.
- `/insights` dashboard and its underlying data sources.
- Blog infrastructure, article metadata, categories, and editorial series.
- Existing Roaster Kit implementation and brand asset generation.
- Existing public logo assets, fonts, design tokens, and brand colors.
- Current SEO implementation, structured data, sitemap, and Open Graph generation.
- Existing contact mechanisms.
- Current analytics instrumentation.

### Implementation constraints

- Reuse existing UI components and design tokens.
- Follow existing routing conventions and project architecture.
- Do not introduce a new CMS.
- Do not create duplicate datasets or content models unnecessarily.
- Do not modify existing page functionality.
- Do not add unnecessary database tables.
- Prefer server-side data fetching where consistent with the application.
- Never invent coverage, media quotes, platform statistics, or founder credentials.

**Deliverable before coding:** A short audit summary identifying reusable files, components, data sources, implementation decisions, and any missing assets.

Proceed with implementation when the repository supports the requirements. Flag unresolved decisions rather than fabricating content.

---

## 3. Information Architecture

Recommended layout:

### Section A — Hero

**Eyebrow:** Press & Media

**Headline:** Discover the Story Behind IndianCoffeeBeans

**Supporting copy:**

IndianCoffeeBeans is an independent platform helping people explore India's specialty coffee ecosystem through coffee discovery, community reviews, industry data, and educational content.

**Primary CTA:** Download Media Kit  
**Secondary CTA:** Explore Industry Insights

Hero should remain compact. Avoid oversized stock photography or generic startup visuals.

### Section B — ICB at a Glance

Present platform metrics as a clean, responsive statistics strip.

Potential metrics:

- Total roasters indexed
- Total coffees catalogued
- Community ratings and reviews
- Other meaningful, verifiable platform metrics

#### Data requirements

- Use canonical sources where available.
- Prefer published/active catalog counts over raw database records.
- Clearly label what each statistic measures.
- Use server-side caching where appropriate.
- Apply the same counting rules used elsewhere on ICB.
- If a metric is not reliably available, omit it.
- Never hardcode an unverified number.

Include a last-updated date if the metrics are derived from a periodic snapshot.

### Section C — About the Platform

Provide press-ready descriptions in three formats:

**Short:** Approximately 25 words.

**Standard:** Approximately 75 words.

**Extended:** Approximately 150–200 words.

Each description should have a copy-to-clipboard action.

Messaging should cover:

- Independent specialty coffee discovery.
- Roaster and coffee exploration.
- Community ratings and reviews.
- Structured industry information.
- Educational resources.

Avoid unsupported superlatives such as "India's largest" or "India's number one."

Do not describe ICB as a marketplace unless current product functionality supports that claim.

### Section D — Data & Industry Insights

**Heading:** Explore India's Specialty Coffee Landscape

This is one of the most important sections.

Feature the existing `/insights` page as the authoritative source for original ICB catalog research.

Potential themes, only where supported by actual dashboard data:

- Growth and diversity of specialty coffee roasters.
- Coffee origins and geographic distribution.
- Processing method trends.
- Roast profile distribution.
- Coffee availability and catalog diversity.
- Other findings already supported by Insights.

#### UI

Build a prominent editorial-style feature card with:

- Heading and description.
- Representative dashboard screenshot or existing visualization.
- Selected factual highlights, if data is accessible.
- CTA: **Explore Industry Insights →**

Do not duplicate the entire dashboard.

#### Attribution

Include suggested data attribution:

"Source: IndianCoffeeBeans.com — Industry Insights"

Link attribution to `/insights`.

Journalists may reference published, aggregated insights with attribution. Do not imply that the complete underlying dataset is freely licensed for commercial reproduction.

For custom datasets, API access, bulk exports, or licensing enquiries, direct users to the appropriate contact channel.

---

## 4. Editorial Content & Blog Series

**Heading:** Stories, Guides & Research

ICB already contains extensive editorial content, including multi-part series. Surface that existing investment rather than creating new content.

### Featured series

Display up to three curated editorial series.

Each card should include:

- Series title.
- Short description.
- Representative thumbnail.
- Article count, if available.
- Link to the existing series landing page or filtered archive.

### Featured articles

Display three to four curated articles relevant to journalists and researchers.

Prioritize:

- Indian specialty coffee industry topics.
- Coffee origins and regional diversity.
- Processing and production.
- Consumer education.
- Meaningful trends and original analysis.

Do not automatically select the newest posts simply because they are recent.

### Data model

Reuse existing blog and series metadata.

Prefer configuration-driven curation through existing identifiers or slugs rather than copying article contents.

If a series has no dedicated landing page, use the application's existing supported navigation pattern. Do not build an entirely new series system as part of this PRD.

### Links

**Explore All Articles →** existing blog landing page.

All content should continue to live at its canonical URL.

---

## 5. Story Angles for Journalists

**Heading:** Stories Worth Exploring

Create three or four editorial story prompts that connect readers to existing ICB content and research.

Potential directions:

- India's evolving specialty coffee ecosystem.
- The diversity of Indian coffee-growing regions.
- The science and experimentation behind processing methods.
- How independent roasters and consumers navigate coffee discovery.

Each item should include:

- A brief story premise.
- Relevant existing article or series.
- Relevant Insights link when appropriate.

These are editorial ideas, not claims of completed studies.

Avoid invented statistics or presenting speculation as established trends.

For initial release, curate these through a typed configuration object rather than building an admin interface.

---

## 6. Brand & Media Assets

**Heading:** Download Brand Assets

Build a media asset library for press and editorial use.

### Logo assets

Support available variants:

- Primary logo.
- Light-on-dark logo.
- Dark-on-light logo.
- Icon or symbol.
- SVG and transparent PNG formats where source files exist.

Reuse the established ICB branding.

Review the Roaster Kit implementation for reusable download utilities and styling conventions.

Do not reuse promotional badges as press logos.

### Product screenshots

Provide representative screenshots of:

- Coffee discovery interface.
- Coffee detail page.
- Roaster discovery interface.
- Industry Insights dashboard.
- Other relevant public functionality.

Screenshots must represent real ICB functionality and current UI.

Do not fabricate interface screenshots.

### Founder media

Include:

- Approved founder portrait.
- Founder name and title.
- Short biography.
- Longer biography, if available.
- Optional candid coffee-related photograph.

Store approved media locally or through the existing asset infrastructure.

Do not automatically treat generated founder images as approved for publication. Use placeholders or existing explicitly approved files until confirmed.

### Downloads

Each media asset should offer an individual download.

Also offer:

**Download Complete Media Kit (.zip)**

The ZIP should contain:

- Approved brand assets.
- Selected platform screenshots.
- Approved founder photographs.
- Plain-text or Markdown company descriptions.
- Founder biography.
- Brief brand usage guidelines.
- Attribution and contact information.

Generate the ZIP through the simplest approach consistent with the existing stack, preferably at build time or as a static public asset when practical.

Avoid unnecessary dynamic ZIP generation or a new asset-management service.

### Brand usage guidelines

Include brief guidelines:

- Preserve original logo proportions.
- Use sufficient contrast.
- Do not modify logo colors or distort marks.
- Do not imply ICB endorsement of third parties.
- Credit ICB when reproducing original data or editorial material.

---

## 7. Founder Section

**Heading:** Meet the Founder

This section should humanize ICB without turning the entire page into a personal portfolio.

Include:

- Approved photograph.
- Name and role.
- Short, factual biography.
- A brief explanation of why ICB was created.
- Relevant professional links.
- CTA linking to the existing `/about` page.

Tone: Personal, credible, and founder-led.

Avoid exaggerated entrepreneurial storytelling or invented achievements.

The founder section should remain secondary to the platform, industry research, and media resources.

---

## 8. Press Coverage & Recognition

**Heading:** In the News

Create a reusable collection of press mentions.

Each record should support:

- Publication name.
- Publication logo, if permitted.
- Article headline.
- Publication date.
- External URL.
- Optional description.
- Coverage type: feature, interview, mention, recognition, or event.

### YourStory

The upcoming YourStory feature should be added when the article is publicly available.

Do not display "Featured in YourStory" before publication.

If there is existing, verifiable recognition separate from the upcoming article, it may be displayed with accurate wording and a source.

### Initial release

Use a typed data configuration for press coverage.

No database table or administration panel is required unless the repository already provides a suitable content-management mechanism.

### Empty state

If no published coverage is available, hide this section rather than presenting empty cards or "Coming soon" announcements.

---

## 9. Media Enquiries

**Heading:** Get in Touch

Provide a clear contact mechanism for:

- Interviews.
- Media enquiries.
- Industry data questions.
- Speaking and event opportunities.
- Collaborations.

Use an existing public contact email or verified contact mechanism.

Include relevant LinkedIn links if available.

Do not create a new backend contact form unless there is an established reusable solution.

For data licensing enquiries, link to the relevant existing commercial/API information rather than suggesting unrestricted data access.

---

## 10. SEO & Discoverability

### Page metadata

**Title:** Press & Media Kit | IndianCoffeeBeans

**Meta description:**

Access IndianCoffeeBeans brand assets, founder information, media resources, specialty coffee industry insights, editorial research, and press coverage.

### Requirements

- Canonical URL for `/press`.
- Proper H1–H3 hierarchy.
- Open Graph and Twitter/social preview metadata.
- Responsive images with descriptive alt text.
- Include `/press` in the sitemap.
- Internal links from the About page and site footer.
- Avoid duplicate metadata or competing canonical URLs.

### Structured data

Reuse existing Organization or WebSite structured data if available.

Consider relevant Organization properties such as logo, description, and verified social profiles.

Use Article structured data only for actual published articles where applicable.

Do not use NewsArticle markup for the press hub itself.

---

## 11. UX & Visual Direction

The Press & Media Hub must visually belong to the existing ICB website.

### Design principles

- Match existing typography, colors, spacing, and dark-theme styling.
- Editorial feel rather than corporate SaaS dashboard.
- Restrained use of icons.
- No stock imagery.
- Strong typographic hierarchy.
- Generous but controlled spacing.
- Clear grouping of research, editorial content, and downloadable assets.
- Responsive card layouts.
- No excessive animation.
- No carousels for essential press resources.
- No unnecessary modals.

### Mobile

Ensure journalists can comfortably browse the page on mobile, open research links, copy descriptions, and download individual files.

The complete ZIP may be a secondary action on mobile.

### Accessibility

- Keyboard-accessible controls.
- Appropriate focus indicators.
- Semantic headings.
- Meaningful image alt text.
- Accessible copy/download feedback.
- Adequate color contrast.

---

## 12. Analytics

Reuse existing PostHog/GA4 infrastructure and conventions.

Track meaningful actions:

| Event | Trigger |
|---|---|
| `press_page_viewed` | Press page visit, if not already captured through general page views |
| `press_asset_downloaded` | Individual asset download |
| `press_kit_downloaded` | Complete ZIP download |
| `press_insights_clicked` | Insights CTA |
| `press_article_clicked` | Featured article click |
| `press_series_clicked` | Editorial series click |
| `press_coverage_clicked` | External media coverage click |
| `press_contact_clicked` | Media contact action |
| `press_description_copied` | Copying approved platform description |

Use established event naming conventions if they differ.

Include relevant attributes such as asset type, content slug, or CTA location.

Do not duplicate existing page-view tracking.

---

## 13. Content Management & Maintenance

The page should require minimal ongoing manual maintenance.

| Content | Preferred source |
|---|---|
| Platform statistics | Existing canonical database/query layer |
| Industry insights | Existing `/insights` |
| Blog articles | Existing blog content system |
| Editorial series | Existing series metadata |
| Story angles | Small curated configuration |
| Brand assets | Existing public asset infrastructure |
| Founder biography | Existing About content or shared configuration |
| Press coverage | Typed configuration, initially |

### Important

Avoid maintaining different versions of the same company descriptions or founder biography across multiple pages where a shared content source is practical.

Do not introduce a CMS migration as part of this feature.

---

## 14. Out of Scope

Do not implement:

- Media login or journalist accounts.
- A gated press kit.
- Newsletter signup specifically for journalists.
- Automated press release distribution.
- A new blog system.
- A new industry analytics dashboard.
- Public raw database exports.
- Commercial data licensing functionality.
- Full redesigns of `/about`, `/insights`, or the Roaster Kit.
- AI-generated media quotes or invented testimonials.
- A separate media administration dashboard.

These can be considered later if actual usage justifies them.

---

## 15. Acceptance Criteria

The feature is complete when:

- [ ] `/press` is publicly accessible and responsive.
- [ ] Visual styling is consistent with ICB.
- [ ] Press descriptions are accurate and copyable.
- [ ] Key statistics are sourced correctly or omitted.
- [ ] `/insights` is prominently linked.
- [ ] Curated blog series and articles navigate to canonical URLs.
- [ ] All asset download links work.
- [ ] Complete media kit ZIP works and contains only approved assets.
- [ ] Founder details are consistent with the About page.
- [ ] Unpublished press coverage is not shown.
- [ ] Contact details and attribution instructions are accessible.
- [ ] SEO metadata, canonical URL, and sitemap are correct.
- [ ] Analytics events follow existing patterns.
- [ ] No existing ICB pages or functions are broken.
- [ ] Relevant tests, linting, and type checks pass.

---

## 16. Delivery Plan

### Phase 1 — Repository audit

Identify existing assets, content models, and reusable components. Report missing information and content.

### Phase 2 — Core press page

Implement hero, platform overview, statistics, Insights feature, editorial series, articles, and founder section.

### Phase 3 — Media assets

Implement asset library, download behavior, company descriptions, and ZIP bundle.

### Phase 4 — Coverage and enquiries

Add verified press mentions, media contact details, and brand usage guidance.

### Phase 5 — Quality assurance

Validate responsiveness, SEO, accessibility, downloads, analytics, and regression safety.

### Implementation guidance for Claude Code

1. Inspect the repository before changing code.
2. Present a concise audit and proposed file-level implementation plan.
3. Reuse existing systems wherever possible.
4. Implement in focused, reviewable changes.
5. Do not invent missing information or silently substitute placeholder content as real.
6. Run relevant checks and tests.
7. Summarize changes, any missing media assets, and manual actions needed before launch.

**Final objective:** Make IndianCoffeeBeans a credible, easily referenced source for journalists covering India's specialty coffee ecosystem — with immediate access to brand assets, verified data, original research, and editorial content.

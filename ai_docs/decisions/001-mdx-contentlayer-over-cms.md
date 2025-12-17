## ADR-001: MDX + Contentlayer over Headless CMS

**Date:** 2025-05-22  
**Status:** Accepted  
**Participants:** CTO, Lead Developer

### Context
Need to choose content management approach for `/learn` section with 10-25 educational articles about Indian coffee culture, brewing techniques, and roaster spotlights.

### Decision
Use **MDX + Contentlayer** instead of headless CMS (Strapi, Sanity) or raw MDX processing.

### Rationale
- **Type Safety**: Contentlayer auto-generates TypeScript types from content schema
- **Build-Time Validation**: Content validation prevents broken builds and missing SEO data
- **Developer Experience**: Full IDE support with auto-completion for content queries
- **Performance**: Static generation with optimized caching
- **SEO Control**: Complete control over meta tags, structured data, and URL structure
- **Cost**: No additional CMS hosting costs
- **Scale Appropriate**: Perfect for 10-25 articles, can scale to 100+ easily

### Alternatives Considered
- **Headless CMS**: Too much overhead for small content volume, additional costs
- **Raw MDX**: Missing type safety and validation that Contentlayer provides
- **Database + Rich Text**: Overkill for article content, worse developer experience

### Consequences
- **Positive**: Type-safe content, excellent SEO, fast performance, no hosting costs
- **Negative**: Slightly more setup complexity than raw MDX
- **Neutral**: Content editing requires basic markdown knowledge (acceptable for current team)

---
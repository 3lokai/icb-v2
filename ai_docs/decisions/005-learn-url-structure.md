## ADR-005: Learn Section URL Structure and Routing

**Date:** 2025-05-22  
**Status:** Accepted  
**Participants:** CTO, Lead Developer

### Context
Need to define URL structure for `/learn` section articles, categories, tags, and authors.

### Decision
Implement the following URL structure:

```
/learn                     → Main listing page
/learn/[slug]             → Individual articles
/learn/category/[slug]    → Category-specific listings
/learn/tag/[tag]          → Tag-specific listings  
/learn/author/[slug]      → Author profile pages
```

### Rationale
- **SEO Friendly**: Clean URLs with relevant keywords
- **Scalable**: Easy to add new content types (series, guides, etc.)
- **Intuitive**: Matches user expectations from other blog platforms
- **Contentlayer Compatible**: Works well with computed fields and routing

### Implementation Details
- **Article slugs**: Auto-generated from titles, manually customizable
- **Category slugs**: Predefined in Contentlayer schema (`coffee-101`, `brewing`, etc.)
- **Tag slugs**: Normalized tag names (`single-origin`, `arabica`, etc.)
- **Author slugs**: Based on author names (`maria-santos`, `coffee-expert`)

### SEO Considerations
- Canonical URLs prevent duplicate content
- Category and tag pages have unique meta descriptions
- Breadcrumbs show content hierarchy
- Internal linking between related content

### Future Extensions
- **Series**: `/learn/series/brewing-basics/part-1`
- **Guides**: `/learn/guides/coffee-beginners-guide`
- **Region focus**: `/learn/region/chikmagalur`

### Consequences
- **Positive**: Clear content organization, good SEO structure, room for growth
- **Negative**: More pages to maintain and optimize
- **Implementation**: Requires dynamic routing for all content types

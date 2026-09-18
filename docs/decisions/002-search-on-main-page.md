## ADR-002: Search on Main Page (Not Separate Route)

**Date:** 2025-05-22  
**Status:** Accepted  
**Participants:** CTO, Lead Developer

### Context
Need search functionality for article discovery on `/learn` section with 10-25 posts.

### Decision
Implement search as enhanced filtering on main `/learn` page rather than dedicated `/learn/search` route.

### URL Structure
```
/learn → All articles
/learn?q=brewing → Search results
/learn?category=coffee-101 → Category filter
/learn?q=arabica&category=brewing → Combined search + filter
```

### Rationale
- **Simpler UX**: Single interface for discovery instead of separate search page
- **Better SEO**: All search traffic consolidates to main `/learn` page authority
- **Easier Maintenance**: One page to maintain instead of two
- **Scale Appropriate**: For 10-25 posts, dedicated search page is overkill
- **Future-Proof**: Easy to add dedicated search page later if volume justifies it

### Implementation
- Search input + category/tag filters on main page
- URL state management for shareable search URLs
- Empty states show popular articles when no results found

### Consequences
- **Positive**: Simpler codebase, better SEO consolidation, faster to implement
- **Negative**: Main page becomes slightly more complex
- **Future**: May need dedicated search page if content grows to 100+ articles

---
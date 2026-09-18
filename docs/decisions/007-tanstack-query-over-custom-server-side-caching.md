# ADR-007: TanStack Query Over Custom Server-Side Caching

**Date:** 2025-01-20  
**Status:** Accepted  
**Participants:** Project Lead, AI Development Consultant

## Context
During filter implementation planning, we initially designed a custom server-side caching system (`SimpleCache`) for handling filtered results. However, analysis revealed that Next.js Server Actions run in serverless functions where each request creates a fresh process, making in-memory server-side caching ineffective. We needed to choose between complex Redis-based server caching, moving logic client-side, or adopting a professional client-side caching solution.

## Decision
Adopt **TanStack Query for client-side caching** while maintaining **server-side filtering logic** for SEO benefits. This hybrid approach combines:
- **Server Actions**: Clean filtering logic (no caching complexity)
- **TanStack Query**: Professional client-side result caching
- **Maintained SEO**: Server-rendered filtered pages remain crawlable
- **Enhanced UX**: Instant cache hits, background refetching, optimistic updates

## Rationale
- **Serverless Reality**: Custom server-side cache is reset on each function invocation
- **SEO Preservation**: Server-side filtering critical for indexable filtered pages (`/roasters?state=Karnataka`)
- **Professional Solution**: TanStack Query provides enterprise-grade features out-of-the-box
- **Reduced Complexity**: Eliminates 500+ lines of custom caching code
- **Better UX**: Built-in loading states, error handling, background refetching
- **Industry Standard**: Battle-tested solution used by major applications

## Alternatives Considered
- **Custom Server-Side Cache + Redis**: Rejected due to infrastructure complexity and overkill for current scale (8-10k daily visitors)
- **Full Client-Side Filtering**: Rejected because it breaks SEO - Google wouldn't see filtered content
- **Keep Custom SimpleCache**: Rejected because it doesn't work in serverless environment
- **React Query Alternative (SWR)**: Rejected because TanStack Query has superior features and TypeScript support

## Consequences
- **Positive**: 
  - Professional caching with 5-minute stale time, 10-minute cache time
  - Request deduplication prevents duplicate API calls automatically
  - Background refetching keeps data fresh without user intervention
  - Built-in loading/error states eliminate custom implementations
  - DevTools integration provides debugging capabilities
  - SEO benefits fully maintained (server-side filtering unchanged)
  - Reduced bundle size (removing custom cache code)
- **Negative**: 
  - Additional dependency (~45kb gzipped)
  - Learning curve for team members unfamiliar with TanStack Query
  - Cache is lost on page refresh (vs hypothetical server cache persistence)
- **Neutral**: 
  - Requires QueryProvider wrapper in app structure
  - Changes testing approach (MSW integration for query testing)

## Implementation Notes
- **Dependencies**: Install `@tanstack/react-query` and `@tanstack/react-query-devtools`
- **Configuration**: 5-minute stale time, 10-minute cache time, keepPreviousData enabled
- **Integration Pattern**: Server Actions remain unchanged, TanStack Query hooks wrap the calls
- **Error Handling**: TanStack Query retry logic replaces custom retry implementation
- **Analytics**: Track cache hit rates alongside existing filter metrics
- **File Removals**: Delete `src/lib/cache/simple-cache.ts` and related server cache logic

## Future Considerations
- **Revisit when**: If server-side caching becomes necessary (unlikely with current serverless architecture)
- **Upgrade Path**: TanStack Query v5 features when they become stable
- **Offline Support**: Consider TanStack Query persistence plugin for offline functionality
- **Advanced Features**: Infinite queries for pagination, mutations for optimistic updates
- **Migration**: Easy path to other query libraries if TanStack Query doesn't meet future needs

---

*This decision enables professional-grade caching while preserving SEO benefits and reducing custom code complexity.*

*Referenced in implementation plan: icb-filters-implementation-plan.md*
*Supersedes: Custom server-side caching approach from original Phase 2*
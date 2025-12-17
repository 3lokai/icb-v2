# ADR-001: Choose Velite over Contentlayer for Learn Section

**Date:** 2025-05-24  
**Status:** Accepted  
**Participants:** CTO, Development Team

## Context
We need to implement the `/learn` section of the Indian Coffee Beans directory with MDX-based content management for articles, guides, and educational content. The original plan specified Contentlayer, but during dependency installation, we discovered that Contentlayer is incompatible with Next.js 15.3.2 (our current version) and has been effectively abandoned by its maintainers since 2024.

The learn section needs to:
- Handle 5+ content categories (coffee-101, brewing, sustainability, etc.)
- Support rich MDX content with custom components
- Integrate with our existing Supabase data layer for coffee/roaster spotlights
- Generate type-safe content schemas
- Process and optimize images automatically
- Work seamlessly with our Next.js 15 + TypeScript + Tailwind setup

## Decision
We will use **Velite** instead of Contentlayer for content management in the learn section.

## Rationale
- **Active Maintenance**: Velite is actively developed and maintained, unlike Contentlayer which has been abandoned
- **Next.js 15 Compatibility**: Works out-of-the-box with Next.js 15 without dependency conflicts
- **Better Asset Handling**: Automatically processes and copies referenced images/files to public directory during build
- **Superior Type Safety**: Uses Zod schemas for validation with better TypeScript inference than Contentlayer
- **Performance**: Lightweight with faster build times and smaller runtime dependencies
- **Framework Agnostic**: Outputs standard JSON, making future migrations easier
- **Simple Integration**: No complex webpack plugins that break with framework updates

## Alternatives Considered
- **Contentlayer**: Original choice - Rejected because abandoned, incompatible with Next.js 15, and broken documentation
- **@next/mdx + next-mdx-remote**: Rejected because requires more manual setup and lacks built-in content management features
- **Fumadocs MDX**: Rejected because overkill for our needs and adds unnecessary complexity
- **Manual MDX handling**: Rejected because would require building content management from scratch

## Consequences
- **Positive**: 
  - No dependency conflicts with Next.js 15
  - Better developer experience with Zod validation
  - Automatic image processing reduces manual work
  - Future-proof with active maintenance
  - Cleaner, simpler configuration
- **Negative**: 
  - Need to learn new API (though very similar to Contentlayer)
  - Smaller ecosystem compared to Contentlayer's peak popularity
  - Migration path if we ever need to switch again
- **Neutral**: 
  - File structure remains mostly the same
  - Development timeline stays on track

## Implementation Notes
- Configuration file: `velite.config.ts` (replaces `contentlayer.config.ts`)
- Content directory: `/content/learn/` with category subdirectories
- Type generation: `./.velite/` directory (replaces `./.contentlayer/`)
- Next.js integration: Simple config-based approach without webpack plugins
- Schema definition: Zod-based with automatic slug generation and metadata extraction

## Future Considerations
We should revisit this decision if:
- Velite becomes unmaintained (monitor GitHub activity quarterly)
- We need features that Velite doesn't support
- Performance issues arise with large content volumes
- Better alternatives emerge in the content management space

The modular nature of our setup means switching content management tools later would primarily affect the learn section without impacting the core directory functionality.

---

## References
- [Velite Documentation](https://velite.js.org/)
- [Contentlayer Abandonment Issue](https://github.com/contentlayerdev/contentlayer/issues/429)
- [Next.js 15 Compatibility Research](https://velite.js.org/guide/with-nextjs)
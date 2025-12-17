# ADR-001: ImageKit for Learn Section Image Management

**Date:** 2025-05-24  
**Status:** Accepted  
**Participants:** CTO, Full Stack Developer

## Context
The Indian Coffee Beans learn section requires an image management solution for article covers, featured images, author avatars, and content images. We need real-time image transformations, CDN delivery, and cost-effective scaling as content grows. The solution must integrate seamlessly with our Velite + MDX setup and provide responsive image delivery for various device sizes.

## Decision
Use ImageKit for image management and delivery, combined with Velite's native image processing for build-time optimization. Images will be stored in ImageKit and referenced via public IDs in article frontmatter, with real-time URL transformations for responsive delivery.

## Rationale
- **Geographic advantage**: ImageKit has superior CDN performance in India vs Cloudinary
- **Cost efficiency**: Unlimited images + 20GB bandwidth/month vs Cloudinary's 30-day trial with 25 credits
- **Real-time transforms**: URL-based transformations (`?w=400&h=250`) without build-time constraints
- **Simple integration**: Direct URL manipulation, no complex SDK required
- **Scalability**: Free tier supports growth without immediate billing concerns
- **Developer experience**: Straightforward implementation with existing Velite setup

## Alternatives Considered
- **Cloudinary**: Superior features but expensive for our scale. 30-day trial limits vs ImageKit's permanent free tier. Overkill for coffee blog use case.
- **Velite native only**: Build-time only processing, no real-time responsiveness. Would require multiple image sizes stored statically.
- **Next.js Image Optimization**: Requires local storage, no CDN benefits, limited transformation options.

## Consequences
- **Positive**: 
  - Cost-effective scaling with generous free tier
  - Excellent performance for Indian users
  - Real-time responsive image delivery
  - Simple URL-based API reduces complexity
  - No vendor lock-in concerns
- **Negative**: 
  - Fewer AI-powered features than Cloudinary
  - Manual image upload process to ImageKit dashboard
  - 20GB bandwidth limit (though generous for launch)
- **Neutral**: 
  - Another service to manage
  - Need to monitor bandwidth usage as we scale

## Implementation Notes
- Create ImageKit account and configure URL endpoint
- Update velite.config.ts to use string URLs instead of s.image()
- Build helper functions for responsive image URLs
- Use public IDs in frontmatter: `cover: "coffee-article-hero"`
- Implement responsive image component with ImageKit transformations
- Remove rehype-pretty-code dependency (not needed for coffee content)

## Future Considerations
Revisit when approaching 20GB/month bandwidth limit or if we need advanced AI features. Migration path to Cloudinary or other providers remains straightforward due to URL-based integration. Consider paid ImageKit plan at scale for higher bandwidth and advanced features.

---

## Next Steps
1. Set up ImageKit account
2. Update velite configuration 
3. Create ImageKit helper utilities
4. Test with sample article images
5. Build responsive image components
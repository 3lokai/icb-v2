## ADR-003: Postpone AI Features Until Content Scale Justifies It

**Date:** 2025-05-22  
**Status:** Accepted  
**Participants:** CTO, Lead Developer

### Context
Considering AI-powered features like semantic search, RAG chatbot, and content recommendations for `/learn` section.

### Decision
**Postpone all AI features** until content volume reaches 100+ articles (estimated 6-12 months post-launch).

### Current Content Plan
- Launch: ~10 articles
- 3 months post-launch: ~25 articles
- 12 months post-launch: ~50-100 articles

### Rationale
- **Over-Engineering**: Vector embeddings and semantic search provide minimal benefit for <25 articles
- **Development Cost**: AI features would take 2-3 weeks to implement properly
- **Infrastructure Cost**: Vector database hosting and embedding API costs
- **Maintenance Overhead**: Additional systems to monitor and maintain
- **Better ROI**: Focus on content quality and SEO fundamentals first

### Simple Alternatives for Now
- Category-based filtering
- Tag-based "related articles"
- Basic text search (browser-native or simple fuzzy matching)
- Manual content curation for featured articles

### Future Trigger Points
Consider AI features when:
- Article count exceeds 100
- Users frequently request content that's hard to find with current search
- Analytics show search abandonment or poor content discovery

### Consequences
- **Positive**: Faster time to market, simpler architecture, focus on content quality
- **Negative**: May miss early AI adoption opportunity
- **Future**: Can implement AI features later when scale justifies complexity

---

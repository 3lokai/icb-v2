
### 1.2 Configuration Files
- **File:** `/velite.config.ts` - Main Velite config with Article schema
- **File:** `/next.config.ts` - Update for Velite integration (simple approach for Next.js 15)
- **File:** `/mdx-components.tsx` - Custom MDX component mappings
- **File:** `.gitignore` - Add `.velite` directory

### 1.3 Content Directory Structure
```
/content/
└── learn/
    ├── coffee-101/
    ├── brewing/
    ├── sustainability/
    ├── processing/
    ├── history/
    └── regions/
```

### 1.4 Type Integration
- **File:** `/src/types/learn.ts` - Re-export Velite generated types + custom interfaces

### ✅ **Checkpoint:** `npm run build` should generate types in `/.velite/`

---

## Phase 2: Content Management (Day 1 - Afternoon)

### 🎯 Goal: Content utilities and helper functions ready

### 2.1 Content Utilities
- **File:** `/src/lib/content/index.ts` - Article fetching functions (getAllArticles, getBySlug, etc.)
- **File:** `/src/lib/content/categories.ts` - Category definitions and metadata
- **File:** `/src/lib/content/supabase-queries.ts` - Server-side queries for coffee/roaster data

### 2.2 Helper Scripts
- **File:** `/scripts/new-article.js` - CLI to generate new article files
- **Package.json scripts** for content management

### 2.3 Sample Content (5 Articles)
Create starter MDX files with proper frontmatter:
- Understanding Arabica Varieties
- Perfect Pour-Over Guide  
- Indian Coffee Heritage
- Chikmagalur Region Guide
- Organic Farming Practices

### ✅ **Checkpoint:** Can query articles with type safety

---

## Phase 3: Core Components (Day 2)

### 🎯 Goal: All Learn section components built and functional

### 3.1 Learn Page Components
- `ArticleCard.tsx` - Article preview cards
- `ArticleGrid.tsx` - Grid layout with pagination
- `ArticleFilters.tsx` - Search & category filters
- `FeaturedArticles.tsx` - Hero section

### 3.2 Article Page Components  
- `ArticleContent.tsx` - Main article wrapper
- `ArticleMeta.tsx` - Author, date, reading time
- `TableOfContents.tsx` - Auto-generated TOC
- `RelatedArticles.tsx` - Suggestions based on category/tags

### 3.3 Data-Connected MDX Components (Server)
- `CoffeeProfile.tsx` - Coffee spotlight with Supabase data
- `RoasterSpotlight.tsx` - Roaster features
- `RegionMap.tsx` - Region showcases

### 3.4 Interactive Components (Client)
- `FloatingTOC.tsx` - Collapsible TOC with scroll spy
- `ArticleProgress.tsx` - Reading progress indicator

### ✅ **Checkpoint:** Components render with mock data

---

## Phase 4: Page Implementation (Day 2-3)

### 🎯 Goal: All Learn routes functional with proper SEO

### 4.1 Route Structure
```
/src/app/learn/
├── page.tsx              # Main learn page
├── loading.tsx           # Loading states
├── [slug]/
│   ├── page.tsx         # Individual articles
│   └── loading.tsx      
└── category/[category]/
    └── page.tsx         # Category pages
```

### 4.2 SEO Implementation
- Article metadata generation
- Structured data for articles
- Sitemap updates for all articles
- Open Graph images

### ✅ **Checkpoint:** All routes accessible and render content

---

## Phase 5: Search & Filtering (Day 3-4)

### 🎯 Goal: Functional search and client-side filtering

### 5.1 Search Implementation
- **Hook:** `useArticleSearch.ts` - Search with debouncing
- **Component:** `SearchInterface.tsx` - Combined search + filters
- URL state management for shareable links

### 5.2 Performance & Polish
- Image optimization and lazy loading
- Mobile responsive design
- Error boundaries and loading states
- Analytics integration

### ✅ **Checkpoint:** Search, filtering working smoothly

---

## Phase 6: Testing & Content (Day 4)

### 🎯 Goal: Complete testing with 5 sample articles

### 6.1 Content Creation
Create 5 complete articles with:
- Proper frontmatter following schema
- Rich content with headings, images, code blocks
- Data-connected components (CoffeeProfile, RoasterSpotlight, etc.)
- Internal cross-links

### 6.2 Testing Checklist
- [ ] All 5 articles display correctly
- [ ] Search finds relevant articles
- [ ] Category filtering works
- [ ] Related articles show up
- [ ] Data-connected components pull live information
- [ ] Mobile responsive design
- [ ] SEO metadata populates correctly
- [ ] Loading states work smoothly
- [ ] Error handling for invalid data

### ✅ **Checkpoint:** All features working end-to-end

---

## Key Differences from Contentlayer

### File Structure Changes
```
# OLD (Contentlayer)
/contentlayer.config.ts
/.contentlayer/

# NEW (Velite)  
/velite.config.ts
/.velite/
```

### Schema Definition
- **Contentlayer:** Custom document types
- **Velite:** Zod-based schemas with better validation

### Asset Handling
- **Contentlayer:** Manual image management
- **Velite:** Automatic asset processing and copying

### Next.js Integration
- **Contentlayer:** Webpack plugin (broken with Next.js 15)
- **Velite:** Simple config-based integration

---

## Success Criteria

At completion, you should have:
- ✅ 5 sample articles displaying correctly
- ✅ Search and filtering functional  
- ✅ All routes working with proper SEO
- ✅ Mobile-responsive design
- ✅ Type-safe content management
- ✅ Data-connected components showing live coffee/roaster info
- ✅ Cross-selling integration to product pages
- ✅ Performance optimized (bundle size, caching, loading)

Ready to start Phase 1? The beauty of Velite is its simplicity - no webpack plugins to break, just clean Zod schemas and automatic asset handling! 🚀
# ICB Learn Section: Implementation Action Plan

**Goal:** Complete `/learn` section with MDX + velite, ready for testing with 5 sample articles

**Estimated Time:** 3-4 days  
**Final State:** Fully functional learn section with search, filtering, and article pages

## Directory Integration Considerations

### **Shared Infrastructure with Directory Pages:**

**Server Actions Pattern:**
- Learn section will use same server action patterns as directory pages
- Consistent data fetching across `/coffees`, `/roasters`, `/regions`, `/learn`
- Shared Zustand stores for cross-section state management

**Files to Consider for Directory Consistency:**
- `/src/app/actions/coffee-actions.ts` - Reuse for coffee data in articles
- `/src/app/actions/roaster-actions.ts` - Reuse for roaster spotlights  
- `/src/app/actions/region-actions.ts` - Reuse for region content
- `/src/store/zustand/coffee-store.ts` - Extend for learn section needs

**Benefits of Alignment:**
- Consistent data fetching patterns
- Shared loading states and error handling
- Cross-section navigation and state preservation
- Unified search experience across site sections

---

## Phase 1: Foundation Setup (Day 1 - Morning)

### 🎯 Goal: Get velite configured and generating types

### 1.1 Install Dependencies
```bash
npm install velite 
npm install remark-gfm rehype-highlight rehype-slug rehype-autolink-headings
npm install gray-matter reading-time
npm install @tailwindcss/typography
`@mdx-js/react` and `@types/mdx`

```

### 1.2 Configuration Files
- **File:** `/velite.config.ts`
  - Define Article document type with all frontmatter fields
  - Set up computed fields (slug, url, readingTime, headings)
  - Configure file path patterns for `/content/learn/**/*.mdx`

- **File:** `/next.config.ts` (update existing)
  - Add withvelite wrapper
  - Configure MDX plugins (remark-gfm, rehype-highlight, etc.)

- **File:** `/mdx-components.tsx` (root level)
  - Define custom MDX components (Callout, ImageGallery, etc.)
  - Map standard HTML elements to styled versions

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
- **File:** `/src/types/learn.ts`
  - Re-export velite generated types
  - Add custom interfaces for components
  - Define category and tag enums

### ✅ **Checkpoint:** `npm run build` should generate types in `/.velite/`

---

## Phase 2: Content Management (Day 1 - Afternoon)

### 🎯 Goal: Content utilities and helper scripts ready

### 2.1 Content Utilities (Server Actions Integration)
- **File:** `/src/lib/content/index.ts`
  - getAllArticles() function with sorting
  - getArticleBySlug() function  
  - getArticlesByCategory() function
  - getFeaturedArticles() function
  - getRelatedArticles() function
  - Search and filtering utilities

- **File:** `/src/lib/content/supabase-queries.ts`
  - Server-side Supabase queries for MDX components
  - getCoffeeForArticle(), getRoasterForArticle()
  - Reusable with your directory page server actions
  - Consistent data fetching patterns across learn & directory sections

- **File:** `/src/lib/content/categories.ts`
  - Category definitions with metadata
  - Category display names and descriptions
  - Category color schemes for badges

### 2.2 Content Validation & Type Safety
- **File:** `/src/lib/content/validation.ts`
  - Build-time validation for MDX component props
  - Verify coffee/roaster/region IDs exist in database
  - TypeScript strict mode enforcement for MDX components

- **File:** `/scripts/validate-content-refs.js`
  - CLI script to validate all content references
  - Check for broken coffee/roaster/region IDs in articles
  - Run as part of build process

- **Package.json scripts:**
  ```json
  {
    "validate-content": "velite build && node scripts/validate-content-refs.js",
    "validate-refs": "node scripts/validate-content-refs.js"
  }
  ```
- **File:** `/scripts/new-article.js`
  - CLI script to generate new article files
  - Pre-filled frontmatter template
  - Automatic slug generation

### 2.3 Helper Scripts
- **File:** `/scripts/new-article.js`
  - CLI script to generate new article files
  - Pre-filled frontmatter template
  - Automatic slug generation

- **File:** `/scripts/preview-mode.js`
  - Enable preview mode for draft articles
  - Mock data fallbacks for development
  - Staging environment configuration

- **Package.json scripts:**
  ```json
  {
    "new-article": "node scripts/new-article.js",
    "validate-content": "velite build && node scripts/validate-content-refs.js",
    "preview-mode": "node scripts/preview-mode.js && npm run dev"
  }
  ```

### 2.4 Sample Content (5 Articles)
Create sample MDX files in appropriate categories:
- `/content/learn/coffee-101/understanding-arabica-varieties.mdx`
- `/content/learn/brewing/perfect-pour-over-guide.mdx`
- `/content/learn/history/indian-coffee-heritage.mdx` 
- `/content/learn/regions/chikmagalur-coffee-guide.mdx`
- `/content/learn/sustainability/organic-farming-practices.mdx`

Each with complete frontmatter following schema.

### ✅ **Checkpoint:** Can query articles with type safety in components

---

## Phase 3: Core Components (Day 2 - Morning)

### 🎯 Goal: All Learn section components built and functional

### 3.1 Learn Page Components
- **File:** `/src/components/learn/ArticleCard.tsx`
  - Article preview card with image, title, description
  - Author, date, reading time, category badge
  - Hover effects and click handling

- **File:** `/src/components/learn/ArticleGrid.tsx`
  - Responsive grid layout for article cards
  - Loading states and empty states
  - Pagination support

- **File:** `/src/components/learn/ArticleFilters.tsx`
  - Search input with debouncing
  - Category filter dropdown/buttons
  - Tag filter (if implementing)
  - Sort options (latest, popular, reading time)

- **File:** `/src/components/learn/FeaturedArticles.tsx`
  - Hero section with 2-3 featured articles
  - Large featured card + smaller cards layout
  - Call-to-action elements

### 3.2 Article Page Components  
- **File:** `/src/components/learn/ArticleContent.tsx`
  - Main article wrapper with proper typography
  - Progress indicator (reading progress)
  - Print-friendly styles

- **File:** `/src/components/learn/ArticleMeta.tsx`
  - Author info, publish date, update date
  - Reading time, difficulty level
  - Category and tags display

- **File:** `/src/components/learn/TableOfContents.tsx`
  - Auto-generated from article headings
  - Collapsible sidebar with toggle button
  - Floating position that follows scroll
  - Current section highlighting
  - Mobile: floating button that opens modal TOC
  - Smooth scroll navigation with offset handling

- **File:** `/src/components/learn/RelatedArticles.tsx`
  - 3-4 related article suggestions
  - Based on category and tags
  - Compact card layout

### 3.3 SEO Components
- **File:** `/src/components/learn/ArticleSchema.tsx` **(Server Component)**
  - Structured data for articles
  - Author, publisher, date information
  - Reading time and word count

### 3.4 Data-Connected Components (Server)
- **File:** `/src/components/learn/mdx/CoffeeProfile.tsx` **(Server Component)**
  - Coffee spotlight with static Supabase data at build time
  - Pulls from coffees table: name, description, roaster info
  - Links to coffee detail page and roaster page

- **File:** `/src/components/learn/mdx/RoasterSpotlight.tsx` **(Server Component)**
  - Roaster feature with static data from roasters table
  - Logo, description, location, website links
  - Shows sample coffees from that roaster

- **File:** `/src/components/learn/mdx/RegionMap.tsx` **(Server Component)**
  - Region showcase from regions table
  - Climate, altitude, main varieties
  - Links to coffees available from that region

- **File:** `/src/components/learn/mdx/FlavorProfile.tsx` **(Server Component)**
  - Visual flavor wheel from coffee_flavor_profiles
  - Connected to flavor_profiles table
  - Static flavor notes display

- **File:** `/src/components/learn/mdx/BrewingMethods.tsx` **(Server Component)**
  - Recommended brewing methods from coffee_brew_methods
  - Connected to brew_methods table
  - Method-specific tips and guidelines

### 3.5 Interactive Components (Client)
- **File:** `/src/components/learn/FloatingTOC.tsx` **(Client Component)**
  - Floating Table of Contents with collapse/expand
  - Uses useScrollSpy hook for active section tracking
  - Position fixed on scroll, collapsible sidebar
  - Mobile modal version with backdrop

- **File:** `/src/components/learn/ArticleProgress.tsx` **(Client Component)**
  - Reading progress indicator
  - Scroll-based progress calculation
  - Smooth progress bar animation

### ✅ **Checkpoint:** Components render properly with mock data and error handling

---

## Phase 4: Page Implementation (Day 2 - Afternoon)

### 🎯 Goal: All Learn routes functional with proper SEO

### 4.1 Main Learn Page
- **File:** `/src/app/learn/page.tsx`
  - Server component fetching all articles
  - Featured articles section
  - Main article grid with filtering
  - SEO metadata generation

- **File:** `/src/app/learn/loading.tsx`
  - Loading skeleton for main page
  - Article card skeletons in grid

### 4.2 Individual Article Pages
- **File:** `/src/app/learn/[slug]/page.tsx`
  - Dynamic route for individual articles
  - Full article content rendering
  - Related articles section
  - generateStaticParams for all articles

- **File:** `/src/app/learn/[slug]/loading.tsx`
  - Article page loading skeleton
  - TOC and content area placeholders

### 4.3 Category Pages
- **File:** `/src/app/learn/category/[category]/page.tsx`
  - Category-specific article listings
  - Category description and metadata
  - generateStaticParams for all categories

### 4.4 Tag Pages (Optional)
- **File:** `/src/app/learn/tag/[tag]/page.tsx`
  - Tag-specific article listings
  - Dynamic generateStaticParams for tags

### 4.5 Author Pages (Optional)
- **File:** `/src/app/learn/author/[author]/page.tsx`
  - Author bio and article listings
  - Author metadata and social links

### ✅ **Checkpoint:** All routes accessible and render content

---

## Phase 5: SEO & Metadata (Day 3 - Morning)

### 🎯 Goal: Complete SEO implementation with rich snippets

### 5.1 SEO Utilities
- **File:** `/src/lib/seo/article-metadata.ts`
  - generateArticleMetadata function
  - Open Graph and Twitter card generation
  - Canonical URL handling

- **File:** `/src/lib/seo/article-schema.ts`
  - Article structured data generation
  - Author and publisher schema
  - Reading time and content schema

### 5.2 Sitemap Updates
- **File:** `/src/app/sitemap.ts` (update existing)
  - Add all article URLs to sitemap
  - Include category and tag pages
  - Set priority and changefreq

### 5.3 Image Optimization
- **Directory:** `/public/images/learn/`
  - Optimized images for articles
  - Default OG images for categories
  - Author profile images

### ✅ **Checkpoint:** SEO tools validate rich snippets and metadata

---

## Phase 6: Styling & Polish (Day 3 - Afternoon)

### 🎯 Goal: Beautiful, responsive design matching ICB brand

### 6.1 Advanced UI Components
- **File:** `/src/hooks/useScrollSpy.ts`
  - Hook to track current section while scrolling
  - Intersection Observer for performance
  - Return current active heading ID

- **File:** `/src/components/learn/FloatingTOC.tsx`
  - Floating Table of Contents with collapse/expand
  - Position fixed on scroll, collapsible sidebar
  - Active section highlighting with smooth transitions
  - Mobile modal version with backdrop

### 6.2 Typography Styles
- **File:** `/src/styles/prose.css`
  - Article content typography
  - Code block styling
  - Blockquote and list styling
  - Mobile-responsive text sizes

### 6.3 Component Styling & Interactions
- Update existing components with proper styling
- Ensure mobile responsiveness  
- Add hover states and scroll animations
- Implement dark mode support
- TOC floating behavior and collapse animations

### 6.3 Custom MDX Components
- **File:** `/src/components/learn/mdx/Callout.tsx`
  - Tip, warning, info callout boxes
  - Icon integration and color schemes

- **File:** `/src/components/learn/mdx/ImageGallery.tsx`
  - Multi-image display component
  - Lightbox functionality (optional)

- **File:** `/src/components/learn/mdx/StepList.tsx`
  - Numbered step-by-step component
  - Progress indicator for multi-step processes

- **File:** `/src/components/learn/mdx/BrewingTable.tsx`
  - Data table component for brewing steps
  - Responsive table with time/action columns

- **File:** `/src/components/learn/mdx/Highlight.tsx`
  - Highlighted text boxes for important tips
  - Multiple style variants (tip, warning, note)

- **File:** `/src/components/learn/mdx/CoffeeProfile.tsx`
  - Coffee spotlight with live Supabase data
  - Pulls from coffees table: name, price, description, availability
  - Links to coffee detail page and roaster page

- **File:** `/src/components/learn/mdx/RoasterSpotlight.tsx`
  - Roaster feature with live data from roasters table
  - Logo, description, location, website links
  - Shows sample coffees from that roaster

- **File:** `/src/components/learn/mdx/RegionMap.tsx`
  - Region showcase from regions table
  - Climate, altitude, main varieties
  - Links to coffees available from that region

- **File:** `/src/components/learn/mdx/FlavorProfile.tsx`
  - Visual flavor wheel from coffee_flavor_profiles
  - Connected to flavor_profiles table
  - Interactive flavor notes display

- **File:** `/src/components/learn/mdx/BrewingMethods.tsx`
  - Recommended brewing methods from coffee_brew_methods
  - Connected to brew_methods table
  - Method-specific tips and guidelines

### ✅ **Checkpoint:** Design matches mockups, accessibility compliant, performance optimized

---

## Phase 7: Search & Filtering (Day 4 - Morning)

### 🎯 Goal: Functional search and filtering on main learn page

### 7.1 Search Implementation
- **File:** `/src/hooks/useArticleSearch.ts`
  - Search hook with debouncing
  - Filter and sort logic
  - URL state management

- **File:** `/src/components/learn/SearchInterface.tsx`
  - Combined search input and filters
  - Real-time search results
  - Clear filters functionality

### 7.2 URL State Management
- **File:** `/src/lib/utils/search-params.ts`
  - Parse and serialize search parameters
  - Handle multiple filters simultaneously
  - Generate shareable URLs

### 7.3 Client-Side Data Management (Zustand Integration)
- **File:** `/src/lib/content/client-queries.ts`
  - Client-side data fetching utilities
  - Integrate with your existing Zustand store patterns
  - Consistent with directory page implementation

- **File:** `/src/hooks/useCoffeeData.ts` **(Client Hook)**
  - Client-side hook for dynamic coffee data
  - Real-time availability and pricing updates
  - Loading states and error handling
  - Works with Zustand for state management

- **File:** `/src/hooks/useSearchFilters.ts` **(Client Hook)**
  - Search and filter state management
  - URL synchronization for shareable links
  - Debounced search input handling

### 7.5 Caching & Performance Strategy
- **File:** `/src/lib/content/cache-manager.ts`
  - Caching strategy for frequently accessed data
  - Cache invalidation for updated content
  - Performance monitoring for data fetching

- **File:** `/src/lib/content/fallback-data.ts`
  - Fallback data when Supabase is unavailable
  - Offline/network error handling
  - Graceful degradation strategies

### ✅ **Checkpoint:** Search, filtering, data components, caching, and analytics working smoothly

---

## Phase 8: Testing & Content (Day 4 - Afternoon)

### 🎯 Goal: Complete testing with 5 sample articles

### 8.1 Content Creation with Data Integration
Create 5 complete articles with:
- Proper frontmatter following schema
- Rich content with headings, images, code blocks
- **Data-connected components**: CoffeeProfile, RoasterSpotlight, RegionMap
- Internal links between articles and to roaster/coffee pages
- Varied categories and tags
- Live Supabase data integration examples

### 8.2 Testing Checklist (Enhanced)
- [ ] All 5 articles display correctly
- [ ] Search finds relevant articles
- [ ] Category filtering works
- [ ] Related articles show up
- [ ] **Error handling works** (invalid coffee IDs, network failures)
- [ ] **Content validation** prevents broken references
- [ ] **Accessibility compliance** (keyboard nav, screen readers)
- [ ] **Performance targets met** (bundle size, load times)
- [ ] Data-connected components pull live information
- [ ] Coffee profiles show current prices and availability
- [ ] Roaster spotlights link to actual roaster pages
- [ ] Region maps connect to available coffees
- [ ] Cross-selling components drive traffic to product pages
- [ ] **Analytics tracking** records component interactions
- [ ] **Mobile responsive** design across all components
- [ ] **Error boundaries** catch and display component failures
- [ ] **Caching works** for frequently accessed data
- [ ] **Preview mode** works for draft content
- [ ] SEO metadata populates correctly
- [ ] Loading states work smoothly
- [ ] 404 pages handle gracefully

### 8.3 Performance Optimization
- Image optimization and lazy loading
- Code splitting for heavy components
- Bundle size analysis
- Core Web Vitals check

### ✅ **Checkpoint:** All features working end-to-end

---

## Final File Structure

```
/velite.config.ts
/mdx-components.tsx
/content/learn/
├── coffee-101/
├── brewing/
├── sustainability/
├── processing/
├── history/
└── regions/

/src/app/learn/
├── page.tsx
├── loading.tsx
├── [slug]/
│   ├── page.tsx
│   └── loading.tsx
├── category/[category]/
│   └── page.tsx
├── tag/[tag]/
│   └── page.tsx
└── author/[author]/
    └── page.tsx

/src/components/learn/
├── ArticleCard.tsx
├── ArticleGrid.tsx
├── ArticleFilters.tsx
├── FeaturedArticles.tsx
├── ArticleContent.tsx
├── ArticleMeta.tsx
├── TableOfContents.tsx
├── RelatedArticles.tsx
├── FloatingTOC.tsx
├── SearchInterface.tsx
├── ArticleSchema.tsx
└── mdx/
    ├── Callout.tsx
    ├── ImageGallery.tsx
    ├── StepList.tsx
    ├── BrewingTable.tsx
    ├── Highlight.tsx
    ├── CoffeeProfile.tsx
    ├── RoasterSpotlight.tsx
    ├── RegionMap.tsx
    ├── FlavorProfile.tsx
    ├── BrewingMethods.tsx
    ├── RegionCoffees.tsx
    ├── RoasterCoffees.tsx
    └── RecommendedCoffees.tsx

/src/hooks/
├── useScrollSpy.ts              # (Client Hook)
├── useArticleSearch.ts          # (Client Hook) 
├── useCoffeeData.ts             # (Client Hook)
└── useSearchFilters.ts          # (Client Hook)

/src/lib/content/
├── index.ts                     # (Server Utils)
├── categories.ts                # (Server Utils)
├── supabase-queries.ts          # (Server Utils) - Shared with directory
└── client-queries.ts            # (Client Utils) - Zustand integration

/src/lib/content/
├── index.ts
└── categories.ts

/src/lib/seo/
├── article-metadata.ts
└── article-schema.ts

/src/types/
└── learn.ts

/src/styles/
└── prose.css

/scripts/
└── new-article.js
```

## Success Criteria

At completion, you should have:
- ✅ 5 sample articles displaying correctly
- ✅ Search and filtering functional
- ✅ All routes working with proper SEO
- ✅ Mobile-responsive design
- ✅ Type-safe content management
- ✅ **Error handling and graceful degradation** working
- ✅ **Content validation** preventing broken references  
- ✅ **Accessibility compliance** (WCAG 2.1 AA)
- ✅ **Performance optimized** (bundle size, caching, loading)
- ✅ **Analytics tracking** component engagement and conversions
- ✅ **Preview mode** for draft content workflow
- ✅ Data-connected components showing live coffee/roaster info
- ✅ Cross-selling integration driving traffic to product pages
- ✅ Content-to-commerce conversion funnel working
- ✅ Rich snippets in SEO tools

Ready to start Phase 1? 🚀
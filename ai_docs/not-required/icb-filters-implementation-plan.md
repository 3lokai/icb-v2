# 🗂️ ICB Directory Filters: Complete Implementation Plan
*Production-Ready in 7 Days - Handles 8-10k Daily Visitors*

## **Performance Target**

- **Daily visitors**: 8–10k
- **Concurrent users**: ~500–1000  
- **Filter response time**: < 500ms
- **Mobile support**: 3G+ network ready
- **No login required**: Guest-based filters only
- **UX Priority**: Smooth, intuitive, mobile-first experience

---

## **Phase 0: Pre-Implementation Setup** (30 mins)
**Goal:** Database and environment preparation

### 0.1 Database Index Verification
```sql
-- Essential indexes for filter performance
-- Roasters
CREATE INDEX IF NOT EXISTS idx_roasters_state ON roasters(state);
CREATE INDEX IF NOT EXISTS idx_roasters_city ON roasters(city);
CREATE INDEX IF NOT EXISTS idx_roasters_verified ON roasters(is_verified);
CREATE INDEX IF NOT EXISTS idx_roasters_physical_store ON roasters(has_physical_store);
CREATE INDEX IF NOT EXISTS idx_roasters_founded_year ON roasters(founded_year);

-- Coffees  
CREATE INDEX IF NOT EXISTS idx_coffees_region_id ON coffees(region_id);
CREATE INDEX IF NOT EXISTS idx_coffees_roaster_id ON coffees(roaster_id);
CREATE INDEX IF NOT EXISTS idx_coffees_roast_level ON coffees(roast_level);
CREATE INDEX IF NOT EXISTS idx_coffees_price ON coffees(price_250g);
CREATE INDEX IF NOT EXISTS idx_coffees_available ON coffees(is_available);
CREATE INDEX IF NOT EXISTS idx_coffees_bean_type ON coffees(bean_type);

-- Regions
CREATE INDEX IF NOT EXISTS idx_regions_state ON regions(state);
CREATE INDEX IF NOT EXISTS idx_regions_featured ON regions(is_featured);
CREATE INDEX IF NOT EXISTS idx_regions_popular ON regions(is_popular);

-- Composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_roasters_state_verified ON roasters(state, is_verified);
CREATE INDEX IF NOT EXISTS idx_coffees_available_price ON coffees(is_available, price_250g);
```

### 0.2 Environment Variables & Dependencies
```bash
# Add to .env.local (if not already present)
NEXT_PUBLIC_ANALYTICS_ID=your_ga_id
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Install TanStack Query for optimal caching
npm install @tanstack/react-query @tanstack/react-query-devtools
```

---

## **Phase 1: Foundation & Types** (Day 1 - Morning)
**Goal:** Rock-solid type foundation with validation

### 1.1 Core Filter Types (`src/types/filters.ts`)
**Key Highlights:**
- **Entity-specific interfaces**: `RoasterFilters`, `CoffeeFilters`, `RegionFilters`
- **Zod validation schemas** for runtime type checking
- **Default filter states** to prevent undefined errors
- **FilterResult<T>** interface for consistent API responses
- **FilterOption** interface with count support (`"Karnataka (23)"`)
- **TanStack Query integration types**

### 1.2 URL Helper Utilities (`src/lib/utils/url-helpers.ts`)
**Key Highlights:**
- **Serialize filters to clean URLs** (arrays as comma-separated)
- **Parse URL params back to filter objects**
- **Handle special cases**: ranges, booleans, empty values
- **Create shareable filter URLs** for social/bookmarking
- **Detect default vs custom filter states**
- **SEO-friendly URL patterns** (`/roasters?state=Karnataka&verified=true`)

### 1.3 Error Handling (`src/lib/error/filter-errors.ts`)
**Key Highlights:**
- **Graceful degradation** when filters fail
- **User-friendly error messages** (not technical jargon)
- **Automatic retry logic** for network failures
- **TanStack Query error integration**
- **Error boundary integration** for UI crashes

✅ **Checkpoint:** Type-safe foundation with URL sync working

---

## **Phase 2: TanStack Query Setup & Performance** (Day 1 - Afternoon)
**Goal:** Professional caching with TanStack Query (replaces custom caching)

### 2.1 Query Client Setup (`src/lib/query-client.ts`)
**Key Highlights:**
- **TanStack Query client configuration**
- **5-minute stale time** for filter results
- **10-minute cache time** for background storage
- **Request deduplication** for identical filter requests
- **Background refetching** for fresh data
- **Error retry logic** with exponential backoff

### 2.2 Query Provider Setup (`src/providers/QueryProvider.tsx`)
**Key Highlights:**
- **React Query provider** wrapper for app
- **DevTools integration** for development
- **Global error handling** for query failures
- **Persister integration** for offline support (optional)

### 2.3 Performance Utilities (`src/lib/performance/debounce.ts`)
**Key Highlights:**
- **300ms debounce** for Apply Filter button
- **Cancellation support** for rapid filter changes
- **Performance timing hooks** for monitoring
- **Bundle size monitoring** for filter components
- **Mobile performance optimization**

✅ **Checkpoint:** TanStack Query provides professional caching, eliminates custom cache complexity

---

## **Phase 3: State Management** (Day 2 - Morning)  
**Goal:** Clean state management with TanStack Query integration

### 3.1 Filter Query Hooks (`src/hooks/useFilterQueries.ts`)
**Key Highlights:**
- **Custom hooks for each entity** (`useCoffeeFilters`, `useRoasterFilters`)
- **TanStack Query integration** with Server Actions
- **Optimistic updates** with rollback capability
- **Loading and error states** built-in
- **Background refetching** for data freshness

### 3.2 Zustand Stores (Update existing stores)
**Key Changes:**
- **Remove caching logic** (TanStack Query handles it)
- **Focus on filter state only** (not results caching)
- **URL synchronization** middleware
- **localStorage persistence** for user preferences
- **Filter validation** and sanitization

### 3.3 Filter State Hooks (`src/hooks/useFilterState.ts`)
**Key Highlights:**
- **Encapsulated filter logic** (apply, reset, clear)
- **URL synchronization** with browser history
- **TanStack Query mutation** integration
- **Optimistic UI updates**
- **Filter combination validation**

✅ **Checkpoint:** Clean state management with professional caching, no custom cache complexity

---

## **Phase 4: Server Actions & API** (Day 2 - Afternoon)
**Goal:** Clean server-side filtering (no server-side caching complexity)

### 4.1 Enhanced Server Actions (Update existing files)
**Key Changes:**
- **Remove server-side caching** (doesn't work in serverless)
- **Focus on clean query building** (WHERE clauses for active filters)
- **Optimized pagination** with accurate total count
- **Filter option generation** (states, cities, etc. with counts)
- **Performance monitoring** (query timing only)
- **Let Supabase handle** its own caching

### 4.2 Filter Options API (`src/app/actions/filter-options.ts`)
**Key Highlights:**
- **Dynamic filter options** from database (not hardcoded)
- **Count aggregation** for each option (`"Karnataka (23)"`)
- **Dependency resolution** (cities based on selected states)
- **Real-time availability** updates
- **Smart option ordering** (popular first, alphabetical secondary)

### 4.3 Search Integration (`src/app/actions/search-actions.ts`)
**Key Highlights:**
- **Supabase full-text search** for server-side search
- **Search within filtered results**
- **Fuzzy matching** for typo tolerance
- **Search suggestions** from existing data
- **Popular search terms** tracking (top 10)

### 4.4 TanStack Query Integration Pattern
**Example Implementation:**
```typescript
// Clean Server Action (no caching)
export async function getCoffeesWithFilters(filters: CoffeeFilters) {
  // Clean server-side filtering logic
  // Let Supabase handle database caching
  return filteredResults;
}

// TanStack Query Hook (client-side caching)
export const useCoffeeFilters = (filters: CoffeeFilters) => {
  return useQuery({
    queryKey: ['coffees', filters],
    queryFn: () => getCoffeesWithFilters(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true, // Smooth transitions
  });
};
```

✅ **Checkpoint:** Clean server actions + TanStack Query caching = optimal architecture

---

## **Phase 5: Page Structure & Layouts** (Day 3 - Morning)
**Goal:** Server-rendered pages with proper layouts

### 5.1 Directory Page Structure
**Create new directory structure:**
```
src/app/
├── coffees/
│   ├── page.tsx                 # Server component with initial data
│   ├── layout.tsx               # Coffee directory specific layout
│   └── CoffeeDirectory.tsx      # Client component with TanStack Query
├── roasters/
│   ├── page.tsx                 # Server component with initial data  
│   ├── layout.tsx               # Roaster directory specific layout
│   └── RoasterDirectory.tsx     # Client component with TanStack Query
└── regions/
    ├── page.tsx                 # Server component with initial data
    ├── layout.tsx               # Region directory specific layout
    └── RegionDirectory.tsx      # Client component with TanStack Query
```

### 5.2 Layout Components (`src/app/*/layout.tsx`)
**Key Highlights:**
- **Sidebar layout for desktop** (filters in left sidebar)
- **Mobile-optimized layout** (filters in bottom sheet modal)
- **Responsive breakpoints** with smooth transitions
- **SEO-optimized metadata** for filtered pages
- **Breadcrumb navigation** integration
- **Query client provider** wrapping

### 5.3 Server-Rendered Pages (`src/app/*/page.tsx`)
**Key Highlights:**
- **Parse URL params** to initial filter state
- **Server-side data fetching** with filters applied (SEO critical)
- **SEO metadata generation** for filtered results
- **Structured data** for filtered pages
- **Social sharing optimization**
- **Initial data for TanStack Query hydration**

✅ **Checkpoint:** Server-rendered pages with proper layouts and SEO maintained

---

## **Phase 6: UI Components & UX** (Day 3 - Afternoon + Day 4)
**Goal:** Best-in-class user experience with mobile-first design

### 6.1 Core Filter Components
**Files to create:**
- `FilterModal.tsx` - **Mobile bottom sheet** (your mockup design)
- `FilterSidebar.tsx` - **Desktop sidebar** layout
- `FilterSection.tsx` - **Collapsible accordion** sections
- `FilterCheckbox.tsx` - **Enhanced checkbox** with counts
- `FilterRange.tsx` - **Dual-handle slider** for price/altitude
- `FilterToggle.tsx` - **Boolean toggle** switches
- `LoadingStates.tsx` - **TanStack Query loading states**
- `ErrorBoundary.tsx` - **TanStack Query error recovery**

**Key UX Highlights:**
- **Mobile-first responsive** design (your mockup priority)
- **Smooth animations** (60fps on mobile)
- **Haptic feedback** on mobile interactions
- **Keyboard navigation** support (full accessibility)
- **Optimistic UI** updates via TanStack Query
- **Focus management** for modals and navigation
- **One-handed mobile operation** optimized

### 6.2 Mobile Filter Experience
**Based on your mockups:**
- **Bottom sheet modal** with backdrop
- **Gesture-driven interactions** (swipe to close)
- **Progressive disclosure** (collapsed sections by default)
- **Apply/Reset buttons** clearly visible
- **Filter count indicators** in section headers
- **Sticky Apply/Reset** buttons at bottom
- **Native-like scrolling** behavior

### 6.3 Desktop Filter Experience
**Key Highlights:**
- **Sticky sidebar** with proper spacing
- **Instant filter preview** (show result count changes)
- **Compact filter representation**
- **Hover states** and micro-interactions
- **Filter combination suggestions**

### 6.4 TanStack Query Integration in Components
**Key Highlights:**
- **Built-in loading states** from useQuery
- **Error boundaries** for query failures
- **Background refetching** indicators
- **Optimistic updates** for apply/reset actions
- **Request deduplication** prevents duplicate calls

### 6.5 Active Filters (`src/components/filters/ActiveFilters.tsx`)
**Key Highlights:**
- **Filter badge display** with remove buttons
- **"Clear all" functionality** with TanStack Query mutation
- **Result count display** with loading states
- **Compact mobile layout** (horizontal scroll if needed)
- **Smart truncation** for long filter names

✅ **Checkpoint:** Exceptional UX with professional loading/error states from TanStack Query

---

## **Phase 7: Search Integration** (Day 5 - Morning)
**Goal:** Seamless search + filter combination

### 7.1 Search Components (`src/components/search/`)
**Files to create:**
- `SearchBar.tsx` - **Primary search interface**
- `SearchSuggestions.tsx` - **Autocomplete dropdown**
- `SearchResults.tsx` - **Search result highlighting**

**Key Highlights:**
- **Debounced search input** (300ms)
- **Search within filtered results** (preserves filters)
- **TanStack Query for search results** caching
- **Recent searches** (localStorage)
- **Popular search terms** display
- **Mobile-optimized search** (proper keyboard handling)

### 7.2 Search Query Hooks (`src/hooks/useSearchQueries.ts`)
**Key Highlights:**
- **TanStack Query integration** for search
- **Combined search + filter queries**
- **Search history management**
- **Search analytics** (query success tracking)
- **Background refetching** for fresh search results

### 7.3 Search Integration with Filters
**Key Highlights:**
- **Search preserves active filters**
- **Filter suggestions** based on search terms
- **Combined search + filter URLs** for sharing
- **TanStack Query handles** search + filter result caching

✅ **Checkpoint:** Search and filters work seamlessly with professional caching

---

## **Phase 8: Analytics & Monitoring** (Day 5 - Afternoon)
**Goal:** Data-driven insights for optimization

### 8.1 Filter Analytics (`src/lib/analytics/filter-tracking.ts`)
**Key Events to Track:**
- `filter_applied` - **When user applies filters**
- `filter_cleared` - **When user resets filters**
- `filter_abandoned` - **Opened modal but didn't apply**
- `search_performed` - **Search queries and results**
- `query_cache_hit` - **TanStack Query cache performance**

**Key Metrics:**
- **Filter response time** (client + server)
- **TanStack Query cache hit rate**
- **Most popular filter combinations**
- **Filter abandonment rate**
- **Search success rate**

### 8.2 Performance Monitoring (`src/lib/monitoring/filter-metrics.ts`)
**Key Highlights:**
- **TanStack Query performance** tracking
- **Cache effectiveness** monitoring
- **Query performance** monitoring
- **Client-side error tracking**
- **Mobile performance metrics**

### 8.3 TanStack Query DevTools Integration
**Key Highlights:**
- **Query cache inspection** in development
- **Background refetching** visualization
- **Error tracking** and debugging
- **Performance analysis** tools

✅ **Checkpoint:** Analytics provide insights into TanStack Query performance and user behavior

---

## **Phase 9: Testing & Quality Assurance** (Day 6)
**Goal:** Production-ready reliability

### 9.1 Component Testing (`src/__tests__/filters/`)
**Test Coverage:**
- **Unit tests** for all filter components
- **TanStack Query hook testing** with MSW
- **Mobile interaction tests** (touch, gestures)
- **Accessibility tests** (keyboard, screen readers)
- **Cache behavior testing**

### 9.2 End-to-End Testing
**Key Scenarios:**
- **Complete filter workflow** with caching validation
- **URL sharing and bookmarking**
- **Network failure recovery** (TanStack Query retry)
- **Cache invalidation** scenarios
- **Background refetching** behavior

### 9.3 Load Testing
**Key Metrics:**
- **1000 concurrent filter requests**
- **TanStack Query performance** under load
- **Cache effectiveness** validation
- **Mobile device performance** (real devices)
- **Memory usage optimization**

### 9.4 TanStack Query Specific Testing
**Key Areas:**
- **Cache persistence** across page navigation
- **Background refetching** behavior
- **Error boundary integration**
- **Optimistic updates** rollback scenarios

✅ **Checkpoint:** Production-ready with TanStack Query reliability

---

## **Phase 10: Final Integration & Deployment** (Day 7)
**Goal:** Everything working together seamlessly

### 10.1 Page Integration
**Update existing directory components:**
- **TanStack Query hydration** from server data
- **FilterModal integration** with query states
- **FilterSidebar integration** with caching
- **URL synchronization** with query invalidation
- **Error boundary wrapping** for resilience

### 10.2 Cross-Entity Consistency
**Key Highlights:**
- **Consistent TanStack Query patterns** across entities
- **Shared query configurations** and error handling
- **Unified caching strategy** across all directories
- **Consistent loading states** for all entities

### 10.3 SEO & Social Optimization (Maintained)
**Key Highlights:**
- **Server-side filtering** preserves SEO benefits
- **Dynamic meta tags** for filtered pages
- **Structured data** for filtered results
- **Social sharing cards** for filter combinations
- **TanStack Query doesn't impact** SEO (client-side caching only)

### 10.4 Performance Final Check
**Key Metrics:**
- **< 500ms filter response** time (with caching benefits)
- **< 2 seconds** mobile modal open time
- **95%+ cache hit rate** for repeated filter combinations
- **< 100kb** TanStack Query bundle impact
- **Background refetching** doesn't impact UX

✅ **Final Checkpoint:** Production deployment ready with professional caching

---

## **📁 Complete File Structure**

```
src/
├── types/
│   └── filters.ts                    # Core filter types + TanStack Query types
├── lib/
│   ├── utils/
│   │   └── url-helpers.ts           # URL serialization/parsing
│   ├── query-client.ts              # TanStack Query configuration
│   ├── performance/
│   │   └── debounce.ts              # Performance utilities
│   ├── error/
│   │   └── filter-errors.ts         # Error handling & TanStack Query integration
│   ├── analytics/
│   │   └── filter-tracking.ts       # Analytics with cache metrics
│   └── monitoring/
│       └── filter-metrics.ts        # Performance monitoring
├── providers/
│   └── QueryProvider.tsx            # TanStack Query provider
├── components/
│   ├── filters/
│   │   ├── FilterModal.tsx          # Mobile bottom sheet (your mockup)
│   │   ├── FilterSidebar.tsx        # Desktop sidebar layout
│   │   ├── FilterSection.tsx        # Collapsible accordion sections
│   │   ├── FilterCheckbox.tsx       # Enhanced checkboxes with counts
│   │   ├── FilterRange.tsx          # Dual-handle range sliders
│   │   ├── FilterToggle.tsx         # Boolean toggle switches
│   │   ├── FilterContainer.tsx      # Responsive layout wrapper
│   │   ├── ActiveFilters.tsx        # Filter badges with TanStack Query
│   │   ├── LoadingStates.tsx        # TanStack Query loading components
│   │   └── ErrorBoundary.tsx        # TanStack Query error recovery
│   └── search/
│       ├── SearchBar.tsx            # Primary search interface
│       ├── SearchSuggestions.tsx    # Autocomplete dropdown
│       └── SearchResults.tsx        # Search result highlighting
├── hooks/
│   ├── useFilterQueries.ts          # TanStack Query filter hooks
│   ├── useSearchQueries.ts          # TanStack Query search hooks
│   ├── useFilterState.ts            # Filter state management
│   ├── useDebounce.ts               # Performance optimization hook
│   └── useFilterAnalytics.ts        # Analytics tracking hooks
├── store/zustand/
│   ├── roaster-store.ts             # UPDATE - Remove caching, keep filter state
│   ├── coffee-store.ts              # UPDATE - Remove caching, keep filter state
│   └── region-store.ts              # UPDATE - Remove caching, keep filter state
├── app/
│   ├── actions/
│   │   ├── roaster-actions.ts       # UPDATE - Clean server-side filtering
│   │   ├── coffee-actions.ts        # UPDATE - Clean server-side filtering
│   │   ├── region-actions.ts        # UPDATE - Clean server-side filtering
│   │   ├── filter-options.ts        # NEW - Dynamic filter options
│   │   └── search-actions.ts        # NEW - Server-side search
│   ├── coffees/
│   │   ├── page.tsx                 # NEW - Server-rendered with TanStack Query hydration
│   │   ├── layout.tsx               # NEW - Coffee directory layout + QueryProvider
│   │   └── CoffeeDirectory.tsx      # NEW - Client component with TanStack Query
│   ├── roasters/
│   │   ├── page.tsx                 # NEW - Server-rendered with TanStack Query hydration
│   │   ├── layout.tsx               # NEW - Roaster directory layout + QueryProvider
│   │   └── RoasterDirectory.tsx     # NEW - Client component with TanStack Query
│   └── regions/
│       ├── page.tsx                 # NEW - Server-rendered with TanStack Query hydration
│       ├── layout.tsx               # NEW - Region directory layout + QueryProvider
│       └── RegionDirectory.tsx      # NEW - Client component with TanStack Query
└── __tests__/
    └── filters/
        ├── components.test.ts       # UI component test suite
        ├── query-hooks.test.ts      # TanStack Query hooks testing
        ├── integration.test.ts      # Filter workflow tests
        ├── performance.test.ts      # Load & caching performance tests
        ├── accessibility.test.ts    # WCAG compliance tests
        └── mobile.test.ts           # Mobile-specific tests
```

---

## **🎯 Success Criteria**

### **Performance Metrics**
- ✅ **< 500ms filter response** time (with cache hits < 50ms)
- ✅ **< 2 seconds** mobile filter modal open time
- ✅ **60fps animations** on mobile devices
- ✅ **95+ PageSpeed score** maintenance with TanStack Query
- ✅ **90%+ cache hit rate** for repeated filter combinations

### **User Experience Metrics**  
- ✅ **Mobile-first design** matching your mockups exactly
- ✅ **Instant filter switching** for cached combinations
- ✅ **Professional loading states** from TanStack Query
- ✅ **Accessibility compliance** (WCAG 2.1 AA)
- ✅ **URL shareability** with maintained SEO benefits

### **Technical Metrics**
- ✅ **TanStack Query caching** eliminates custom cache complexity
- ✅ **Type-safe implementation** across all components
- ✅ **Graceful error handling** with automatic retry
- ✅ **Background refetching** keeps data fresh
- ✅ **SEO optimization** maintained with server-side filtering

### **Business Metrics**
- ✅ **Essential analytics** including cache performance
- ✅ **Filter usage patterns** tracking
- ✅ **Search success rate** monitoring
- ✅ **TanStack Query performance** insights

---

## **🚀 Implementation Notes**

### **Key Architectural Decisions**
1. **TanStack Query replaces custom caching** - Professional solution with built-in features
2. **Server Actions stay clean** - No server-side caching complexity
3. **SEO benefits maintained** - Server-side filtering preserved
4. **Mobile UX prioritized** - Your mockups as design foundation
5. **Type safety throughout** - TanStack Query + Zod + TypeScript

### **TanStack Query Benefits**
- ✅ **Request deduplication** - Prevents duplicate API calls
- ✅ **Background refetching** - Keeps data fresh automatically
- ✅ **Optimistic updates** - Smooth UX with rollback capability
- ✅ **Error retry logic** - Automatic recovery from failures
- ✅ **DevTools integration** - Professional debugging experience
- ✅ **Cache persistence** - Survives page navigation

### **Quality Gates**
- Each phase has clear **checkpoints** for validation
- **TanStack Query testing** with MSW for reliable testing
- **Performance testing** includes cache effectiveness
- **Mobile device testing** on real hardware
- **SEO validation** ensures server-side filtering works

**Ready for implementation with professional-grade caching!** 🎯
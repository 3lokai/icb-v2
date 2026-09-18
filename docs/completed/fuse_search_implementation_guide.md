# Fuse.js Unified Search Implementation Guide

**Transform your coffee directory into a Notion-style search experience**

---

## 📋 Overview

This guide implements a **client-side unified search** using Fuse.js that searches across:
- ☕ **Coffees** (with denormalized flavor profiles)
- 🏪 **Roasters** (with relationship data)
- 📚 **Articles** (from Velite)

### Key Features
- 🔍 **Semantic search** - "nutty" finds hazelnut, almond, woody notes
- ⚡ **Instant results** - no API calls after initial load
- 🎯 **Smart sectioning** - results grouped by relevance
- ⌨️ **Keyboard navigation** - Cmd+K, arrow keys, enter
- 📱 **Mobile responsive** - works everywhere

---

## 🏗️ Architecture Overview

```mermaid
graph TD
    A[User Types Query] --> B[Fuse.js Search Engine]
    B --> C[Pre-built Search Index]
    C --> D[Denormalized Data]
    D --> E[Instant Results]
    
    F[Build Time] --> G[buildSearchIndex()]
    G --> H[Join DB Tables]
    H --> I[Include Flavor Profiles]
    I --> J[Flatten for Search]
    
    K[Supabase Tables] --> L[coffees]
    K --> M[coffee_flavor_profiles]
    K --> N[roasters]
    O[Velite] --> P[articles.json]
    
    L --> H
    M --> H
    N --> H
    P --> H
```

---

## 📁 File Structure & Dependencies

### New Files to Create

```
src/
├── lib/search/
│   ├── searchIndex.ts          # 🆕 Build denormalized search data
│   ├── fuseConfig.ts           # 🆕 Fuse.js configuration & synonyms
│   └── searchUtils.ts          # 🆕 Helper functions
├── hooks/
│   └── useSearch.ts            # 🆕 React hook for search state
├── components/search/
│   ├── SearchCommand.tsx       # 🆕 Main search modal (Cmd+K)
│   ├── SearchInput.tsx         # 🆕 Search input with typeahead
│   ├── SearchResults.tsx       # 🆕 Results display
│   └── SearchResultCard.tsx    # 🆕 Individual result cards
└── types/
    └── search.ts               # 🆕 TypeScript definitions
```

### Existing Files to Leverage

```
src/
├── types/
│   ├── learn.ts                # ✅ Article type definitions
│   ├── supabase.ts             # ✅ Database type definitions
│   └── enriched-types.ts       # ✅ Enhanced data types
├── lib/
│   ├── supabase/client.ts      # ✅ Database client
│   └── content/search-and-filter.ts # ✅ Current article search
├── hooks/
│   └── useDebounce.ts          # ✅ Debouncing utility
├── components/ui/
│   ├── dialog.tsx              # ✅ Modal components
│   ├── input.tsx               # ✅ Input components
│   └── badge.tsx               # ✅ Tag/badge components
└── .velite/
    └── articles.json           # ✅ Pre-built article data
```

### Dependencies to Install

```bash
npm install fuse.js
# Already have: @types/node, typescript, react, next
```

---

## 🔍 How Fuse.js Works

### 1. **Data Preparation** (Build Time)
```typescript
// Instead of separate searches, we create ONE unified index
const searchIndex = [
  // Coffee with denormalized data
  {
    id: "coffee-1",
    type: "coffee",
    title: "Blue Tokai Vienna Roast",
    searchableText: "blue tokai vienna roast nutty chocolatey woody medium bangalore",
    flavorNotes: ["nutty", "chocolatey", "woody"],
    metadata: { roasterName: "Blue Tokai", price: 350 }
  },
  // Roaster data
  {
    id: "roaster-1", 
    type: "roaster",
    title: "Blue Tokai Coffee Roasters",
    searchableText: "blue tokai coffee roasters bangalore specialty premium",
    metadata: { region: "Bangalore", coffeeCount: 12 }
  },
  // Article data
  {
    id: "article-1",
    type: "article", 
    title: "Understanding Nutty Coffee Notes",
    searchableText: "understanding nutty coffee notes hazelnut almond flavor profile",
    metadata: { category: "coffee-101", readingTime: 5 }
  }
]
```

### 2. **Search Execution** (Runtime)
```typescript
// User types "nutty"
const query = "nutty"

// Fuse.js magic happens
const fuse = new Fuse(searchIndex, {
  keys: ['title', 'searchableText', 'flavorNotes'],
  threshold: 0.3 // Fuzzy matching tolerance
})

// Get ranked results
const results = fuse.search(query)
// Returns coffees with nutty notes, roasters who make them, articles about flavor
```

### 3. **Smart Result Grouping**
```typescript
// Group by type for clean UI
const grouped = {
  coffees: results.filter(r => r.item.type === 'coffee'),
  roasters: results.filter(r => r.item.type === 'roaster'), 
  articles: results.filter(r => r.item.type === 'article')
}

// Smart ordering based on query relevance
if (isFlavorQuery(query)) {
  displayOrder = ['coffees', 'roasters', 'articles']
} else if (isRoasterQuery(query)) {
  displayOrder = ['roasters', 'coffees', 'articles']  
}
```

---

## 🎯 Key Implementation Details

### Denormalized Search Index Structure

```typescript
// types/search.ts
export interface SearchableItem {
  id: string
  type: 'coffee' | 'roaster' | 'article'
  title: string
  description: string
  url: string
  imageUrl?: string
  
  // 🔥 The magic: flattened searchable content
  searchableText: string  // All searchable fields combined
  flavorNotes?: string[]  // Separate for weighted search
  tags: string[]
  
  // Type-specific metadata for display
  metadata: {
    coffee?: {
      roasterName: string
      roasterRegion: string
      flavorProfile: string[]  // From coffee_flavor_profiles table
      price?: number
      rating?: number
    }
    roaster?: {
      region: string
      verified: boolean
      coffeeCount: number      // From relationship count
    }
    article?: {
      category: string
      difficulty: string
      readingTime: number
      author: string
    }
  }
}
```

### Flavor Synonym Mapping

```typescript
// fuseConfig.ts - The semantic search secret sauce
export const flavorSynonyms = {
  nutty: ['hazelnut', 'almond', 'walnut', 'pecan', 'woody', 'earthy'],
  fruity: ['berry', 'citrus', 'apple', 'cherry', 'tropical'],
  chocolatey: ['chocolate', 'cocoa', 'dark chocolate'],
  // etc...
}

// "nutty" search automatically includes hazelnut, almond, etc.
```

### Database Query Strategy

```sql
-- Single query to get all coffee data with relationships
SELECT 
  c.*,
  r.name as roaster_name,
  r.region as roaster_region,
  array_agg(fp.flavor_note) as flavor_notes
FROM coffees c
LEFT JOIN roasters r ON c.roaster_id = r.id  
LEFT JOIN coffee_flavor_profiles fp ON c.id = fp.coffee_id
GROUP BY c.id, r.name, r.region;
```

---

## 🎨 UX Flow & Interactions

### Search Modal Trigger
```typescript
// Multiple ways to open search
1. Click search button in header
2. Cmd+K / Ctrl+K keyboard shortcut  
3. Forward slash (/) quick access
4. Mobile: tap search icon
```

### Search Experience
```
┌─ Search Modal ─────────────────────────────┐
│ 🔍 [nutty________________] [×]             │
├────────────────────────────────────────────┤
│                                            │
│ ☕ COFFEES (8)                            │
│ ┌─ Nutty Delight Blend ──────────────────┐ │
│ │ Rich hazelnut and almond notes...      │ │
│ │ by Mountain Coffee Co. • ₹420          │ │
│ └────────────────────────────────────────┘ │
│ ┌─ Woodland Single Origin ───────────────┐ │
│ │ Earthy, woody, with pecan undertones   │ │  
│ │ by Forest Roasters • ₹580              │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ 🏪 ROASTERS (2)                           │
│ ┌─ Nutty Bean Co. ───────────────────────┐ │
│ │ Specializes in nutty flavor profiles   │ │
│ │ Coorg, Karnataka • 6 coffees           │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ 📚 ARTICLES (1)                           │
│ ┌─ Understanding Nutty Notes ────────────┐ │
│ │ Learn about hazelnut, almond flavors   │ │
│ │ 5 min read • Beginner                  │ │
│ └────────────────────────────────────────┘ │
├────────────────────────────────────────────┤
│ ↑↓ Navigate • ↵ Select • ESC Close        │
└────────────────────────────────────────────┘
```

### Keyboard Navigation
- **Arrow keys**: Navigate through results
- **Enter**: Select highlighted result
- **Escape**: Close modal
- **Tab**: Move between sections

---

## 🚀 Implementation Steps

### Phase 1: Core Search Infrastructure
1. **Install Fuse.js** (`npm install fuse.js`)
2. **Create search types** (`types/search.ts`)
3. **Build search index** (`lib/search/searchIndex.ts`)
4. **Configure Fuse.js** (`lib/search/fuseConfig.ts`)

### Phase 2: React Integration  
5. **Create search hook** (`hooks/useSearch.ts`)
6. **Build search command** (`components/search/SearchCommand.tsx`)
7. **Add to header** (integrate with existing `Header.tsx`)

### Phase 3: UI Components
8. **Search input component** (`components/search/SearchInput.tsx`)
9. **Results display** (`components/search/SearchResults.tsx`) 
10. **Result cards** (`components/search/SearchResultCard.tsx`)

### Phase 4: Polish & Testing
11. **Add keyboard shortcuts**
12. **Mobile optimization**
13. **Performance testing**
14. **Semantic search tuning**

---

## 🔧 Integration with Existing Code

### Leverage Current Search Logic
```typescript
// lib/content/search-and-filter.ts
// Keep this for complex article filtering on /learn page
// Use Fuse.js for quick unified search

// Current function for article-specific search:
export function searchArticles(articles: Article[], query: string): Article[]

// New function for unified search:
export function unifiedSearch(query: string): SearchableItem[]
```

### Extend Existing Types
```typescript
// types/learn.ts - Already have Article type
export interface Article {
  title: string
  description?: string
  // ... existing fields
}

// types/search.ts - Extend for search
export interface SearchableArticle extends Article {
  searchableText: string  // New field for Fuse.js
  type: 'article'         // Discriminator
}
```

### Database Integration
```typescript
// lib/supabase/client.ts - Use existing client
import { createClient } from '@/lib/supabase/client'

// New search-specific queries in searchIndex.ts
export async function buildSearchIndex() {
  const supabase = createClient() // Existing client
  // Build unified index using existing DB structure
}
```

---

## 📊 Performance Considerations

### Initial Load
- **Search index built once** on page load (~50-200kb for your scale)
- **Cached in memory** - subsequent searches are instant
- **Lazy loading** - only build index when search is first opened

### Search Performance
- **Client-side search** - no API calls during typing
- **Debounced input** - prevent excessive re-renders
- **Result limiting** - show top 20 results per type
- **Virtual scrolling** - for large result sets (future enhancement)

### Bundle Size
- **Fuse.js**: ~9kb gzipped
- **Search components**: ~15kb additional
- **Search index**: Dynamic based on content size

---

## 🎨 Design System Integration

### Use Existing Components
```typescript
// Leverage your current design system
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'  
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Apply existing CSS classes
className="glass-modal"           // Your glassmorphism
className="card-base card-hover"  // Your card styles
className="text-title"            // Your typography
```

### Color Coding
```typescript
// Type-specific styling (from your existing theme)
const typeColors = {
  coffee: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20',
  roaster: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20', 
  article: 'bg-green-100 text-green-800 dark:bg-green-900/20'
}
```

---

## 🧪 Testing Strategy

### Search Quality Testing
```typescript
// Test cases for semantic search
const testQueries = [
  { query: 'nutty', expect: ['hazelnut coffees', 'almond notes', 'woody roasters'] },
  { query: 'blue tokai', expect: ['roaster first', 'their coffees', 'related articles'] },
  { query: 'pour over', expect: ['brewing articles', 'suitable coffees', 'equipment roasters'] }
]
```

### Performance Benchmarks
- **Index build time**: < 2 seconds
- **Search response**: < 50ms  
- **Initial render**: < 100ms
- **Subsequent searches**: < 10ms

---

## 🚀 Future Enhancements

### Phase 2 Features
- **Search analytics** - track popular queries
- **Personalized results** - based on user preferences  
- **Voice search** - "Find me nutty coffees"
- **Visual search** - search by coffee bag image

### Advanced Search Features  
- **Filters integration** - price range, rating, region
- **Saved searches** - bookmark favorite queries
- **Search suggestions** - "People also search for..."
- **Typo correction** - "Did you mean...?"

---

## 📈 Success Metrics

### User Engagement
- **Search usage rate**: % of users who use search
- **Query success rate**: % of searches that lead to clicks
- **Search depth**: Average results explored per query
- **Conversion rate**: Search → product page → action

### Technical Performance
- **Search latency**: Time from keystroke to results
- **Bundle impact**: Additional JavaScript size
- **Memory usage**: Search index size in browser
- **Error rate**: Failed searches / total searches

---

## 🎯 Implementation Priority

### Must Have (Week 1)
- ✅ Basic Fuse.js setup
- ✅ Unified search index
- ✅ Command modal (Cmd+K)
- ✅ Sectioned results display

### Should Have (Week 2)  
- ✅ Keyboard navigation
- ✅ Mobile optimization
- ✅ Semantic search (synonyms)
- ✅ Result highlighting

### Could Have (Week 3+)
- ⭐ Advanced filtering
- ⭐ Search analytics
- ⭐ Performance optimizations
- ⭐ Additional search triggers

---
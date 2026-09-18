# Indian Coffee Beans Directory - Style Guide

This style guide establishes the visual language for IndianCoffeeBeans.com, creating a cohesive and engaging user experience that celebrates India's rich coffee culture.

## Brand Values

- **Authenticity**: Highlighting the genuine traditions of Indian coffee cultivation
- **Discovery**: Guiding users to explore new flavors and roasters
- **Education**: Providing valuable knowledge about coffee origins and brewing
- **Community**: Connecting coffee enthusiasts with local roasters
- **Quality**: Emphasizing premium coffee craftsmanship

---

# 📘 IndianCoffeeBeans UI Cheat Sheet

## 1. Typography
* `.text-display` → Homepage hero (`Discover India's Finest Coffee Beans`)
* `.text-title` → Section headers (`Featured Roasters`, `New Arrivals`)
* `.text-heading` → Subsection headers (`Coffee Growing Regions`)
* `.text-body` → Paragraphs and descriptions
* `.text-caption` → Metadata (`Established 2015`, `Rating 4.2`)
* `.text-overline` → Tags and badges (`New`, `Washed`, `Honey Process`)

## 2. Layout & Spacing
* `.container-default` → Page-level wrap (used on almost all sections)
* `.section-spacing` → Padding for vertical sections
* `.grid-cards` → Cards for roasters, regions, blog
* `.card-padding` → Standard padding inside card content
* `.flex-between`, `.flex-center` → Alignment for headers, stats
* Breakpoints: `--breakpoint-sm: 640px`, `--breakpoint-md: 768px`, `--breakpoint-lg: 1024px`, `--breakpoint-xl: 1280px`, `--breakpoint-2xl: 1400px`

## 3. Components
* `.btn-primary` → Brown CTAs like "Subscribe", "Explore Coffees"
* `.btn-secondary` → Light/outline buttons like "View All Roasters"
* `.btn-icon` → Small icon buttons (arrows, stars)
* `.input-base` → Newsletter email inputs, search bar
* `.search-wrapper` → Hero search container with filters
* `.badge`, `.badge-brown`, `.badge-outline` → Labels for process, roast, etc.
* `.rating-stars` → Star ratings for roasters and reviews
* `.card-base` → Roaster card, blog card, testimonial card
* `.card-hover` → Hover effect for cards
* `.card-featured` → Highlighted cards with borders
* `.card-review` → Testimonial cards with quotes
* `.avatar-sm` → Small user avatars in reviews
* `.tag-list` → Horizontal scrolling tags (roast, flavor profiles)
* `.breadcrumb` → Navigation breadcrumbs
* `.pill-filter` → Rounded filter buttons for categories

## 4. Design System
### Colors
| Element | Token |
|---------|-------|
| Hero background | `--background` |
| CTA buttons | `--primary`, `--primary-foreground` |
| Section BGs | `--secondary`, `--muted` |
| Text | `--foreground`, `--muted-foreground` |
| Badges | `--accent`, `--accent-foreground` |
| Ratings/Highlights | `--chart-1` through `--chart-5` (used for flair) |
| Destructive actions | `--destructive` |
| Forms & inputs | `--input`, `--border`, `--ring` |
| Sidebar elements | `--sidebar`, `--sidebar-foreground`, etc. |

### Radius
* `--radius-xs`: Smallest radius for tiny elements
* `--radius-sm`: Small elements (tags, badges)
* `--radius-md`: Medium elements (buttons, inputs)
* `--radius-lg`: Large elements (cards)
* `--radius-xl`: Extra large elements (hero sections)

### Shadows
* `--shadow-xs`, `--shadow-sm`: Subtle depth for cards, badges
* `--shadow-md`, `--shadow-lg`: Medium depth for hoverable elements
* `--shadow-xl`, `--shadow-2xl`: Deep shadows for modals, featured cards
* `--shadow-inner`: Inset shadows for pressed states
* `--shadow-focus`, `--shadow-outline`: Focus states for interactive elements

## 5. Motion & Animation
| Use Case | Token |
|----------|-------|
| Roaster hover | `--animate-fade-in-scale` |
| Testimonials cycle | `--animate-fade-in-out` |
| Region cards fade | `--animate-accordion-down`, `--animate-slide-to-top` |
| Hero shimmer or loader | `--animate-marquee` or `--animate-shadow-ping` |
| Infinite sliders | `--animate-infinite-slider`, `--animate-infinite-slider-reverse` |
| Progress indicators | `--animate-progress` |
| Button effects | `--animate-flip-btn`, `--animate-rotate-btn` |
| Light effects | `--animate-light-to-right-top`, `--animate-light-to-right-bottom` |
| Directional animations | Slide to any direction: `--animate-slide-to-right`, `--animate-slide-to-top`, `--animate-slide-to-left-bottom`, etc. |

## 6. Theme & Dark Mode
* Light/dark mode handled via `.dark` class (i.e., `.dark:text-white`)
* Theme variables are normalized in `@theme inline` section
* Custom dark variant available with `@custom-variant dark (&:is(.dark *))`
* Default breakpoints from Tailwind apply (`sm`, `md`, `lg`, `xl`, `2xl`)
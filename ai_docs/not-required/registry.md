# 🗃️ ICB Frontend Registry - Complete AI Implementation Guide

## 📁 Route Structure
| Route Pattern | Purpose | Example |
|---------------|---------|---------|
| `src/app/(public)/*` | Public-facing content pages | about, contact |
| `src/app/api/*` | API routes | analytics, health, og |
| `src/app/[section]/*` | Content section pages | coffees, roasters, regions, learn |

## 🧱 Core Components
| Component | Path | Usage Notes |
|-----------|------|-------------|
| Icon | `src/components/common/Icon.tsx` | Use for all iconography |
| LoadingSpinner | `src/components/common/LoadingSpinner.tsx` | Use for loading states |
| NewsletterForm | `src/components/common/NewsletterForm.tsx` | Use for newsletter subscriptions |
| SuspenseBoundary | `src/components/common/SuspenseBoundary.tsx` | Wrap async components for loading/error states |
| PageLayout | `src/components/layout/PageLayout.tsx` | Wrapper for standard pages |
| Header | `src/components/layout/Header.tsx` | Main navigation (already implemented) |
| Footer | `src/components/layout/Footer.tsx` | Site footer (already implemented) |
| AnnouncementBar | `src/components/layout/AnnouncementBar.tsx` | Site announcements |
| CookieNotice | `src/components/layout/CookieNotice.tsx` | Cookie consent banner |
| ThemeToggle | `src/components/layout/ThemeToggle.tsx` | Dark/light mode toggle |

## 🔧 Providers & Hooks
| Provider/Hook | Path | Purpose |
|---------------|------|---------|
| Providers | `src/providers/Providers.tsx` | Main provider wrapper |
| ThemeProvider | `src/providers/ThemeProvider.tsx` | Dark/light theme management |
| AnalyticsProvider | `src/providers/AnalyticsProvider.tsx` | Analytics tracking |
| ModalProvider | `src/providers/ModalProvider.tsx` | Global modal state |
| SonnerProvider | `src/providers/SonnerProvider.tsx` | Toast notifications |
| useToast | `src/hooks/useToast.ts` | Hook for displaying toast messages |

## 📊 Data & API
| Module | Path | Purpose |
|--------|------|---------|
| forms.ts | `src/app/actions/forms.ts` | Contact form server actions |
| newsletter.ts | `src/app/actions/newsletter.ts` | Newsletter subscription server actions |
| client.ts | `src/lib/supabase/client.ts` | Client-side Supabase access |
| server.ts | `src/lib/supabase/server.ts` | Server-side Supabase access |
| analytics | `src/lib/analytics/index.ts` | Analytics tracking utilities |

## 🎨 Design System
| Resource | Path | Purpose |
|----------|------|---------|
| UI Cheat Sheet | `IndianCoffeeBeans UI Cheat Sheet.md` | Reference for UI classes and components |
| globals.css | `src/styles/globals.css` | Design tokens and utility classes |

## 📱 Page Types
| Page Type | Pattern | Notes |
|-----------|---------|-------|
| Server Component Page | `page.tsx` | Default server component |
| Client Component Page | `page.client.tsx` | When client interactivity is needed |
| Server-only Actions | `page.server.tsx` | When you need server-only logic |
| Layout Component | `layout.tsx` | Section-specific layouts |

## 🖼️ Image & Asset Handling
| Asset Type | Location | Notes |
|------------|----------|-------|
| SVG Icons | `/public/*.svg` | Static SVG assets |
| Animations | `/public/animations/` | Lottie animation files |

## 📋 Implementation Guidelines
* Always use design tokens from globals.css instead of hardcoded values
* Use the utility classes defined in the UI Cheat Sheet
* Implement new pages with the appropriate layout component
* Use server components by default, only add 'use client' when needed
* Don't duplicate existing components - refer to this registry first
* Use ShadCN UI components as building blocks
* Follow established patterns for data fetching and state management
* Keep layouts consistent with the design system
* Implement proper SEO with metadata and schema

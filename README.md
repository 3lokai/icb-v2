# ☕ Indian Coffee Beans Directory (ICB v2)

A comprehensive directory website for discovering Indian specialty coffee beans and roasters. Built with Next.js 15, React 19, TypeScript, and Supabase.

## 🎯 Project Overview

Indian Coffee Beans Directory is a modern web platform that helps coffee enthusiasts discover, compare, and learn about Indian specialty coffee. The platform features:

- **Coffee Directory** - Browse and filter hundreds of Indian coffee beans
- **Roaster Profiles** - Detailed profiles of Indian coffee roasters
- **Advanced Filtering** - Filter by region, process, roast level, flavor notes, and more
- **Search System** - Unified search across coffees, roasters, and articles
- **Coffee Tools** - Brewing calculator and expert recipes
- **Educational Content** - Learn about Indian coffee regions, processing methods, and brewing
- **User Profiles** - Personalized experience with preferences and ratings

**Status:** 90% Complete - Awaiting Data Migration & Final Bug Fixes

## 🚀 Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router and Turbopack
- **React 19** - Latest React features with Server Components
- **TypeScript** - Strict type safety throughout
- **Tailwind CSS v4** - Utility-first CSS with CSS-first approach
- **shadcn/ui** - Accessible component library built on Radix UI
- **Motion** - Smooth animations and transitions
- **Fuse.js** - Client-side fuzzy search

### Backend & Database

- **Supabase** - PostgreSQL database with real-time capabilities
- **Row Level Security (RLS)** - Database-level security policies
- **Authentication** - Email/password and OAuth (Google) support
- **ImageKit** - CDN for optimized image delivery

### State Management & Data Fetching

- **Zustand** - Lightweight state management for filters and UI state
- **TanStack Query** - Server state management with caching
- **React Hook Form** - Form state management
- **Zod** - Runtime validation and type inference

### Development Tools

- **ESLint** - Code linting with Next.js and TypeScript rules
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **TypeScript** - Strict mode with path aliases

## 🛠️ Getting Started

### Prerequisites

- **Node.js 20.11.0+** (LTS recommended)
- npm, yarn, pnpm, or bun
- Supabase account and project
- ImageKit account (optional, for image optimization)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd icb-v2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your credentials:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   SUPABASE_SECRET_KEY=your_supabase_secret_key

   # App Configuration
   NEXT_PUBLIC_APP_NAME=Indian Coffee Beans
   NEXT_PUBLIC_APP_URL=https://your-domain.com

   # ImageKit (optional)
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

   # Upstash Redis (required for external API rate limiting and usage tracking)
   UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
   ```

4. **Set up Git hooks**

   ```bash
   npm run prepare
   ```

5. **Set up Supabase database**

   ```bash
   # Link to your Supabase project
   npx supabase link --project-ref your-project-ref

   # Run migrations
   npm run supabase:migration:up

   # Generate TypeScript types
   npm run supabase:types
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
icb-v2/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public routes (about, contact, privacy, etc.)
│   │   ├── actions/           # Server actions
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── coffees/           # Coffee directory pages
│   │   ├── dashboard/         # User dashboard (protected)
│   │   ├── learn/             # Educational content
│   │   ├── roasters/          # Roaster directory pages
│   │   └── tools/              # Coffee tools (calculator, recipes)
│   ├── components/            # React components
│   │   ├── cards/             # Card components
│   │   ├── coffees/           # Coffee-specific components
│   │   ├── common/            # Shared components
│   │   ├── homepage/          # Homepage sections
│   │   ├── providers/         # Context providers
│   │   ├── roasters/          # Roaster-specific components
│   │   ├── search/            # Search components
│   │   ├── tools/             # Tool components
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-auth.ts        # Authentication hook
│   │   ├── use-coffees.ts     # Coffee data fetching
│   │   ├── use-roasters.ts    # Roaster data fetching
│   │   ├── use-search.ts      # Search functionality
│   │   └── use-supabase-query.ts # Supabase query utilities
│   ├── lib/                   # Utility libraries
│   │   ├── analytics/         # Analytics helpers
│   │   ├── filters/          # Filter logic
│   │   ├── search/           # Search index and utilities
│   │   ├── seo/              # SEO helpers
│   │   ├── supabase/         # Supabase clients
│   │   └── utils.ts          # General utilities
│   ├── store/                 # Zustand stores
│   │   └── zustand/          # State management
│   └── types/                # TypeScript type definitions
│       ├── coffee-types.ts   # Coffee-related types
│       ├── roaster-types.ts  # Roaster-related types
│       └── supabase-types.ts # Generated Supabase types
├── supabase/
│   └── migrations/           # Database migrations
├── public/                   # Static assets
│   ├── animations/           # Lottie animations
│   ├── images/              # Image assets
│   └── videos/              # Video assets
├── ai_docs/                  # Project documentation
├── scripts/                  # Utility scripts
├── env.ts                    # Environment validation
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

## 🎨 Key Features

### Coffee Directory

- Browse hundreds of Indian coffee beans
- Advanced filtering by:
  - Region (Karnataka, Kerala, Tamil Nadu, etc.)
  - Processing method (Washed, Natural, Honey, Anaerobic)
  - Roast level (Light, Medium, Dark)
  - Flavor notes (Chocolate, Fruity, Nutty, etc.)
  - Roaster
  - Price range
- URL-synchronized filter state
- Detailed coffee profiles with tasting notes

### Roaster Directory

- Comprehensive roaster profiles
- Location and contact information
- Coffee catalog per roaster
- Verification badges
- Social media links

### Search System

- Unified search across coffees, roasters, and articles
- Fuzzy matching with Fuse.js
- Keyboard shortcuts (Cmd+K / Ctrl+K)
- Instant results with client-side indexing

### Coffee Tools

- **Brewing Calculator** - Calculate coffee-to-water ratios
- **Expert Recipes** - Curated brewing recipes
- Support for multiple brewing methods

### User Features

- Authentication (Email/Password, Google OAuth)
- User profiles with preferences
- Coffee journey tracking
- Rating system (IP-based, auth-ready)
- Dashboard for managing preferences

### Educational Content

- Coffee glossary
- Regional information
- Processing method guides
- Brewing tutorials

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run type-check   # TypeScript type checking
npm run lint         # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Supabase
npm run supabase:types           # Generate TypeScript types from schema
npm run supabase:migration:new   # Create a new migration
npm run supabase:migration:list   # List all migrations
npm run supabase:migration:up     # Apply pending migrations
npm run supabase:migration:down   # Rollback last migration
npm run supabase:db:pull         # Pull schema from Supabase
npm run supabase:db:push         # Push local schema to Supabase
```

## 🗄️ Database Schema

The project uses Supabase (PostgreSQL) with the following main entities:

- **coffees** - Coffee bean listings
- **roasters** - Roaster profiles
- **coffee_flavor_profiles** - Flavor notes and tasting profiles
- **regions** - Indian coffee growing regions
- **user_profiles** - User account information
- **ratings** - Coffee ratings (IP-based)

See `supabase/migrations/` for the complete schema.

## 🔐 Authentication

The project supports multiple authentication methods:

- **Email/Password** - Traditional email authentication
- **Google OAuth** - Social authentication
- **Role-based access** - Admin, Operator, User, Viewer, Contributor, Roaster

Protected routes are handled via Next.js middleware. User profiles include:

- Coffee preferences
- Notification settings
- Privacy controls
- Account management

## 🎯 Filter System

The filter system uses Zustand for state management and synchronizes with URL parameters:

- **State Management** - Zustand store for filter state
- **URL Sync** - Filters reflected in URL for sharing/bookmarking
- **Persistence** - Filter state persists across navigation
- **Performance** - Optimized queries with TanStack Query caching

## 🔍 Search Implementation

The search system uses Fuse.js for client-side fuzzy search:

- **Unified Index** - Single search across all content types
- **Denormalized Data** - Pre-joined data for fast searching
- **Semantic Matching** - Finds related terms and synonyms
- **Keyboard Navigation** - Full keyboard support

## 📊 SEO & Performance

- **Metadata** - Comprehensive meta tags per page
- **Open Graph** - Social sharing optimization
- **Sitemap** - Auto-generated XML sitemap
- **Robots.txt** - Search engine configuration
- **Image Optimization** - ImageKit CDN with Next.js Image
- **Server Components** - Optimized rendering

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Ensure all required environment variables are set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server-side only)
- `NEXT_PUBLIC_APP_URL`
- ImageKit credentials (if using)

## 🧪 Development Guidelines

### Code Quality Standards

- **TypeScript Strict Mode** - All code must be type-safe
- **Server Components First** - Prefer server components over client
- **Accessibility** - WCAG compliant components
- **Error Handling** - Comprehensive error boundaries
- **Loading States** - Proper loading UI for async operations

### Component Patterns

- Use Zustand for complex state, `useState` for simple state
- Prefer TanStack Query for data fetching
- Use server actions for mutations
- Follow existing patterns in `src/components/`

### Database Patterns

- Use `useSupabaseQuery` hook for data fetching
- Zod schemas for validation
- TanStack Query for caching
- Custom hooks in `src/hooks/`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) team for the amazing framework
- [Supabase](https://supabase.com) for the backend platform
- [shadcn](https://ui.shadcn.com) for the beautiful components
- [Vercel](https://vercel.com) for the deployment platform
- The Indian specialty coffee community for inspiration

---

**Built with ☕ and ❤️ for the Indian coffee community**

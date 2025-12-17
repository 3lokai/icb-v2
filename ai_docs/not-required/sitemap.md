# IndianCoffeeBeans.com Sitemap

## Core Pages

### Home (`/`)
- Hero section with search
- Featured roasters carousel
- New arrivals section
- Browse by region (visual map)
- Quick filters (roast level, bean type)
- Newsletter signup

### About (`/about`)
- Our story
- Mission statement
- Team information

### Contact (`/contact`)
- Contact form
- Email/phone information
- Office location (if applicable)

## Directory Pages

### Roasters
- **Listing** (`/roasters`)
  - Filters (location, features, etc.)
  - Sort options (name, founded year)
  - Grid/list view toggle
  - Pagination

- **Detail** (`/roasters/[slug]`)
  - Profile information
  - Logo and images
  - Description
  - Available coffees
  - Contact information
  - Location
  - Social links
  - Reviews (Phase 3)

### Coffees
- **Listing** (`/coffees`)
  - Filters:
    - Roast level
    - Bean type
    - Processing method
    - Region
    - Price range
  - Sort options (price, rating, etc.)
  - Grid/list view toggle
  - Search functionality
  - Pagination

- **Detail** (`/coffees/[slug]`)
  - Product images
  - Description
  - Specifications (roast level, bean type, etc.)
  - Pricing info
  - Flavor profile
  - Brewing recommendations
  - Roaster information
  - Purchase options
  - Reviews (Phase 3)
  - Similar coffees

### Regions
- **Listing** (`/regions`)
  - Interactive map
  - List of all regions
  - Region statistics

- **Detail** (`/regions/[slug]`)
  - Region information
  - Climate and geography
  - Coffees from region
  - Roasters from region
  - History and characteristics

## Content Pages

### Blog
- **Listing** (`/blog`)
  - Latest posts
  - Category filters
  - Search functionality
  - Featured posts

- **Detail** (`/blog/[slug]`)
  - Article content
  - Author information
  - Publication date
  - Related posts
  - Social sharing
  - Comments (Phase 3)

### Learn
- **Coffee 101** (`/learn/coffee-101`)
  - Basics of coffee
  - Brewing guides
  - Glossary of terms

- **Brewing Guides** (`/learn/brewing`)
  - Method-specific guides
  - Equipment recommendations
  - Recipes

- **Glossary** (`/learn/glossary`)
  - Alphabetical list of coffee terms
  - Searchable database

## User Pages (Phase 3)

### Authentication
- **Login** (`/auth/login`)
- **Register** (`/auth/register`)
- **Forgot Password** (`/auth/forgot-password`)
- **Reset Password** (`/auth/reset-password`)
- **Email Verification** (`/auth/verify-email`)

### User Dashboard
- **Profile** (`/user/profile`)
  - Personal information
  - Avatar management
  - Preferences

- **Reviews** (`/user/reviews`)
  - List of user reviews
  - Edit/delete functionality

- **Favorites** (`/user/favorites`)
  - Saved coffees
  - Saved roasters
  - Collections

- **Notifications** (`/user/notifications`)
  - System notifications
  - Review responses
  - New product alerts

## Roaster Portal (Phase 3)

### Verification
- **Claim Listing** (`/roaster-portal/claim`)
  - Verification form
  - Document upload
  - Contact information

### Management
- **Dashboard** (`/roaster-portal/dashboard`)
  - Profile statistics
  - Review alerts

- **Profile Editor** (`/roaster-portal/profile`)
  - Edit roaster information
  - Upload images
  - Update social links

- **Products** (`/roaster-portal/products`)
  - View product listings
  - Request changes

- **Reviews** (`/roaster-portal/reviews`)
  - View customer reviews
  - Respond to reviews

## Administrative (Internal)

### Moderation
- **Review Management** (`/admin/reviews`)
- **Verification Requests** (`/admin/verification`)
- **User Management** (`/admin/users`)
- **Content Management** (`/admin/content`)

## Legal & Policy

- **Privacy Policy** (`/privacy-policy`)
- **Terms of Service** (`/terms-of-service`)
- **Cookie Policy** (`/cookie-policy`)

## Other

- **404 Page** (`/404`)
- **500 Page** (`/500`)
- **Maintenance Page** (`/maintenance`)
- **Sitemap** (`/sitemap.xml`)
- **Robots** (`/robots.txt`)

---

## URL Structure Patterns

- Homepage: `/`
- Static pages: `/{page-name}`
- Listing pages: `/{entity-type}`
- Detail pages: `/{entity-type}/{slug}`
- Blog: `/blog` and `/blog/{post-slug}`
- User pages: `/user/{section}`
- Authentication: `/auth/{action}`
- Roaster portal: `/roaster-portal/{section}`
- Admin: `/admin/{section}`

The URL structure follows RESTful principles and is designed to be both human-readable and SEO-friendly.

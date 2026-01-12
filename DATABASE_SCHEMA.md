# Database Schema Documentation

This document details the database tables used in the website frontend. Backend/scraping-related tables have been excluded.

## Table of Contents

- [Core Entity Tables](#core-entity-tables)
- [Junction/Joining Tables](#junctionjoining-tables)
- [User Tables](#user-tables)
- [Related Tables](#related-tables)
- [Enums](#enums)

---

## Core Entity Tables

### `coffees`

The main coffee products table containing all coffee information.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `name` (string) - Coffee name
- `slug` (string) - URL-friendly identifier
- `roaster_id` (string) - Foreign key to `roasters.id`
- `status` (coffee_status_enum) - Current status: `active`, `seasonal`, `discontinued`, `draft`, `hidden`, `coming_soon`, `archived`
- `description_md` (string, nullable) - Markdown description
- `direct_buy_url` (string, nullable) - Direct purchase link
- `rating_avg` (number, nullable) - Average rating
- `rating_count` (number) - Number of ratings
- `roast_level` (roast_level_enum, nullable) - Normalized roast level
- `roast_level_raw` (string, nullable) - Original roast level text
- `process` (process_enum, nullable) - Processing method
- `process_raw` (string, nullable) - Original process text
- `bean_species` (species_enum, nullable) - Coffee species
- `default_grind` (grind_enum, nullable) - Default grind type
- `decaf` (boolean) - Whether coffee is decaffeinated
- `is_single_origin` (boolean) - Single origin flag
- `is_limited` (boolean) - Limited edition flag
- `is_coffee` (boolean, nullable) - Product type flag
- `crop_year` (number, nullable) - Harvest year
- `harvest_window` (string, nullable) - Harvest period
- `varieties` (string[], nullable) - Coffee varieties array
- `tags` (string[], nullable) - Product tags
- `seo_title` (string, nullable) - SEO title
- `seo_desc` (string, nullable) - SEO description
- `notes_raw` (Json) - Raw notes data
- `source_raw` (Json) - Raw source data
- `created_at` (string) - Creation timestamp
- `updated_at` (string) - Last update timestamp

**Relationships:**
- Belongs to: `roasters` (via `roaster_id`)

---

### `roasters`

Coffee roaster companies and brands.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `name` (string) - Roaster name
- `slug` (string) - URL-friendly identifier
- `description` (string, nullable) - Company description
- `website` (string, nullable) - Website URL
- `logo_url` (string, nullable) - Logo image URL
- `image_url` (string, nullable) - Hero image URL
- `instagram_handle` (string, nullable) - Instagram username
- `support_email` (string, nullable) - Support contact email
- `phone` (string, nullable) - Contact phone
- `is_active` (boolean) - Active status
- `is_featured` (boolean, nullable) - Featured roaster flag
- `is_editors_pick` (boolean, nullable) - Editor's pick flag
- `avg_rating` (number, nullable) - Average rating
- `total_ratings_count` (number, nullable) - Total number of ratings
- `recommend_percentage` (number, nullable) - Recommendation percentage
- `avg_customer_support` (number, nullable) - Customer support rating
- `avg_delivery_experience` (number, nullable) - Delivery rating
- `avg_packaging` (number, nullable) - Packaging rating
- `avg_value_for_money` (number, nullable) - Value rating
- `founded_year` (number, nullable) - Year founded
- `hq_city` (string, nullable) - Headquarters city
- `hq_state` (string, nullable) - Headquarters state
- `hq_country` (string, nullable) - Headquarters country
- `lat` (number, nullable) - Latitude
- `lon` (number, nullable) - Longitude
- `has_physical_store` (boolean, nullable) - Physical store flag
- `has_subscription` (boolean, nullable) - Subscription service flag
- `platform` (platform_enum, nullable) - E-commerce platform
- `social_json` (Json) - Social media links JSON
- `canon_estate_id` (string, nullable) - Foreign key to `canon_estates.id` (if roaster is also an estate)
- `created_at` (string) - Creation timestamp
- `updated_at` (string) - Last update timestamp

**Relationships:**
- Belongs to: `canon_estates` (via `canon_estate_id`, optional)

---

### `estates`

Coffee estates/farms where coffee is grown.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `name` (string) - Estate name
- `estate_key` (string) - Unique key identifier
- `region_id` (string, nullable) - Foreign key to `regions.id`
- `canon_estate_id` (string, nullable) - Foreign key to `canon_estates.id` (canonical estate reference)
- `altitude_min_m` (number, nullable) - Minimum altitude in meters
- `altitude_max_m` (number, nullable) - Maximum altitude in meters
- `notes` (string, nullable) - Additional notes

**Relationships:**
- Belongs to: `regions` (via `region_id`, optional)
- Belongs to: `canon_estates` (via `canon_estate_id`, optional)

---

### `regions`

Geographic regions where coffee is grown.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `subregion` (string) - Subregion name (required)
- `country` (string, nullable) - Country name
- `state` (string, nullable) - State/province name
- `display_name` (string, nullable) - Display name for UI

---

### `canon_estates`

Canonical/curated estate information with detailed metadata.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `name` (string) - Estate name
- `slug` (string) - URL-friendly identifier
- `canon_region_id` (string) - Foreign key to `canon_regions.id`
- `description` (string, nullable) - Detailed description
- `owner` (string, nullable) - Estate owner
- `founded_year` (number, nullable) - Year founded
- `altitude_min_m` (number, nullable) - Minimum altitude in meters
- `altitude_max_m` (number, nullable) - Maximum altitude in meters
- `certifications` (string, nullable) - Certifications (e.g., organic, fair trade)
- `hero_image_url` (string, nullable) - Hero image URL
- `seo_title` (string, nullable) - SEO title
- `seo_description` (string, nullable) - SEO description
- `notes` (string, nullable) - Additional notes
- `created_at` (string) - Creation timestamp
- `updated_at` (string) - Last update timestamp

**Relationships:**
- Belongs to: `canon_regions` (via `canon_region_id`)

---

### `canon_regions`

Canonical/curated region information with detailed metadata.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `display_name` (string) - Display name
- `slug` (string) - URL-friendly identifier
- `country` (string) - Country name
- `state` (string, nullable) - State/province name
- `subregion` (string, nullable) - Subregion name
- `description` (string, nullable) - Detailed description
- `climate` (string, nullable) - Climate information
- `soil` (string, nullable) - Soil type information
- `harvest_season` (string, nullable) - Harvest season
- `altitude_min_m` (number, nullable) - Minimum altitude in meters
- `altitude_max_m` (number, nullable) - Maximum altitude in meters
- `rainfall_mm` (number, nullable) - Annual rainfall in mm
- `hero_image_url` (string, nullable) - Hero image URL
- `seo_title` (string, nullable) - SEO title
- `seo_description` (string, nullable) - SEO description
- `notes` (string, nullable) - Additional notes
- `created_at` (string) - Creation timestamp
- `updated_at` (string) - Last update timestamp

---

### `flavor_notes`

Flavor profile descriptors for coffees.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `key` (string) - Unique key identifier
- `label` (string) - Display label
- `group_key` (string, nullable) - Grouping key for organizing related flavors

---

### `brew_methods`

Brewing methods that can be used with coffees.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `key` (string) - Unique key identifier
- `label` (string) - Display label
- `canonical_key` (grind_enum, nullable) - Canonical grind type mapping
- `canonical_label` (string, nullable) - Canonical label

---

## Junction/Joining Tables

### `coffee_estates`

Many-to-many relationship between coffees and estates.

**Key Fields:**
- `coffee_id` (string) - Foreign key to `coffees.id`
- `estate_id` (string) - Foreign key to `estates.id`
- `pct` (number, nullable) - Percentage of coffee from this estate (for blends)

**Relationships:**
- Belongs to: `coffees` (via `coffee_id`)
- Belongs to: `estates` (via `estate_id`)

---

### `coffee_regions`

Many-to-many relationship between coffees and regions.

**Key Fields:**
- `coffee_id` (string) - Foreign key to `coffees.id`
- `region_id` (string) - Foreign key to `regions.id`
- `pct` (number, nullable) - Percentage of coffee from this region (for blends)

**Relationships:**
- Belongs to: `coffees` (via `coffee_id`)
- Belongs to: `regions` (via `region_id`)

---

### `coffee_flavor_notes`

Many-to-many relationship between coffees and flavor notes.

**Key Fields:**
- `coffee_id` (string) - Foreign key to `coffees.id`
- `flavor_note_id` (string) - Foreign key to `flavor_notes.id`

**Relationships:**
- Belongs to: `coffees` (via `coffee_id`)
- Belongs to: `flavor_notes` (via `flavor_note_id`)

---

### `coffee_brew_methods`

Many-to-many relationship between coffees and brew methods.

**Key Fields:**
- `coffee_id` (string) - Foreign key to `coffees.id`
- `brew_method_id` (string) - Foreign key to `brew_methods.id`

**Relationships:**
- Belongs to: `coffees` (via `coffee_id`)
- Belongs to: `brew_methods` (via `brew_method_id`)

---

### `coffee_images`

Images associated with coffee products.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `coffee_id` (string) - Foreign key to `coffees.id`
- `url` (string) - Image URL
- `imagekit_url` (string, nullable) - ImageKit CDN URL
- `alt` (string, nullable) - Alt text for accessibility
- `sort_order` (number) - Display order
- `width` (number, nullable) - Image width in pixels
- `height` (number, nullable) - Image height in pixels
- `content_hash` (string, nullable) - Content hash for deduplication
- `source_raw` (Json) - Raw source data
- `updated_at` (string, nullable) - Last update timestamp

**Relationships:**
- Belongs to: `coffees` (via `coffee_id`)

---

## User Tables

### `user_profiles`

User profile information.

**Key Fields:**
- `id` (string, UUID) - Primary key (matches Supabase auth user ID)
- `full_name` (string) - User's full name
- `username` (string, nullable) - Username
- `avatar_url` (string, nullable) - Profile avatar URL
- `bio` (string, nullable) - User biography
- `email_verified` (boolean, nullable) - Email verification status
- `newsletter_subscribed` (boolean, nullable) - Newsletter subscription
- `onboarding_completed` (boolean, nullable) - Onboarding completion flag
- `is_public_profile` (boolean, nullable) - Public profile visibility
- `experience_level` (string, nullable) - Coffee experience level
- `preferred_brewing_methods` (string[], nullable) - Preferred brew methods array
- `city` (string, nullable) - City
- `state` (string, nullable) - State/province
- `country` (string, nullable) - Country
- `show_location` (boolean, nullable) - Location visibility flag
- `gender` (string, nullable) - Gender
- `created_at` (string, nullable) - Creation timestamp
- `updated_at` (string, nullable) - Last update timestamp
- `deleted_at` (string, nullable) - Soft delete timestamp

---

### `user_coffee_preferences`

User coffee preference settings.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `user_id` (string, nullable) - Foreign key to `user_profiles.id` (one-to-one)
- `decaf_only` (boolean, nullable) - Decaf only preference
- `organic_only` (boolean, nullable) - Organic only preference
- `with_milk_preference` (boolean, nullable) - Milk preference
- `roast_levels` (string[], nullable) - Preferred roast levels array
- `processing_methods` (string[], nullable) - Preferred processing methods array
- `regions` (string[], nullable) - Preferred regions array
- `flavor_profiles` (string[], nullable) - Preferred flavor profiles array
- `updated_at` (string, nullable) - Last update timestamp

**Relationships:**
- Belongs to: `user_profiles` (via `user_id`, one-to-one)

---

### `user_notification_preferences`

User notification and email preferences.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `user_id` (string, nullable) - Foreign key to `user_profiles.id` (one-to-one)
- `newsletter` (boolean, nullable) - Newsletter subscription
- `coffee_updates` (boolean, nullable) - Coffee update notifications
- `new_roasters` (boolean, nullable) - New roaster notifications
- `platform_updates` (boolean, nullable) - Platform update notifications
- `email_frequency` (string, nullable) - Email frequency preference
- `updated_at` (string, nullable) - Last update timestamp

**Relationships:**
- Belongs to: `user_profiles` (via `user_id`, one-to-one)

---

## Related Tables

### `sensory_params`

Sensory analysis parameters for coffees (acidity, body, sweetness, etc.).

**Key Fields:**
- `coffee_id` (string) - Foreign key to `coffees.id` (one-to-one)
- `acidity` (number, nullable) - Acidity score (0-10)
- `body` (number, nullable) - Body score (0-10)
- `sweetness` (number, nullable) - Sweetness score (0-10)
- `bitterness` (number, nullable) - Bitterness score (0-10)
- `aftertaste` (number, nullable) - Aftertaste score (0-10)
- `clarity` (number, nullable) - Clarity score (0-10)
- `source` (sensory_source_enum, nullable) - Source: `roaster`, `icb_inferred`, `icb_manual`
- `confidence` (sensory_confidence_enum, nullable) - Confidence level: `high`, `medium`, `low`
- `notes` (string, nullable) - Additional notes
- `created_at` (string) - Creation timestamp
- `updated_at` (string) - Last update timestamp

**Relationships:**
- Belongs to: `coffees` (via `coffee_id`, one-to-one)

---

### `reviews`

User reviews for coffees and roasters.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `entity_id` (string) - ID of reviewed entity (coffee or roaster)
- `entity_type` (review_entity_type) - Type: `coffee` or `roaster`
- `user_id` (string, nullable) - Foreign key to `user_profiles.id` (if authenticated)
- `anon_id` (string, nullable) - Anonymous identifier (for IP-based reviews)
- `rating` (number, nullable) - Rating score
- `recommend` (boolean, nullable) - Recommendation flag
- `comment` (string, nullable) - Review comment text
- `brew_method` (grind_enum, nullable) - Brew method used
- `works_with_milk` (boolean, nullable) - Works with milk flag
- `value_for_money` (boolean, nullable) - Value for money flag
- `status` (review_status) - Status: `active`, `deleted`, `flagged`
- `created_at` (string) - Creation timestamp
- `updated_at` (string) - Last update timestamp

---

### `announcements`

Site-wide announcements/banners.

**Key Fields:**
- `id` (string, UUID) - Primary key
- `message` (string) - Announcement message
- `link` (string, nullable) - Optional link URL
- `is_active` (boolean) - Active status
- `created_at` (string) - Creation timestamp

---

## Enums

### `coffee_status_enum`
- `active` - Currently available
- `seasonal` - Seasonal availability
- `discontinued` - No longer available
- `draft` - Not yet published
- `hidden` - Hidden from public view
- `coming_soon` - Coming soon
- `archived` - Archived

### `roast_level_enum`
- `light`
- `light_medium`
- `medium`
- `medium_dark`
- `dark`

### `process_enum`
- `washed`
- `natural`
- `honey`
- `pulped_natural`
- `monsooned`
- `wet_hulled`
- `anaerobic`
- `carbonic_maceration`
- `double_fermented`
- `experimental`
- `other`
- `washed_natural`

### `grind_enum`
- `whole` - Whole bean
- `filter` - Filter grind
- `espresso` - Espresso grind
- `drip` - Drip grind
- `other` - Other grind
- `turkish` - Turkish grind
- `moka_pot` - Moka pot grind
- `cold_brew` - Cold brew grind
- `aeropress` - AeroPress grind
- `channi` - Channi grind
- `coffee_filter` - Coffee filter grind
- `french_press` - French press grind
- `south_indian_filter` - South Indian filter grind
- `pour_over` - Pour over grind
- `syphon` - Syphon grind

### `species_enum`
- `arabica`
- `robusta`
- `liberica`
- `blend`
- `arabica_80_robusta_20`
- `arabica_70_robusta_30`
- `arabica_60_robusta_40`
- `arabica_50_robusta_50`
- `robusta_80_arabica_20`
- `arabica_chicory`
- `robusta_chicory`
- `blend_chicory`
- `filter_coffee_mix`
- `excelsa`

### `review_entity_type`
- `coffee` - Coffee review
- `roaster` - Roaster review

### `review_status`
- `active` - Active review
- `deleted` - Deleted review
- `flagged` - Flagged review

### `sensory_source_enum`
- `roaster` - From roaster
- `icb_inferred` - ICB inferred
- `icb_manual` - ICB manually entered

### `sensory_confidence_enum`
- `high` - High confidence
- `medium` - Medium confidence
- `low` - Low confidence

---

## Database Views

### `coffee_summary`

Aggregated view of coffee data with computed fields for filtering and display.

**Key Fields:**
- `coffee_id` (string, nullable)
- `name` (string, nullable)
- `slug` (string, nullable)
- `roaster_id` (string, nullable)
- `status` (coffee_status_enum, nullable)
- `process` (process_enum, nullable)
- `process_raw` (string, nullable)
- `roast_level` (roast_level_enum, nullable)
- `roast_level_raw` (string, nullable)
- `roast_style_raw` (string, nullable)
- `direct_buy_url` (string, nullable)
- `has_250g_bool` (boolean, nullable) - Has 250g variant available
- `has_sensory` (boolean, nullable) - Has sensory parameters
- `in_stock_count` (number, nullable) - Count of in-stock variants
- `min_price_in_stock` (number, nullable) - Minimum in-stock price
- `best_normalized_250g` (number, nullable) - Best normalized 250g price
- `best_variant_id` (string, nullable) - Best value variant ID
- `weights_available` (number[], nullable) - Available weight options
- `sensory_public` (Json, nullable) - Public sensory data
- `sensory_updated_at` (string, nullable) - Sensory data update timestamp

**Relationships:**
- Belongs to: `roasters` (via `roaster_id`)

---

## Relationships Summary

```
coffees
  ├── belongs_to: roasters
  ├── has_many: coffee_estates → estates
  ├── has_many: coffee_regions → regions
  ├── has_many: coffee_flavor_notes → flavor_notes
  ├── has_many: coffee_brew_methods → brew_methods
  ├── has_many: coffee_images
  └── has_one: sensory_params

roasters
  └── belongs_to: canon_estates (optional)

estates
  ├── belongs_to: regions (optional)
  └── belongs_to: canon_estates (optional)

canon_estates
  └── belongs_to: canon_regions

user_profiles
  ├── has_one: user_coffee_preferences
  └── has_one: user_notification_preferences

reviews
  └── belongs_to: user_profiles (optional, can be anonymous)
```



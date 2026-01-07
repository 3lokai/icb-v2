-- Migration: Create canonical origins (regions and estates)
-- Created: 2026-01-06
-- Description: Creates canonical regions and estates tables for coffee origin pages and filtering.
-- These tables provide structured geographic data for coffee origins with rich metadata,
-- SEO fields, and hierarchical relationships.

-- =========================================
-- Canonical Origins (for pages + filtering)
-- =========================================

-- 1) Canonical Regions
create table if not exists canon_regions (
  id               uuid primary key default gen_random_uuid(),

  -- URL + identity
  slug             citext not null unique,        -- e.g. 'chikkamagaluru'
  display_name     text not null,                 -- e.g. 'Chikkamagaluru'

  -- Hierarchy / geo
  country          text not null,                 -- e.g. 'India'
  state            text,                          -- e.g. 'Karnataka'
  subregion        text,                          -- optional

  -- Content / rich data (for UI cards/pages)
  description      text,
  climate          text,                          -- free text for now (e.g. "tropical, high rainfall")
  soil             text,
  harvest_season   text,                          -- free text (e.g. "Nov–Feb")
  notes            text,

  -- Elevation (region-wide ranges)
  altitude_min_m   integer,
  altitude_max_m   integer,
  rainfall_mm      integer,

  -- Media + SEO
  hero_image_url   text,
  seo_title        text,
  seo_description  text,

  -- Metadata
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  -- Basic sanity
  check (altitude_min_m is null or altitude_min_m >= 0),
  check (altitude_max_m is null or altitude_max_m >= 0),
  check (altitude_min_m is null or altitude_max_m is null or altitude_min_m <= altitude_max_m),
  check (rainfall_mm is null or rainfall_mm >= 0)
);

create index if not exists idx_canon_regions_country_state on canon_regions(country, state);
create index if not exists idx_canon_regions_display_name on canon_regions using gin (to_tsvector('simple', display_name));


-- 2) Canonical Estates
create table if not exists canon_estates (
  id               uuid primary key default gen_random_uuid(),

  -- URL + identity
  slug             citext not null unique,        -- e.g. 'ratnagiri-estate'
  name             text not null,                 -- e.g. 'Ratnagiri Estate'

  -- Each estate belongs to exactly one canonical region
  canon_region_id  uuid not null references canon_regions(id) on delete restrict,

  -- Content / rich data
  description      text,
  owner            text,
  founded_year     integer,
  certifications   text,                          -- free text for now (e.g. 'Rainforest Alliance')
  notes            text,

  -- Elevation (estate-specific ranges; can override region)
  altitude_min_m   integer,
  altitude_max_m   integer,

  -- Media + SEO
  hero_image_url   text,
  seo_title        text,
  seo_description  text,

  -- Metadata
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  -- Sanity
  check (founded_year is null or (founded_year >= 1600 and founded_year <= extract(year from now())::int)),
  check (altitude_min_m is null or altitude_min_m >= 0),
  check (altitude_max_m is null or altitude_max_m >= 0),
  check (altitude_min_m is null or altitude_max_m is null or altitude_min_m <= altitude_max_m)
);

create index if not exists idx_canon_estates_region on canon_estates(canon_region_id);
create index if not exists idx_canon_estates_name on canon_estates using gin (to_tsvector('simple', name));


-- =========================================
-- Row Level Security (RLS)
-- =========================================

-- Enable RLS on both tables
alter table canon_regions enable row level security;
alter table canon_estates enable row level security;

-- Public read access for both tables (these are public data)
create policy "canon_regions_select_public"
  on canon_regions for select
  using (true);

create policy "canon_estates_select_public"
  on canon_estates for select
  using (true);

-- Note: Write access can be added later if needed for admin users
-- For now, these tables are read-only via RLS



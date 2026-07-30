-- Canon regions/estates: enthusiast profile fields + B2B trade skeleton + media gallery.

-- 1. canon_regions: terroir/specialty + Coffee-Board-style stats
alter table canon_regions
  add column terroir_notes text,
  add column signature_profile text,
  add column primary_varieties text[],
  add column primary_processing_methods text[],
  add column intercrop_species text[],
  add column area_hectares numeric check (area_hectares >= 0),
  add column annual_production_mt numeric check (annual_production_mt >= 0),
  add column logo_url text;

-- 2. canon_estates: people/story + terroir/specialty
alter table canon_estates
  add column owner_generation text,
  add column founder_name text,
  add column family_story text,
  add column quote text,
  add column quote_attribution text,
  add column primary_varieties text[],
  add column processing_methods text[],
  add column signature_profile text,
  add column specialty_notes text;

alter table canon_estates
  alter column certifications type text[] using
    case when certifications is null then null else array[certifications] end;

-- 3. canon_media: gallery for both regions and estates
create table canon_media (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('region', 'estate')),
  entity_id uuid not null,
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  is_hero boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index canon_media_entity_idx on canon_media (entity_type, entity_id);

alter table canon_media enable row level security;
create policy canon_media_select_public on canon_media
  for select to public using (true);
create policy canon_media_write_admin on canon_media
  for all to authenticated using (
    exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'operator'))
  );

-- 4. canon_estate_trade: B2B skeleton, gated (no public SELECT policy)
create table canon_estate_trade (
  id uuid primary key default gen_random_uuid(),
  canon_estate_id uuid not null unique references canon_estates(id),
  contact_name text,
  contact_email text,
  contact_phone text,
  export_capacity_kg int check (export_capacity_kg >= 0),
  moq_kg int check (moq_kg >= 0),
  partner_status text not null default 'prospect'
    check (partner_status in ('prospect', 'contacted', 'partner', 'inactive')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table canon_estate_trade enable row level security;
create policy canon_estate_trade_write_admin on canon_estate_trade
  for all to authenticated using (
    exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'operator'))
  );


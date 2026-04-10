-- Public contact/social fields on curators. Nullable; curator_links remains for other platforms.
-- App resolves IG/Twitter with fallback to curator_links when columns are empty.

ALTER TABLE public.curators
  ADD COLUMN IF NOT EXISTS instagram_url TEXT,
  ADD COLUMN IF NOT EXISTS twitter_url TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT;

COMMENT ON COLUMN public.curators.instagram_url IS 'Instagram URL or @handle';
COMMENT ON COLUMN public.curators.twitter_url IS 'X/Twitter URL or @handle';
COMMENT ON COLUMN public.curators.contact_email IS 'Public contact email (mailto in UI)';

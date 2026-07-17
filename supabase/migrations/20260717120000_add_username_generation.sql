-- Auto-generate a slugified, unique username for new signups and backfill existing
-- profiles that have none. OAuth / email signups arrive via handle_new_user with a
-- full_name but no username, which silently excluded them from get_top_coffee_reviewers
-- (WHERE username IS NOT NULL). Charset/length match profileUpdateSchema: [a-z0-9_], 3-50.

-- Slugify a display name into a unique username.
drop function if exists public.generate_username(text);
create function public.generate_username(p_name text)
returns text
language plpgsql
stable
security definer
set search_path to 'public', 'pg_temp'
as $$
declare
  v_base text;
  v_candidate text;
  v_i int := 0;
begin
  -- lowercase, collapse runs of non-alphanumerics to '_', trim edge underscores
  v_base := trim(both '_' from regexp_replace(lower(coalesce(p_name, '')), '[^a-z0-9]+', '_', 'g'));
  if length(v_base) < 3 then
    v_base := 'user';                    -- non-latin / empty names fall back
  end if;
  v_base := left(v_base, 40);            -- leave room for a numeric suffix in varchar(50)

  v_candidate := v_base;
  -- ponytail: sequential counter on collision. Concurrent signups can still race
  -- past this check; handle_new_user retries the insert on the unique_violation.
  while exists (select 1 from public.user_profiles where username = v_candidate) loop
    v_i := v_i + 1;
    v_candidate := v_base || v_i::text;
  end loop;

  return v_candidate;
end;
$$;

-- Internal helper only; not exposed to API roles (matches repo RPC lockdown).
-- Supabase grants EXECUTE directly to anon/authenticated, so revoking FROM PUBLIC
-- alone is a no-op — revoke the role grants too.
revoke execute on function public.generate_username(text) from public, anon, authenticated;

-- Assign a username on first profile creation; never clobber a user-chosen one.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $$
declare
  user_full_name text;
  user_avatar_url text;
  user_email text;
  user_username text;
begin
  user_email := coalesce(NEW.email, NEW.raw_user_meta_data->>'email');

  user_full_name := coalesce(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'display_name',
    case when user_email is not null then split_part(user_email, '@', 1) else 'User' end
  );

  user_avatar_url := coalesce(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    NEW.raw_user_meta_data->>'photo_url'
  );

  -- Retry username allocation across a concurrent-signup race: generate_username
  -- picks a free slug, but two signups with the same name can both pass its check.
  -- On the username unique_violation we regenerate (now seeing the committed
  -- collision) and retry the insert, rather than dropping the profile entirely.
  for v_attempt in 1..5 loop
    begin
      user_username := public.generate_username(user_full_name);

      insert into public.user_profiles (
        id, full_name, username, avatar_url, email, email_verified
      )
      values (
        NEW.id,
        user_full_name,
        user_username,
        user_avatar_url,
        user_email,
        case when NEW.email_confirmed_at is not null then true else false end
      )
      on conflict (id) do update
      set
        username = coalesce(user_profiles.username, excluded.username),
        avatar_url = coalesce(user_profiles.avatar_url, excluded.avatar_url),
        full_name = case
          when user_profiles.full_name is null
            or user_profiles.full_name = split_part(coalesce(user_email, ''), '@', 1)
            or user_profiles.full_name = 'User'
          then coalesce(excluded.full_name, user_profiles.full_name, 'User')
          else user_profiles.full_name
        end,
        email = coalesce(NEW.email, NEW.raw_user_meta_data->>'email', user_profiles.email),
        email_verified = case when NEW.email_confirmed_at is not null then true else user_profiles.email_verified end,
        updated_at = now();

      return NEW;                         -- inserted/updated cleanly
    exception
      when unique_violation then
        null;                             -- username taken; loop regenerates and retries
    end;
  end loop;

  raise warning 'Could not allocate a unique username for user % after 5 attempts', NEW.id;
  return NEW;
exception
  when others then
    raise warning 'Failed to create user profile for user %: %', NEW.id, SQLERRM;
    return NEW;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Close the other write path: upsert_user_profile must never persist a NULL
-- username either. Fall back to generate_username from the available name when
-- p_username is null and the row has none; explicitly provided usernames win.
-- CREATE OR REPLACE (not drop) so the function's existing EXECUTE grants survive.
create or replace function public.upsert_user_profile(
  p_user_id uuid,
  p_full_name text default null,
  p_username character varying default null,
  p_bio text default null,
  p_city text default null,
  p_state text default null,
  p_country text default null,
  p_gender text default null,
  p_experience_level text default null,
  p_preferred_brewing_methods text[] default null,
  p_onboarding_completed boolean default null,
  p_newsletter_subscribed boolean default null,
  p_is_public_profile boolean default null,
  p_show_location boolean default null
)
returns table(profile_id uuid, username character varying, full_name text, email text, city text, state text, country text, gender text, experience_level text, preferred_brewing_methods text[], bio text, avatar_url text, is_public_profile boolean, show_location boolean, email_verified boolean, onboarding_completed boolean, newsletter_subscribed boolean, created_at timestamp with time zone, updated_at timestamp with time zone)
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_exists boolean;
  v_auth_email text;
  v_auth_email_verified boolean;
begin
  if p_user_id is distinct from (select auth.uid()) then
    raise exception 'not authorized to modify this profile';
  end if;

  select exists(select 1 from public.user_profiles where user_profiles.id = p_user_id) into v_exists;

  select au.email, (au.email_confirmed_at is not null)
  into v_auth_email, v_auth_email_verified
  from auth.users au
  where au.id = p_user_id;

  if v_exists then
    update public.user_profiles up
    set
      full_name = coalesce(p_full_name, up.full_name),
      -- generate_username only runs when both p_username and the stored one are null
      username = coalesce(p_username, up.username, public.generate_username(coalesce(p_full_name, up.full_name))),
      bio = coalesce(p_bio, up.bio),
      city = coalesce(p_city, up.city),
      state = coalesce(p_state, up.state),
      country = coalesce(p_country, up.country),
      gender = coalesce(p_gender, up.gender),
      experience_level = coalesce(p_experience_level, up.experience_level),
      preferred_brewing_methods = coalesce(p_preferred_brewing_methods, up.preferred_brewing_methods),
      onboarding_completed = coalesce(p_onboarding_completed, up.onboarding_completed),
      newsletter_subscribed = coalesce(p_newsletter_subscribed, up.newsletter_subscribed),
      is_public_profile = coalesce(p_is_public_profile, up.is_public_profile),
      show_location = coalesce(p_show_location, up.show_location),
      updated_at = now()
    where up.id = p_user_id;
  else
    insert into public.user_profiles (
      id, full_name, username, bio, city, state, country, gender,
      experience_level, preferred_brewing_methods, onboarding_completed,
      newsletter_subscribed, is_public_profile, show_location, email, email_verified
    )
    values (
      p_user_id,
      p_full_name,
      coalesce(p_username, public.generate_username(coalesce(p_full_name, split_part(v_auth_email, '@', 1)))),
      p_bio,
      p_city,
      p_state,
      p_country,
      p_gender,
      p_experience_level,
      p_preferred_brewing_methods,
      coalesce(p_onboarding_completed, false),
      coalesce(p_newsletter_subscribed, true),
      coalesce(p_is_public_profile, true),
      coalesce(p_show_location, true),
      v_auth_email,
      coalesce(v_auth_email_verified, false)
    );
  end if;

  return query
  select
    up.id as profile_id,
    up.username,
    up.full_name,
    up.email,
    up.city,
    up.state,
    up.country,
    up.gender,
    up.experience_level,
    up.preferred_brewing_methods,
    up.bio,
    up.avatar_url,
    up.is_public_profile,
    up.show_location,
    up.email_verified,
    up.onboarding_completed,
    up.newsletter_subscribed,
    up.created_at,
    up.updated_at
  from public.user_profiles up
  where up.id = p_user_id;
end;
$$;

-- Backfill existing profiles that never got a username. Row-by-row so each new
-- username is visible to the next iteration (prevents duplicate-name collisions).
do $$
declare
  r record;
begin
  for r in
    select id, full_name from public.user_profiles where username is null order by created_at
  loop
    update public.user_profiles
    set username = public.generate_username(r.full_name), updated_at = now()
    where id = r.id;
  end loop;
end $$;

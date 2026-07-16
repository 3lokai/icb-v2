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
  -- ponytail: sequential counter on collision; tiny race under concurrent signups,
  -- absorbed by handle_new_user's exception handler. Fine at directory signup volume.
  while exists (select 1 from public.user_profiles where username = v_candidate) loop
    v_i := v_i + 1;
    v_candidate := v_base || v_i::text;
  end loop;

  return v_candidate;
end;
$$;

-- Internal helper only; not exposed to API roles (matches repo RPC lockdown).
revoke execute on function public.generate_username(text) from public;

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

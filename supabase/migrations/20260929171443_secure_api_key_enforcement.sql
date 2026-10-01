-- Enforce API-key creation limits and irreversible user revocation at the
-- database boundary. The server action is not a security boundary: signed-in
-- users can call the Data API directly, and separate count/insert statements
-- race under concurrent requests.

drop policy if exists "Users can insert own api_keys" on public.api_keys;
revoke insert on table public.api_keys from anon, authenticated;

drop policy if exists "Users can update own api_keys" on public.api_keys;
create policy "Users can revoke own api_keys"
  on public.api_keys
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and is_active = false
  );

revoke update on table public.api_keys from anon, authenticated;
grant update (is_active) on table public.api_keys to authenticated;

create or replace function public.create_api_key(
  p_name text,
  p_key_prefix text,
  p_key_hash text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_max_keys integer;
  v_active_keys integer;
  v_key_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if nullif(btrim(p_name), '') is null then
    raise exception 'API key name is required' using errcode = '22023';
  end if;

  if p_key_prefix !~ '^icb_live_' or char_length(p_key_prefix) <> 16 then
    raise exception 'Invalid API key prefix' using errcode = '22023';
  end if;

  if p_key_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid API key hash' using errcode = '22023';
  end if;

  -- Serialize the short count-and-insert transaction for this user. A
  -- transaction-scoped advisory lock releases automatically on success/error.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text, 0)
  );

  select coalesce(
    (
      select p.max_keys
      from public.api_subscriptions s
      join public.api_plans p on p.tier = s.tier
      where s.user_id = v_user_id
        and current_date between s.period_start and s.period_end
    ),
    (select p.max_keys from public.api_plans p where p.tier = 'free'),
    3
  )
  into v_max_keys;

  select count(*)::integer
  into v_active_keys
  from public.api_keys k
  where k.user_id = v_user_id
    and k.is_active = true;

  if v_active_keys >= v_max_keys then
    raise exception 'API key limit reached' using errcode = 'P0001';
  end if;

  insert into public.api_keys (
    user_id,
    name,
    key_prefix,
    key_hash,
    is_active,
    rate_limit_rpm
  )
  values (
    v_user_id,
    btrim(p_name),
    p_key_prefix,
    lower(p_key_hash),
    true,
    60
  )
  returning id into v_key_id;

  return v_key_id;
end;
$$;

revoke all on function public.create_api_key(text, text, text)
  from public, anon;
grant execute on function public.create_api_key(text, text, text)
  to authenticated;

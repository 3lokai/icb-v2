begin;
select plan(7);

insert into auth.users (id, email)
values ('11111111-1111-4111-8111-111111111111', 'api-key-test@example.com');

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';

select lives_ok(
  $$select public.create_api_key('first', 'icb_live_1234567', repeat('a', 64))$$,
  'free plan permits its first active API key'
);

select lives_ok(
  $$select public.create_api_key('second', 'icb_live_2345678', repeat('b', 64))$$,
  'free plan permits its second active API key'
);

select lives_ok(
  $$select public.create_api_key('third', 'icb_live_3456789', repeat('c', 64))$$,
  'free plan permits its third active API key'
);

select throws_ok(
  $$select public.create_api_key('fourth', 'icb_live_4567890', repeat('d', 64))$$,
  'P0001',
  'API key limit reached',
  'free plan rejects an API key above its cap'
);

select throws_ok(
  $$
    insert into public.api_keys (user_id, name, key_prefix, key_hash)
    values (
      '11111111-1111-4111-8111-111111111111',
      'direct bypass',
      'icb_live_5678901',
      repeat('e', 64)
    )
  $$,
  '42501',
  'permission denied for table api_keys',
  'authenticated users cannot bypass the cap with a direct insert'
);

select lives_ok(
  $$
    update public.api_keys
    set is_active = false
    where key_hash = repeat('a', 64)
  $$,
  'an owner can revoke an active API key'
);

select throws_ok(
  $$
    update public.api_keys
    set is_active = true
    where key_hash = repeat('a', 64)
  $$,
  '42501',
  'new row violates row-level security policy for table "api_keys"',
  'an owner cannot reactivate a revoked API key'
);

select * from finish();
rollback;

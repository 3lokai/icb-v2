# Running paid API plans (ops guide)

How to turn a signed deal into API access, keep it running, and switch it off. Plain
language first; the SQL you actually run is at the bottom.

## The one idea to hold onto

**Money never touches the code.** You invoice and collect payment however you like (bank
transfer, Razorpay link, whatever). The system only knows one thing: does this user have a
row in `api_subscriptions` covering today's date?

- **Row exists and today is between `period_start` and `period_end`** → they get that plan.
- **No row, or the dates have passed** → they're on Free. Automatically, no warning.

That row is the on/off switch. Everything below is about writing it correctly.

## The plans

| Plan | Requests / minute | Requests / period | Active keys | Customer-facing use? |
|---|---|---|---|---|
| free | 30 | 5,000 per calendar month | 3 | No |
| pro | 120 | 100,000 | 5 | No (internal tools only) |
| commercial | 300 | 1,000,000 | 10 | Yes |
| enterprise | 600 | 10,000,000 | 20 | Yes |

These live in the `api_plans` table. For a one-off deal, don't invent a new plan: put the
negotiated numbers in the customer's subscription row (`rpm_override`, `quota_override`).

**"Customer-facing use" isn't enforced by code.** A Pro customer *can* technically power a
public product; only your contract stops them. Make sure the agreement says which plan
they're on and what it allows.

## Walkthrough: you sign a deal

Say you agree a 6-week paid pilot with a company, 500,000 requests total, starting 1 Nov.

1. **They create an ICB account** and sign in at least once. The subscription attaches to
   a *person's account*, not a company. All their developers should use keys from that one
   account; otherwise each account is a separate Free user with its own limits.
2. **You find their user id** from their sign-in email (SQL A below). Double-check it's the
   right person: whoever owns that account gets the access.
3. **Payment received (or pilot signed)** → you add their subscription row (SQL B):
   tier `commercial`, `period_start` 2026-11-01, `period_end` 2026-12-12,
   `quota_override` 500000.
4. **What happens immediately**, with no deploy and no restart:
   - Their very next API request uses the new limits. The plan is looked up on every request.
   - They can create more keys (up to 10 on Commercial).
   - Their dashboard (`/dashboard/developer`) shows the new plan and their usage against it.
   - Their usage counter starts at **zero** for this period. Whatever they used on Free
     doesn't carry over.
5. **Tell them** it's live. Every response to their key carries `X-Quota-Remaining`, so they can
   watch their own usage.

## Keeping it running

**Renewing.** Each customer has exactly one row, and a new `period_start` is what gives them
a fresh counter at zero. The catch: **a `period_start` in the future switches them off
today**, because the row no longer covers today. So renewal is two steps:

1. **When they pay (any time before the period ends):** push only `period_end` out to the
   new end date (SQL C1). Access continues uninterrupted.
2. **On the first day of the new period:** set `period_start` to that date (SQL C2). Their
   counter resets to zero.

Renewing on the first day itself or later? Do C2 with both dates in one go.

> ⚠️ If you do step 1 and forget step 2, their usage keeps counting from the *old* start.
> A "monthly" quota then covers two periods, and they'll run out early. SQL H2 lists
> rows worth checking; confirm the agreed renewal date (in `notes`) before running C2.

**They run out mid-period.** They get `429 Monthly quota exceeded` until the period ends.
To help them out, raise `quota_override` (SQL D). It takes effect on their next request, and
their usage so far still counts, so they just get more headroom.

**Upgrading or downgrading.** Change `tier` (SQL D). Same dates means the same counter;
only the limits change.

> ⚠️ **Overrides beat the plan.** If the row has `rpm_override` or `quota_override` set (e.g.
> the 500,000 pilot), changing `tier` alone changes nothing about those limits. A
> "downgrade to Pro" would still allow 500,000. Clear the overrides when changing plan
> unless you mean to keep them (SQL D does this).

**Checking usage for an invoice.** Use SQL E. It reads the nightly ledger, which is
rolled up at 00:10 UTC each night for the day before. **Today's usage isn't in it yet.**
The live number is in their dashboard and response headers.

## Switching it off

**They stop paying, or the pilot ends without converting.** Do nothing and the row
expires on its own: the day after `period_end` they're on Free. To cut them off early,
use SQL F. It moves the whole period into the past, because the table rejects any
`period_end` that isn't after `period_start`.

After a downgrade:
- **Their existing keys keep working**, just at Free limits. The key cap only blocks
  *creating new* keys. If they had 10 keys, all 10 still work but share the 5,000/month.
- If you want keys gone, revoke them (SQL G). **Treat revoking as permanent.** Customers
  can't switch a revoked key back on. You technically could from the SQL editor, but
  don't: if a key was revoked for a leak, reviving it revives the leak. Have them create
  a new one.

**A key leaks** (posted on GitHub, etc.). The customer can revoke it in their dashboard,
or you can with SQL G. They create a replacement. Their quota is per account, so the
leaked key's usage until then still counts against them.

## What could go wrong

| What happens | Why | What to do |
|---|---|---|
| A paying customer suddenly gets throttled hard (429s at 30/min) | Their `period_end` passed and nobody renewed. They silently dropped to Free. | Renew (SQL C). Set a reminder a few days before each `period_end`; SQL H lists what's expiring soon. |
| Access starts or ends at an odd hour | Dates are **UTC**. A period starting "1 Nov" begins 05:30 IST on 1 Nov, and `period_end` 12 Dec runs until 05:30 IST on 13 Dec. | Expect it; mention it if a customer is timing a launch. |
| The wrong person got access | Wrong user id in the row. | Fix the `user_id`. Always confirm the email in SQL A first. |
| Customer says "we have 3 developers and they each get Free limits" | Each developer signed up separately. Plans attach to one account. | Ask them to use keys from the one account on the subscription. |
| Customer burns their quota in week 1 of a renewal | You did renewal step 1 (extend `period_end`) but not step 2, so old usage still counts. | Run SQL C2: move `period_start` to the renewal date. |
| Customer drops to Free right after you renewed early | You moved `period_start` into the future, so the row doesn't cover today. | Set `period_start` back to the current period's start (SQL C1 shape); do C2 on the new start date. |
| A "downgraded" customer still has big limits | `quota_override` / `rpm_override` from the old deal are still set. | Clear them (SQL D). |
| The invoice number looks low or is missing days | The nightly rollup failed. Redis keeps raw daily counts for 32 days, but the rollup only processes "yesterday". | Check the ledger weekly (SQL E). If days are missing, tell a developer within the month, before Redis drops the counts. |
| Everyone's API calls fail with 503 or 500 | Redis (Upstash) is down or not configured. Every request checks rate limits in Redis. | Check Upstash status and the `UPSTASH_REDIS_*` env vars in Vercel. The keepalive cron runs every 2 days to stop Upstash idling it out. |
| A paid customer gets Free (or odd) limits even though their row is right | A Supabase lookup failed. If the *subscription* lookup fails, they get Free entirely. If only the *plan* lookup fails, they get Free's base limits, but any `rpm_override` / `quota_override` on their row still applies. | Usually a Supabase blip; check Supabase status and logs. Check their actual limits in the `X-RateLimit-Limit` / `X-Quota-Limit` response headers. |
| Customer uses Pro in a public product | Licence terms aren't enforced by code. | A contract matter: move them to Commercial. |

## SQL

Run these in the Supabase dashboard → SQL editor. That runs with full privileges, so
there are no permission errors, and no safety net either. Read before you run.

**A. Find a user by email**
```sql
select id, email, created_at, last_sign_in_at
from auth.users
where email = 'dev@customer.com';
```

**B. Turn on a plan**
```sql
insert into public.api_subscriptions
  (user_id, tier, period_start, period_end, quota_override, notes)
values
  ('<user id from A>', 'commercial', '2026-11-01', '2026-12-12', 500000,
   'Pilot, ₹40k, invoice INV-0012');
```
`period_end` is the **last day** of access (inclusive). Leave the overrides `null` to use the
plan's defaults. Use `notes` for the deal reference: future you will want it.

**C1. Renew early: extend access (when payment arrives)**
```sql
update public.api_subscriptions
set period_end = '2027-01-12',
    notes = notes || ' | renewed INV-0019, C2 due 2026-12-13', updated_at = now()
where user_id = '<user id>';
```

**C2. Start the new period (on its first day, UTC): fresh counter**
```sql
update public.api_subscriptions
set period_start = '2026-12-13', period_end = '2027-01-12', updated_at = now()
where user_id = '<user id>';
```
Never set `period_start` to a date after today: that switches them off until then.

**D. Change plan mid-period** (clears deal-specific overrides)
```sql
update public.api_subscriptions
set tier = 'pro',
    rpm_override = null, quota_override = null, features_override = null,
    updated_at = now()
where user_id = '<user id>';
```
Just raising a limit instead? Leave `tier` alone:
`set quota_override = 750000, updated_at = now()`.

**E. Usage for invoicing** (one customer, one period)
```sql
select sum(request_count) as requests, count(*) as days_with_traffic
from public.api_user_daily_usage
where user_id = '<user id>'
  and date between '2026-11-01' and '2026-12-12';
```

**F. End access now**
```sql
update public.api_subscriptions
set period_start = least(period_start, current_date - 2),
    period_end = current_date - 1,
    notes = notes || ' | ended early ' || current_date, updated_at = now()
where user_id = '<user id>';
```
This keeps the row (and its notes) for your records. They're on Free from their next request.

**G. Revoke a key (permanent)**
```sql
select id, name, key_prefix, is_active, last_used_at
from public.api_keys where user_id = '<user id>';

update public.api_keys set is_active = false where id = '<key id>';
```

**H. What's expiring in the next 14 days**
```sql
select s.user_id, u.email, s.tier, s.period_end, s.notes
from public.api_subscriptions s
join auth.users u on u.id = s.user_id
where s.period_end between current_date and current_date + 14
order by s.period_end;
```

**H2. Rows to check for renewal step 2** (period running past ~a month). Not all are
overdue: a single long period like the six-week pilot shows up here too. Check the agreed
renewal date in `notes` and only run C2 if that date has passed.
```sql
select s.user_id, u.email, s.tier, s.period_start, s.period_end, s.notes
from public.api_subscriptions s
join auth.users u on u.id = s.user_id
where s.period_end >= current_date
  and current_date - s.period_start > 31
order by s.period_start;
```

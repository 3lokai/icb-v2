// backfill-newsletteronly-list.mjs — one-time: subscribe newsletter subscribers
// who are NOT registered users to the Notifuse "Newsletter Only" list.
// Idempotent (re-subscribing an active contact is a no-op). Needs in .env.local:
// NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, NOTIFUSE_API_URL,
// NOTIFUSE_API_KEY, NOTIFUSE_WORKSPACE_ID, NOTIFUSE_NEWSLETTER_ONLY_LIST_ID
import { createClient } from "@supabase/supabase-js";

const dryRun = process.argv.includes("--dry-run");
const url = (process.env.NOTIFUSE_API_URL ?? "").replace(/\/+$/, "");
const ws = process.env.NOTIFUSE_WORKSPACE_ID;
const key = process.env.NOTIFUSE_API_KEY;
const listId = process.env.NOTIFUSE_NEWSLETTER_ONLY_LIST_ID;
if (!url || !ws || !key || !listId) {
  throw new Error(
    "Set NOTIFUSE_API_URL, NOTIFUSE_WORKSPACE_ID, NOTIFUSE_API_KEY, NOTIFUSE_NEWSLETTER_ONLY_LIST_ID"
  );
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const norm = (e) => (e || "").trim().toLowerCase();

const PAGE = 1000;
const subs = [];
for (let from = 0; ; from += PAGE) {
  const { data, error } = await supabase
    .from("form_submissions")
    .select("email")
    .eq("form_type", "newsletter")
    .not("email", "is", null)
    .order("id", { ascending: true })
    .range(from, from + PAGE - 1);
  if (error) throw error;
  if (!data?.length) break;
  subs.push(...data);
  if (data.length < PAGE) break;
}

const authUsers = [];
for (let page = 1; ; page++) {
  const { data: userData, error: uErr } = await supabase.auth.admin.listUsers({
    page,
    perPage: PAGE,
  });
  if (uErr) throw uErr;
  const batch = userData?.users ?? [];
  if (!batch.length) break;
  authUsers.push(...batch);
  if (batch.length < PAGE) break;
}
const userEmails = new Set(authUsers.map((u) => norm(u.email)).filter(Boolean));

// newsletter subscribers who are NOT registered users
const targets = [
  ...new Set(subs.map((r) => norm(r.email)).filter(Boolean)),
].filter((e) => !userEmails.has(e));

let done = 0;
for (const email of targets) {
  if (dryRun) {
    console.log(`[dry-run] subscribe ${email}`);
    done++;
    continue;
  }
  const res = await fetch(`${url}/api/lists.subscribe`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(8000),
    body: JSON.stringify({
      workspace_id: ws,
      contact: { email },
      list_ids: [listId],
    }),
  });
  if (!res.ok)
    throw new Error(`lists.subscribe ${res.status}: ${await res.text()}`);
  console.log(`subscribed ${++done}/${targets.length} ${email}`);
}
console.log(
  dryRun
    ? `dry-run: ${done} to subscribe (non-user newsletter subscribers)`
    : `done: ${done} subscribed`
);

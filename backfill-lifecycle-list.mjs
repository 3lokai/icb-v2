// backfill-lifecycle-list.mjs — one-time: subscribe existing users to ICB Lifecycle.
// Idempotent (re-subscribing an active contact is a no-op). Needs in .env.local:
// NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, NOTIFUSE_API_URL,
// NOTIFUSE_API_KEY, NOTIFUSE_WORKSPACE_ID, NOTIFUSE_LIFECYCLE_LIST_ID
import { createClient } from "@supabase/supabase-js";

const dryRun = process.argv.includes("--dry-run");
const url = (process.env.NOTIFUSE_API_URL ?? "").replace(/\/+$/, "");
const ws = process.env.NOTIFUSE_WORKSPACE_ID;
const key = process.env.NOTIFUSE_API_KEY;
const listId = process.env.NOTIFUSE_LIFECYCLE_LIST_ID;
if (!url || !ws) {
  throw new Error("Set NOTIFUSE_API_URL, NOTIFUSE_WORKSPACE_ID");
}
if (!listId) throw new Error("Set NOTIFUSE_LIFECYCLE_LIST_ID");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const PAGE = 1000;
const users = [];
for (let from = 0; ; from += PAGE) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id")
    .order("id", { ascending: true })
    .range(from, from + PAGE - 1);
  if (error) throw error;
  if (!data?.length) break;
  users.push(...data);
  if (data.length < PAGE) break;
}

let done = 0,
  skipped = 0;
for (const { id } of users) {
  const { data: rows, error: rpcErr } = await supabase.rpc(
    "get_user_lifecycle_state",
    { p_user_id: id }
  );
  if (rpcErr) throw rpcErr;
  const row = Array.isArray(rows) ? rows[0] : rows;
  if (!row?.email) {
    skipped++;
    continue;
  }
  if (dryRun) {
    console.log(`[dry-run] subscribe ${row.email}`);
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
      contact: {
        email: row.email.trim().toLowerCase(),
        external_id: id,
      },
      list_ids: [listId],
    }),
  });
  if (!res.ok)
    throw new Error(`lists.subscribe ${res.status}: ${await res.text()}`);
  console.log(`subscribed ${++done}/${users.length}`);
}
console.log(
  dryRun
    ? `dry-run: ${done} to subscribe, ${skipped} skipped`
    : `done: ${done} subscribed, ${skipped} skipped`
);

// backfill-lifecycle-list.mjs — one-time: subscribe existing users to ICB Lifecycle.
// Idempotent (re-subscribing an active contact is a no-op). Needs in .env.local:
// NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, NOTIFUSE_API_KEY,
// NOTIFUSE_WORKSPACE_ID, NOTIFUSE_LIFECYCLE_LIST_ID
import { createClient } from "@supabase/supabase-js";

const dryRun = process.argv.includes("--dry-run");
const URL = "https://notifuse.indiancoffeebeans.com";
const ws = process.env.NOTIFUSE_WORKSPACE_ID ?? "indiancoffeebeans";
const key = process.env.NOTIFUSE_API_KEY;
const listId = process.env.NOTIFUSE_LIFECYCLE_LIST_ID;
if (!listId) throw new Error("Set NOTIFUSE_LIFECYCLE_LIST_ID");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const { data: users, error } = await supabase.from("user_profiles").select("id");
if (error) throw error;

let done = 0, skipped = 0;
for (const { id } of users) {
  const { data: rows, error: rpcErr } = await supabase.rpc(
    "get_user_lifecycle_state", { p_user_id: id });
  if (rpcErr) throw rpcErr;
  const row = Array.isArray(rows) ? rows[0] : rows;
  if (!row?.email) { skipped++; continue; }
  if (dryRun) { console.log(`[dry-run] subscribe ${row.email}`); done++; continue; }
  const res = await fetch(`${URL}/api/lists.subscribe`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      workspace_id: ws,
      contact: { email: row.email.trim(), external_id: id },
      list_ids: [listId],
    }),
  });
  if (!res.ok) throw new Error(`lists.subscribe ${res.status}: ${await res.text()}`);
  console.log(`subscribed ${++done}/${users.length}`);
}
console.log(dryRun ? `dry-run: ${done} to subscribe, ${skipped} skipped` : `done: ${done} subscribed, ${skipped} skipped`);

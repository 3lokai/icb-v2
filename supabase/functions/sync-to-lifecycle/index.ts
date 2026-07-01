import { createClient } from "npm:@supabase/supabase-js@2.49.8";

// Self-hosted Notifuse. Funnel logic lives in Notifuse (segments + automations
// filter on the contact custom fields we push here). This function is read-only
// against the DB: it loads facts and forwards them to Notifuse.

type LifecycleRow = {
  user_id: string;
  ratings_count: number;
  has_gear: boolean;
  has_station_photo: boolean;
  has_bio: boolean;
  has_avatar: boolean;
  full_name: string | null;
  email: string | null;
};

const ALLOWED_EVENTS = new Set([
  "signed_up",
  "rated_coffee",
  "gear_added",
  "station_photo_added",
  "profile_updated",
  "session_started",
]);

const bit = (b: boolean): number => (b ? 1 : 0);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const internal = Deno.env.get("INTERNAL_LIFECYCLE_SYNC_SECRET") ?? "";
  const headerSecret = req.headers.get("x-icb-lifecycle-sync") ?? "";
  if (!internal || headerSecret !== internal) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const notifuseUrl = (Deno.env.get("NOTIFUSE_API_URL") ?? "").replace(
    /\/+$/,
    ""
  );
  const notifuseKey = Deno.env.get("NOTIFUSE_API_KEY");
  const workspaceId = Deno.env.get("NOTIFUSE_WORKSPACE_ID");
  if (!notifuseUrl || !notifuseKey || !workspaceId) {
    console.error(
      "sync-to-lifecycle: NOTIFUSE_API_URL / NOTIFUSE_API_KEY / NOTIFUSE_WORKSPACE_ID not set"
    );
    return jsonResponse({ error: "Server misconfiguration" }, 500);
  }

  let body: { user_id?: string; event_name?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }
  if (!body || typeof body !== "object") {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const userId = body.user_id;
  const eventName = body.event_name;
  if (!userId || typeof userId !== "string") {
    return jsonResponse({ error: "user_id required" }, 400);
  }
  if (
    !eventName ||
    typeof eventName !== "string" ||
    !ALLOWED_EVENTS.has(eventName)
  ) {
    return jsonResponse({ error: "Invalid event_name" }, 400);
  }
  const source =
    typeof body.source === "string" && body.source.trim() !== ""
      ? body.source.trim().toLowerCase()
      : "live";

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: rows, error: rpcError } = await admin.rpc(
    "get_user_lifecycle_state",
    { p_user_id: userId }
  );

  if (rpcError) {
    console.error("get_user_lifecycle_state", rpcError);
    return jsonResponse({ error: "Failed to load lifecycle state" }, 500);
  }

  const row = (Array.isArray(rows) ? rows[0] : rows) as
    | LifecycleRow
    | undefined;
  if (!row) {
    return jsonResponse({ error: "User not found" }, 404);
  }

  let email = row.email?.trim() || null;
  if (!email) {
    const { data: userData, error: userErr } =
      await admin.auth.admin.getUserById(userId);
    if (userErr || !userData.user?.email) {
      console.error("resolve email", userErr);
      return jsonResponse({ error: "Email not found for user" }, 400);
    }
    email = userData.user.email;
  }

  const ratings = row.ratings_count ?? 0;
  const now = new Date();

  const authHeaders = {
    Authorization: `Bearer ${notifuseKey}`,
    "Content-Type": "application/json",
  };

  // 1) Upsert contact attributes (what Notifuse segments/automations filter on).
  let upsertRes: Response;
  try {
    upsertRes = await fetch(`${notifuseUrl}/api/contacts.upsert`, {
      method: "POST",
      headers: authHeaders,
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        workspace_id: workspaceId,
        contact: {
          email,
          external_id: userId,
          full_name: row.full_name ?? null,
          custom_number_1: ratings,
          custom_number_2: bit(row.has_gear),
          custom_number_3: bit(row.has_station_photo),
          custom_number_4: bit(row.has_bio),
          custom_number_5: bit(row.has_avatar),
        },
      }),
    });
  } catch (err) {
    console.error("Notifuse contacts.upsert unreachable", err);
    return jsonResponse({ error: "Notifuse unreachable" }, 502);
  }
  if (!upsertRes.ok) {
    const t = await upsertRes.text();
    console.error("Notifuse contacts.upsert error", upsertRes.status, t);
    return jsonResponse(
      { error: "Notifuse contacts.upsert failed", detail: t.slice(0, 500) },
      502
    );
  }

  // 2) Fire the lifecycle event (drives automations / contact timeline).
  // signed_up is idempotent (stable external_id); other events are per-occurrence.
  const externalId =
    eventName === "signed_up"
      ? `${userId}:signed_up`
      : `${userId}:${eventName}:${now.getTime()}`;

  let eventRes: Response;
  try {
    eventRes = await fetch(`${notifuseUrl}/api/customEvents.import`, {
      method: "POST",
      headers: authHeaders,
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        workspace_id: workspaceId,
        events: [
          {
            event_name: eventName,
            external_id: externalId,
            email,
            occurred_at: now.toISOString(),
            source: "api",
            properties: {
              ratings_count: ratings,
              has_gear: row.has_gear,
              has_station_photo: row.has_station_photo,
              has_bio: row.has_bio,
              has_avatar: row.has_avatar,
              source,
            },
          },
        ],
      }),
    });
  } catch (err) {
    console.error("Notifuse customEvents.import unreachable", err);
    return jsonResponse({ error: "Notifuse unreachable" }, 502);
  }
  if (!eventRes.ok) {
    const t = await eventRes.text();
    console.error("Notifuse customEvents.import error", eventRes.status, t);
    return jsonResponse(
      { error: "Notifuse customEvents.import failed", detail: t.slice(0, 500) },
      502
    );
  }

  return jsonResponse({ success: true });
});

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-icb-lifecycle-sync",
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}

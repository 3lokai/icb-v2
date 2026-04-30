import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const SEQUENZY_URL = "https://api.sequenzy.com/api/v1/subscribers/events";

type LifecycleRow = {
  user_id: string;
  ratings_count: number;
  has_gear: boolean;
  has_station_photo: boolean;
  has_bio: boolean;
  has_avatar: boolean;
  sequenzy_phase: string | null;
  sequenzy_last_synced_at: string | null;
  sequenzy_last_session_event_at: string | null;
  activated_at: string | null;
  profile_building_entered_at: string | null;
  last_active_at: string | null;
  email: string | null;
};

const ALLOWED_EVENTS = new Set([
  "signed_up",
  "rated_coffee",
  "gear_added",
  "station_photo_added",
  "profile_updated",
  "session_started",
  "user_activated",
]);

function parseIso(s: string | null | undefined): Date | null {
  if (s == null || s === "") return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function addDaysUtc(d: Date, days: number): Date {
  const x = new Date(d.getTime());
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

/** Funnel-only phase from metrics (`dormant` is handled in `computeNextPhase`). */
function funnelPhase(
  row: LifecycleRow,
  now: Date
): "onboarding" | "profile_building" | "active" {
  const ratings = row.ratings_count ?? 0;
  if (ratings < 3) return "onboarding";

  const hasBio = row.has_bio;
  const hasGear = row.has_gear;
  const hasPhoto = row.has_station_photo;
  const pbEntered = parseIso(row.profile_building_entered_at);

  if ((hasGear || hasPhoto) && hasBio) return "active";

  if (
    pbEntered != null &&
    now.getTime() >= addDaysUtc(pbEntered, 14).getTime()
  ) {
    return "active";
  }

  return "profile_building";
}

/**
 * Dormant users always wake to `active` (do not re-run funnel into profile_building).
 */
function computeNextPhase(row: LifecycleRow, now: Date): string {
  if ((row.sequenzy_phase ?? "") === "dormant") {
    return "active";
  }
  return funnelPhase(row, now);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const internal = Deno.env.get("INTERNAL_SEQUENZY_SYNC_SECRET") ?? "";
  const headerSecret = req.headers.get("x-icb-sequenzy-sync") ?? "";
  if (!internal || headerSecret !== internal) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sequenzyKey = Deno.env.get("SEQUENZY_API_KEY");
  if (!sequenzyKey) {
    console.error("sync-to-sequenzy: SEQUENZY_API_KEY is not set");
    return jsonResponse({ error: "Server misconfiguration" }, 500);
  }

  let body: { user_id?: string; event_name?: string; source?: string };
  try {
    body = await req.json();
  } catch {
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

  const now = new Date();

  // signed_up should be emitted once per user; retries/backfills must be idempotent.
  if (eventName === "signed_up" && row.sequenzy_last_synced_at != null) {
    return jsonResponse({ success: true, skipped: "signed_up_already_sent" });
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

  const prevPhase = row.sequenzy_phase ?? "onboarding";
  const ratings = row.ratings_count ?? 0;

  const nextPhase = computeNextPhase(row, now);

  let activatedAt = row.activated_at;
  if (ratings >= 3 && !activatedAt) {
    activatedAt = now.toISOString();
  }

  let profileBuildingEnteredAt = row.profile_building_entered_at;
  if (ratings >= 3 && prevPhase === "onboarding" && !profileBuildingEnteredAt) {
    profileBuildingEnteredAt = now.toISOString();
  }

  const lastActiveAt = now.toISOString();

  const patch: Record<string, unknown> = {
    sequenzy_phase: nextPhase,
    sequenzy_last_synced_at: now.toISOString(),
    activated_at: activatedAt,
    profile_building_entered_at: profileBuildingEnteredAt,
    last_active_at: lastActiveAt,
  };

  if (eventName === "session_started") {
    patch.sequenzy_last_session_event_at = now.toISOString();
  }

  const { error: upErr } = await admin
    .from("user_profiles")
    .update(patch)
    .eq("id", userId);

  if (upErr) {
    console.error("user_profiles update", upErr);
    return jsonResponse({ error: "Failed to persist lifecycle state" }, 500);
  }

  const sequenzyPayload: Record<string, unknown> = {
    email,
    event: eventName,
    properties: {
      ratings_count: ratings,
      source,
    },
    customAttributes: {
      userId,
      ratings_count: ratings,
      user_phase: nextPhase,
      has_gear: row.has_gear,
      has_station_photo: row.has_station_photo,
      has_bio: row.has_bio,
      has_avatar: row.has_avatar,
      lastActiveAt,
      activatedAt: activatedAt ?? null,
    },
  };

  const sequenzyRes = await fetch(SEQUENZY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sequenzyKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sequenzyPayload),
  });

  if (!sequenzyRes.ok) {
    const t = await sequenzyRes.text();
    console.error("Sequenzy API error", sequenzyRes.status, t);
    return jsonResponse(
      { error: "Sequenzy request failed", detail: t.slice(0, 500) },
      502
    );
  }

  // First time hitting exactly 3 coffee ratings (activated_at was unset).
  // Skip this side-effect when user_activated is the incoming event itself (backfill/direct call).
  if (
    eventName !== "user_activated" &&
    ratings === 3 &&
    row.activated_at == null
  ) {
    const activationPayload: Record<string, unknown> = {
      email,
      event: "user_activated",
      properties: {
        ratings_count: ratings,
        source,
      },
      customAttributes: {
        userId,
        ratings_count: ratings,
        user_phase: nextPhase,
        has_gear: row.has_gear,
        has_station_photo: row.has_station_photo,
        has_bio: row.has_bio,
        has_avatar: row.has_avatar,
        lastActiveAt,
        activatedAt: activatedAt ?? null,
      },
    };

    const activationRes = await fetch(SEQUENZY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sequenzyKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activationPayload),
    });

    if (!activationRes.ok) {
      const t = await activationRes.text();
      console.error(
        "Sequenzy API error (user_activated)",
        activationRes.status,
        t
      );
      return jsonResponse(
        {
          error: "Sequenzy user_activated request failed",
          detail: t.slice(0, 500),
        },
        502
      );
    }
  }

  return jsonResponse({ success: true });
});

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-icb-sequenzy-sync",
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}

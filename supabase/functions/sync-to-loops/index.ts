import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const LOOPS_URL = "https://app.loops.so/api/v1/events/send";

type LifecycleRow = {
  user_id: string;
  ratings_count: number;
  has_gear: boolean;
  has_station_photo: boolean;
  has_bio: boolean;
  has_avatar: boolean;
  loops_phase: string | null;
  loops_last_synced_at: string | null;
  loops_last_session_event_at: string | null;
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

function utcCalendarDay(d: Date): string {
  return d.toISOString().slice(0, 10);
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
  if ((row.loops_phase ?? "") === "dormant") {
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

  const internal = Deno.env.get("INTERNAL_LOOPS_SYNC_SECRET") ?? "";
  const headerSecret = req.headers.get("x-icb-loops-sync") ?? "";
  if (!internal || headerSecret !== internal) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const loopsKey = Deno.env.get("LOOPS_API_KEY");
  if (!loopsKey) {
    console.error("sync-to-loops: LOOPS_API_KEY is not set");
    return jsonResponse({ error: "Server misconfiguration" }, 500);
  }

  let body: { user_id?: string; event_name?: string };
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

  if (eventName === "session_started") {
    const lastSess = parseIso(row.loops_last_session_event_at);
    if (lastSess != null && utcCalendarDay(lastSess) === utcCalendarDay(now)) {
      return jsonResponse({ success: true, skipped: "session_throttled" });
    }
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

  const prevPhase = row.loops_phase ?? "onboarding";
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
    loops_phase: nextPhase,
    loops_last_synced_at: now.toISOString(),
    activated_at: activatedAt,
    profile_building_entered_at: profileBuildingEnteredAt,
    last_active_at: lastActiveAt,
  };

  if (eventName === "session_started") {
    patch.loops_last_session_event_at = now.toISOString();
  }

  const { error: upErr } = await admin
    .from("user_profiles")
    .update(patch)
    .eq("id", userId);

  if (upErr) {
    console.error("user_profiles update", upErr);
    return jsonResponse({ error: "Failed to persist lifecycle state" }, 500);
  }

  const loopsPayload: Record<string, unknown> = {
    email,
    userId,
    eventName,
    createContact: true,
    eventProperties: {
      event_name: eventName,
      ratings_count: ratings,
    },
    ratings_count: ratings,
    user_phase: nextPhase,
    has_gear: row.has_gear,
    has_station_photo: row.has_station_photo,
    has_bio: row.has_bio,
    has_avatar: row.has_avatar,
    last_active_at: lastActiveAt,
    activated_at: activatedAt,
  };

  const loopsRes = await fetch(LOOPS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${loopsKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loopsPayload),
  });

  if (!loopsRes.ok) {
    const t = await loopsRes.text();
    console.error("Loops API error", loopsRes.status, t);
    return jsonResponse(
      { error: "Loops request failed", detail: t.slice(0, 500) },
      502
    );
  }

  // First time hitting exactly 3 coffee ratings (activated_at was unset)
  if (ratings === 3 && row.activated_at == null) {
    const activationPayload: Record<string, unknown> = {
      email,
      userId,
      eventName: "user_activated",
      createContact: true,
      eventProperties: {
        event_name: "user_activated",
        ratings_count: ratings,
      },
      ratings_count: ratings,
      user_phase: nextPhase,
      has_gear: row.has_gear,
      has_station_photo: row.has_station_photo,
      has_bio: row.has_bio,
      has_avatar: row.has_avatar,
      last_active_at: lastActiveAt,
      activated_at: activatedAt,
    };

    const activationRes = await fetch(LOOPS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${loopsKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activationPayload),
    });

    if (!activationRes.ok) {
      const t = await activationRes.text();
      console.error(
        "Loops API error (user_activated)",
        activationRes.status,
        t
      );
      return jsonResponse(
        {
          error: "Loops user_activated request failed",
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
      "authorization, x-client-info, apikey, content-type, x-icb-loops-sync",
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}

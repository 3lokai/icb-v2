import { createHash } from "node:crypto";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { isValidRating, isValidComment } from "@/types/review-types";

const GRIND_VALUES = [
  "whole",
  "filter",
  "espresso",
  "drip",
  "other",
  "turkish",
  "moka_pot",
  "cold_brew",
  "aeropress",
  "channi",
] as const;

const bodySchema = z.object({
  entity_type: z.enum(["coffee", "roaster"]),
  entity_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  recommend: z.boolean().optional().nullable(),
  value_for_money: z.boolean().optional().nullable(),
  works_with_milk: z.boolean().optional().nullable(),
  brew_method: z.enum(GRIND_VALUES).optional().nullable(),
  comment: z.string().max(5000).optional().nullable(),
  external_user_id: z.string().optional(),
  anon_id: z.string().uuid().optional(),
});

/**
 * POST /api/v1/reviews
 * Submit a review for a coffee or roaster. Requires API key.
 * Provide either anon_id (from POST /users) or external_user_id (will be resolved or created).
 */
export async function POST(request: Request) {
  const auth = await validateApiKey(request);
  if ("error" in auth) return auth.error;

  let body: z.infer<typeof bodySchema>;
  try {
    const raw = await request.json();
    body = bodySchema.parse(raw);
  } catch (err) {
    const message =
      err instanceof z.ZodError
        ? err.issues.map((e: { message: string }) => e.message).join("; ")
        : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const hasSignal =
    body.rating != null ||
    body.recommend != null ||
    body.value_for_money != null ||
    body.works_with_milk != null ||
    (body.comment != null && body.comment.trim().length > 0);
  if (!hasSignal) {
    return NextResponse.json(
      {
        error:
          "Provide at least one of: rating, recommend, value_for_money, works_with_milk, or comment.",
      },
      { status: 400 }
    );
  }

  if (!isValidRating(body.rating ?? null)) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5." },
      { status: 400 }
    );
  }
  if (!isValidComment(body.comment ?? null)) {
    return NextResponse.json(
      { error: "Comment must be 5000 characters or less." },
      { status: 400 }
    );
  }

  let anonId: string;

  if (body.anon_id) {
    anonId = body.anon_id;
  } else if (body.external_user_id) {
    const externalIdHash = createHash("sha256")
      .update(body.external_user_id, "utf8")
      .digest("hex");
    const supabase = await createServiceRoleClient();

    const { data: existing } = await supabase
      .from("external_user_identities")
      .select("anon_id")
      .eq("key_id", auth.keyId)
      .eq("external_user_id", externalIdHash)
      .single();

    if (existing) {
      anonId = existing.anon_id;
    } else {
      anonId = randomUUID();
      await supabase.from("external_user_identities").insert({
        key_id: auth.keyId,
        external_user_id: externalIdHash,
        anon_id: anonId,
      });
    }
  } else {
    return NextResponse.json(
      {
        error: "Provide either anon_id or external_user_id.",
      },
      { status: 400 }
    );
  }

  const supabase = await createServiceRoleClient();

  const { data: row, error } = await supabase
    .from("reviews")
    .insert({
      entity_type: body.entity_type,
      entity_id: body.entity_id,
      user_id: null,
      anon_id: anonId,
      recommend: body.recommend ?? null,
      rating: body.rating ?? null,
      value_for_money: body.value_for_money ?? null,
      works_with_milk: body.works_with_milk ?? null,
      brew_method: body.brew_method ?? null,
      comment: body.comment?.trim() || null,
      status: "pending_external",
      source_key_id: auth.keyId,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[API v1 /reviews] insert error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create review" },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: row.id });
}

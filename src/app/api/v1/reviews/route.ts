import { NextResponse } from "next/server";
import { z } from "zod";
import { rpcEnsureExternalIdentity } from "@/lib/api/ensure-external-identity";
import { getExternalUserIdHash } from "@/lib/api/external-user-id-hash";
import { validateApiKey } from "@/lib/api/validate-api-key";
import { createApiRouteClient } from "@/lib/supabase/api-route";
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
  try {
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

    const autoRecommend = body.rating != null && body.rating >= 4 ? true : null;
    const recommendForInsert =
      body.recommend !== undefined ? body.recommend : autoRecommend;

    const hasSignal =
      body.rating != null ||
      recommendForInsert != null ||
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

    const supabase = createApiRouteClient();

    let anonId: string;

    if (body.anon_id) {
      anonId = body.anon_id;
    } else if (body.external_user_id) {
      const hashed = getExternalUserIdHash(auth.keyId, body.external_user_id);
      if (!hashed.ok) return hashed.response;

      const ensured = await rpcEnsureExternalIdentity(
        supabase,
        auth.keyId,
        hashed.hash
      );
      if (!ensured.ok) {
        console.error(
          "[API v1 /reviews] ensure_external_identity error:",
          ensured
        );
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
      anonId = ensured.anonId;
    } else {
      return NextResponse.json(
        {
          error: "Provide either anon_id or external_user_id.",
        },
        { status: 400 }
      );
    }

    const { data: row, error } = await supabase
      .from("reviews")
      .insert({
        entity_type: body.entity_type,
        entity_id: body.entity_id,
        user_id: null,
        anon_id: anonId,
        recommend: recommendForInsert,
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
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: row.id });
  } catch (error) {
    console.error("[API v1 /reviews] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

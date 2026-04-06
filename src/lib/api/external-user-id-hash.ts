import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";

const MIN_SECRET_LENGTH = 32;

/**
 * HMAC-SHA256 of `${keyId}:${externalUserId}` for storing in external_user_identities.
 * Requires EXTERNAL_ID_HASH_SECRET (≥32 chars).
 */
export function getExternalUserIdHash(
  keyId: string,
  externalUserId: string
): { ok: true; hash: string } | { ok: false; response: NextResponse } {
  const secret = process.env.EXTERNAL_ID_HASH_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    console.error(
      "[external-user-id-hash] EXTERNAL_ID_HASH_SECRET must be set and at least 32 characters"
    );
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Service unavailable" },
        { status: 503 }
      ),
    };
  }
  const hash = createHmac("sha256", secret)
    .update(`${keyId}:${externalUserId}`, "utf8")
    .digest("hex");
  return { ok: true, hash };
}

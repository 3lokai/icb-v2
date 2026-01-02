import { type NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

/**
 * Data Deletion Callback API
 *
 * This endpoint handles data deletion requests from OAuth providers (Google, Facebook)
 * as required by GDPR compliance.
 *
 * Providers will send POST requests to this endpoint when a user requests data deletion
 * through their platform.
 *
 * Expected payload format (varies by provider):
 * - Google: { signed_request: string, user_id: string }
 * - Facebook: { signed_request: string, user_id: string }
 *
 * @see https://developers.google.com/identity/gsi/web/guides/data-deletion
 * @see https://developers.facebook.com/docs/apps/delete-data
 */

/**
 * Verify the request signature from OAuth providers
 *
 * IMPORTANT: This is a placeholder implementation. For production, you MUST:
 *
 * For Google:
 * - Verify JWT signature using Google's public keys from:
 *   https://www.googleapis.com/oauth2/v3/certs
 * - Use a JWT library (e.g., jsonwebtoken) to verify the token
 *
 * For Facebook:
 * - Verify HMAC-SHA256 signature using your App Secret
 * - Format: signed_request = base64(hmac_sha256(payload, app_secret))
 * - Split on '.', verify signature of payload using app_secret
 *
 * @see https://developers.google.com/identity/gsi/web/guides/data-deletion
 * @see https://developers.facebook.com/docs/apps/delete-data
 */
async function verifyRequest(
  signedRequest: string,
  provider: "google" | "facebook"
): Promise<{ valid: boolean; userId?: string }> {
  try {
    // Extract payload (format: signature.payload)
    const parts = signedRequest.split(".");
    if (parts.length !== 2) {
      return { valid: false };
    }

    const [_signature, payload] = parts;

    // Decode payload to get user_id
    const decoded = JSON.parse(
      Buffer.from(payload, "base64").toString("utf-8")
    );

    const userId = decoded.user_id || decoded.sub || decoded.userId;

    if (!userId) {
      return { valid: false };
    }

    // TODO: Implement proper signature verification
    // For now, we trust the payload structure but this should be verified
    // using provider-specific methods (JWT for Google, HMAC for Facebook)

    // In production, add:
    // - Google: JWT signature verification with public keys
    // - Facebook: HMAC-SHA256 verification with app secret
    // - Rate limiting to prevent abuse

    // For now, log a warning that signature isn't verified
    if (process.env.NODE_ENV === "production") {
      console.warn(
        `[SECURITY] Signature verification not fully implemented for ${provider}. ` +
          `User ID extracted: ${userId}. Implement proper verification before production use.`
      );
    }

    return {
      valid: true,
      userId,
    };
  } catch (error) {
    console.error("Signature verification error:", error);
    return { valid: false };
  }
}

// Find user by OAuth provider ID
async function findUserByProviderId(
  providerId: string,
  provider: "google" | "facebook"
): Promise<string | null> {
  const supabase = await createServiceRoleClient();

  // Use Admin API to list users and find by provider identity
  // Note: This is a simplified approach - in production, you might want to
  // maintain a mapping table or use a more efficient lookup method
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error || !users) {
    console.error("Error listing users:", error);
    return null;
  }

  // Find user with matching provider identity
  for (const user of users) {
    const identity = user.identities?.find(
      (id) => id.provider === provider && id.id === providerId
    );
    if (identity) {
      return user.id;
    }
  }

  return null;
}

/**
 * Delete user data
 *
 * This function performs the same deletion logic as deleteAccount in account.ts
 * to ensure consistency between manual deletion and OAuth provider callbacks.
 *
 * Steps:
 * 1. Anonymize all user reviews (set anon_id, nullify user_id)
 * 2. Anonymize user profile (set to "Deleted User", remove PII)
 * 3. Disable all notification preferences
 * 4. Delete auth.users record (prevents future login)
 */
async function deleteUserData(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceRoleClient();

    // Step 1: Critical - Set anon_id on all reviews where user_id = userId and anon_id IS NULL
    // This prevents CHECK constraint violation when user_id is set to NULL
    const { error: reviewsError } = await supabase.rpc(
      "anonymize_user_reviews",
      {
        p_user_id: userId,
      }
    );

    if (reviewsError) {
      console.error("Error anonymizing reviews:", reviewsError);
      // Continue anyway - might not have any reviews, or function might not exist yet
      // In production, this should be handled, but for now we continue
    }

    // Step 2: Anonymize PII in user_profiles
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({
        full_name: "Deleted User", // Required field, cannot be NULL
        username: null,
        avatar_url: null,
        bio: null,
        city: null,
        state: null,
        gender: null,
        is_public_profile: false,
        show_location: false,
        newsletter_subscribed: false,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error anonymizing profile:", profileError);
      return {
        success: false,
        error: profileError.message,
      };
    }

    // Step 3: Disable all notifications
    const { error: notifError } = await supabase
      .from("user_notification_preferences")
      .update({
        new_roasters: false,
        coffee_updates: false,
        newsletter: false,
        platform_updates: false,
      })
      .eq("user_id", userId);

    // Notifications might not exist, so we ignore errors unless it's a real issue
    if (notifError && !notifError.message.includes("No rows")) {
      console.error("Error updating notification preferences:", notifError);
      // Continue anyway
    }

    // Step 4: Delete auth.users record (prevents login)
    // Use Admin API through service role client
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Error deleting auth user:", deleteError);
      return {
        success: false,
        error: deleteError.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Data deletion error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headersList = await headers();

    // Extract provider from request (could be in header or body)
    const provider = (body.provider ||
      headersList.get("x-provider") ||
      "google") as "google" | "facebook";
    const signedRequest = body.signed_request;
    const userId = body.user_id || body.sub;

    if (!signedRequest && !userId) {
      return NextResponse.json(
        { error: "Missing signed_request or user_id" },
        { status: 400 }
      );
    }

    // Verify request signature
    let verifiedUserId: string | null = null;

    if (signedRequest) {
      const verification = await verifyRequest(signedRequest, provider);
      if (!verification.valid) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
      verifiedUserId = verification.userId || null;
    } else if (userId) {
      // If no signed_request, try to find user by provider ID
      verifiedUserId = await findUserByProviderId(userId, provider);
    }

    if (!verifiedUserId) {
      // User not found - return success (idempotent)
      return NextResponse.json({
        url: "https://indiancoffeebeans.com/data-deletion",
        confirmation_code: `icb_${Date.now()}`,
        status: "completed",
      });
    }

    // Delete user data
    const result = await deleteUserData(verifiedUserId);

    if (!result.success) {
      console.error("Failed to delete user data:", result.error);
      return NextResponse.json(
        { error: "Failed to delete user data" },
        { status: 500 }
      );
    }

    // Return confirmation (required by providers)
    return NextResponse.json({
      url: "https://indiancoffeebeans.com/data-deletion",
      confirmation_code: `icb_${verifiedUserId}_${Date.now()}`,
      status: "completed",
    });
  } catch (error) {
    console.error("Data deletion callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Some providers may use GET for verification
export async function GET(_request: NextRequest) {
  return NextResponse.json({
    message: "Data deletion callback endpoint",
    url: "https://indiancoffeebeans.com/data-deletion",
    status: "active",
  });
}

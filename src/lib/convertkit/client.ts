"use server";

import { env } from "../../../env";

/**
 * ConvertKit/Kit API v4 Types
 */

export type KitSubscriberState =
  | "active"
  | "cancelled"
  | "bounced"
  | "complained"
  | "inactive";

export interface KitSubscriberFields {
  "Signup Source"?: string;
  "User Role"?: string;
  "Experience Level"?: string;
  Location?: string;
  [key: string]: string | undefined;
}

export interface SubscribeToConvertKitParams {
  email_address: string;
  first_name?: string | null;
  state?: KitSubscriberState;
  fields?: KitSubscriberFields;
}

export interface KitSubscriberResponse {
  subscriber: {
    id: number;
    first_name: string | null;
    email_address: string;
    state: KitSubscriberState;
    created_at: string;
    fields: Record<string, unknown>;
  };
}

export interface KitErrorResponse {
  errors: string[];
}

/**
 * Check if ConvertKit is configured
 */
export function isConvertKitConfigured(): boolean {
  return Boolean(env.KIT_API_KEY);
}

/**
 * Subscribe a user to ConvertKit (upsert behavior)
 *
 * @param params - Subscriber information
 * @returns Subscriber data with ID, or null if not configured or error
 */
export async function subscribeToConvertKit(
  params: SubscribeToConvertKitParams
): Promise<KitSubscriberResponse | null> {
  // Graceful degradation if not configured
  if (!isConvertKitConfigured()) {
    console.log("[ConvertKit] API key not configured, skipping subscription");
    return null;
  }

  const apiKey = env.KIT_API_KEY!;
  const apiUrl = "https://api.kit.com/v4/subscribers";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({
        email_address: params.email_address.toLowerCase().trim(),
        first_name: params.first_name || null,
        state: params.state || "active",
        fields: params.fields || {},
      }),
    });

    // Handle different response codes
    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 202
    ) {
      const data = (await response.json()) as KitSubscriberResponse;
      console.log(
        `[ConvertKit] Subscriber ${data.subscriber.id} subscribed/updated: ${params.email_address}`
      );
      return data;
    }

    // Handle error responses
    if (response.status === 401) {
      const errorData = (await response.json()) as KitErrorResponse;
      console.error("[ConvertKit] Authentication error:", errorData.errors);
      return null;
    }

    if (response.status === 422) {
      const errorData = (await response.json()) as KitErrorResponse;
      console.error("[ConvertKit] Validation error:", errorData.errors);
      return null;
    }

    // Handle rate limiting (429)
    if (response.status === 429) {
      console.warn("[ConvertKit] Rate limit exceeded, skipping subscription");
      return null;
    }

    // Handle other errors
    const errorText = await response.text();
    console.error(
      `[ConvertKit] Unexpected error (${response.status}):`,
      errorText
    );
    return null;
  } catch (error) {
    // Network errors, etc. - fail silently
    console.error(
      "[ConvertKit] Network error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
}

/**
 * Unsubscribe a subscriber from ConvertKit
 *
 * @param subscriberId - ConvertKit subscriber ID
 * @returns true if successful, false otherwise
 */
export async function unsubscribeFromConvertKit(
  subscriberId: number
): Promise<boolean> {
  // Graceful degradation if not configured
  if (!isConvertKitConfigured()) {
    console.log("[ConvertKit] API key not configured, skipping unsubscribe");
    return false;
  }

  const apiKey = env.KIT_API_KEY!;
  const apiUrl = `https://api.kit.com/v4/subscribers/${subscriberId}/unsubscribe`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({}),
    });

    if (response.status === 204) {
      console.log(
        `[ConvertKit] Subscriber ${subscriberId} unsubscribed successfully`
      );
      return true;
    }

    if (response.status === 401) {
      const errorData = (await response.json()) as KitErrorResponse;
      console.error("[ConvertKit] Authentication error:", errorData.errors);
      return false;
    }

    if (response.status === 404) {
      console.warn(`[ConvertKit] Subscriber ${subscriberId} not found`);
      return false;
    }

    const errorText = await response.text();
    console.error(
      `[ConvertKit] Unexpected error (${response.status}):`,
      errorText
    );
    return false;
  } catch (error) {
    console.error(
      "[ConvertKit] Network error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return false;
  }
}

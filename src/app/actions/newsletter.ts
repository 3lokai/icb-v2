"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { sendNewsletterWelcomeEmail } from "@/lib/emails/resend";
import { subscribeToConvertKit } from "@/lib/convertkit/client";

const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  consent: z.string().refine((val) => val === "true", {
    message: "Please consent to receive newsletters.",
  }),
  website: z.string().optional(), // Honeypot field
});

export async function subscribeToNewsletter(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    consent: formData.get("consent") as string,
    website: formData.get("website") as string, // Honeypot field
  };

  // Check honeypot - if filled, it's a bot
  if (rawData.website) {
    // Silently reject - don't let bots know they were caught
    return {
      success: true,
      message: "Thank you for subscribing!",
    };
  }

  // Validate with Zod
  const validationResult = newsletterSchema.safeParse(rawData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    return {
      success: false,
      error:
        firstError?.message || "Validation failed. Please check your input.",
    };
  }

  const { email } = validationResult.data;

  try {
    // Get current user if authenticated (using regular client)
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    // Use service role client to bypass RLS for server-side form submissions
    const supabase = await createServiceRoleClient();

    // Get request metadata for spam detection
    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      null;
    const userAgent = headersList.get("user-agent") || null;

    // Prepare form submission data
    const submissionData = {
      form_type: "newsletter" as const,
      email,
      data: {
        email,
        consent: validationResult.data.consent,
        website: rawData.website || "",
      },
      ip_address: ipAddress,
      user_agent: userAgent,
      user_id: user?.id || null,
      status: "pending" as const,
    };

    // Insert into form_submissions table
    const { data, error } = await supabase
      .from("form_submissions")
      .insert(submissionData)
      .select("id")
      .single();

    if (error) {
      console.error("Newsletter subscription error:", error);
      return {
        success: false,
        error: "Failed to subscribe. Please try again later.",
      };
    }

    // Get user's profile data if authenticated
    let userName: string | null = null;
    let userProfile: {
      full_name: string | null;
      experience_level: string | null;
      city: string | null;
      state: string | null;
      country: string | null;
    } | null = null;
    let userRoles: string[] = [];

    if (user?.id) {
      // Get profile data
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("full_name, experience_level, city, state, country")
        .eq("id", user.id)
        .single();

      if (profile) {
        userName = profile.full_name || null;
        userProfile = profile;
      }

      // Get user roles
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (roles && roles.length > 0) {
        userRoles = roles.map((r) => r.role);
      }
    }

    // Sync to ConvertKit (fire and forget)
    subscribeToConvertKit({
      email_address: email,
      first_name: userName,
      state: "active",
      fields: {
        "Signup Source": "newsletter-signup",
        ...(userRoles.length > 0 && { "User Role": userRoles[0] }),
        ...(userProfile?.experience_level && {
          "Experience Level": userProfile.experience_level,
        }),
        ...(userProfile?.city || userProfile?.state || userProfile?.country
          ? {
              Location: [
                userProfile.city,
                userProfile.state,
                userProfile.country,
              ]
                .filter(Boolean)
                .join(", "),
            }
          : {}),
      },
    })
      .then((response) => {
        // Store subscriber ID if we got a response and user is authenticated
        if (response?.subscriber?.id && user?.id) {
          Promise.resolve(
            supabase
              .from("user_profiles")
              .update({ convertkit_subscriber_id: response.subscriber.id })
              .eq("id", user.id)
          )
            .then((result) => {
              if (result.error) {
                throw result.error;
              }
              console.log(
                `[ConvertKit] Stored subscriber ID ${response.subscriber.id} for user ${user.id}`
              );
            })
            .catch((err: unknown) => {
              console.error("[ConvertKit] Failed to store subscriber ID:", err);
            });
        }
      })
      .catch((err) => {
        // Already logged in subscribeToConvertKit
        console.error("[ConvertKit] Subscription sync error:", err);
      });

    // Send newsletter welcome email (fire and forget)
    sendNewsletterWelcomeEmail({
      email,
      name: userName,
    }).catch((err) => {
      console.error("Failed to send newsletter welcome email:", err);
    });

    return {
      success: true,
      message: "Successfully subscribed to newsletter!",
      id: data.id,
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      error: "Failed to subscribe. Please try again later.",
    };
  }
}

/**
 * Sync a newly registered user to ConvertKit
 * Called after successful email/password signup
 */
export async function syncUserToConvertKit(userId: string): Promise<void> {
  try {
    const supabase = await createServiceRoleClient();

    // Get user profile to check newsletter_subscribed
    const { data: profile } = await supabase
      .from("user_profiles")
      .select(
        "email, full_name, newsletter_subscribed, experience_level, city, state, country"
      )
      .eq("id", userId)
      .single();

    if (!profile || !profile.email) {
      console.log("[ConvertKit] No profile or email found for user:", userId);
      return;
    }

    // Only sync if newsletter_subscribed is true (default)
    if (!(profile.newsletter_subscribed ?? true)) {
      console.log("[ConvertKit] User opted out of newsletter:", userId);
      return;
    }

    // Get user roles
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const userRoles = roles?.map((r) => r.role) || [];

    // Sync to ConvertKit (fire and forget)
    subscribeToConvertKit({
      email_address: profile.email,
      first_name: profile.full_name || null,
      state: "active",
      fields: {
        "Signup Source": "user-registration",
        ...(userRoles.length > 0 && { "User Role": userRoles[0] }),
        ...(profile.experience_level && {
          "Experience Level": profile.experience_level,
        }),
        ...(profile.city || profile.state || profile.country
          ? {
              Location: [profile.city, profile.state, profile.country]
                .filter(Boolean)
                .join(", "),
            }
          : {}),
      },
    })
      .then((response) => {
        // Store subscriber ID if we got a response
        if (response?.subscriber?.id) {
          Promise.resolve(
            supabase
              .from("user_profiles")
              .update({ convertkit_subscriber_id: response.subscriber.id })
              .eq("id", userId)
          )
            .then((result) => {
              if (result.error) {
                throw result.error;
              }
              console.log(
                `[ConvertKit] Stored subscriber ID ${response.subscriber.id} for user ${userId}`
              );
            })
            .catch((err: unknown) => {
              console.error("[ConvertKit] Failed to store subscriber ID:", err);
            });
        }
      })
      .catch((err) => {
        // Already logged in subscribeToConvertKit
        console.error("[ConvertKit] User signup sync error:", err);
      });
  } catch (error) {
    console.error("[ConvertKit] Error syncing user to ConvertKit:", error);
    // Fail silently - don't block user flow
  }
}

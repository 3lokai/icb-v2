"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { sendNewsletterWelcomeEmail } from "@/lib/emails/resend";

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

    // Get user's name from profile if authenticated
    let userName: string | null = null;
    if (user?.id) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      userName = profile?.full_name || null;
    }

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

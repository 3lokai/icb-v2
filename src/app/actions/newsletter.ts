"use server";

import { headers } from "next/headers";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;
  const consent = formData.get("consent") as string;
  const honeypot = formData.get("website") as string; // Honeypot field

  // Check honeypot - if filled, it's a bot
  if (honeypot) {
    // Silently reject - don't let bots know they were caught
    return {
      success: true,
      message: "Thank you for subscribing!",
    };
  }

  if (!email?.includes("@")) {
    return {
      success: false,
      error: "Please provide a valid email address.",
    };
  }

  if (consent !== "true") {
    return {
      success: false,
      error: "Please consent to receive newsletters.",
    };
  }

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
      email: email.toLowerCase().trim(),
      data: {
        email: email.toLowerCase().trim(),
        consent,
        website: honeypot || "",
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

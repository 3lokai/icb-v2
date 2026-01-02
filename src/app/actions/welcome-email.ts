"use server";

import { sendWelcomeEmail } from "@/lib/emails/resend";

/**
 * Send welcome email to a new user
 *
 * This is a server action that can be called from client components.
 * It's fire-and-forget and won't throw errors.
 */
export async function sendWelcomeEmailAction(
  email: string,
  name: string | null
): Promise<void> {
  // Fire and forget - don't await or throw errors
  sendWelcomeEmail({ email, name }).catch((err) => {
    console.error("Failed to send welcome email:", err);
  });
}

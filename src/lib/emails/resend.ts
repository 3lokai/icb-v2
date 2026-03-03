import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface WelcomeEmailParams {
  email: string;
  name: string | null;
}

export interface NewsletterWelcomeEmailParams {
  email: string;
  name: string | null;
}

/**
 * Send welcome email to new users
 *
 * This is a fire-and-forget operation - errors are logged but don't throw
 */
export async function sendWelcomeEmail({
  email,
  name,
}: WelcomeEmailParams): Promise<void> {
  // Silently return if Resend API key is not configured
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Resend] API key not configured, skipping welcome email");
    }
    return;
  }

  try {
    const userName = name || "Coffee Lover";
    const ccEmail = "gta3lok.ai@gmail.com";

    await resend.emails.send({
      from: "thrilok.gt@indiancoffeebeans.com",
      to: email,
      cc: ccEmail,
      subject: "Welcome to IndianCoffeeBeans!",
      text: `Hey ${userName},
GT here, founder of IndianCoffeeBeans.com.
Thanks for signing up! ICB is India's largest independent specialty coffee platform — 70+ roasters, 900+ coffees, and a growing community of ratings and reviews. No sponsors, no paid placements. Just data and community.
Here's what you can do on ICB:

Explore the directory and discover Indian roasters you didn't know existed
Rate and review coffees you've tried
Use our tools to find your next bag
Set up your profile and share your coffee setup with the community

Every two weeks I send ICB Fortnight, a digest of what's new on the platform, what the community is talking about, and the best from the Indian coffee world. Keep an eye on your inbox.
Btw, what brought you here? Just reply, I read everything.
Cheers,
GT

---
IndianCoffeeBeans
One-Stop Shop for Indian Coffee.`,
    });
  } catch (error) {
    // Log error but don't throw - email sending should never break the app
    console.error("[Resend] Failed to send welcome email:", error);
  }
}

/**
 * Send newsletter welcome email to new subscribers
 *
 * This is a fire-and-forget operation - errors are logged but don't throw
 */
export async function sendNewsletterWelcomeEmail({
  email,
  name,
}: NewsletterWelcomeEmailParams): Promise<void> {
  // Silently return if Resend API key is not configured
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "[Resend] API key not configured, skipping newsletter welcome email"
      );
    }
    return;
  }

  try {
    const userName = name || "Coffee Lover";

    await resend.emails.send({
      from: "thrilok.gt@indiancoffeebeans.com",
      to: email,
      subject: "Welcome to ICB Fortnight",
      text: `Hey ${userName},

GT here, founder of IndianCoffeeBeans.com.

Thanks for subscribing! ICB is India's largest independent specialty coffee platform — 70+ roasters, 900+ coffees, and a growing community of ratings and reviews. No sponsors, no paid placements. Just data and community.

Every two weeks I send ICB Fortnight — a digest of what's new on the platform, what the community is talking about, and the best from the Indian coffee world. Keep an eye on your inbox.

In the meantime, explore the directory at indiancoffeebeans.com — you might find a roaster from your city you didn't know existed.

What brought you here? Just reply — I read everything.

Cheers,
GT

—
IndianCoffeeBeans.com
India's specialty coffee directory. Community-powered. Free.`,
    });
  } catch (error) {
    // Log error but don't throw - email sending should never break the app
    console.error("[Resend] Failed to send newsletter welcome email:", error);
  }
}

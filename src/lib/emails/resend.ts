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
      from: "thrlok.gt@indiancoffeebeans.com",
      to: email,
      cc: ccEmail,
      subject: "Welcome to IndianCoffeeBeans!",
      text: `Hey ${userName},

GT here, founder of IndianCoffeeBeans.

Thanks for signing up! What brought you here?

We're just launching, so your feedback is gold. Here's what you can do:

• Explore our coffee directory and discover amazing Indian roasters
• Rate and review coffees you've tried
• Use our tools to find your perfect coffee match
• Share your coffee journey with our community

We'd love to hear what you think - just reply to this email with any thoughts, suggestions, or questions.

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
      from: "thrlok.gt@indiancoffeebeans.com",
      to: email,
      subject: "Thanks for subscribing to IndianCoffeeBeans newsletter!",
      text: `Hey ${userName},

Thanks for signing up for the IndianCoffeeBeans newsletter 🙌

Quick heads-up: the newsletter is still **brewing**.

I'm actively working on the site and the data behind it, and once things settle a bit, I'll start sending regular updates here — new roasters, interesting coffees, site updates, and the occasional coffee rant.

No spam. No nonsense. Just useful coffee stuff.

Appreciate your patience (and your trust).
More coming soon.

Cheers,
GT

—
IndianCoffeeBeans
Discover Indian specialty coffee`,
    });
  } catch (error) {
    // Log error but don't throw - email sending should never break the app
    console.error("[Resend] Failed to send newsletter welcome email:", error);
  }
}

import { z } from "zod";

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_URL is required")
    .url(
      "NEXT_PUBLIC_SUPABASE_URL must be a valid URL (e.g., https://your-project.supabase.co)"
    ),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required"),

  // Optional Supabase secret key (server-side only)
  SUPABASE_SECRET_KEY: z.string().optional(),

  // App configuration
  NEXT_PUBLIC_APP_NAME: z.string().default("Next.js Starter"),
  NEXT_PUBLIC_APP_URL: z.string().min(1).url().optional(),

  // ImageKit configuration
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),

  // Google Analytics (GA4) configuration
  // Google Tag ID (GT-XXXX) - used for loading the gtag.js script
  NEXT_PUBLIC_GOOGLE_TAG_ID: z.string().optional(),
  // GA4 Measurement ID (G-XXXX) - used for gtag('config', ...) and events
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  // Legacy: kept for backward compatibility
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Resend email service
  RESEND_API_KEY: z.string().optional(),

  // ConvertKit/Kit API (server-side only)
  KIT_API_KEY: z.string().optional(),

  // Slack webhooks for notifications
  // Activity channel: user signups and reviews/ratings
  SLACK_WEBHOOK_URL_ACTIVITY: z.string().url().optional(),
  // Forms channel: contact form submissions (non-roaster)
  SLACK_WEBHOOK_URL_FORMS: z.string().url().optional(),
  // Roasters channel: roaster submissions, claims, and partner inquiries
  SLACK_WEBHOOK_URL_ROASTERS: z.string().url().optional(),

  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Environment variable validation failed:\n");
  parsed.error.issues.forEach((err) => {
    const path = err.path.join(".");
    console.error(`  • ${path}: ${err.message}`);
  });
  console.error(
    "\n💡 Make sure your .env.local file has valid values for all required variables."
  );
  console.error(
    "   Get your Supabase credentials from: https://supabase.com/dashboard → Your Project → Settings → API\n"
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

export type Env = z.infer<typeof envSchema>;

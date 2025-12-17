import { z } from "zod";

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Supabase publishable key is required"),

  // Optional Supabase secret key (server-side only)
  SUPABASE_SECRET_KEY: z.string().optional(),

  // App configuration
  NEXT_PUBLIC_APP_NAME: z.string().default("Next.js Starter"),
  NEXT_PUBLIC_APP_URL: z.string().min(1).url().optional(),

  // ImageKit configuration
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),

  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;

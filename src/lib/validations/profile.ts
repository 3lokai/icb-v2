import { z } from "zod";
import { onboardingSchema } from "./onboarding";

// Profile update schema - extends onboarding fields, adds username and bio
export const profileUpdateSchema = onboardingSchema.extend({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .trim()
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

// Coffee preferences update schema
export const coffeePreferencesUpdateSchema = z.object({
  roastLevels: z
    .array(z.string())
    .max(10, "Please select up to 10 roast levels")
    .optional(),
  flavorProfiles: z
    .array(z.string())
    .max(20, "Please select up to 20 flavor profiles")
    .optional(),
  processingMethods: z
    .array(z.string())
    .max(15, "Please select up to 15 processing methods")
    .optional(),
  regions: z
    .array(z.string())
    .max(20, "Please select up to 20 regions")
    .optional(),
  withMilkPreference: z.boolean().optional(),
  decafOnly: z.boolean().optional(),
  organicOnly: z.boolean().optional(),
});

export type CoffeePreferencesUpdateFormData = z.infer<
  typeof coffeePreferencesUpdateSchema
>;

// Notification preferences update schema
export const notificationPreferencesUpdateSchema = z.object({
  newRoasters: z.boolean().optional(),
  coffeeUpdates: z.boolean().optional(),
  newsletter: z.boolean().optional(),
  platformUpdates: z.boolean().optional(),
  emailFrequency: z
    .enum(["immediately", "daily", "weekly", "monthly", "never"])
    .optional(),
});

export type NotificationPreferencesUpdateFormData = z.infer<
  typeof notificationPreferencesUpdateSchema
>;

// Privacy settings schema
export const privacySettingsSchema = z.object({
  isPublicProfile: z.boolean().optional(),
  showLocation: z.boolean().optional(),
});

export type PrivacySettingsFormData = z.infer<typeof privacySettingsSchema>;

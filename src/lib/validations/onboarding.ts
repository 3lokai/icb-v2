import { z } from "zod";

export const onboardingSchema = z.object({
  // Step 1: Basic Info
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters")
    .trim(),
  city: z
    .string()
    .max(100, "City must be less than 100 characters")
    .trim()
    .optional(),
  state: z
    .string()
    .max(100, "State must be less than 100 characters")
    .trim()
    .optional(),
  country: z
    .string()
    .max(100, "Country must be less than 100 characters")
    .trim()
    .optional(),
  gender: z
    .enum(["male", "female", "non-binary", "prefer-not-to-say"])
    .optional(),

  // Step 2: Coffee Experience
  experienceLevel: z.enum(["beginner", "enthusiast", "expert"]).optional(),
  preferredBrewingMethods: z
    .array(z.string())
    .max(20, "Please select up to 20 brewing methods")
    .optional(),

  // Step 3: Coffee Preferences (optional)
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

  // Step 4: Notification Preferences (optional)
  newsletterSubscribed: z.boolean().optional(),
  newRoasters: z.boolean().optional(),
  coffeeUpdates: z.boolean().optional(),
  platformUpdates: z.boolean().optional(),
  emailFrequency: z
    .enum(["immediately", "daily", "weekly", "monthly", "never"])
    .optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Partial schema for step-by-step validation
export const step1Schema = onboardingSchema.pick({
  fullName: true,
  city: true,
  state: true,
  country: true,
  gender: true,
});

export const step2Schema = onboardingSchema.pick({
  experienceLevel: true,
  preferredBrewingMethods: true,
});

export const step3Schema = onboardingSchema.pick({
  roastLevels: true,
  flavorProfiles: true,
  processingMethods: true,
  regions: true,
  withMilkPreference: true,
  decafOnly: true,
  organicOnly: true,
});

export const step4Schema = onboardingSchema.pick({
  newsletterSubscribed: true,
  newRoasters: true,
  coffeeUpdates: true,
  platformUpdates: true,
  emailFrequency: true,
});

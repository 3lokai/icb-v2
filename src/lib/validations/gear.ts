import { z } from "zod";

export const GEAR_CATEGORIES = [
  "grinder",
  "brewer",
  "espresso_machine",
  "kettle",
  "scale",
  "filter",
  "accessory",
] as const;

export type GearCategory = (typeof GEAR_CATEGORIES)[number];

export const GEAR_CATEGORY_LABELS: Record<GearCategory, string> = {
  grinder: "Grinder",
  brewer: "Brewer",
  espresso_machine: "Espresso machine",
  kettle: "Kettle",
  scale: "Scale",
  filter: "Filter",
  accessory: "Accessory",
};

export const addExistingGearSchema = z.object({
  gearId: z.string().uuid("Invalid gear ID"),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

export const createNewGearSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  category: z.enum(GEAR_CATEGORIES, {
    message: `Category must be one of: ${GEAR_CATEGORIES.join(", ")}`,
  }),
  brand: z.string().max(50, "Brand must be less than 50 characters").optional(),
  model: z.string().max(50, "Model must be less than 50 characters").optional(),
});

export const removeGearSchema = z.object({
  userGearId: z.string().uuid("Invalid user gear ID"),
});

export type AddExistingGearFormData = z.infer<typeof addExistingGearSchema>;
export type CreateNewGearFormData = z.infer<typeof createNewGearSchema>;
export type RemoveGearFormData = z.infer<typeof removeGearSchema>;

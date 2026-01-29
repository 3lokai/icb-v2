import { z } from "zod";

// Schema for validating file data sent from client
// Note: File object itself is validated in the hook, this validates the metadata
export const uploadStationPhotoSchema = z.object({
  fileName: z
    .string()
    .min(1, "File name is required")
    .max(255, "File name too long"),
  fileSize: z
    .number()
    .int()
    .positive()
    .max(2097152, "File size must be less than 2MB"),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"], {
    message: "File must be JPEG, PNG, or WebP",
  }),
  fileData: z.string().min(1, "File data is required"), // base64 string
});

export const deleteStationPhotoSchema = z.object({
  photoId: z.string().uuid("Invalid photo ID"),
});

export type UploadStationPhotoFormData = z.infer<
  typeof uploadStationPhotoSchema
>;
export type DeleteStationPhotoFormData = z.infer<
  typeof deleteStationPhotoSchema
>;

// Avatar upload schema (reuses same structure as station photos)
export const uploadAvatarSchema = uploadStationPhotoSchema;
export type UploadAvatarFormData = z.infer<typeof uploadAvatarSchema>;

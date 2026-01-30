"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadStationPhoto, deleteStationPhoto } from "@/app/actions/profile";
import type {
  UploadStationPhotoFormData,
  DeleteStationPhotoFormData,
} from "@/lib/validations/station-photos";
import type { StationPhoto } from "@/types/profile-types";

const MAX_FILE_SIZE = 2097152; // 2MB
const MAX_PHOTOS = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Convert File to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Custom hook for managing station photo uploads and deletions
 * Provides optimistic UI updates and error handling
 */
export function useStationPhotos(currentPhotos: StationPhoto[] = []) {
  const queryClient = useQueryClient();
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [optimisticPhotos, setOptimisticPhotos] = useState<
    Map<string, StationPhoto>
  >(new Map());
  const [deletingPhotoIds, setDeletingPhotoIds] = useState<Set<string>>(
    new Set()
  );

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (data: UploadStationPhotoFormData) => {
      const result = await uploadStationPhoto(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to upload photo");
      }
      return result.data;
    },
    onSuccess: (data) => {
      if (data) {
        // Remove from uploading set
        setUploadingFiles((prev) => {
          const next = new Set(prev);
          // Find and remove the file that was uploading
          // We track by a temporary ID, but we'll use the file name for now
          return next;
        });

        // Remove optimistic photo
        setOptimisticPhotos((prev) => {
          const next = new Map(prev);
          // We'll need to track which optimistic photo corresponds to which upload
          return next;
        });

        toast.success("Photo uploaded successfully!");

        // Invalidate profile queries to refetch
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload photo");
      // Remove from uploading set
      setUploadingFiles((prev) => {
        const next = new Set(prev);
        // Remove all uploading files on error
        return new Set();
      });
      // Remove optimistic photos
      setOptimisticPhotos(new Map());
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (data: DeleteStationPhotoFormData) => {
      const result = await deleteStationPhoto(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete photo");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Photo deleted successfully!");
      // Remove from deleting set
      setDeletingPhotoIds((prev) => {
        const next = new Set(prev);
        return next;
      });

      // Invalidate profile queries to refetch
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete photo");
      // Remove from deleting set to revert optimistic update
      setDeletingPhotoIds((prev) => {
        const next = new Set(prev);
        return next;
      });
    },
  });

  /**
   * Upload a photo file
   */
  const uploadPhoto = async (file: File) => {
    // Client-side validation
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 2MB");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("File must be JPEG, PNG, or WebP");
      return;
    }

    if (currentPhotos.length + optimisticPhotos.size >= MAX_PHOTOS) {
      toast.error(
        `Maximum ${MAX_PHOTOS} photos allowed. Please delete a photo first.`
      );
      return;
    }

    // Create temporary ID for tracking
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const fileName = file.name;

    // Add to uploading set
    setUploadingFiles((prev) => new Set(prev).add(tempId));

    // Create optimistic photo
    const optimisticPhoto: StationPhoto = {
      id: tempId,
      image_url: URL.createObjectURL(file), // Create object URL for preview
      width: null,
      height: null,
      sort_order: currentPhotos.length + optimisticPhotos.size,
    };
    setOptimisticPhotos((prev) => new Map(prev).set(tempId, optimisticPhoto));

    try {
      // Convert file to base64
      const base64Data = await fileToBase64(file);

      // Prepare upload data
      const uploadData: UploadStationPhotoFormData = {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type as "image/jpeg" | "image/png" | "image/webp",
        fileData: base64Data,
      };

      // Trigger upload mutation
      await uploadMutation.mutateAsync(uploadData);

      // Clean up object URL after successful upload
      URL.revokeObjectURL(optimisticPhoto.image_url);
    } catch (error) {
      // Error handling is done in mutation onError
      // Clean up object URL on error
      URL.revokeObjectURL(optimisticPhoto.image_url);
    } finally {
      // Remove from uploading set
      setUploadingFiles((prev) => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });

      // Remove optimistic photo
      setOptimisticPhotos((prev) => {
        const next = new Map(prev);
        next.delete(tempId);
        return next;
      });
    }
  };

  /**
   * Delete a photo
   */
  const deletePhoto = async (photoId: string) => {
    // Add to deleting set (optimistic removal)
    setDeletingPhotoIds((prev) => new Set(prev).add(photoId));

    try {
      await deleteMutation.mutateAsync({ photoId });
    } catch (error) {
      // Error handling is done in mutation onError
      // The optimistic update will be reverted
    } finally {
      // Remove from deleting set
      setDeletingPhotoIds((prev) => {
        const next = new Set(prev);
        next.delete(photoId);
        return next;
      });
    }
  };

  // Combine current photos with optimistic photos, excluding deleted ones
  const displayPhotos = [
    ...currentPhotos.filter((p) => !deletingPhotoIds.has(p.id)),
    ...Array.from(optimisticPhotos.values()),
  ].sort((a, b) => a.sort_order - b.sort_order);

  return {
    uploadPhoto,
    deletePhoto,
    uploadingFiles,
    deletingPhotoIds,
    displayPhotos,
    isUploading: uploadingFiles.size > 0,
    isDeleting: deletingPhotoIds.size > 0,
    canUploadMore: displayPhotos.length < MAX_PHOTOS,
  };
}

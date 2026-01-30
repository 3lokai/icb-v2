"use client";

import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/common/Icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { uploadAvatar, deleteAvatar } from "@/app/actions/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";

type AvatarUploadProps = {
  currentAvatarUrl?: string | null;
  name: string;
  userId?: string; // Optional - will be fetched if not provided
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onUploadComplete?: (avatarUrl: string) => void;
  onDeleteComplete?: () => void;
  disabled?: boolean;
};

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
  xl: "h-40 w-40",
};

const MAX_FILE_SIZE = 2097152; // 2MB
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
 * AvatarUpload component with upload and delete functionality
 * Wraps the base Avatar component with ImageKit upload capabilities
 */
export function AvatarUpload({
  currentAvatarUrl,
  name,
  userId: providedUserId,
  size = "md",
  className,
  onUploadComplete,
  onDeleteComplete,
  disabled = false,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [optimisticAvatarUrl, setOptimisticAvatarUrl] = useState<string | null>(
    null
  );
  const [userId, setUserId] = useState<string | null>(providedUserId || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Fetch userId if not provided
  useEffect(() => {
    if (!providedUserId) {
      const fetchUserId = async () => {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
      };
      fetchUserId();
    }
  }, [providedUserId]);

  const displayAvatarUrl = optimisticAvatarUrl || currentAvatarUrl;
  const isReady = userId !== null;

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (data: {
      fileName: string;
      fileSize: number;
      mimeType: "image/jpeg" | "image/png" | "image/webp";
      fileData: string;
    }) => {
      const result = await uploadAvatar(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to upload avatar");
      }
      return result.data;
    },
    onSuccess: (data) => {
      if (data) {
        setOptimisticAvatarUrl(data.avatarUrl);
        setIsUploading(false);
        toast.success("Avatar uploaded successfully!");
        onUploadComplete?.(data.avatarUrl);

        // Invalidate profile queries
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
    onError: (error: Error) => {
      setIsUploading(false);
      setOptimisticAvatarUrl(null);
      toast.error(error.message || "Failed to upload avatar");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const result = await deleteAvatar();
      if (!result.success) {
        throw new Error(result.error || "Failed to delete avatar");
      }
      return result;
    },
    onSuccess: () => {
      setOptimisticAvatarUrl(null);
      toast.success("Avatar removed successfully!");
      onDeleteComplete?.();

      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete avatar");
    },
  });

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: disabled || isUploading || !isReady,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          errors.forEach((error) => {
            if (error.code === "file-too-large") {
              toast.error("File size must be less than 2MB");
            } else if (error.code === "file-invalid-type") {
              toast.error("File must be JPEG, PNG, or WebP");
            } else {
              toast.error(error.message);
            }
          });
        });
        return;
      }

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Client-side validation
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 2MB");
        return;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error("File must be JPEG, PNG, or WebP");
        return;
      }

      setIsUploading(true);

      // Create optimistic preview
      const previewUrl = URL.createObjectURL(file);
      setOptimisticAvatarUrl(previewUrl);

      try {
        // Convert file to base64
        const base64Data = await fileToBase64(file);

        // Prepare upload data
        // Type assertion is safe because we validated file.type above
        const uploadData: {
          fileName: string;
          fileSize: number;
          mimeType: "image/jpeg" | "image/png" | "image/webp";
          fileData: string;
        } = {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type as "image/jpeg" | "image/png" | "image/webp",
          fileData: base64Data,
        };

        await uploadMutation.mutateAsync(uploadData);

        // Clean up preview URL
        URL.revokeObjectURL(previewUrl);
      } catch (error) {
        // Error handling is done in mutation onError
        URL.revokeObjectURL(previewUrl);
      }
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
    setShowDeleteDialog(false);
  };

  const handleClick = () => {
    if (disabled || isUploading || !isReady) return;
    fileInputRef.current?.click();
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer",
          (disabled || isUploading) && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={handleClick}
      >
        <input {...getInputProps()} ref={fileInputRef} className="hidden" />

        <Avatar
          className={cn(
            sizeClasses[size],
            "border-2 border-border/40 transition-all duration-300",
            isDragActive && "ring-2 ring-accent ring-offset-2",
            !disabled && "hover:border-accent/60"
          )}
        >
          <AvatarImage
            src={displayAvatarUrl || undefined}
            alt={name}
            className="object-cover"
          />
          <AvatarFallback className="text-title font-serif italic">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Upload overlay */}
        {!disabled && (
          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isUploading ? (
              <Icon
                name="CircleNotch"
                size={24}
                className="animate-spin text-white"
              />
            ) : (
              <Icon name="Camera" size={24} className="text-white" />
            )}
          </div>
        )}

        {/* Delete button (only show if avatar exists and not uploading) */}
        {!disabled && displayAvatarUrl && !isUploading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 z-10"
            aria-label="Delete avatar"
          >
            <Icon name="X" size={12} />
          </button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Avatar?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your avatar image. You can upload a new one
              anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

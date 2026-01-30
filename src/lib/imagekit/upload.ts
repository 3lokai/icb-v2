// src/lib/imagekit/upload.ts
// ImageKit REST API integration for file uploads and deletions

type ImageKitUploadResponse = {
  fileId: string;
  url: string;
  width: number;
  height: number;
  size: number;
};

type ImageKitError = {
  message: string;
  help?: string;
};

/**
 * Upload a file to ImageKit
 * @param file - File object or Buffer to upload
 * @param userId - User ID for folder organization
 * @param fileName - Optional file name (if not provided, will be generated)
 * @param folder - Optional folder path (defaults to "station-photos/{userId}")
 * @returns ImageKit file metadata
 */
export async function uploadToImageKit(
  file: File | Buffer,
  userId: string,
  fileName?: string,
  folder?: string
): Promise<ImageKitUploadResponse> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    throw new Error(
      "ImageKit credentials not configured. Please set IMAGEKIT_PRIVATE_KEY and NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY environment variables."
    );
  }

  // Convert file to base64
  let base64File: string;
  let mimeType: string;
  let originalFileName: string;

  if (file instanceof File) {
    base64File = await fileToBase64(file);
    mimeType = file.type;
    originalFileName = file.name;
  } else {
    // Buffer - assume JPEG if no mime type provided
    base64File = file.toString("base64");
    mimeType = "image/jpeg";
    originalFileName = fileName || "image.jpg";
  }

  // Generate unique filename to avoid collisions
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = originalFileName.split(".").pop() || "jpg";
  const finalFileName =
    fileName || `${timestamp}-${randomString}.${fileExtension}`;
  const folderPath = folder || `station-photos/${userId}`;

  // Create authentication token
  // ImageKit server-side upload uses private key in Authorization header
  const token = Buffer.from(`${privateKey}:`).toString("base64");

  // Prepare form data
  // Note: ImageKit expects the file as base64 string in the 'file' field
  const formData = new FormData();
  formData.append("file", base64File);
  formData.append("fileName", finalFileName);
  formData.append("folder", folderPath);
  formData.append("useUniqueFileName", "true");
  formData.append("isPrivateFile", "false");

  try {
    const response = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = (await response.json()) as ImageKitError;
      throw new Error(
        errorData.message || `ImageKit upload failed: ${response.statusText}`
      );
    }

    const data = (await response.json()) as {
      fileId: string;
      url: string;
      width: number;
      height: number;
      size: number;
    };

    return {
      fileId: data.fileId,
      url: data.url,
      width: data.width,
      height: data.height,
      size: data.size,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to upload to ImageKit: ${error.message}`);
    }
    throw new Error("Failed to upload to ImageKit: Unknown error");
  }
}

/**
 * Delete a file from ImageKit
 * @param fileId - ImageKit file ID
 */
export async function deleteFromImageKit(fileId: string): Promise<void> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error(
      "ImageKit credentials not configured. Please set IMAGEKIT_PRIVATE_KEY environment variable."
    );
  }

  // Create authentication token
  const token = Buffer.from(`${privateKey}:`).toString("base64");

  try {
    const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ImageKitError;
      throw new Error(
        errorData.message || `ImageKit deletion failed: ${response.statusText}`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete from ImageKit: ${error.message}`);
    }
    throw new Error("Failed to delete from ImageKit: Unknown error");
  }
}

/**
 * Extract file ID from ImageKit URL
 * ImageKit URLs typically contain the file ID in the path
 * Format: https://ik.imagekit.io/{imagekitId}/{path}/{fileId}
 * @param imageUrl - Full ImageKit URL
 * @returns File ID or null if not found
 */
export function extractFileIdFromUrl(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/").filter(Boolean);
    // The file ID is typically the last part of the path (before any query params)
    // Or it might be in the filename
    const lastPart = pathParts[pathParts.length - 1];

    // ImageKit file IDs are typically UUIDs or alphanumeric strings
    // If the last part looks like a file ID (no extension or has extension), use it
    // We'll need to query ImageKit API to get the actual fileId from the URL
    // For now, return null and handle in server action by querying ImageKit
    return null;
  } catch {
    return null;
  }
}

/**
 * Convert File to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

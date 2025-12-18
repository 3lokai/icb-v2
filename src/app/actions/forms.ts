"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

type FormType = "roaster_submission" | "suggestion" | "professional_inquiry";

// Zod schemas for form validation
const roasterSubmissionSchema = z.object({
  roasterName: z
    .string()
    .min(1, "Roaster name is required")
    .max(200, "Roaster name must be less than 200 characters")
    .trim(),
  website: z
    .string()
    .max(500, "Website URL must be less than 500 characters")
    .trim()
    .optional(),
  location: z
    .string()
    .max(200, "Location must be less than 200 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .trim()
    .optional(),
  yourName: z
    .string()
    .min(1, "Your name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  yourEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  website_url: z.string().optional(), // Honeypot field
});

const suggestionSchema = z.object({
  suggestionType: z
    .string()
    .min(1, "Suggestion type is required")
    .max(100, "Suggestion type must be less than 100 characters")
    .trim(),
  suggestionDetails: z
    .string()
    .min(1, "Suggestion details are required")
    .max(2000, "Suggestion details must be less than 2000 characters")
    .trim(),
  suggesterName: z
    .string()
    .min(1, "Your name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  suggesterEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  website: z.string().optional(), // Honeypot field
});

const professionalInquirySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  organization: z
    .string()
    .max(200, "Organization name must be less than 200 characters")
    .trim()
    .optional(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  collaborationType: z
    .string()
    .min(1, "Collaboration type is required")
    .max(100, "Collaboration type must be less than 100 characters")
    .trim(),
  message: z
    .string()
    .min(1, "Message is required")
    .max(5000, "Message must be less than 5000 characters")
    .trim(),
  website: z.string().optional(), // Honeypot field
});

type SubmissionData = {
  form_type: FormType;
  email: string | null;
  data: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  user_id: string | null;
  status: "pending";
};

async function getRequestMetadata() {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ipAddress = forwardedFor
    ? forwardedFor.split(",")[0]?.trim() || null
    : headersList.get("x-real-ip");
  const userAgent = headersList.get("user-agent");

  return {
    ipAddress: ipAddress || null,
    userAgent: userAgent || null,
  };
}

function processRoasterSubmission(
  formData: FormData,
  metadata: { ipAddress: string | null; userAgent: string | null },
  userId: string | null
): { success: false; error: string } | { success: true; data: SubmissionData } {
  const rawData = {
    roasterName: formData.get("roasterName") as string,
    website: formData.get("website") as string,
    location: formData.get("location") as string,
    description: formData.get("description") as string,
    yourName: formData.get("yourName") as string,
    yourEmail: formData.get("yourEmail") as string,
    website_url: formData.get("website_url") as string, // Honeypot field
  };

  // Check honeypot - if filled, it's a bot
  if (rawData.website_url) {
    // Silently reject - don't let bots know they were caught
    return {
      success: true,
      data: {
        form_type: "roaster_submission",
        email: "",
        data: {},
        ip_address: metadata.ipAddress,
        user_agent: metadata.userAgent,
        user_id: userId,
        status: "pending",
      },
    };
  }

  // Validate with Zod
  const validationResult = roasterSubmissionSchema.safeParse(rawData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    return {
      success: false,
      error:
        firstError?.message || "Validation failed. Please check your input.",
    };
  }

  const validatedData = validationResult.data;

  return {
    success: true,
    data: {
      form_type: "roaster_submission",
      email: validatedData.yourEmail,
      data: {
        roasterName: validatedData.roasterName,
        website: validatedData.website || "",
        location: validatedData.location || "",
        description: validatedData.description || "",
        yourName: validatedData.yourName,
        yourEmail: validatedData.yourEmail,
      },
      ip_address: metadata.ipAddress,
      user_agent: metadata.userAgent,
      user_id: userId,
      status: "pending",
    },
  };
}

function processSuggestion(
  formData: FormData,
  metadata: { ipAddress: string | null; userAgent: string | null },
  userId: string | null
): { success: false; error: string } | { success: true; data: SubmissionData } {
  const rawData = {
    suggestionType: formData.get("suggestionType") as string,
    suggestionDetails: formData.get("suggestionDetails") as string,
    suggesterName: formData.get("suggesterName") as string,
    suggesterEmail: formData.get("suggesterEmail") as string,
    website: formData.get("website") as string, // Honeypot field
  };

  // Check honeypot - if filled, it's a bot
  if (rawData.website) {
    // Silently reject - don't let bots know they were caught
    return {
      success: true,
      data: {
        form_type: "suggestion",
        email: "",
        data: {},
        ip_address: metadata.ipAddress,
        user_agent: metadata.userAgent,
        user_id: userId,
        status: "pending",
      },
    };
  }

  // Validate with Zod
  const validationResult = suggestionSchema.safeParse(rawData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    return {
      success: false,
      error:
        firstError?.message || "Validation failed. Please check your input.",
    };
  }

  const validatedData = validationResult.data;

  return {
    success: true,
    data: {
      form_type: "suggestion",
      email: validatedData.suggesterEmail,
      data: {
        suggestionType: validatedData.suggestionType,
        suggestionDetails: validatedData.suggestionDetails,
        suggesterName: validatedData.suggesterName,
        suggesterEmail: validatedData.suggesterEmail,
      },
      ip_address: metadata.ipAddress,
      user_agent: metadata.userAgent,
      user_id: userId,
      status: "pending",
    },
  };
}

function processProfessionalInquiry(
  formData: FormData,
  metadata: { ipAddress: string | null; userAgent: string | null },
  userId: string | null
): { success: false; error: string } | { success: true; data: SubmissionData } {
  const rawData = {
    name: formData.get("name") as string,
    organization: formData.get("organization") as string,
    email: formData.get("email") as string,
    collaborationType: formData.get("collaborationType") as string,
    message: formData.get("message") as string,
    website: formData.get("website") as string, // Honeypot field
  };

  // Check honeypot - if filled, it's a bot
  if (rawData.website) {
    // Silently reject - don't let bots know they were caught
    return {
      success: true,
      data: {
        form_type: "professional_inquiry",
        email: "",
        data: {},
        ip_address: metadata.ipAddress,
        user_agent: metadata.userAgent,
        user_id: userId,
        status: "pending",
      },
    };
  }

  // Validate with Zod
  const validationResult = professionalInquirySchema.safeParse(rawData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    return {
      success: false,
      error:
        firstError?.message || "Validation failed. Please check your input.",
    };
  }

  const validatedData = validationResult.data;

  return {
    success: true,
    data: {
      form_type: "professional_inquiry",
      email: validatedData.email,
      data: {
        name: validatedData.name,
        organization: validatedData.organization || "",
        email: validatedData.email,
        collaborationType: validatedData.collaborationType,
        message: validatedData.message,
      },
      ip_address: metadata.ipAddress,
      user_agent: metadata.userAgent,
      user_id: userId,
      status: "pending",
    },
  };
}

type FormProcessor = (
  formData: FormData,
  metadata: { ipAddress: string | null; userAgent: string | null },
  userId: string | null
) =>
  | { success: false; error: string }
  | { success: true; data: SubmissionData };

const formProcessors: Record<FormType, FormProcessor> = {
  roaster_submission: processRoasterSubmission,
  suggestion: processSuggestion,
  professional_inquiry: processProfessionalInquiry,
};

export async function submitForm(
  formType: string,
  formData: FormData
): Promise<{ success: boolean; error?: string; id?: string }> {
  const typedFormType = formType as FormType;
  const processor = formProcessors[typedFormType];

  if (!processor) {
    return {
      success: false,
      error: "Invalid form type.",
    };
  }

  try {
    // Get current user if authenticated (using regular client)
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    // Use service role client to bypass RLS for server-side form submissions
    const supabase = await createServiceRoleClient();
    const metadata: { ipAddress: string | null; userAgent: string | null } =
      await getRequestMetadata();

    const result = processor(formData, metadata, user?.id || null);

    if (!result.success) {
      return result;
    }

    const { data: insertedData, error } = await supabase
      .from("form_submissions")
      .insert(result.data)
      .select("id")
      .single();

    if (error) {
      console.error("Form submission error:", error);
      return {
        success: false,
        error: "Failed to submit form. Please try again later.",
      };
    }

    return {
      success: true,
      id: insertedData.id,
    };
  } catch (error) {
    console.error("Form submission error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

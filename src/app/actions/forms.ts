"use server";

import { headers } from "next/headers";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

type FormType = "roaster_submission" | "suggestion" | "professional_inquiry";

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
  const roasterName = formData.get("roasterName") as string;
  const website = formData.get("website") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const yourName = formData.get("yourName") as string;
  const yourEmail = formData.get("yourEmail") as string;

  if (!(roasterName && yourName && yourEmail)) {
    return {
      success: false,
      error: "Please fill in all required fields.",
    };
  }

  return {
    success: true,
    data: {
      form_type: "roaster_submission",
      email: yourEmail.toLowerCase().trim(),
      data: {
        roasterName,
        website: website || "",
        location: location || "",
        description: description || "",
        yourName,
        yourEmail: yourEmail.toLowerCase().trim(),
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
  const suggestionType = formData.get("suggestionType") as string;
  const suggestionDetails = formData.get("suggestionDetails") as string;
  const suggesterName = formData.get("suggesterName") as string;
  const suggesterEmail = formData.get("suggesterEmail") as string;

  const hasAllFields =
    suggestionType && suggestionDetails && suggesterName && suggesterEmail;

  if (!hasAllFields) {
    return {
      success: false,
      error: "Please fill in all required fields.",
    };
  }

  return {
    success: true,
    data: {
      form_type: "suggestion",
      email: suggesterEmail.toLowerCase().trim(),
      data: {
        suggestionType,
        suggestionDetails,
        suggesterName,
        suggesterEmail: suggesterEmail.toLowerCase().trim(),
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
  const name = formData.get("name") as string;
  const organization = formData.get("organization") as string;
  const email = formData.get("email") as string;
  const collaborationType = formData.get("collaborationType") as string;
  const message = formData.get("message") as string;

  const hasAllFields = name && email && collaborationType && message;

  if (!hasAllFields) {
    return {
      success: false,
      error: "Please fill in all required fields.",
    };
  }

  return {
    success: true,
    data: {
      form_type: "professional_inquiry",
      email: email.toLowerCase().trim(),
      data: {
        name,
        organization: organization || "",
        email: email.toLowerCase().trim(),
        collaborationType,
        message,
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

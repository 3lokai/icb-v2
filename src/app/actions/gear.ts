"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";
import {
  addExistingGearSchema,
  createNewGearSchema,
  removeGearSchema,
  type AddExistingGearFormData,
  type CreateNewGearFormData,
  type RemoveGearFormData,
} from "@/lib/validations/gear";

export type GearCatalogItem = {
  id: string;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  usage_count: number;
  is_verified: boolean;
};

type ActionResult<T = void> = {
  success: boolean;
  error?: string;
  data?: T;
};

/**
 * Search gear catalog
 */
export async function searchGearCatalog(
  query?: string,
  category?: "grinder" | "brewer" | "accessory"
): Promise<ActionResult<GearCatalogItem[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("search_gear_catalog", {
      p_search_query: query || null,
      p_category: category || null,
      p_limit: 50,
    });

    if (error) {
      console.error("❌ Gear search RPC error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? `${error.message}${error.details ? ` (${error.details})` : ""}${error.hint ? ` - ${error.hint}` : ""}`
            : "Failed to search gear catalog. Please try again.",
      };
    }

    return {
      success: true,
      data: (data || []) as GearCatalogItem[],
    };
  } catch (error) {
    console.error("Gear search error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Add existing gear from catalog to user collection
 */
export async function addExistingGear(
  data: AddExistingGearFormData
): Promise<ActionResult<{ userGearId: string }>> {
  try {
    const validationResult = addExistingGearSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid input",
      };
    }

    const validatedData = validationResult.data;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to add gear.",
      };
    }

    const supabase = await createClient();

    const { data: result, error } = await supabase.rpc("add_user_gear", {
      p_user_id: currentUser.id,
      p_gear_id: validatedData.gearId,
      p_notes: validatedData.notes || null,
    });

    if (error) {
      console.error("❌ Add gear RPC error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      // Handle specific error messages from RPC
      const errorMessage =
        error.message.includes("already have this item") ||
        error.message.includes("unique constraint")
          ? "You already have this item in your collection"
          : process.env.NODE_ENV === "development"
            ? `${error.message}${error.details ? ` (${error.details})` : ""}${error.hint ? ` - ${error.hint}` : ""}`
            : "Failed to add gear. Please try again.";

      return {
        success: false,
        error: errorMessage,
      };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { userGearId: result as string },
    };
  } catch (error) {
    console.error("Add gear error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Create new gear item and add to user collection
 */
export async function createAndAddGear(
  data: CreateNewGearFormData
): Promise<ActionResult<{ gearId: string; userGearId: string }>> {
  try {
    const validationResult = createNewGearSchema.safeParse(data);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.issues
        .map((e: { message: string }) => e.message)
        .join(", ");
      return {
        success: false,
        error: fieldErrors || "Invalid input",
      };
    }

    const validatedData = validationResult.data;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to create gear.",
      };
    }

    const supabase = await createClient();

    // Step 1: Create gear item in catalog
    const { data: gearId, error: createError } = await supabase.rpc(
      "create_gear_item",
      {
        p_name: validatedData.name,
        p_category: validatedData.category,
        p_brand: validatedData.brand || null,
        p_model: validatedData.model || null,
        p_created_by: currentUser.id,
      }
    );

    if (createError) {
      console.error("❌ Create gear RPC error:", {
        message: createError.message,
        code: createError.code,
        details: createError.details,
        hint: createError.hint,
      });

      const errorMessage =
        createError.message.includes("already exists") ||
        createError.message.includes("unique constraint")
          ? "A gear item with this name already exists"
          : process.env.NODE_ENV === "development"
            ? `${createError.message}${createError.details ? ` (${createError.details})` : ""}${createError.hint ? ` - ${createError.hint}` : ""}`
            : "Failed to create gear item. Please try again.";

      return {
        success: false,
        error: errorMessage,
      };
    }

    // Step 2: Add to user collection
    const { data: userGearId, error: addError } = await supabase.rpc(
      "add_user_gear",
      {
        p_user_id: currentUser.id,
        p_gear_id: gearId as string,
        p_notes: null,
      }
    );

    if (addError) {
      console.error("❌ Add gear after create RPC error:", {
        message: addError.message,
        code: addError.code,
      });

      // Gear was created but failed to add - this shouldn't happen but handle gracefully
      return {
        success: false,
        error:
          "Gear created but failed to add to your collection. Please try adding it manually.",
      };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        gearId: gearId as string,
        userGearId: userGearId as string,
      },
    };
  } catch (error) {
    console.error("Create and add gear error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Remove gear from user collection
 */
export async function removeGear(
  data: RemoveGearFormData
): Promise<ActionResult> {
  try {
    const validationResult = removeGearSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid input",
      };
    }

    const validatedData = validationResult.data;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to remove gear.",
      };
    }

    const supabase = await createClient();

    const { error } = await supabase.rpc("remove_user_gear", {
      p_user_gear_id: validatedData.userGearId,
      p_user_id: currentUser.id,
    });

    if (error) {
      console.error("❌ Remove gear RPC error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? `${error.message}${error.details ? ` (${error.details})` : ""}${error.hint ? ` - ${error.hint}` : ""}`
            : "Failed to remove gear. Please try again.",
      };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Remove gear error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

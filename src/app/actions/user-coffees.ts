"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";
import {
  addUserCoffeeSchema,
  updateUserCoffeeSchema,
  removeUserCoffeeSchema,
  type AddUserCoffeeFormData,
  type UpdateUserCoffeeFormData,
  type RemoveUserCoffeeFormData,
} from "@/lib/validations/user-coffees";

type ActionResult<T = void> = {
  success: boolean;
  error?: string;
  data?: T;
};

/**
 * Add a coffee to the current user's tried/tasted list.
 */
export async function addUserCoffee(
  data: AddUserCoffeeFormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const validationResult = addUserCoffeeSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to add a coffee to your list.",
      };
    }

    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("user_coffees")
      .insert({
        user_id: currentUser.id,
        coffee_id: validationResult.data.coffeeId,
        status: validationResult.data.status ?? "logged",
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return {
          success: false,
          error: "This coffee is already in your list.",
        };
      }
      console.error("addUserCoffee error:", error);
      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Failed to add coffee. Please try again.",
      };
    }

    revalidatePath("/", "layout");
    return { success: true, data: { id: row.id } };
  } catch (e) {
    console.error("addUserCoffee:", e);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Update status and/or photo for a user coffee entry.
 */
export async function updateUserCoffee(
  data: UpdateUserCoffeeFormData
): Promise<ActionResult> {
  try {
    const validationResult = updateUserCoffeeSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to update your list.",
      };
    }

    const { userCoffeeId, status, photo } = validationResult.data;
    const updates: { status?: string; photo?: string | null } = {};
    if (status !== undefined) updates.status = status;
    if (photo !== undefined) updates.photo = photo;

    if (Object.keys(updates).length === 0) {
      return { success: true };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("user_coffees")
      .update(updates)
      .eq("id", userCoffeeId)
      .eq("user_id", currentUser.id);

    if (error) {
      console.error("updateUserCoffee error:", error);
      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Failed to update. Please try again.",
      };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    console.error("updateUserCoffee:", e);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Remove a coffee from the current user's tried/tasted list.
 */
export async function removeUserCoffee(
  data: RemoveUserCoffeeFormData
): Promise<ActionResult> {
  try {
    const validationResult = removeUserCoffeeSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to remove from your list.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("user_coffees")
      .delete()
      .eq("id", validationResult.data.userCoffeeId)
      .eq("user_id", currentUser.id);

    if (error) {
      console.error("removeUserCoffee error:", error);
      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Failed to remove. Please try again.",
      };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    console.error("removeUserCoffee:", e);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

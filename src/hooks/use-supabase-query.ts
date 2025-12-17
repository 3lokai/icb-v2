import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

// Generic hook for Supabase queries
export function useSupabaseQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    retry?: boolean | number;
  }
) {
  return useQuery({
    queryKey,
    queryFn,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes default
    retry: options?.retry ?? 3,
  });
}

// Generic hook for Supabase mutations
export function useSupabaseMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
    invalidateQueries?: string[][];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate related queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
  });
}

// Example: Get all users (if you have a users table)
export function useUsers() {
  return useSupabaseQuery(
    ["users"],
    async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      return data;
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
}

// Example: Create a new user
export function useCreateUser() {
  return useSupabaseMutation(
    async (userData: { email: string; name: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .insert([userData])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    {
      invalidateQueries: [["users"]],
    }
  );
}

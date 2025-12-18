import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/auth-provider";
import { queryKeys } from "@/lib/query-keys";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase-types";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

export function useUserProfile() {
  const { user, isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: [...queryKeys.user.all, "profile"],
    queryFn: async () => {
      if (!user) {
        return null;
      }

      const supabase = createClient();
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        // Profile might not exist yet (new user)
        if (error.code === "PGRST116") {
          return null;
        }
        throw error;
      }

      return profile as UserProfile;
    },
    enabled: !authLoading && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}


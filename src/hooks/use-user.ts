import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/auth-provider";
import { queryKeys } from "@/lib/query-keys";
import { auth } from "@/lib/supabase/auth-helpers";

export function useUser() {
  const { user, isLoading } = useAuth();

  return useQuery({
    queryKey: queryKeys.user.all,
    queryFn: async () => {
      if (user) {
        return user;
      }

      // If no user in context, try to fetch from Supabase
      const { user: authUser, error } = await auth.getUser();
      if (error) {
        throw error;
      }
      return authUser;
    },
    enabled: !isLoading, // Only run when auth is not loading
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry auth queries
  });
}

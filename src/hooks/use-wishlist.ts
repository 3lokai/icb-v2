import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { getMyWishlistCoffeeIds, toggleWishlist } from "@/app/actions/wishlist";
import { useAuth } from "@/components/providers/auth-provider";
import { queryKeys } from "@/lib/query-keys";

/**
 * Current user's wishlist as a Set of coffee IDs, plus an optimistic toggle.
 * One query feeds every heart on the page. Signed-out users get an empty set
 * and a "sign in" toast on toggle (no redirect).
 */
export function useWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: ids } = useQuery({
    queryKey: queryKeys.wishlist.mine,
    queryFn: getMyWishlistCoffeeIds,
    enabled: Boolean(user),
    staleTime: 60 * 1000,
  });

  const wishlistedIds = useMemo(() => new Set(ids ?? []), [ids]);

  const mutation = useMutation({
    mutationFn: (coffeeId: string) => toggleWishlist({ coffeeId }),
    onMutate: async (coffeeId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist.mine });
      const previous =
        queryClient.getQueryData<string[]>(queryKeys.wishlist.mine) ?? [];
      const next = previous.includes(coffeeId)
        ? previous.filter((id) => id !== coffeeId)
        : [...previous, coffeeId];
      queryClient.setQueryData(queryKeys.wishlist.mine, next);
      return { previous };
    },
    onError: (_err, _coffeeId, context) => {
      if (context) {
        queryClient.setQueryData(queryKeys.wishlist.mine, context.previous);
      }
      toast.error("Couldn't update your wishlist. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.mine });
    },
  });

  const toggle = useCallback(
    (coffeeId: string) => {
      if (!user) {
        toast("Sign in to save coffees to your wishlist.", {
          action: {
            label: "Sign in",
            onClick: () => (window.location.href = "/login"),
          },
        });
        return;
      }
      // Ignore rapid re-clicks — prevents a remove racing into a re-insert.
      if (mutation.isPending) return;
      mutation.mutate(coffeeId);
    },
    [user, mutation]
  );

  const isWishlisted = useCallback(
    (coffeeId: string) => wishlistedIds.has(coffeeId),
    [wishlistedIds]
  );

  return { isWishlisted, toggle, isPending: mutation.isPending };
}

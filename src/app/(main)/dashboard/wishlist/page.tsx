import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/data/auth";
import { fetchWishlistCoffeeIds } from "@/lib/data/fetch-wishlist";
import { fetchCoffeesByIds } from "@/lib/data/fetch-coffees";
import { CoffeeGrid } from "@/components/coffees/CoffeeGrid";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/primitives/stack";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Coffees you've saved to try.",
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/auth?mode=sign-in&from=/dashboard/wishlist");
  }

  const coffeeIds = await fetchWishlistCoffeeIds(currentUser.id);
  const coffees = await fetchCoffeesByIds(coffeeIds);

  return (
    <Stack gap="6">
      <h1 className="text-title">My Wishlist</h1>

      {coffees.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-body text-muted-foreground mb-4">
            You haven&apos;t saved any coffees yet. Tap the heart on any coffee
            to add it here.
          </p>
          <Button asChild variant="outline">
            <Link href="/coffees">Browse coffees</Link>
          </Button>
        </div>
      ) : (
        <CoffeeGrid items={coffees} />
      )}
    </Stack>
  );
}

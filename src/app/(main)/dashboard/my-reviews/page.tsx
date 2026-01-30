import { redirect } from "next/navigation";
import { getCurrentUser } from "@/data/auth";
import { getMyReviews } from "@/data/user-dto";
import { MyReviewsClient } from "@/components/dashboard/MyReviewsClient";

export default async function MyReviewsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth?mode=login&from=/dashboard/my-reviews");
  }

  const reviews = await getMyReviews();

  // Server-side logging for debugging
  console.log("[MyReviewsPage] Fetched reviews:", {
    count: reviews.length,
    userId: currentUser.id,
    coffeeReviews: reviews.filter((r) => r.entity_type === "coffee").length,
    roasterReviews: reviews.filter((r) => r.entity_type === "roaster").length,
  });

  return <MyReviewsClient initialReviews={reviews} />;
}

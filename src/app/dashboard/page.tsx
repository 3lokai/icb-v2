import { redirect } from "next/navigation";
import { getCurrentUser } from "@/data/auth";
import {
  getMyProfileDTO,
  getCoffeePreferences,
  getMyReviewStats,
} from "@/data/user-dto";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth?mode=login&from=/dashboard");
  }

  // Fetch data in parallel for better performance
  const [profile, coffeePreferences, reviewStats] = await Promise.all([
    getMyProfileDTO(),
    getCoffeePreferences(),
    getMyReviewStats(),
  ]);

  if (!profile) {
    redirect("/auth/onboarding");
  }

  return (
    <DashboardClient
      initialProfile={profile}
      initialCoffeePreferences={coffeePreferences}
      initialReviewStats={reviewStats}
    />
  );
}

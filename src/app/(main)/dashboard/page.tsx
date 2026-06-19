import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/data/auth";
import {
  getMyProfileDTO,
  getCoffeePreferences,
  getMyReviewStats,
} from "@/data/user-dto";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal coffee dashboard on Indian Coffee Beans.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth?mode=sign-in&from=/dashboard");
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

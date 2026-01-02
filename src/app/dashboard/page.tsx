import { redirect } from "next/navigation";
import { getCurrentUser } from "@/data/auth";
import { getMyProfileDTO, getCoffeePreferences } from "@/data/user-dto";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth?mode=login&from=/dashboard");
  }

  // Fetch data in parallel for better performance
  const [profile, coffeePreferences] = await Promise.all([
    getMyProfileDTO(),
    getCoffeePreferences(),
  ]);

  if (!profile) {
    redirect("/auth/onboarding");
  }

  return (
    <DashboardClient
      initialProfile={profile}
      initialCoffeePreferences={coffeePreferences}
    />
  );
}

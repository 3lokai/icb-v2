import { redirect } from "next/navigation";
import { AuthScreen } from "@/components/layout/auth-screen";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { getCurrentUser } from "@/data/auth";
import { getMyProfileDTO } from "@/data/user-dto";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const currentUser = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!currentUser) {
    redirect("/auth?mode=sign-in&from=/auth/onboarding");
  }

  // Parallelize profile and coffee preferences queries for better performance
  const supabase = await createClient();
  const [profile, coffeePreferencesResult] = await Promise.all([
    getMyProfileDTO(),
    supabase
      .from("user_coffee_preferences")
      .select("*")
      .eq("user_id", currentUser.id)
      .maybeSingle(),
  ]);

  // Check if user has already completed onboarding
  if (profile?.onboarding_completed) {
    redirect("/profile");
  }

  return (
    <AuthScreen
      contentClassName="max-w-2xl"
      image={{
        src: "/images/onboarding_screen.avif",
        alt: "A gooseneck kettle pouring hot water into a Chemex brewer over a paper filter, surrounded by bags of whole beans.",
        label: "First pour",
        caption: "The pour begins. Let's set up your field guide.",
      }}
    >
      <OnboardingWizard
        initialProfile={profile || undefined}
        initialCoffeePreferences={coffeePreferencesResult.data || undefined}
      />
    </AuthScreen>
  );
}

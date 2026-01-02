import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Stack } from "@/components/primitives/stack";
import { Logo } from "@/components/layout/logo";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { getCurrentUser } from "@/data/auth";
import { getMyProfileDTO } from "@/data/user-dto";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const currentUser = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!currentUser) {
    redirect("/auth?mode=login&from=/auth/onboarding");
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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10">
        <Stack gap="8" className="h-full">
          <div className="flex justify-center md:justify-start">
            <Link className="flex items-center" href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-2xl">
              <OnboardingWizard
                initialProfile={profile || undefined}
                initialCoffeePreferences={
                  coffeePreferencesResult.data || undefined
                }
              />
            </div>
          </div>
        </Stack>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          alt="Onboarding screen"
          className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.4] dark:grayscale"
          fill
          priority
          quality={90}
          sizes="50vw"
          src="/images/onboarding_screen.jpg"
        />
        <div className="absolute inset-0 bg-black/20" />
        {/* Magazine noise texture */}
        <div className="absolute inset-0 opacity-[0.2] pointer-events-none mix-blend-overlay">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

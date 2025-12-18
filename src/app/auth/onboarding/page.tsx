import Image from "next/image";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { getCurrentUser } from "@/data/auth";
import { getMyProfileDTO } from "@/data/user-dto";

export default async function OnboardingPage() {
  const currentUser = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!currentUser) {
    redirect("/auth?mode=login&from=/auth/onboarding");
  }

  // Check if user has already completed onboarding
  const profile = await getMyProfileDTO();
  if (profile?.onboarding_completed) {
    redirect("/profile");
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a className="flex items-center" href="/">
            <Logo />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl">
            <OnboardingWizard />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          alt="French press coffee setup with warm natural lighting"
          className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.3] dark:grayscale"
          fill
          priority
          quality={90}
          src="/images/login_screen.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20" />
      </div>
    </div>
  );
}

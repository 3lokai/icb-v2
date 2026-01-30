import { redirect } from "next/navigation";
import { getCurrentUser } from "@/data/auth";
import { getMyProfileDTO } from "@/data/user-dto";
import { PrivacyFormClient } from "@/components/dashboard/PrivacyFormClient";

export default async function PrivacyPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth?mode=login&from=/dashboard/privacy");
  }

  const profile = await getMyProfileDTO();

  if (!profile) {
    redirect("/auth/onboarding");
  }

  return <PrivacyFormClient initialProfile={profile} />;
}

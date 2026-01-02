import { redirect } from "next/navigation";
import { getCurrentUser } from "@/data/auth";
import { getMyProfileDTO } from "@/data/user-dto";
import { ProfileFormClient } from "@/components/dashboard/ProfileFormClient";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth?mode=login&from=/dashboard/profile");
  }

  const profile = await getMyProfileDTO();

  if (!profile) {
    redirect("/auth/onboarding");
  }

  return <ProfileFormClient initialProfile={profile} />;
}

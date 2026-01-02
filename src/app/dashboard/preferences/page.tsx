import { redirect } from "next/navigation";
import { getCurrentUser } from "@/data/auth";
import { getCoffeePreferences } from "@/data/user-dto";
import { PreferencesFormClient } from "@/components/dashboard/PreferencesFormClient";

export default async function PreferencesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth?mode=login&from=/dashboard/preferences");
  }

  const preferences = await getCoffeePreferences();

  return <PreferencesFormClient initialPreferences={preferences} />;
}

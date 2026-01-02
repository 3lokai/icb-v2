import { redirect } from "next/navigation";
import { getCurrentUser } from "@/data/auth";
import { getNotificationPreferences } from "@/data/user-dto";
import { NotificationsFormClient } from "@/components/dashboard/NotificationsFormClient";

export default async function NotificationsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth?mode=login&from=/dashboard/notifications");
  }

  const preferences = await getNotificationPreferences();

  return <NotificationsFormClient initialPreferences={preferences} />;
}

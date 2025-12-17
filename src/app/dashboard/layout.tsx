import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard with protected content",
  openGraph: {
    title: "Dashboard",
    description: "Your personal dashboard with protected content",
    images: [
      {
        url: "/api/og?title=Dashboard&description=Your%20personal%20dashboard%20with%20protected%20content",
        width: 1200,
        height: 630,
        alt: "Dashboard",
      },
    ],
  },
  robots: {
    index: false, // Don't index protected pages
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

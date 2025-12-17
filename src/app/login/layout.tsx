import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account to access the dashboard",
  openGraph: {
    title: "Sign In",
    description: "Sign in to your account to access the dashboard",
    images: [
      {
        url: "/api/og?title=Sign%20In&description=Sign%20in%20to%20your%20account%20to%20access%20the%20dashboard",
        width: 1200,
        height: 630,
        alt: "Sign In",
      },
    ],
  },
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

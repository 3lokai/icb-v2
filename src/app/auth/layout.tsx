import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in or create an account to access your dashboard",
  openGraph: {
    title: "Sign In",
    description: "Sign in or create an account to access your dashboard",
    images: [
      {
        url: "/api/og?title=Sign%20In&description=Sign%20in%20or%20create%20an%20account%20to%20access%20your%20dashboard",
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

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


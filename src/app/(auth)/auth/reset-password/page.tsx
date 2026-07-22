import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthResetPasswordForm } from "@/components/layout/auth-reset-password-form";
import { AuthScreen } from "@/components/layout/auth-screen";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your account",
  openGraph: {
    title: "Reset Password",
    description: "Create a new password for your account",
    images: [
      {
        url: "/api/og?title=Reset%20Password&description=Create%20a%20new%20password%20for%20your%20account",
        width: 1200,
        height: 630,
        alt: "Reset Password",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <AuthScreen
      image={{
        src: "/images/password-screen.avif",
        alt: "Two hands cradling a duck-egg-blue mug of black coffee over an open book.",
        label: "A fresh start",
        caption: "A new password, and you're back to the coffee.",
      }}
    >
      {/* AuthResetPasswordForm reads useSearchParams(); Suspense keeps the page
          statically prerenderable (CSR-bailout boundary). */}
      <Suspense fallback={null}>
        <AuthResetPasswordForm />
      </Suspense>
    </AuthScreen>
  );
}

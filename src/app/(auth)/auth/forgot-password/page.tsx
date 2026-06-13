import type { Metadata } from "next";
import { AuthForgotPasswordForm } from "@/components/layout/auth-forgot-password-form";
import { AuthScreen } from "@/components/layout/auth-screen";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password to access your account",
  openGraph: {
    title: "Forgot Password",
    description: "Reset your password to access your account",
    images: [
      {
        url: "/api/og?title=Forgot%20Password&description=Reset%20your%20password%20to%20access%20your%20account",
        width: 1200,
        height: 630,
        alt: "Forgot Password",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <AuthScreen
      image={{
        src: "/images/password-screen.avif",
        alt: "Two hands cradling a duck-egg-blue mug of black coffee over an open book.",
        label: "A pause",
        caption: "A quiet cup, a turned page. Take your time.",
      }}
    >
      <AuthForgotPasswordForm />
    </AuthScreen>
  );
}

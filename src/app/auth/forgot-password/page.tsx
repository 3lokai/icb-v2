import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Stack } from "@/components/primitives/stack";
import { AuthForgotPasswordForm } from "@/components/layout/auth-forgot-password-form";
import { Logo } from "@/components/layout/logo";

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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10">
        <Stack gap="8" className="h-full">
          <div className="flex justify-center md:justify-start">
            <Link className="flex items-center" href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <AuthForgotPasswordForm />
            </div>
          </div>
        </Stack>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          alt="Forgot password screen"
          className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.4] dark:grayscale"
          fill
          priority
          quality={90}
          sizes="50vw"
          src="/images/password-screen.jpg"
        />
        <div className="absolute inset-0 bg-black/20" />
        {/* Magazine noise texture */}
        <div className="absolute inset-0 opacity-[0.2] pointer-events-none mix-blend-overlay">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Stack } from "@/components/primitives/stack";
import { AuthResetPasswordForm } from "@/components/layout/auth-reset-password-form";
import { Logo } from "@/components/layout/logo";

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
              <AuthResetPasswordForm />
            </div>
          </div>
        </Stack>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          alt="Reset password screen"
          className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.4] dark:grayscale"
          fill
          priority
          quality={90}
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

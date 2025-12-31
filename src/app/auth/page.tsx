import Image from "next/image";
import Link from "next/link";
import { Stack } from "@/components/primitives/stack";
import { AuthForm } from "@/components/layout/auth-form";
import { Logo } from "@/components/layout/logo";

export default async function AuthPage() {
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
              <AuthForm />
            </div>
          </div>
        </Stack>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          alt="Login screen"
          className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.4] dark:grayscale"
          fill
          priority
          quality={90}
          sizes="50vw"
          src="/images/login_screen.jpg"
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

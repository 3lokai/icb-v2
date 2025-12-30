import Image from "next/image";
import Link from "next/link";
import { Stack } from "@/components/primitives/stack";
import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/logo";

type SearchParams = {
  mode?: "login" | "signup";
};

type AuthPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const mode = params.mode === "signup" ? "signup" : "login";

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
              <AuthForm mode={mode} />
            </div>
          </div>
        </Stack>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          alt="French press coffee setup with warm natural lighting"
          className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.4] dark:grayscale"
          fill
          priority
          quality={90}
          src="/images/login_screen.jpg"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>
  );
}

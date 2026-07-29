import { Suspense } from "react";
import { AuthForm } from "@/components/layout/auth-form";
import { AuthScreen } from "@/components/layout/auth-screen";
import { Skeleton } from "@/components/ui/skeleton";
import { Stack } from "@/components/primitives/stack";

function AuthFormFallback() {
  return (
    <Stack gap="4" aria-busy="true" aria-label="Loading sign-in form">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </Stack>
  );
}

export default function AuthPage() {
  return (
    <AuthScreen
      image={{
        src: "/images/login_screen.avif",
        alt: "A glass French press of dark coffee on a wooden table, lit by warm morning light through a window.",
        label: "Morning ritual",
        caption: "The morning press, caught in the first warm light.",
      }}
    >
      {/* AuthForm reads useSearchParams(); Suspense keeps the page statically
          prerenderable (CSR-bailout boundary) instead of erroring the build. */}
      <Suspense fallback={<AuthFormFallback />}>
        <AuthForm />
      </Suspense>
    </AuthScreen>
  );
}

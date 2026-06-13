import Link from "next/link";
import { Decor } from "@/components/primitives/decor";
import { Stack } from "@/components/primitives/stack";
import { AuthImagePanel } from "@/components/layout/auth-image-panel";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

type AuthScreenProps = {
  children: React.ReactNode;
  image: {
    src: string;
    alt: string;
    label: string;
    caption: string;
  };
  /** Form column max width. Defaults to `max-w-xs`; the onboarding wizard widens it. */
  contentClassName?: string;
};

/**
 * AuthScreen — the shared two-column shell behind every auth surface.
 *
 * Consolidates the markup that was copy-pasted across sign-in, forgot-password,
 * reset-password, and onboarding. The form column sits on warm paper with the
 * brand's native `<Decor texture="grain">` film grain (used in the context it
 * actually reads in); the image column is the editorial plate.
 *
 * A quiet field-guide line anchors the bottom of the form column so the
 * vertical rhythm reads as a designed spread rather than a centred form.
 */
export function AuthScreen({
  children,
  image,
  contentClassName,
}: AuthScreenProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative flex flex-col overflow-hidden p-6 md:p-10">
        <Decor texture="grain" />
        <Stack gap="8" className="relative h-full">
          <div className="flex justify-center md:justify-start">
            <Link className="flex items-center" href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className={cn("w-full", contentClassName ?? "max-w-xs")}>
              {children}
            </div>
          </div>
          <p className="hidden text-balance text-caption md:block">
            An editorial field guide to Indian specialty coffee.
          </p>
        </Stack>
      </div>
      <AuthImagePanel {...image} priority />
    </div>
  );
}

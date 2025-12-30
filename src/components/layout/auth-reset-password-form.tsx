"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/client";

type AuthResetPasswordFormProps = {
  className?: string;
} & Omit<React.ComponentProps<"form">, "onSubmit">;

export function AuthResetPasswordForm({
  className,
  ...props
}: AuthResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const initializeRecovery = async () => {
      // Check for code parameter (PKCE flow)
      const code = searchParams.get("code");
      const type = searchParams.get("type");

      if (code && type === "recovery") {
        // Exchange code for session
        const supabase = createClient();
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          setError("Invalid or expired reset link. Please request a new one.");
          setIsChecking(false);
          return;
        }

        // Code exchanged successfully, user is now in recovery mode
        setIsRecoveryMode(true);
        setIsChecking(false);
        return;
      }

      // Listen for PASSWORD_RECOVERY event
      const {
        data: { subscription: authSubscription },
      } = auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsRecoveryMode(true);
          setIsChecking(false);
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          // User is authenticated, check if they're in recovery mode
          if (session?.user) {
            setIsRecoveryMode(true);
          }
          setIsChecking(false);
        } else {
          setIsChecking(false);
        }
      });

      subscription = authSubscription;

      // Check current session to see if user is already in recovery mode
      const { session } = await auth.getSession();
      if (session?.user) {
        // User might already be authenticated via recovery link
        setIsRecoveryMode(true);
      }
      setIsChecking(false);
    };

    initializeRecovery();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await auth.updateUser({ password });

      if (updateError) {
        setError(
          updateError.message ||
            "Failed to reset password. The link may have expired. Please request a new one."
        );
        setIsLoading(false);
        return;
      }

      // Success - redirect to login
      router.push("/auth?mode=login&reset=success");
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setError(null);
  };

  if (isChecking) {
    return (
      <div className={cn(className)}>
        <Stack gap="6">
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-title font-serif tracking-tight">
                Verifying reset link
              </h1>
              <p className="text-muted-foreground text-caption text-balance">
                Please wait while we verify your password reset link...
              </p>
            </div>
          </FieldGroup>
        </Stack>
      </div>
    );
  }

  if (!isRecoveryMode) {
    return (
      <div className={cn(className)}>
        <Stack gap="6">
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-title font-serif tracking-tight">
                Invalid or expired link
              </h1>
              <p className="text-muted-foreground text-caption text-balance">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>
            </div>

            <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/20 p-3 text-caption">
              Password reset links expire after a certain time for security
              reasons. Please request a new password reset link.
            </div>

            <Field>
              <Button
                type="button"
                onClick={() => router.push("/auth/forgot-password")}
                className="w-full"
              >
                Request new reset link
              </Button>
            </Field>

            <Field>
              <FieldDescription className="text-center">
                <Link
                  href="/auth?mode=login"
                  className="underline underline-offset-4 hover:no-underline"
                >
                  Back to login
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </Stack>
      </div>
    );
  }

  return (
    <form className={cn(className)} onSubmit={handleSubmit} {...props}>
      <Stack gap="6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-title font-bold">Create new password</h1>
            <p className="text-muted-foreground text-caption text-balance">
              Enter your new password below
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/20 p-3 text-caption">
              {error}
            </div>
          )}

          <Stack gap="4">
            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm New Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              <FieldDescription>
                Please confirm your new password.
              </FieldDescription>
            </Field>

            <Field>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Resetting password..." : "Reset password"}
              </Button>
            </Field>
          </Stack>

          <Field>
            <FieldDescription className="text-center">
              <Link
                href="/auth?mode=login"
                className="underline underline-offset-4 hover:no-underline"
              >
                Back to login
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </Stack>
    </form>
  );
}

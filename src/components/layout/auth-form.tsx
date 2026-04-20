"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { capture, posthog } from "@/lib/posthog";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { sendWelcomeEmailAction } from "@/app/actions/welcome-email";
import { syncUserToConvertKit } from "@/app/actions/newsletter";

type AuthFormProps = {
  className?: string;
} & React.ComponentProps<"form">;

export function AuthForm({ className, ...props }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp, signInWithOAuth } = useAuth();
  const mode = searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";
  const fromRaw = searchParams.get("from");
  const from = fromRaw != null && fromRaw.trim() !== "" ? fromRaw.trim() : null;

  // Post-auth destination: explicit `from`, otherwise homepage
  const returnTo = from ?? "/";
  const isSignUpMode = mode === "sign-up";
  const oauthAction = isSignUpMode ? "Sign up" : "Sign in";
  const emailAction = isSignUpMode ? "Create account" : "Sign in";

  const buildAuthUrl = (newMode: "sign-in" | "sign-up") =>
    `/auth?mode=${newMode}${from ? `&from=${encodeURIComponent(from)}` : ""}`;

  // Get initial error from URL params
  const getInitialError = () => {
    const errorParam = searchParams.get("error");
    if (errorParam === "callback_failed") {
      return "Authentication failed. Please try again.";
    } else if (errorParam === "no_code") {
      return "No authentication code received. Please try again.";
    } else if (errorParam === "oauth_failed") {
      return "OAuth authentication failed. Please try again.";
    } else if (errorParam === "account_creation_failed") {
      return "Account creation encountered an issue. You may already have an account - please try signing in, or contact support if the problem persists.";
    }
    return null;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(getInitialError);
  const [errorType, setErrorType] = useState<"generic" | "already-registered">(
    "generic"
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError(null);
    setErrorType("generic");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setErrorType("generic");
    setIsLoading(true);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }

      // Validate password length
      if (!formData.password || formData.password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }

      if (!isSignUpMode) {
        const { data: signInData, error: signInError } = await signIn(
          formData.email.trim(),
          formData.password
        );

        if (signInError) {
          setError("Invalid email or password");
          return;
        }

        posthog.identify(signInData?.user?.id ?? formData.email.trim(), {
          email: formData.email.trim(),
        });
        capture("user_signed_in", { method: "email" });
        router.push(returnTo);
        const pathOnly = (() => {
          try {
            if (/^https?:\/\//i.test(returnTo)) {
              return new URL(returnTo).pathname || "/";
            }
          } catch {
            // ignore invalid URL
          }
          return returnTo.split(/[?#]/)[0] || "/";
        })();
        if (pathOnly === "/") {
          router.refresh();
        }
        return;
      }

      const { data: signUpData, error: signUpError } = await signUp(
        formData.email.trim(),
        formData.password
      );

      if (signUpError) {
        const lowerError = signUpError.message?.toLowerCase() ?? "";
        if (
          lowerError.includes("already registered") ||
          lowerError.includes("user already exists")
        ) {
          setErrorType("already-registered");
          setError("An account with this email already exists.");
        } else {
          setError(
            signUpError.message || "Failed to create account. Please try again."
          );
        }
        return;
      }

      // Track sign-up event
      posthog.identify(signUpData?.user?.id || formData.email.trim(), {
        email: formData.email.trim(),
      });
      capture("user_signed_up", { method: "email" });

      // Success - send welcome email and sync to ConvertKit (fire and forget)
      if (signUpData?.user) {
        const userName =
          signUpData.user.user_metadata?.full_name ||
          signUpData.user.user_metadata?.name ||
          null;
        sendWelcomeEmailAction(
          signUpData.user.email || formData.email.trim(),
          userName
        ).catch((err) => {
          console.error("Failed to send welcome email:", err);
        });

        // Sync to ConvertKit if user has ID
        if (signUpData.user.id) {
          syncUserToConvertKit(signUpData.user.id).catch((err) => {
            console.error("Failed to sync user to ConvertKit:", err);
          });
        }
      }

      // New users should complete onboarding first
      router.push("/auth/onboarding");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    setError(null);
    // Pass the return URL to OAuth so user is redirected back after auth
    const { error } = await signInWithOAuth(provider, returnTo);
    if (error) {
      setError(
        `Failed to ${oauthAction.toLowerCase()} with ${provider}. Please try again.`
      );
      setIsLoading(false);
    }
    // OAuth will redirect, so we don't need to handle success here
  };

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit}
      data-mode={mode}
      {...props}
    >
      <Stack gap="6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-title font-serif tracking-tight">
              {isSignUpMode ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-muted-foreground text-caption text-balance">
              {isSignUpMode
                ? "Enter your details below to create your account"
                : "Sign in to continue"}
            </p>
          </div>

          {error && errorType === "generic" && (
            <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/20 p-3 text-caption">
              {error}
            </div>
          )}
          {error && errorType === "already-registered" && (
            <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/20 p-3 text-caption">
              {error}{" "}
              <Link
                href={buildAuthUrl("sign-in")}
                className="font-medium underline underline-offset-4 hover:no-underline"
              >
                Sign in instead
              </Link>
              .
            </div>
          )}

          <Field>
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={isLoading}
                className="w-full"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {oauthAction} with Google
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuth("facebook")}
                disabled={isLoading}
                className="w-full"
              >
                <svg
                  className="size-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                {oauthAction} with Facebook
              </Button>
            </div>
          </Field>

          <FieldSeparator>Or continue with email</FieldSeparator>

          <Stack gap="4">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                {!isSignUpMode && (
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-caption underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? isSignUpMode
                    ? "Creating account..."
                    : "Signing in..."
                  : emailAction}
              </Button>
            </Field>
          </Stack>

          <div className="text-caption text-center">
            {isSignUpMode
              ? "Already have an account? "
              : "Don't have an account? "}
            <Link
              href={buildAuthUrl(isSignUpMode ? "sign-in" : "sign-up")}
              className="underline underline-offset-4 hover:no-underline"
            >
              {isSignUpMode ? "Sign in" : "Sign up"}
            </Link>
          </div>

          <div className="text-caption text-center mt-1">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline-offset-4 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </FieldGroup>
      </Stack>
    </form>
  );
}

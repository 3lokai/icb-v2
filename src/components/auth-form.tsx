"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode?: AuthMode;
  className?: string;
} & React.ComponentProps<"form">;

export function AuthForm({
  mode: initialMode = "login",
  className,
  ...props
}: AuthFormProps) {
  const router = useRouter();
  const { signIn, signUp, signInWithOAuth } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === "signup") {
        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        // Validate password length
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long");
          setIsLoading(false);
          return;
        }

        const { error: signUpError } = await signUp(
          formData.email,
          formData.password,
          { full_name: formData.name }
        );

        if (signUpError) {
          setError(
            signUpError.message || "Failed to create account. Please try again."
          );
          setIsLoading(false);
          return;
        }

        // Success - redirect to dashboard
        router.push("/dashboard");
      } else {
        const { error: signInError } = await signIn(
          formData.email,
          formData.password
        );

        if (signInError) {
          setError(
            signInError.message ||
              "Invalid email or password. Please try again."
          );
          setIsLoading(false);
          return;
        }

        // Success - redirect to dashboard
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleOAuth = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    setError(null);
    const { error } = await signInWithOAuth(provider);
    if (error) {
      setError(`Failed to sign in with ${provider}. Please try again.`);
      setIsLoading(false);
    }
    // OAuth will redirect, so we don't need to handle success here
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-title font-bold">
            {mode === "login" ? "Login to your account" : "Create your account"}
          </h1>
          <p className="text-muted-foreground text-caption text-balance">
            {mode === "login"
              ? "Enter your email below to login to your account"
              : "Fill in the form below to create your account"}
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/20 p-3 text-caption">
            {error}
          </div>
        )}

        {mode === "signup" && (
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Field>
        )}

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
          {mode === "signup" && (
            <FieldDescription>
              We&apos;ll use this to contact you. We will not share your email
              with anyone else.
            </FieldDescription>
          )}
        </Field>

        <Field>
          {mode === "login" ? (
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <a
                href="#"
                className="ml-auto text-caption underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          ) : (
            <FieldLabel htmlFor="password">Password</FieldLabel>
          )}
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {mode === "signup" && (
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          )}
        </Field>

        {mode === "signup" && (
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <FieldDescription>Please confirm your password.</FieldDescription>
          </Field>
        )}

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

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
              {mode === "login"
                ? "Continue with Google"
                : "Sign up with Google"}
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
              {mode === "login"
                ? "Continue with Facebook"
                : "Sign up with Facebook"}
            </Button>
          </div>
          <FieldDescription className="text-center">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="underline underline-offset-4 hover:no-underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="underline underline-offset-4 hover:no-underline"
                >
                  Sign in
                </button>
              </>
            )}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}

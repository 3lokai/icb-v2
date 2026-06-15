import { AuthForm } from "@/components/layout/auth-form";
import { AuthScreen } from "@/components/layout/auth-screen";

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
      <AuthForm />
    </AuthScreen>
  );
}

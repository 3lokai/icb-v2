import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "../env";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect old auth routes to unified auth page
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  if (request.nextUrl.pathname === "/signup") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Protect routes that require authentication
  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Protect profile routes
  if (request.nextUrl.pathname.startsWith("/profile") && !user) {
    return NextResponse.redirect(
      new URL(
        `/auth?from=${encodeURIComponent(request.nextUrl.pathname)}`,
        request.url
      )
    );
  }

  // Redirect authenticated users away from auth pages (but allow callback and onboarding)
  if (
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup") ||
      (request.nextUrl.pathname.startsWith("/auth") &&
        !request.nextUrl.pathname.startsWith("/auth/callback") &&
        !request.nextUrl.pathname.startsWith("/auth/onboarding"))) &&
    user
  ) {
    // Redirect to original destination or dashboard
    const from = request.nextUrl.searchParams.get("from");
    const redirectTo = from ? decodeURIComponent(from) : "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

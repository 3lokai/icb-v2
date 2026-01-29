"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Icon } from "@/components/common/Icon";
import { Logo } from "@/components/layout/logo";
import { useAuth } from "@/components/providers/auth-provider";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MobileNav,
  MobileNavDropdown,
  MobileNavHeader,
  MobileNavMenu,
  NavBody,
  Navbar,
  NavItems,
} from "@/components/ui/resizable-navbar";
import { useUserProfile } from "@/hooks/use-user-profile";
import { cn } from "@/lib/utils";
import { useSearchContext } from "@/providers/SearchProvider";

// Regex for splitting names into parts (defined at top level for performance)
const NAME_SPLIT_REGEX = /\s+/;

// Base nav items (without Profile - it's added conditionally)
const baseNavItems = [
  {
    name: "Explore",
    link: "/explore",
    children: [
      { name: "Coffees", link: "/coffees" },
      { name: "Roasters", link: "/roasters" },
      { name: "Estates", link: "/estates" },
      { name: "Regions", link: "/regions" },
    ],
  },
  {
    name: "Learn",
    link: "/learn",
    children: [
      { name: "Brew Calculator", link: "/tools/coffee-calculator" },
      { name: "Expert recipes", link: "/tools/expert-recipes" },
      { name: "Glossary", link: "/learn/glossary" },
    ],
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavbarCompact, setIsNavbarCompact] = useState(false);
  const { scrollY } = useScroll();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { openSearch } = useSearchContext();
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    setIsNavbarCompact(latest > 100);
  });

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string | null | undefined) => {
    if (!name) {
      return "U";
    }
    const parts = name.trim().split(NAME_SPLIT_REGEX);
    if (parts.length === 1) {
      return parts[0]?.[0]?.toUpperCase() ?? "U";
    }
    return ((parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "")).toUpperCase();
  };

  const displayName =
    profile?.full_name ?? user?.email?.split("@")[0] ?? "User";
  const avatarUrl = profile?.avatar_url ?? null;
  const initials = getInitials(profile?.full_name ?? user?.email ?? null);

  // Build nav items with conditional Profile link
  type NavItem = {
    name: string;
    link: string;
    children?: { name: string; link: string }[];
  };

  const navItems: NavItem[] = [
    ...baseNavItems,
    {
      name: "Profile",
      link: user
        ? "/profile" // Will redirect to /profile/[username] via page.tsx
        : "/profile/anon", // Direct link to anon profile
    },
  ];

  return (
    <Navbar className="top-0">
      <NavBody>
        {/* Logo */}
        <Link
          aria-label="Indian Coffee Beans"
          className="relative z-20 mr-8 flex items-center gap-2 px-2 py-1"
          href="/"
        >
          <Logo
            aria-label="Indian Coffee Beans"
            className="h-8 w-auto"
            compact={isNavbarCompact}
          />
        </Link>

        {/* Desktop Navigation Items */}
        <NavItems items={navItems} />

        {/* Desktop Actions */}
        <div className="relative z-20 ml-auto flex items-center gap-2">
          <button
            aria-label="Search"
            className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
            onClick={() => openSearch()}
            type="button"
          >
            <Icon color="muted" name="MagnifyingGlass" size={20} />
          </button>
          {(() => {
            if (authLoading || profileLoading) {
              return (
                <div className="size-8 animate-pulse rounded-full bg-muted" />
              );
            }
            if (user) {
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="relative flex size-8 items-center justify-center overflow-hidden rounded-full border-2 border-border transition-colors hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      type="button"
                    >
                      <Avatar className="size-full">
                        <AvatarImage
                          alt={displayName}
                          src={avatarUrl ?? undefined}
                        />
                        <AvatarFallback className="bg-primary-foreground font-medium text-caption">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-body leading-none">
                          {displayName}
                        </p>
                        {user.email && (
                          <p className="text-muted-foreground text-caption leading-none">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link className="flex items-center" href="/dashboard">
                        <Icon
                          className="mr-2"
                          color="muted"
                          name="SquaresFour"
                          size={16}
                        />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        className="flex items-center"
                        href="/dashboard/profile"
                      >
                        <Icon
                          className="mr-2"
                          color="muted"
                          name="User"
                          size={16}
                        />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        className="flex items-center"
                        href="/dashboard/preferences"
                      >
                        <Icon
                          className="mr-2"
                          color="muted"
                          name="Coffee"
                          size={16}
                        />
                        Coffee Preferences
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        className="flex items-center"
                        href="/dashboard/notifications"
                      >
                        <Icon
                          className="mr-2"
                          color="muted"
                          name="Bell"
                          size={16}
                        />
                        Notifications
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        className="flex items-center"
                        href="/dashboard/privacy"
                      >
                        <Icon
                          className="mr-2"
                          color="muted"
                          name="Shield"
                          size={16}
                        />
                        Privacy & Data
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={handleSignOut}
                      variant="destructive"
                    >
                      <Icon
                        className="mr-2"
                        color="destructive"
                        name="SignOut"
                        size={16}
                      />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            return (
              <>
                <Button asChild size="sm" variant="outline">
                  <Link href="/roasters/partner">For Roasters</Link>
                </Button>
                <Button asChild size="sm" variant="default">
                  <Link href="/auth">Login</Link>
                </Button>
              </>
            );
          })()}
          <AnimatedThemeToggler
            className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
          />
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav
        className={cn(
          mobileMenuOpen &&
            "bg-background/95 backdrop-blur-md border border-border/40 shadow-sm rounded-2xl"
        )}
      >
        <MobileNavHeader>
          <Link
            aria-label="Indian Coffee Beans"
            className="flex items-center gap-2"
            href="/"
          >
            <Logo
              aria-label="Indian Coffee Beans"
              className="h-8 w-auto"
              compact={isNavbarCompact}
            />
          </Link>
          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
              onClick={() => openSearch()}
              type="button"
            >
              <Icon color="muted" name="MagnifyingGlass" size={20} />
            </button>
            <AnimatedThemeToggler
              className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
            />
            <button
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
              className="flex items-center justify-center p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
            >
              {mobileMenuOpen ? (
                <Icon className="h-6 w-6" color="muted" name="X" size={24} />
              ) : (
                <Icon className="h-6 w-6" color="muted" name="List" size={24} />
              )}
            </button>
          </div>
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu}>
          {navItems.map((item) =>
            "children" in item && item.children && item.children.length > 0 ? (
              <MobileNavDropdown
                item={item}
                key={item.link}
                onItemClick={closeMobileMenu}
              />
            ) : (
              <Link
                className="font-medium text-muted-foreground text-body transition-colors hover:text-foreground"
                href={item.link}
                key={item.link}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            )
          )}
          {(() => {
            if (authLoading || profileLoading) {
              return (
                <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
              );
            }
            if (user) {
              return (
                <>
                  <div className="flex items-center gap-3 border-border border-t px-4 py-3">
                    <Avatar className="size-10">
                      <AvatarImage
                        alt={displayName}
                        src={avatarUrl ?? undefined}
                      />
                      <AvatarFallback className="bg-primary font-medium text-primary-foreground text-body">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="font-medium text-body">
                        {displayName}
                      </span>
                      {user.email && (
                        <span className="text-muted-foreground text-caption">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    className="font-medium text-muted-foreground text-body transition-colors hover:text-foreground"
                    href="/dashboard"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    className="font-medium text-muted-foreground text-body transition-colors hover:text-foreground"
                    href="/dashboard/profile"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    className="font-medium text-muted-foreground text-body transition-colors hover:text-foreground"
                    href="/dashboard/preferences"
                    onClick={closeMobileMenu}
                  >
                    Coffee Preferences
                  </Link>
                  <Link
                    className="font-medium text-muted-foreground text-body transition-colors hover:text-foreground"
                    href="/dashboard/notifications"
                    onClick={closeMobileMenu}
                  >
                    Notifications
                  </Link>
                  <Link
                    className="font-medium text-muted-foreground text-body transition-colors hover:text-foreground"
                    href="/dashboard/privacy"
                    onClick={closeMobileMenu}
                  >
                    Privacy & Data
                  </Link>
                  <button
                    className="font-medium text-destructive text-body transition-colors hover:text-destructive/80"
                    onClick={() => {
                      closeMobileMenu();
                      handleSignOut();
                    }}
                    type="button"
                  >
                    Log out
                  </button>
                </>
              );
            }
            return (
              <div className="flex flex-col gap-2 w-full">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/roasters/partner" onClick={closeMobileMenu}>
                    For Roasters
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="default">
                  <Link href="/auth" onClick={closeMobileMenu}>
                    Login
                  </Link>
                </Button>
              </div>
            );
          })()}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

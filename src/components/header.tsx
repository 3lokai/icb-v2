"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Logo } from "@/components/logo";
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

const navItems = [
  { name: "Coffees", link: "/coffees" },
  { name: "Roasters", link: "/roasters" },
  {
    name: "Tools",
    link: "/tools/expert-recipes",
    children: [
      { name: "Expert Recipes", link: "/tools/expert-recipes" },
      { name: "Coffee Calculator", link: "/tools/coffee-calculator" },
    ],
  },
  {
    name: "Learn",
    link: "/blog",
    children: [
      { name: "Blog", link: "/blog" },
      { name: "Glossary", link: "/learn/glossary" },
    ],
  },
  {
    name: "Know More",
    link: "/about",
    children: [
      { name: "About", link: "/about" },
      { name: "Contact", link: "/contact" },
    ],
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { openSearch } = useSearchContext();
  const router = useRouter();

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

  return (
    <Navbar className="top-0">
      <NavBody>
        {/* Logo */}
        <Link
          aria-label="Indian Coffee Beans"
          className="relative z-20 mr-8 flex items-center space-x-2 px-2 py-1"
          href="/"
        >
          <Logo aria-label="Indian Coffee Beans" className="h-8 w-auto" />
        </Link>

        {/* Desktop Navigation Items */}
        <NavItems items={navItems} />

        {/* Desktop Actions */}
        <div className="relative z-20 ml-auto flex items-center space-x-2">
          <button
            aria-label="Search"
            className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
            onClick={() => openSearch()}
            type="button"
          >
            <Icon name="MagnifyingGlass" size={20} />
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
                        <AvatarFallback className="bg-primary font-medium text-primary-foreground text-overline">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="font-medium text-caption leading-none">
                          {displayName}
                        </p>
                        {user.email && (
                          <p className="text-muted-foreground text-overline leading-none">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link className="flex items-center" href="/profile">
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
                      <Link className="flex items-center" href="/dashboard">
                        <Icon
                          className="mr-2"
                          color="muted"
                          name="Gear"
                          size={16}
                        />
                        Dashboard
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
              <Button asChild size="sm" variant="outline">
                <Link href="/auth">Login</Link>
              </Button>
            );
          })()}
          <AnimatedThemeToggler
            className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
          />
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <Link
            aria-label="Indian Coffee Beans"
            className="flex items-center space-x-2"
            href="/"
          >
            <Logo aria-label="Indian Coffee Beans" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center space-x-2">
            <button
              aria-label="Search"
              className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
              onClick={() => openSearch()}
              type="button"
            >
              <Icon name="MagnifyingGlass" size={20} />
            </button>
            <AnimatedThemeToggler
              className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
            />
            <button
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
              className="flex items-center justify-center p-2 text-black dark:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
            >
              {mobileMenuOpen ? (
                <Icon className="h-6 w-6" name="X" size={24} />
              ) : (
                <Icon className="h-6 w-6" name="List" size={24} />
              )}
            </button>
          </div>
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu}>
          {navItems.map((item) =>
            item.children && item.children.length > 0 ? (
              <MobileNavDropdown
                item={item}
                key={item.link}
                onItemClick={closeMobileMenu}
              />
            ) : (
              <Link
                className="font-medium text-neutral-600 text-caption transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
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
                      <AvatarFallback className="bg-primary font-medium text-primary-foreground text-caption">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col">
                      <span className="font-medium text-caption">
                        {displayName}
                      </span>
                      {user.email && (
                        <span className="text-muted-foreground text-overline">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    className="font-medium text-neutral-600 text-caption transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                    href="/profile"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    className="font-medium text-neutral-600 text-caption transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                    href="/dashboard"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="font-medium text-destructive text-caption transition-colors hover:text-destructive/80"
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
              <Button asChild className="w-full" variant="outline">
                <Link href="/auth" onClick={closeMobileMenu}>
                  Login
                </Link>
              </Button>
            );
          })()}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

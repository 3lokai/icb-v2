"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import {
  GearSixIcon,
  ListIcon,
  MagnifyingGlassIcon,
  SignOutIcon,
  StarIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MobileNav,
  MobileNavDropdown,
  MobileNavHeader,
  MobileNavMenu,
  mobileNavLink,
  NavBody,
  Navbar,
  NavItems,
} from "@/components/ui/resizable-navbar";
import { useUserProfile } from "@/hooks/use-user-profile";
import { HEADER_NAV, type NavItem, PROFILE_SECTIONS } from "@/lib/navigation";
import { getReviewCount } from "@/lib/reviews/anon-id";
import { cn } from "@/lib/utils";
import { useSearchContext } from "@/providers/SearchProvider";

// Regex for splitting names into parts (defined at top level for performance)
const NAME_SPLIT_REGEX = /\s+/;

function NavLogo({ visible }: { visible?: boolean }) {
  return (
    <Link
      aria-label="Indian Coffee Beans"
      className="relative z-20 mr-8 flex shrink-0 items-center gap-2 px-2 py-1"
      href="/"
    >
      <Logo
        aria-label="Indian Coffee Beans"
        className="h-8 w-auto"
        compact={!!visible}
      />
    </Link>
  );
}

function MobileNavLogo({ visible }: { visible?: boolean }) {
  return (
    <Link
      aria-label="Indian Coffee Beans"
      className="flex items-center gap-2"
      href="/"
    >
      <Logo
        aria-label="Indian Coffee Beans"
        className="h-8 w-auto"
        compact={!!visible}
      />
    </Link>
  );
}

const SEARCH_PLACEHOLDER = "Search coffees, roasters, origins…";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Shortcut hint matches the handler (Meta+K on Mac, Ctrl+K elsewhere).
  // Default to the non-Mac label so SSR/first client render agree; correct after mount.
  const [isMac, setIsMac] = useState(false);
  // Signed-out visitors who have rated keep a way back to their anonymous profile.
  const [hasAnonRatings, setHasAnonRatings] = useState(false);
  useEffect(() => {
    const mac = /mac|iphone|ipad|ipod/i.test(
      navigator.platform || navigator.userAgent
    );
    const rated = (getReviewCount() ?? 0) > 0;
    startTransition(() => {
      setIsMac(mac);
      setHasAnonRatings(rated);
    });
  }, []);
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

  // Profile ▸ lists the profile page's own sections. /profile redirects to the
  // member's page; the username path is used when known so the anchor survives.
  const profileBase = profile?.username
    ? `/profile/${profile.username}`
    : "/profile";
  const profileNav: NavItem = {
    name: "Profile",
    link: profileBase,
    groups: [
      {
        items: PROFILE_SECTIONS.map((section) => ({
          name: section.name,
          link: `${profileBase}${section.link}`,
        })),
      },
    ],
  };

  return (
    <Navbar className="top-0">
      <NavBody>
        <NavLogo />

        {/* Desktop Navigation Items */}
        <NavItems items={HEADER_NAV} />

        {/* Desktop Actions */}
        <div className="relative z-20 ml-auto flex shrink-0 items-center gap-2">
          {/* Reads as a field, opens the command search. Collapses to the icon
              below xl and when the bar compacts on scroll. */}
          <button
            aria-label="Search"
            className="flex h-9 items-center gap-2 rounded-full border border-input bg-background px-3 text-caption transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            onClick={() => openSearch()}
            type="button"
          >
            <Icon color="muted" icon={MagnifyingGlassIcon} size={16} />
            <span className="hidden xl:inline [.navbar-compact_&]:hidden">
              {SEARCH_PLACEHOLDER}
            </span>
            <kbd className="hidden items-center rounded border border-border bg-muted px-1.5 text-micro xl:inline-flex [.navbar-compact_&]:hidden">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
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
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Icon
                          className="mr-2"
                          color="muted"
                          icon={UserIcon}
                          size={16}
                        />
                        Profile
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {profileNav.groups?.[0]?.items.map((section) => (
                          <DropdownMenuItem asChild key={section.link}>
                            <Link href={section.link}>{section.name}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem asChild>
                      <Link className="flex items-center" href="/dashboard">
                        <Icon
                          className="mr-2"
                          color="muted"
                          icon={GearSixIcon}
                          size={16}
                        />
                        Settings
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
                        icon={SignOutIcon}
                        size={16}
                      />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            return (
              <>
                {hasAnonRatings && (
                  <Button asChild size="sm" variant="ghost">
                    <Link href="/profile/anon">Your profile</Link>
                  </Button>
                )}
                <Button asChild size="sm" variant="default">
                  <Link href="/auth">Sign in</Link>
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
          <MobileNavLogo />
          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
              onClick={() => openSearch()}
              type="button"
            >
              <Icon color="muted" icon={MagnifyingGlassIcon} size={20} />
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
                <Icon
                  className="h-6 w-6"
                  color="muted"
                  icon={XIcon}
                  size={24}
                />
              ) : (
                <Icon
                  className="h-6 w-6"
                  color="muted"
                  icon={ListIcon}
                  size={24}
                />
              )}
            </button>
          </div>
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu}>
          <button
            className="flex h-11 w-full items-center gap-2 rounded-full border border-input bg-background px-4 text-left text-caption"
            onClick={() => {
              closeMobileMenu();
              openSearch();
            }}
            type="button"
          >
            <Icon color="muted" icon={MagnifyingGlassIcon} size={16} />
            {SEARCH_PLACEHOLDER}
          </button>
          {HEADER_NAV.map((item) =>
            item.groups ? (
              <MobileNavDropdown
                item={item}
                key={item.name}
                onItemClick={closeMobileMenu}
              />
            ) : (
              <Link
                className={mobileNavLink}
                href={item.link}
                key={item.name}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            )
          )}
          {/* Rating is an action, not a page: it opens search in rating mode. */}
          <button
            className={cn(mobileNavLink, "flex items-center gap-2")}
            onClick={() => {
              closeMobileMenu();
              openSearch(undefined, true);
            }}
            type="button"
          >
            <Icon color="muted" icon={StarIcon} size={16} />
            Rate a coffee
          </button>
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
                  <MobileNavDropdown
                    item={profileNav}
                    onItemClick={closeMobileMenu}
                  />
                  <Link
                    className={mobileNavLink}
                    href="/dashboard"
                    onClick={closeMobileMenu}
                  >
                    Settings
                  </Link>
                  <button
                    className="font-medium text-destructive text-body transition-colors hover:text-destructive/80"
                    onClick={() => {
                      closeMobileMenu();
                      handleSignOut();
                    }}
                    type="button"
                  >
                    Sign out
                  </button>
                </>
              );
            }
            return (
              <div className="flex w-full flex-col gap-2">
                {hasAnonRatings && (
                  <Link
                    className={mobileNavLink}
                    href="/profile/anon"
                    onClick={closeMobileMenu}
                  >
                    Your profile
                  </Link>
                )}
                {/* 44px by composition: primary action on mobile (doc 26). */}
                <Button asChild className="min-h-11 w-full" variant="default">
                  <Link href="/auth" onClick={closeMobileMenu}>
                    Sign in
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

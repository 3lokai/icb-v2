"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  MobileNav,
  MobileNavDropdown,
  MobileNavHeader,
  MobileNavMenu,
  NavBody,
  Navbar,
  NavItems,
} from "@/components/ui/resizable-navbar";
import { cn } from "@/lib/utils";

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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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
          <Button asChild size="sm" variant="outline">
            <Link href="/login">Login</Link>
          </Button>
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
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
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
                className="font-medium text-neutral-600 text-sm transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                href={item.link}
                key={item.link}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            )
          )}
          <Button asChild className="w-full" variant="outline">
            <Link href="/login" onClick={closeMobileMenu}>
              Login
            </Link>
          </Button>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

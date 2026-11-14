"use client";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useScrolledPast } from "@/hooks/use-scrolled-past";
import type { NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

// ponytail: motion/react removed — this component sits in the global header, so
// its animation runtime loaded on every page. Compaction/hover/dropdown effects
// are now CSS transitions + tw-animate-css. Trade-off: the spring feel becomes
// ease-out and the hover "pill" no longer slides between items (it fades per
// item). Restore motion here only if that polish is worth the sitewide bundle.

type NavbarProps = {
  children: React.ReactNode;
  className?: string;
};

type NavBodyProps = {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
};

type NavItemsProps = {
  items: NavItem[];
  className?: string;
  onItemClick?: () => void;
};

type MobileNavProps = {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
};

type MobileNavHeaderProps = {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
};

type MobileNavMenuProps = {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

export const Navbar = ({ children, className }: NavbarProps) => {
  const visible = useScrolledPast(100);

  return (
    <div
      className={cn("sticky inset-x-0 top-20 z-40 w-full", className)}
      // IMPORTANT: Change this to class of `fixed` if you want the navbar to be fixed
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => (
  <div
    className={cn(
      "relative z-60 mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 transition-all duration-500 ease-out lg:flex dark:bg-transparent",
      visible
        ? "navbar-compact w-2/5 translate-y-5 bg-background/80 shadow-lg backdrop-blur-md dark:bg-background/80"
        : "w-full",
      className
    )}
    style={{
      minWidth: "800px",
    }}
  >
    {React.Children.map(children, (child) => {
      if (!React.isValidElement(child) || typeof child.type === "string") {
        return child;
      }
      return React.cloneElement(
        child as React.ReactElement<{ visible?: boolean }>,
        { visible }
      );
    })}
  </div>
);

const isActive = (pathname: string, link: string) =>
  link === "/" ? pathname === "/" : pathname.startsWith(link);

// Panel rows match DropdownMenu: neutral bg-muted on hover and focus, no copper fill.
const panelLink =
  "block rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none motion-reduce:transition-none";

/**
 * Desktop nav. Every label is a link; a label with `groups` also opens a panel on
 * hover or keyboard focus (Escape closes it). A multi-group panel is centred under
 * the whole bar, a single list under its own label.
 */
export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [open, setOpen] = useState<number | null>(null);
  const pathname = usePathname();
  const close = () => setOpen(null);

  return (
    <nav
      aria-label="Main"
      className={cn(
        "hidden min-w-0 flex-1 flex-row items-center justify-center gap-1 pr-6 lg:flex",
        className
      )}
      onMouseLeave={close}
    >
      {items.map((item, idx) => {
        const { groups } = item;
        const wide = !!groups && groups.length > 1;
        const expanded = !!groups && open === idx;

        return (
          <div
            // A wide panel positions against NavBody, so its wrapper stays static.
            className={cn(!wide && "relative")}
            key={item.name}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) close();
            }}
            onFocus={() => setOpen(idx)}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
            }}
            onMouseEnter={() => setOpen(idx)}
          >
            <Link
              aria-current={pathname === item.link ? "page" : undefined}
              aria-expanded={groups ? expanded : undefined}
              className={cn(
                "flex items-center gap-1 rounded-full px-3 py-2 text-ui-label transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                isActive(pathname, item.link)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
              href={item.link}
              onClick={() => {
                close();
                onItemClick?.();
              }}
            >
              {item.name}
              {groups && (
                <Icon
                  className={cn(
                    "transition-transform motion-reduce:transition-none",
                    expanded && "rotate-180"
                  )}
                  icon={CaretDownIcon}
                  size={12}
                />
              )}
            </Link>

            {expanded && (
              // The padding (not a margin) keeps the label-to-panel gap inside the
              // hover area. The wide panel starts 8px up to meet the labels across
              // NavBody's bottom padding.
              <div
                className={cn(
                  "-translate-x-1/2 absolute left-1/2 z-50",
                  wide
                    ? "top-[calc(100%-0.5rem)] w-max max-w-[calc(100vw-2rem)] pt-4"
                    : "top-full min-w-48 pt-2"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-md duration-200 animate-in fade-in slide-in-from-top-2 motion-reduce:animate-none",
                    wide && "flex gap-2 p-4"
                  )}
                >
                  {groups.map((group, i) => (
                    <div className="min-w-32" key={group.label ?? i}>
                      {group.label && (
                        <p className="px-3 pb-1 text-ui-meta">{group.label}</p>
                      )}
                      <ul>
                        {group.items.map((child) => (
                          <li key={child.link}>
                            <Link
                              aria-current={
                                pathname === child.link ? "page" : undefined
                              }
                              className={panelLink}
                              href={child.link}
                              onClick={() => {
                                close();
                                onItemClick?.();
                              }}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => (
  <div
    className={cn(
      "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 transition-all duration-500 ease-out lg:hidden",
      visible
        ? "w-[90%] translate-y-5 rounded px-3 bg-background/80 shadow-lg backdrop-blur-md dark:bg-background/80"
        : "rounded-[2rem]",
      className
    )}
  >
    {React.Children.map(children, (child) => {
      if (!React.isValidElement(child) || typeof child.type === "string") {
        return child;
      }
      return React.cloneElement(
        child as React.ReactElement<{ visible?: boolean }>,
        { visible }
      );
    })}
  </div>
);

export const MobileNavHeader = ({
  children,
  className,
  visible,
}: MobileNavHeaderProps) => (
  <div
    className={cn(
      "flex w-full flex-row items-center justify-between",
      className
    )}
  >
    {React.Children.map(children, (child) => {
      if (!React.isValidElement(child) || typeof child.type === "string") {
        return child;
      }
      return React.cloneElement(
        child as React.ReactElement<{ visible?: boolean }>,
        { visible }
      );
    })}
  </div>
);

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => {
  if (!isOpen) return null;
  return (
    <div
      className={cn(
        // Scrolls inside itself: with Coffees expanded the menu is taller than the screen.
        "absolute inset-x-0 top-16 z-50 flex max-h-[calc(100dvh-6rem)] w-full flex-col items-start justify-start gap-4 overflow-y-auto rounded-lg border [&>*]:shrink-0 border-border bg-popover px-4 py-6 text-popover-foreground shadow-md duration-200 animate-in fade-in motion-reduce:animate-none",
        className
      )}
    >
      {children}
    </div>
  );
};

type MobileNavDropdownProps = {
  item: NavItem;
  onItemClick?: () => void;
};

export const mobileNavLink =
  "font-medium text-base text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none";

/** Mobile row: the label navigates, the caret beside it expands the same groups. */
export const MobileNavDropdown = ({
  item,
  onItemClick,
}: MobileNavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <Link
          className={cn(
            mobileNavLink,
            isActive(pathname, item.link) && "text-foreground"
          )}
          href={item.link}
          onClick={onItemClick}
        >
          {item.name}
        </Link>
        <button
          aria-expanded={isOpen}
          aria-label={`${item.name} menu`}
          // 44px target; -my-2 keeps the row at the height of its neighbours.
          className="-my-2 flex size-11 items-center justify-center text-muted-foreground"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <Icon
            className={cn(
              "transition-transform motion-reduce:transition-none",
              isOpen && "rotate-180"
            )}
            color="muted"
            icon={CaretDownIcon}
            size={16}
          />
        </button>
      </div>
      {isOpen && (
        <div className="mt-2 flex flex-col gap-4 pl-4 duration-200 animate-in fade-in slide-in-from-top-1 motion-reduce:animate-none">
          {item.groups?.map((group, i) => (
            <div key={group.label ?? i}>
              {group.label && (
                <p className="pb-1 text-ui-meta">{group.label}</p>
              )}
              {group.items.map((child) => (
                <Link
                  className="block py-2 text-muted-foreground text-sm transition-colors hover:text-foreground motion-reduce:transition-none"
                  href={child.link}
                  key={child.link}
                  onClick={onItemClick}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

"use client";
import { Icon } from "@/components/common/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useScrolledPast } from "@/hooks/use-scrolled-past";
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

type NavItem = {
  name: string;
  link: string;
  disabled?: boolean;
  badge?: string;
  children?: NavItem[];
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
    {children}
  </div>
);

type NavItemComponentProps = {
  item: NavItem;
  idx: number;
  hovered: number | null;
  openDropdown: number | null;
  isActive: (link: string) => boolean;
  hasActiveChild: (item: NavItem) => boolean;
  onHover: (idx: number) => void;
  onLeave: () => void;
  onItemClick?: () => void;
};

const NavItemComponent = ({
  item,
  idx,
  hovered,
  openDropdown,
  isActive,
  hasActiveChild,
  onHover,
  onLeave,
  onItemClick,
}: NavItemComponentProps) => {
  const active = isActive(item.link) || hasActiveChild(item);
  const showPill = hovered === idx || (active && hovered === null);
  const hasDropdown = item.children && item.children.length > 0;
  const isDropdownOpen = openDropdown === idx;

  const handleMouseEnter = () => {
    onHover(idx);
  };

  const renderButton = () => (
    <button
      aria-expanded={isDropdownOpen}
      aria-haspopup="true"
      aria-label={`${item.name} menu`}
      className={cn(
        "relative flex cursor-pointer items-center gap-1 border-0 bg-transparent px-4 py-2 font-inherit text-inherit transition-colors",
        active
          ? "font-medium text-accent-foreground"
          : "text-muted-foreground hover:text-accent-foreground"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      type="button"
    >
      {showPill && (
        <span
          className={cn(
            "absolute inset-0 h-full w-full rounded-full",
            active ? "bg-accent/80" : "bg-accent/40"
          )}
        />
      )}
      <span className="relative z-20">{item.name}</span>
      <Icon
        className={cn(
          "relative z-20 transition-transform",
          isDropdownOpen && "rotate-180"
        )}
        name="CaretDown"
        size={12}
      />
    </button>
  );

  const renderLink = () => (
    <Link
      className={cn(
        "relative px-4 py-2 transition-colors",
        active
          ? "font-medium text-accent-foreground"
          : "text-muted-foreground hover:text-accent-foreground"
      )}
      href={item.link}
      onClick={onItemClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
    >
      {showPill && (
        <span
          className={cn(
            "absolute inset-0 h-full w-full rounded-full",
            active ? "bg-accent/80" : "bg-accent/40"
          )}
        />
      )}
      <span className="relative z-20">{item.name}</span>
    </Link>
  );

  return (
    <div className="relative" key={item.link}>
      {hasDropdown ? renderButton() : renderLink()}

      {hasDropdown && isDropdownOpen && (
        <div
          className="-translate-x-1/2 absolute top-full left-1/2 z-50 mt-2 min-w-[200px] rounded-xl bg-background/90 px-2 py-2 shadow-lg backdrop-blur-lg duration-200 animate-in fade-in slide-in-from-top-2 dark:bg-background/90"
          onMouseEnter={() => onHover(idx)}
          onMouseLeave={onLeave}
        >
          {item.children?.map((child) => {
            const childActive = isActive(child.link);

            if (child.disabled) {
              return (
                <span
                  className="relative flex items-center justify-between gap-2 rounded-full px-4 py-2 text-body text-muted-foreground/50 cursor-not-allowed"
                  key={child.link}
                >
                  <span className="relative z-20">{child.name}</span>
                  {child.badge && (
                    <span className="relative z-20 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {child.badge}
                    </span>
                  )}
                </span>
              );
            }

            return (
              <Link
                className={cn(
                  "relative block rounded-full px-4 py-2 text-body transition-colors",
                  childActive
                    ? "font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-accent-foreground"
                )}
                href={child.link}
                key={child.link}
                onClick={onItemClick}
              >
                {childActive && (
                  <span className="absolute inset-0 h-full w-full rounded-full bg-accent/80" />
                )}
                <span className="relative z-20">{child.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const pathname = usePathname();

  const isActive = (link: string) => {
    if (link === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(link);
  };

  const hasActiveChild = (item: NavItem): boolean => {
    if (!item.children) {
      return false;
    }
    return item.children.some((child) => isActive(child.link));
  };

  const handleHover = (idx: number) => {
    setHovered(idx);
    const item = items[idx];
    if (item.children && item.children.length > 0) {
      setOpenDropdown(idx);
    }
  };

  const handleLeave = () => {
    setHovered(null);
    setOpenDropdown(null);
  };

  return (
    <div
      className={cn(
        "hidden min-w-0 flex-1 flex-row items-center justify-center gap-2 pr-6 font-medium text-muted-foreground text-body transition-colors hover:text-foreground lg:flex",
        className
      )}
      onMouseLeave={handleLeave}
    >
      {items.map((item, idx) => (
        <NavItemComponent
          hasActiveChild={hasActiveChild}
          hovered={hovered}
          idx={idx}
          isActive={isActive}
          item={item}
          key={item.link}
          onHover={handleHover}
          onItemClick={onItemClick}
          onLeave={handleLeave}
          openDropdown={openDropdown}
        />
      ))}
    </div>
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
    {children}
  </div>
);

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => (
  <div
    className={cn(
      "flex w-full flex-row items-center justify-between",
      className
    )}
  >
    {children}
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
        "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-card px-4 py-8 shadow-lg duration-200 animate-in fade-in dark:bg-card",
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

export const MobileNavDropdown = ({
  item,
  onItemClick,
}: MobileNavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (link: string) => {
    if (link === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(link);
  };

  const hasActiveChild = item.children?.some((child) => isActive(child.link));
  const active = isActive(item.link) || hasActiveChild;

  return (
    <div className="w-full">
      <button
        aria-expanded={isOpen}
        aria-label={`${item.name} menu`}
        className={cn(
          "flex w-full items-center justify-between text-muted-foreground hover:text-foreground",
          active && "font-medium text-accent-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{item.name}</span>
        <Icon
          className={cn("transition-transform", isOpen && "rotate-180")}
          name="CaretDown"
          size={16}
        />
      </button>
      {isOpen && (
        <div className="mt-2 flex flex-col gap-2 pl-4 duration-200 animate-in fade-in slide-in-from-top-1">
          {item.children?.map((child) => {
            const childActive = isActive(child.link);

            if (child.disabled) {
              return (
                <span
                  className="flex items-center justify-between gap-2 text-muted-foreground/50 text-body cursor-not-allowed"
                  key={child.link}
                >
                  <span>{child.name}</span>
                  {child.badge && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {child.badge}
                    </span>
                  )}
                </span>
              );
            }

            return (
              <Link
                className={cn(
                  "block text-muted-foreground text-body transition-colors hover:text-foreground",
                  childActive && "font-medium text-accent-foreground"
                )}
                href={child.link}
                key={child.link}
                onClick={onItemClick}
              >
                {child.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

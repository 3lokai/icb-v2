"use client";
import { Icon } from "@/components/common/Icon";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      className={cn("sticky inset-x-0 top-20 z-40 w-full", className)}
      // IMPORTANT: Change this to class of `fixed` if you want the navbar to be fixed
      ref={ref}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => (
  <motion.div
    animate={{
      backdropFilter: visible ? "blur(10px)" : "none",
      boxShadow: visible ? "var(--shadow-lg)" : "none",
      width: visible ? "40%" : "100%",
      y: visible ? 20 : 0,
    }}
    className={cn(
      "relative z-60 mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex dark:bg-transparent",
      visible && "navbar-compact bg-background/80 dark:bg-background/80",
      className
    )}
    style={{
      minWidth: "800px",
    }}
    transition={{
      type: "spring",
      stiffness: 200,
      damping: 50,
    }}
  >
    {children}
  </motion.div>
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
    <Link
      aria-expanded={isDropdownOpen}
      aria-label={`${item.name} menu`}
      className={cn(
        "relative flex items-center gap-1 px-4 py-2 transition-colors",
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
        <motion.div
          className={cn(
            "absolute inset-0 h-full w-full rounded-full",
            active ? "bg-accent/80" : "bg-accent/40"
          )}
          layoutId="hovered"
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
    </Link>
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
        <motion.div
          className={cn(
            "absolute inset-0 h-full w-full rounded-full",
            active ? "bg-accent/80" : "bg-accent/40"
          )}
          layoutId="hovered"
        />
      )}
      <span className="relative z-20">{item.name}</span>
    </Link>
  );

  return (
    <div className="relative" key={item.link}>
      {hasDropdown ? renderButton() : renderLink()}

      {hasDropdown && (
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="-translate-x-1/2 absolute top-full left-1/2 z-50 mt-2 min-w-[200px] rounded-xl bg-background/90 px-2 py-2 shadow-lg backdrop-blur-lg dark:bg-background/90"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: -10 }}
              onMouseEnter={() => onHover(idx)}
              onMouseLeave={onLeave}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {item.children?.map((child) => {
                const childActive = isActive(child.link);
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
                      <motion.div
                        className="absolute inset-0 h-full w-full rounded-full bg-accent/80"
                        layoutId="dropdown-active"
                      />
                    )}
                    <span className="relative z-20">{child.name}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
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
    <motion.div
      className={cn(
        "absolute inset-0 hidden flex-row items-center justify-center gap-2 font-medium text-muted-foreground text-body transition-colors hover:text-foreground lg:flex",
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
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => (
  <motion.div
    animate={{
      backdropFilter: visible ? "blur(10px)" : "none",
      boxShadow: visible ? "var(--shadow-lg)" : "none",
      width: visible ? "90%" : "100%",
      paddingRight: visible ? "12px" : "0px",
      paddingLeft: visible ? "12px" : "0px",
      borderRadius: visible ? "4px" : "2rem",
      y: visible ? 20 : 0,
    }}
    className={cn(
      "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
      visible && "bg-background/80 dark:bg-background/80",
      className
    )}
    transition={{
      type: "spring",
      stiffness: 200,
      damping: 50,
    }}
  >
    {children}
  </motion.div>
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
}: MobileNavMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        animate={{ opacity: 1 }}
        className={cn(
          "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-card px-4 py-8 shadow-lg dark:bg-card",
          className
        )}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <button
    aria-expanded={isOpen}
    aria-label="Toggle menu"
    className="text-foreground"
    onClick={onClick}
    type="button"
  >
    <Icon name={isOpen ? "X" : "List"} size={20} />
  </button>
);

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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 flex flex-col gap-2 pl-4"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            {item.children?.map((child) => {
              const childActive = isActive(child.link);
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-4 py-2 rounded-md bg-card text-foreground text-body font-semibold relative cursor-pointer hover:-translate-y-0.5 transition-all duration-200 inline-block text-center";

  const variantStyles = {
    primary: "bg-primary text-primary-foreground shadow-md hover:shadow-lg",
    secondary: "bg-transparent shadow-none text-foreground",
    dark: "bg-foreground text-background shadow-md hover:shadow-lg",
    gradient:
      "bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-md hover:shadow-lg",
  };

  return (
    <Tag
      className={cn(baseStyles, variantStyles[variant], className)}
      href={href || undefined}
      {...props}
    >
      {children}
    </Tag>
  );
};

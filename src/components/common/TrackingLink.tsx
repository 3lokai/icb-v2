// src/components/common/TrackingLink.tsx
"use client";

import Link from "next/link";

type TrackingLinkProps = {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
};

export function RoasterTrackingLink({
  href,
  ariaLabel,
  children,
  className,
}: TrackingLinkProps) {
  return (
    <Link aria-label={ariaLabel} className={className} href={href}>
      {children}
    </Link>
  );
}

export function CuratorTrackingLink({
  href,
  ariaLabel,
  children,
}: Pick<TrackingLinkProps, "href" | "ariaLabel" | "children">) {
  return (
    <Link
      aria-label={ariaLabel}
      className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href={href}
    >
      {children}
    </Link>
  );
}

export function CommunityTrackingLink({
  href,
  ariaLabel,
  children,
}: Pick<TrackingLinkProps, "href" | "ariaLabel" | "children">) {
  return (
    <a
      aria-label={ariaLabel}
      className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

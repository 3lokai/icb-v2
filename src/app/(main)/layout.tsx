import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/Footer";
import { Banner1 } from "@/components/ui/banner1";
import { fetchActiveAnnouncement } from "@/lib/data/fetch-announcement";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { CookieNotice } from "@/components/common/CookieNotice";

// Lazy load SearchCommand to reduce initial bundle size
const SearchCommand = dynamic(() =>
  import("@/components/search/SearchCommand").then((mod) => ({
    default: mod.SearchCommand,
  }))
);

async function AnnouncementBanner() {
  const announcement = await fetchActiveAnnouncement();
  if (!announcement) return null;
  return (
    <Banner1
      defaultVisible
      description={announcement.message}
      linkText={announcement.link ? "Learn more" : undefined}
      linkUrl={announcement.link || undefined}
    />
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="surface-0 relative flex min-h-screen flex-col">
      {/* Prefer a non-layout-shifting fallback: announcements are usually empty. */}
      <Suspense
        fallback={
          <div className="sr-only" aria-busy="true">
            Loading announcements
          </div>
        }
      >
        <AnnouncementBanner />
      </Suspense>
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring"
        href="#main-content"
      >
        Skip to content
      </a>
      <Header />
      <main className="flex-1 overflow-x-clip" id="main-content">
        {children}
      </main>
      <Footer />
      <SearchCommand />
      <CookieNotice />
    </div>
  );
}

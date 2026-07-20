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
      {/* fallback=null: no active announcement is the common case, so reserve no
          height — a skeleton here collapsed to null and shifted every page (incl. footer). */}
      <Suspense fallback={null}>
        <AnnouncementBanner />
      </Suspense>
      <Header />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
      <SearchCommand />
      <CookieNotice />
    </div>
  );
}

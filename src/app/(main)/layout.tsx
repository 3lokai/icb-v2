import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/Footer";
import { Banner1 } from "@/components/ui/banner1";
import { fetchActiveAnnouncement } from "@/lib/data/fetch-announcement";
import dynamic from "next/dynamic";
import { CookieNotice } from "@/components/common/CookieNotice";

// Lazy load SearchCommand to reduce initial bundle size
const SearchCommand = dynamic(() =>
  import("@/components/search/SearchCommand").then((mod) => ({
    default: mod.SearchCommand,
  }))
);

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const announcement = await fetchActiveAnnouncement();

  return (
    <div className="surface-0 relative flex min-h-screen flex-col">
      {announcement && (
        <Banner1
          defaultVisible
          description={announcement.message}
          linkText={announcement.link ? "Learn more" : undefined}
          linkUrl={announcement.link || undefined}
        />
      )}
      <Header />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Footer />
      <SearchCommand />
      <CookieNotice />
    </div>
  );
}

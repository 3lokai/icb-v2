// Server component for LCP-optimized hero heading
import { Stack } from "@/components/primitives/stack";
import { Announcement, AnnouncementTitle } from "@/components/ui/announcement";
import { Icon } from "@/components/common/Icon";

export function HeroHeading() {
  return (
    <>
      {/* Hero badge - Animation removed for LCP optimization */}
      <div className="flex items-center justify-start">
        <Announcement variant="onMedia">
          <AnnouncementTitle className="gap-2">
            <Icon className="text-accent" name="MapPin" size={16} />
            India&apos;s First Coffee Directory
            <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          </AnnouncementTitle>
        </Announcement>
      </div>

      {/* Main heading - Server-rendered for optimal LCP */}
      <div className="lcp-optimized">
        <Stack gap="6" className="text-left">
          <h1 className="text-hero text-white text-balance leading-[1.1]">
            Rate your coffee. Build your{" "}
            <span className="text-accent italic">Coffee Identity.</span>
          </h1>
          {/* Animation removed from paragraph for LCP optimization */}
          <p className="max-w-3xl text-white/90 text-body-large leading-relaxed text-pretty">
            A community-driven platform where your ratings shape your{" "}
            <span className="text-accent">taste profile</span> — and help others
            discover better Indian coffee.
          </p>
        </Stack>
      </div>
    </>
  );
}

// Server component for LCP-optimized hero heading
import { Stack } from "@/components/primitives/stack";
import { Announcement, AnnouncementTitle } from "@/components/ui/announcement";
import { Icon } from "@/components/common/Icon";

export function HeroHeading() {
  return (
    <>
      {/* Hero badge - Animation removed for LCP optimization */}
      <div className="flex items-center justify-center">
        <Announcement variant="outline">
          <AnnouncementTitle className="gap-2">
            <Icon className="text-accent" name="MapPin" size={16} />
            India&apos;s First Coffee Directory
            <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          </AnnouncementTitle>
        </Announcement>
      </div>

      {/* Main heading - Server-rendered for optimal LCP */}
      <div className="lcp-optimized">
        <Stack gap="8">
          <h1 className="text-hero text-primary-foreground text-balance leading-tight">
            Discover India's{" "}
            <span className="text-accent italic">Finest Coffee</span> Beans.
          </h1>
          {/* Animation removed from paragraph for LCP optimization */}
          <p className="mx-auto max-w-3xl text-primary-foreground/90 text-body-large leading-relaxed text-pretty">
            Explore exceptional Indian specialty coffee beans, roasters, and the
            stories behind each perfect cup. Verified data for the modern
            brewer.
          </p>
        </Stack>
      </div>
    </>
  );
}

// Server component for LCP-optimized hero heading
import { Stack } from "@/components/primitives/stack";
import { Announcement, AnnouncementTitle } from "@/components/ui/announcement";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

export function HeroHeading({
  rightAligned = false,
}: {
  rightAligned?: boolean;
}) {
  return (
    <>
      {/* Hero badge - Animation removed for LCP optimization */}
      <div
        className={cn(
          "flex items-center",
          rightAligned ? "justify-end" : "justify-start"
        )}
      >
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
        <Stack gap="6" className={rightAligned ? "text-right" : "text-left"}>
          <h1 className="text-hero text-white text-balance leading-[1.1]">
            Which <span className="text-accent italic">coffee</span> did you{" "}
            <span className="text-accent italic">brew</span> last?
          </h1>
          {/* Animation removed from paragraph for LCP optimization */}
          <p className="max-w-3xl text-white text-body-large leading-relaxed text-pretty">
            Rate your coffee to build your taste profile and see how others
            experience it.
          </p>
        </Stack>
      </div>
    </>
  );
}

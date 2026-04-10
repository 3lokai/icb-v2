"use client";

import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Icon, type IconName } from "@/components/common/Icon";
import { Curator } from "./types";

type CurationFooterProps = {
  partner: Curator;
};

const primarySocialLinkClass =
  "p-2.5 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all border border-border/40 bg-background shadow-sm";

export function CurationFooter({ partner }: CurationFooterProps) {
  const primaryRow: {
    key: string;
    label: string;
    href: string;
    icon: IconName;
    external: boolean;
  }[] = [];

  if (partner.instagramUrl) {
    primaryRow.push({
      key: "instagram",
      label: "Instagram",
      href: partner.instagramUrl,
      icon: "InstagramLogo",
      external: true,
    });
  }
  if (partner.contactEmail) {
    primaryRow.push({
      key: "email",
      label: "Email",
      href: `mailto:${partner.contactEmail}`,
      icon: "Envelope",
      external: false,
    });
  }
  if (partner.twitterUrl) {
    primaryRow.push({
      key: "twitter",
      label: "Twitter",
      href: partner.twitterUrl,
      icon: "TwitterLogo",
      external: true,
    });
  }

  return (
    <footer className="py-20 border-t border-border/40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <Stack gap="4" className="max-w-md">
          <Cluster gap="3" align="center">
            <span className="h-px w-8 bg-accent/60" />
            <span className="text-overline text-accent tracking-[0.15em] uppercase">
              The curator
            </span>
          </Cluster>
          <p className="text-body-large text-muted-foreground font-serif italic">
            These recommendations are curated by {partner.name} and reflect
            their unique perspective on quality and specialty coffee
            craftsmanship in India.
          </p>
        </Stack>

        <Stack gap="4">
          <h3 className="text-subheading tracking-tight">
            Connect with {partner.name}
          </h3>
          {primaryRow.length > 0 && (
            <Cluster gap="2" className="pt-0.5">
              {primaryRow.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={primarySocialLinkClass}
                  title={item.label}
                  aria-label={item.label}
                >
                  <Icon name={item.icon} size={18} />
                </a>
              ))}
            </Cluster>
          )}
          {partner.links.length > 0 && (
            <Cluster
              gap="4"
              align="center"
              className={primaryRow.length > 0 ? "pt-1" : ""}
            >
              {partner.links.map((link) => (
                <a
                  key={`${link.platform}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                  aria-label={link.platform}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 group-hover:border-accent/40 group-hover:bg-accent/5 transition-all">
                    <Icon
                      name={
                        link.platform === "instagram"
                          ? "InstagramLogo"
                          : link.platform === "twitter"
                            ? "XLogo"
                            : "Globe"
                      }
                      size={20}
                    />
                  </div>
                  <span className="text-label capitalize hidden sm:inline">
                    {link.platform}
                  </span>
                </a>
              ))}
            </Cluster>
          )}
        </Stack>
      </div>
    </footer>
  );
}

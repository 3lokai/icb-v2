"use client";

import Image from "next/image";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Icon } from "@/components/common/Icon";
import { CurationPartner } from "./types";

type CurationAboutProps = {
  partner: CurationPartner;
};

export function CurationAbout({ partner }: CurationAboutProps) {
  return (
    <div className="py-10 md:py-14 border-t border-border/40">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        <Stack gap="6">
          <Stack gap="3">
            <h2 className="text-title">
              About <span className="text-accent italic">{partner.name}</span>
            </h2>
            <p className="text-body text-muted-foreground font-serif">
              {partner.story}
            </p>
          </Stack>

          <Stack gap="3">
            <Cluster gap="2" align="center">
              <Icon name="MapPin" size={14} className="text-accent" />
              <span className="text-caption">{partner.location}</span>
            </Cluster>

            <Cluster gap="3">
              {partner.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2.5 rounded-full bg-muted hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors border border-border/40"
                  aria-label={link.platform}
                >
                  <Icon
                    name={
                      link.platform === "instagram"
                        ? "InstagramLogo"
                        : link.platform === "twitter"
                          ? "XLogo"
                          : "Globe"
                    }
                    size={18}
                  />
                </a>
              ))}
            </Cluster>
          </Stack>
        </Stack>

        <div className="relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-muted group grayscale hover:grayscale-0 transition-all duration-500 border border-border/40">
          <Image
            src={partner.logo}
            alt={partner.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
}

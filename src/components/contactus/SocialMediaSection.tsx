// src/components/contactus/SocialMediaSection.tsx
"use client";

import { Icon, IconName } from "@/components/common/Icon";
import { SectionHeader } from "./SectionHeader";
import { Stack } from "../primitives/stack";

export function SocialMediaSection() {
  const socialLinks = [
    {
      name: "Instagram",
      handle: "@indiancoffeebeans",
      href: "https://instagram.com/indiancoffeebeans",
      icon: "InstagramLogo" as IconName,
      description:
        "Daily doses of Indian coffee culture and roaster highlights.",
    },
    {
      name: "Twitter",
      handle: "@indcoffeebeans",
      href: "https://twitter.com/indcoffeebeans",
      icon: "TwitterLogo" as IconName,
      description: "Quick updates, industry news, and community conversations.",
    },
    {
      name: "Facebook",
      handle: "/indiacoffeebeans/",
      href: "https://www.facebook.com/indiacoffeebeans/",
      icon: "FacebookLogo" as IconName,
      description:
        "Join our community group and connect with fellow enthusiasts.",
    },
  ];

  return (
    <section className="py-12">
      <Stack gap="12">
        <SectionHeader
          align="center"
          eyebrow="Stay Connected"
          title="Follow Our Journey"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {socialLinks.map((social) => (
            <a
              className="group relative flex flex-col p-8 rounded-[2rem] border border-border bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
              href={social.href}
              key={social.name}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Stack gap="6">
                <div className="h-16 w-16 flex items-center justify-center rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-accent/20 group-hover:bg-accent/5 group-hover:scale-110">
                  <Icon color="accent" name={social.icon} size={32} />
                </div>

                <Stack gap="2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif italic text-heading text-primary group-hover:text-accent transition-colors">
                      {social.name}
                    </h4>
                    <span className="text-micro font-bold text-muted-foreground/40 uppercase tracking-widest">
                      Visit
                    </span>
                  </div>
                  <p className="text-caption text-muted-foreground leading-relaxed">
                    {social.description}
                  </p>
                </Stack>

                <div className="pt-2 flex items-center gap-2 text-micro font-bold uppercase tracking-wider text-accent/80">
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  {social.handle}
                </div>
              </Stack>
            </a>
          ))}
        </div>
      </Stack>
    </section>
  );
}

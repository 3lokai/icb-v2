"use client";

import { Icon, IconName } from "@/components/common/Icon";

export function SocialMediaSection() {
  const socialLinks = [
    {
      name: "Instagram",
      handle: "@indiancoffeebeans",
      href: "https://instagram.com/indiancoffeebeans",
      icon: "InstagramLogo" as IconName,
    },
    {
      name: "Twitter",
      handle: "@indcoffeebeans",
      href: "https://twitter.com/indcoffeebeans",
      icon: "TwitterLogo" as IconName,
    },
    {
      name: "Facebook",
      handle: "/indiacoffeebeans/",
      href: "https://www.facebook.com/indiacoffeebeans/",
      icon: "FacebookLogo" as IconName,
    },
  ];

  return (
    <section className="mb-16">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-heading text-primary">Follow Us</h2>
        <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Stay connected with the latest updates, coffee discoveries, and
          community features by following us on social media.
        </p>
      </div>

      <div className="rounded-xl border border-border/20 bg-muted/30 p-8 backdrop-blur-sm">
        <div className="flex flex-wrap justify-center gap-8">
          {socialLinks.map((social) => (
            <a
              className="group hover:-translate-y-1 flex flex-col items-center transition-transform duration-200"
              href={social.href}
              key={social.name}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="mb-3 h-16 w-16 flex-center rounded-full border border-border/30 bg-background shadow-sm transition-all duration-300 group-hover:border-accent/50 group-hover:shadow-md">
                <Icon color="primary" name={social.icon} size={32} />
              </div>
              <span className="font-medium text-primary transition-colors duration-200 group-hover:text-accent">
                {social.name}
              </span>
              <span className="text-muted-foreground text-caption">
                {social.handle}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

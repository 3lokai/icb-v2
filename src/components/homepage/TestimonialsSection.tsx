// src/components/home/TestimonialsSection.tsx

import { Icon } from "@/components/common/Icon";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";

type Testimonial = {
  id: number;
  comment: string;
  name: string;
  username: string;
};

const REDDIT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    comment:
      "We definitely needed a directory for all coffee roasters! Thanks for putting this together.",
    name: "DragonFruit Coffee",
    username: "@DragonfruitThin1574",
  },
  {
    id: 2,
    comment: "Exactly the kind of resource this community needs.",
    name: "Coffee Community",
    username: "@coffee_Community6789",
  },
  {
    id: 3,
    comment:
      "This is something I was planning to do myself but glad that you did it!",
    name: "Sourabh",
    username: "@Sourabh_1212",
  },
  {
    id: 4,
    comment: "The hero we need!!",
    name: "Wilson",
    username: "@wilson_fisk1191",
  },
  {
    id: 5,
    comment: "I have them bookmarked. Good to have another reference.",
    name: "Indi Guy",
    username: "@indi_guy",
  },
  {
    id: 6,
    comment:
      "Awesome initiative! Being able to rate roasters would be a game changer.",
    name: "Average Coffee Guy",
    username: "@avg42",
  },
  {
    id: 7,
    comment: "Good work",
    name: "Sat TV",
    username: "@sat_tv",
  },
  {
    id: 8,
    comment: "This is great! Love the idea of adding equipment options too.",
    name: "Tonkotsu AI",
    username: "@tonkotsu-ai",
  },
  {
    id: 9,
    comment: "Awesome! Looks great!",
    name: "General Permission",
    username: "@GeneralPermission375",
  },
  {
    id: 10,
    comment: "Please add Rossette to the list! Thanks",
    name: "Rossette Founder",
    username: "@Vanshanand",
  },
  {
    id: 11,
    comment: "I have bought really good beans from GB Roasters. Great quality!",
    name: "Fifan Beer",
    username: "@fifanbeer",
  },
  {
    id: 12,
    comment: "Mining Reddit info for coffee ratings would be awesome.",
    name: "Steamy Sideburns",
    username: "@Steamysideburns",
  },
];

// Split into two rows
const firstRow = REDDIT_TESTIMONIALS.slice(0, 6);
const secondRow = REDDIT_TESTIMONIALS.slice(6, 12);

const TestimonialCard = ({
  comment,
  name,
  username,
}: {
  comment: string;
  name: string;
  username: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-80 cursor-pointer overflow-hidden rounded-xl border p-6",
        // Glassmorphism treatment matching your existing style
        "border-border/30 bg-card/40 shadow-lg backdrop-blur-sm",
        "group transition-all duration-300 hover:bg-card/60 hover:shadow-xl"
      )}
      itemScope
      itemType="https://schema.org/Review"
    >
      {/* Reddit icon to indicate source */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="text-accent" name="ChatCircle" size={16} />
          <span className="font-medium text-muted-foreground text-overline">
            from Reddit
          </span>
        </div>
        {/* Simple 5-star rating for all since they're all positive */}
        <div className="flex">
          {["star-1", "star-2", "star-3", "star-4", "star-5"].map((starId) => (
            <Icon className="text-accent" key={starId} name="Star" size={14} />
          ))}
        </div>
      </div>

      {/* Comment */}
      <blockquote
        className="mb-6 text-foreground/90 text-caption leading-relaxed transition-colors duration-200 group-hover:text-foreground"
        itemProp="reviewBody"
      >
        &quot;{comment}&quot;
      </blockquote>

      {/* Author Info */}
      <div
        className="flex items-center gap-3"
        itemProp="author"
        itemScope
        itemType="https://schema.org/Person"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 font-medium text-accent text-overline ring-2 ring-border transition-colors duration-200 group-hover:ring-accent">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <div
            className="font-medium text-foreground text-caption"
            itemProp="name"
          >
            {name}
          </div>
          <div className="text-muted-foreground text-overline">{username}</div>
        </div>
      </div>

      {/* Rating metadata for SEO */}
      <meta content="5" itemProp="ratingValue" />
      <meta content="5" itemProp="bestRating" />
    </figure>
  );
};

export default function TestimonialsSection() {
  return (
    <Section spacing="default">
      <Stack gap="12">
        {/* Header */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <Stack gap="6">
                <div className="inline-flex items-center gap-4">
                  <span className="h-px w-8 md:w-12 bg-accent/60" />
                  <span className="text-overline text-muted-foreground tracking-[0.15em]">
                    Community Voice
                  </span>
                </div>
                <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                  What Coffee{" "}
                  <span className="text-accent italic">Lovers Say.</span>
                </h2>
                <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                  Join the community of coffee enthusiasts discovering the rich
                  world of Indian coffee beans through our directory.
                </p>
              </Stack>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end pb-2">
              <div className="flex md:hidden items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
                <span className="h-1 w-1 rounded-full bg-accent/40" />
                Verified Feedback
                <span className="h-1 w-1 rounded-full bg-accent/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Dual Marquee Rows */}
        <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden">
          {/* Row 1: Normal direction */}
          <Marquee className="[--duration:80s]" pauseOnHover>
            {firstRow.map((testimonial) => (
              <TestimonialCard key={testimonial.username} {...testimonial} />
            ))}
          </Marquee>

          {/* Row 2: Reverse direction */}
          <Marquee className="[--duration:80s]" pauseOnHover reverse>
            {secondRow.map((testimonial) => (
              <TestimonialCard key={testimonial.username} {...testimonial} />
            ))}
          </Marquee>

          {/* Gradient fade edges - matching Magic UI style */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-muted/30" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-muted/30" />
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/reviews">
            <Button className="group w-full sm:w-auto" variant="outline">
              View All Reviews
              <Icon
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                name="ArrowRight"
              />
            </Button>
          </Link>
        </div>
      </Stack>
    </Section>
  );
}

// src/components/home/TestimonialsSection.tsx

import { Icon } from "@/components/common/Icon";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

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
    <section className="mb-20 py-16">
      <div className="container-default">
        {/* Header - keeping your exact styling */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-heading text-primary">
            What Coffee Lovers Say
          </h2>
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
          <p className="mx-auto max-w-2xl text-body text-muted-foreground">
            Join the community of coffee enthusiasts discovering the rich world
            of Indian coffee beans through our directory.
          </p>
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

        {/* CTA - keeping your exact styling */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-muted-foreground text-caption">
            Have a story to share about your coffee journey?
          </p>
          <a
            className="group inline-flex items-center font-medium text-accent transition-colors duration-200 hover:text-accent-foreground"
            href="/contact"
          >
            Share Your Experience
            <Icon
              className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
              name="ArrowRight"
              size={16}
            />
          </a>
        </div>
      </div>
    </section>
  );
}

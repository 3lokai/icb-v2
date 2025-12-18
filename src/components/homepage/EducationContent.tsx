// src/components/home/EducationSection.tsx

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon, IconName } from "../common/Icon";

const educationItems = [
  {
    id: "varieties",
    title: "Bean Varieties",
    description:
      "Learn about India's Arabica and Robusta varieties and what makes them special.",
    icon: "CoffeeBean",
  },
  {
    id: "brewing",
    title: "Brewing Guides",
    description:
      "Master brewing techniques specifically tailored to bring out the best in Indian coffees.",
    icon: "Coffee",
  },
  {
    id: "glossary",
    title: "Coffee Glossary",
    description:
      "Decode coffee terminology with our comprehensive glossary of industry terms.",
    icon: "BookOpen",
  },
];

export default function EducationSection() {
  return (
    <section className="mb-20">
      <div className="glass-panel card-padding rounded-2xl">
        <div className="container-default">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Column: Content */}
            <div className="order-2 lg:order-1">
              <div className="mb-8 text-left">
                <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5">
                  <Icon
                    className="mr-2"
                    color="primary"
                    name="BookOpen"
                    size={16}
                  />
                  <span className="font-medium text-primary text-caption">
                    Education Center
                  </span>
                </div>

                <h2 className="mb-4 text-heading text-primary">
                  Unlock the World of Indian Coffee
                </h2>
                <div className="mb-6 h-1 w-16 rounded-full bg-accent" />

                <p className="text-body text-muted-foreground">
                  Dive into India&apos;s rich coffee heritage, from cultivation
                  techniques in the Western Ghats to traditional brewing methods
                  that enhance the unique flavors of Indian beans.
                </p>
              </div>

              <div className="mb-8 space-y-4">
                {educationItems.map((item, index) => (
                  <div
                    className={`glass-card card-padding card-hover group animate-fade-in-scale delay-${index * 100}`}
                    key={item.id}
                  >
                    <div className="flex items-start">
                      <div className="mr-4 h-12 w-12 flex-center rounded-lg border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/15">
                        <Icon
                          className="text-primary"
                          name={item.icon as IconName}
                          size={20}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-heading transition-colors duration-200 group-hover:text-accent">
                          {item.title}
                        </h3>
                        <p className="text-caption">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/learn">
                <Button className="hover-lift group" size="lg">
                  Explore Educational Content
                  <Icon
                    className="ml-2 transition-transform group-hover:translate-x-1"
                    name="ArrowRight"
                    size={16}
                  />
                </Button>
              </Link>
            </div>

            {/* Right Column: Image with floating fact card */}
            <div className="relative order-1 lg:order-2">
              <div className="relative mx-auto aspect-square max-w-[500px]">
                {/* Main Image */}
                <div className="group relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    alt="Open coffee education journal on wooden café table"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    height={500}
                    priority
                    src="/images/home/open-book-cafe.png"
                    width={500}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating "Did You Know" Card */}
                <div className="-top-4 -right-4 absolute z-20 hidden max-w-xs animate-float rounded-2xl lg:block">
                  <div className="glass-card card-padding shadow-xl">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 flex-center flex-shrink-0 rounded-full border border-accent/30 bg-accent/20">
                        <Icon className="text-accent" name="Coffee" size={16} />
                      </div>
                      <div>
                        <h4 className="mb-1 font-medium text-accent-foreground text-caption">
                          Did You Know?
                        </h4>
                        <p className="text-muted-foreground text-overline leading-relaxed">
                          India&apos;s famed Monsooned Malabar coffee gets its
                          unique flavor from monsoon winds.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute bottom-6 left-6 h-16 w-16 animate-pulse rounded-full bg-primary/10 blur-xl" />
                <div className="absolute top-1/3 right-8 h-12 w-12 animate-float rounded-full bg-accent/10 blur-lg delay-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

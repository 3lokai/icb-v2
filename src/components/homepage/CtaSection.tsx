// src/components/home/CtaSection.tsx
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="section-spacing glass-overlay">
      <div className="container-default">
        <div className="overflow-hidden rounded-lg shadow-xl">
          <div className="relative bg-gradient-to-r from-primary to-accent">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="-left-20 -top-20 absolute h-80 w-80 rounded-full shadow-inner blur-[100px]" />
              <div className="-right-20 -bottom-20 absolute h-80 w-80 rounded-full shadow-inner blur-[100px]" />
            </div>

            <div className="relative px-6 py-12 text-center md:px-12 md:py-16">
              <div
                aria-hidden="true"
                className="glass-panel mb-6 inline-flex items-center justify-center rounded-full p-2"
              >
                <Icon className="h-6 w-6" color="accent" name="Coffee" />
                <Icon className="ml-2 h-6 w-6" color="muted" name="MapPin" />
              </div>

              <h2 className="mx-auto mb-6 max-w-3xl text-title text-white">
                Start Your Indian Coffee Journey Today
              </h2>

              <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
                Discover exceptional beans from India&apos;s most passionate
                roasters and explore the rich heritage of Indian coffee culture.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/coffees">
                  <Button className="btn-primary hover-lift">
                    <Icon className="mr-2" name="Coffee" size={18} />
                    Explore Coffee Beans
                  </Button>
                </Link>
                <Link href="/roasters">
                  <Button className="hover-lift" variant="secondary">
                    <Icon className="mr-2" name="Storefront" size={18} />
                    Discover Roasters
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

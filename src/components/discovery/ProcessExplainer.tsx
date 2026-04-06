import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { DiscoverySectionIntro } from "@/components/discovery/DiscoverySectionIntro";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { cn } from "@/lib/utils";

type Step = { title: string; body: string };

const PROCESS_STEPS: Record<string, Step[]> = {
  natural: [
    {
      title: "Harvest",
      body: "Ripe cherries are picked and sorted—quality here sets the ceiling for sweetness and clarity.",
    },
    {
      title: "Dry & ferment in the cherry",
      body: "Cherries dry with fruit intact; sugars and microbes shape bold fruit and wine-like complexity.",
    },
    {
      title: "Mill & rest",
      body: "Hulling reveals the bean; resting helps flavours settle before roasting.",
    },
  ],
  washed: [
    {
      title: "Harvest",
      body: "Cherries are picked and depulped to expose the bean in its mucilage.",
    },
    {
      title: "Ferment & wash",
      body: "Mucilage is broken down and washed off—this is what delivers the classic clean cup.",
    },
    {
      title: "Dry & mill",
      body: "Beans dry to stable moisture, then hull and sort for roasting.",
    },
  ],
  honey: [
    {
      title: "Harvest",
      body: "Cherries are depulped while leaving intentional mucilage on the parchment.",
    },
    {
      title: "Dry with mucilage",
      body: "Controlled drying with sticky mucilage boosts sweetness and body vs washed.",
    },
    {
      title: "Mill & rest",
      body: "Hulling and resting balance clarity with the extra sweetness from honey processing.",
    },
  ],
  anaerobic: [
    {
      title: "Harvest",
      body: "Cherries are prepared and often placed in sealed tanks to limit oxygen.",
    },
    {
      title: "Controlled ferment",
      body: "Low-oxygen fermentation steers microbes and acids toward intense aromatics.",
    },
    {
      title: "Dry & mill",
      body: "Careful drying locks in complexity; milling follows once stable.",
    },
  ],
  "monsooned-malabar": [
    {
      title: "Harvest",
      body: "Green coffee is prepared using traditional arabica lots suited to monsooning.",
    },
    {
      title: "Monsoon exposure",
      body: "Beans take on moisture from coastal winds—swelling and mellowing acidity.",
    },
    {
      title: "Rest & sort",
      body: "Stabilised beans are sorted for the mellow, heritage cup profile.",
    },
  ],
};

const STEP_ICONS = ["Coffee", "Drop", "Package"] as const;

type ProcessExplainerProps = {
  processSlug: string;
  guideHref?: string;
  className?: string;
};

export function ProcessExplainer({
  processSlug,
  guideHref = "/learn",
  className,
}: ProcessExplainerProps) {
  const steps = PROCESS_STEPS[processSlug];
  if (!steps?.length) {
    return null;
  }

  return (
    <Section spacing="default" contained={false} className={cn(className)}>
      <DiscoverySectionIntro
        className="mb-8"
        overline="How it works"
        title="From cherry to *cup*"
        description="A simplified walkthrough of what happens before roasting—helpful context when you read tasting notes."
        rightAside={
          <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            3 steps
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
      />
      <div className="mx-auto max-w-6xl w-full px-4 md:px-0">
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="surface-1 relative overflow-hidden card-padding card-hover group rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Decorative background blurs */}
              <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />

              <Stack gap="4" className="relative z-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon
                    className="text-primary"
                    name={STEP_ICONS[index]}
                    size={24}
                  />
                </div>

                <Stack gap="1">
                  <div className="flex items-center gap-2">
                    <span className="text-micro font-bold text-accent/80 tracking-tighter tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="h-0.5 w-4 rounded-full bg-accent/20" />
                  </div>
                  <h3 className="text-heading font-serif leading-tight">
                    {step.title}
                  </h3>
                </Stack>

                <p className="text-body text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
              </Stack>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Link
            href={guideHref}
            className="group inline-flex items-center gap-2 text-body font-medium text-accent hover:underline"
          >
            Read the full guide
            <Icon
              name="ArrowRight"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </Section>
  );
}

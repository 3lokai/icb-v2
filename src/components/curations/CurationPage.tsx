"use client";

import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { CuratorPageData } from "./types";
import { CurationHeader } from "./CurationHeader";
import { CurationStory } from "./CurationStory";
import { CurationGallery } from "./CurationGallery";
import { CurationAccordion } from "./CurationAccordion";
import { CurationFooter } from "./CurationFooter";

type CurationPageProps = {
  data: CuratorPageData;
};

export function CurationPage({ data }: CurationPageProps) {
  const { curator, curations } = data;

  // Find default curation ID
  const defaultCurationId =
    curations.find((c) => c.isDefault)?.id || curations[0].id;

  return (
    <PageShell maxWidth="full" className="px-0">
      <Stack className="gap-0">
        <CurationHeader
          title={`${curator.name}’s Selections`}
          subtitle={curator.quote || curator.story.slice(0, 100) + "..."}
          curator={curator}
        />

        <CurationStory curator={curator} />

        <CurationGallery images={curator.gallery} />

        <Section contained={true} spacing="loose" className="max-w-6xl mx-auto">
          <CurationAccordion
            curations={curations}
            defaultCurationId={defaultCurationId}
          />
        </Section>

        <Section contained={true} spacing="loose" className="max-w-6xl mx-auto">
          <CurationFooter partner={curator} />
        </Section>
      </Stack>
    </PageShell>
  );
}

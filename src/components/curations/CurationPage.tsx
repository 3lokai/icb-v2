"use client";

import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { CuratorPageData } from "./types";
import { CurationHeader } from "./CurationHeader";
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
    <PageShell maxWidth="6xl">
      <Stack gap="6">
        <CurationHeader
          title={`ICB × ${curator.name}`}
          subtitle={curator.quote || curator.story.slice(0, 100) + "..."}
          curator={curator}
        />

        <Section contained={false} spacing="tight">
          <CurationGallery images={curator.gallery} partner={curator} />
        </Section>

        <Section contained={false} spacing="tight">
          <CurationAccordion
            curations={curations}
            defaultCurationId={defaultCurationId}
          />
        </Section>

        <CurationFooter partner={curator} />
      </Stack>
    </PageShell>
  );
}

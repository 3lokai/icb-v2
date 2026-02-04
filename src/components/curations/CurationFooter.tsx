"use client";

import { CurationPartner } from "./types";

type CurationFooterProps = {
  partner: CurationPartner;
};

export function CurationFooter({ partner }: CurationFooterProps) {
  return (
    <footer className="py-12 border-t border-border/40">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-caption text-muted-foreground max-w-md text-center md:text-left">
          These recommendations are curated by {partner.name} and reflect their
          brewing preferences and commitment to specialty coffee quality.
        </p>
      </div>
    </footer>
  );
}

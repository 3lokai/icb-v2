"use client";

import type { RoasterDetail } from "@/types/roaster-types";

type RoasterAboutProps = {
  roaster: RoasterDetail;
};

export function RoasterAbout({ roaster }: RoasterAboutProps) {
  // If no description, don't render the section
  if (!roaster.description) {
    return null;
  }

  return (
    <div className="card-shell card-padding mb-8">
      <h2 className="text-title mb-4">About</h2>
      <div className="text-body">
        <p className="whitespace-pre-line">{roaster.description}</p>
      </div>
    </div>
  );
}

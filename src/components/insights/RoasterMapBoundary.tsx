"use client";

import { Component, type ReactNode } from "react";
import { captureException } from "@/lib/posthog";

export function RoasterMapFallback() {
  return (
    <div className="flex items-center justify-center rounded-sm bg-muted/40 px-6 py-10 text-center">
      <p className="text-caption text-muted-foreground">
        The map is not available in this browser. The city list below shows the
        same data.
      </p>
    </div>
  );
}

/** Keeps a Leaflet failure inside the map card instead of the route error page */
export class RoasterMapBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    captureException(error, { error_boundary: "insights/roaster-map" });
  }

  render() {
    return this.state.hasError ? <RoasterMapFallback /> : this.props.children;
  }
}

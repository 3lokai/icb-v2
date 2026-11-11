import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentPlayground } from "./playground";
import "./deep-roast.css";

export const metadata: Metadata = {
  title: "Component playground · Deep Roast (design branch)",
  robots: { index: false, follow: false },
};

export default function ComponentPlaygroundPage() {
  // ponytail: design-branch review surface; never served on the production deployment
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <>
      {/* Fontshare for review only; production self-hosts via next/font/local (Phase C step 6).
          Same URL as system/index.html — adding more weights/italics makes Fontshare silently swap Ranade for another family. */}
      <link
        href="https://api.fontshare.com/v2/css?f[]=gambetta@400,500,400i&f[]=ranade@400,500&display=swap"
        precedence="default"
        rel="stylesheet"
      />
      <ComponentPlayground />
    </>
  );
}

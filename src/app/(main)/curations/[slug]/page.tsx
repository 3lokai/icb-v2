import { notFound } from "next/navigation";
import { getCuratorBySlug } from "@/data/curations";
import { CurationPage } from "@/components/curations/CurationPage";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCuratorBySlug(slug);

  if (!data) return { title: "Curator Not Found" };

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
  const title = `ICB × ${data.curator.name} | Indian Coffee Beans`;
  const description = (data.curator.story ?? "").slice(0, 160);
  const url = `${baseUrl}/curations/${slug}`;
  const ogImage = data.curator.logo?.startsWith("http")
    ? data.curator.logo
    : data.curator.logo
      ? `${baseUrl}${data.curator.logo.startsWith("/") ? "" : "/"}${data.curator.logo}`
      : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Indian Coffee Beans",
      type: "profile",
      ...(ogImage && {
        images: [
          { url: ogImage, width: 1200, height: 630, alt: data.curator.name },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const data = await getCuratorBySlug(slug);

  if (!data) {
    notFound();
  }

  return <CurationPage data={data} />;
}

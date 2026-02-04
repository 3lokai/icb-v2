import { notFound } from "next/navigation";
import { getCuratorBySlug } from "@/data/curations";
import { CurationPage } from "@/components/curations/CurationPage";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCuratorBySlug(slug);

  if (!data) return { title: "Curator Not Found" };

  return {
    title: `ICB × ${data.curator.name} | Indian Coffee Beans`,
    description: data.curator.story.slice(0, 160),
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

import { permanentRedirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Legacy lineup URL — permanently redirects to the paginated catalog on the
 * parent roaster profile (`/roasters/[slug]?page=N`).
 */
export default async function RoasterCoffeesPageRedirect({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/roasters/${slug}`);
}

import type { Metadata } from "next";
import { getGlossaryTermsServer } from "@/lib/glossary/server";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";
import { PageHeader } from "@/components/layout/PageHeader";
import { slugifyHeading } from "@/lib/utils";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

export const metadata: Metadata = generateSEOMetadata({
  title: "Specialty Coffee Glossary",
  description:
    "Confused by washed vs natural, or Arabica vs Robusta? This glossary helps you decode the coffee lingo — from brew to bean.",
  keywords: [
    "Indian coffee glossary",
    "coffee terms explained",
    "specialty coffee vocabulary India",
  ],
  canonical: `${baseUrl}/learn/glossary`,
});

export default function GlossaryPage() {
  const terms = getGlossaryTermsServer();

  if (terms.length === 0) {
    return (
      <>
        <h1 className="mb-4 text-display text-balance">
          Coffee Glossary - Indian Specialty Coffee Terms
        </h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-800">
            Debug: No glossary terms found
          </p>
          <p className="mt-2 text-red-600 text-caption">
            Check the browser console and server logs for debugging information.
          </p>
          <details className="mt-4">
            <summary className="cursor-pointer text-red-700">
              Debug Info
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 text-overline" />
          </details>
        </div>
      </>
    );
  }

  const termsByCategory = terms.reduce(
    (acc, term) => {
      const category = term.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(term);
      return acc;
    },
    {} as Record<string, typeof terms>
  );

  // A glossary is prime AI-citation surface but was emitting no page-level
  // JSON-LD at all. DefinedTermSet is the exact schema.org fit; each h3 carries
  // a matching anchor id so a term can be cited by URL.
  const definedTermSetSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${baseUrl}/learn/glossary`,
    name: "Specialty Coffee Glossary",
    description:
      "Indian specialty coffee terminology — processing, roast, brewing, and tasting terms defined.",
    url: `${baseUrl}/learn/glossary`,
    inLanguage: "en",
    hasDefinedTerm: terms.map((term) => ({
      "@type": "DefinedTerm",
      "@id": `${baseUrl}/learn/glossary#${slugifyHeading(term.term)}`,
      name: term.term,
      description: term.definition,
      ...(term.aliases?.length ? { alternateName: term.aliases } : {}),
      ...(term.category ? { termCode: term.category } : {}),
      inDefinedTermSet: `${baseUrl}/learn/glossary`,
    })),
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Learn", url: `${baseUrl}/learn` },
    { name: "Glossary", url: `${baseUrl}/learn/glossary` },
  ]);

  return (
    <>
      <StructuredData schema={[definedTermSetSchema, breadcrumbSchema]} />
      <PageHeader
        title="Coffee Glossary"
        overline="Learn"
        description="Confused by washed vs natural, or Arabica vs Robusta? This glossary helps you decode the coffee lingo — from brew to bean."
      />

      <div className="mb-4 text-muted-foreground text-caption">
        Found {terms.length} terms in {Object.keys(termsByCategory).length}{" "}
        categories
      </div>

      {Object.entries(termsByCategory).map(([category, categoryTerms]) => (
        <section className="mb-12" key={category}>
          <h2 className="mb-6 text-title">{category}</h2>
          <div className="grid-cards">
            {categoryTerms.map((term) => (
              <div
                className="card-base card-padding card-hover"
                key={term.term}
              >
                <h3
                  className="mb-2 scroll-mt-24 text-heading"
                  id={slugifyHeading(term.term)}
                >
                  {term.term}
                </h3>
                <p className="text-body text-muted-foreground">
                  {term.definition}
                </p>
                {term.aliases && term.aliases.length > 0 && (
                  <div className="mt-3">
                    <span className="text-caption">Also known as: </span>
                    <span className="text-caption">
                      {term.aliases.slice(0, 3).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

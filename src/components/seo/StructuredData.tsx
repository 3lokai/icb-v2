"use client";

type StructuredDataProps = {
  schema: Record<string, unknown>;
};

export default function StructuredData({ schema }: StructuredDataProps) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  );
}

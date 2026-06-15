type StructuredDataProps = {
  schema: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Serialize JSON-LD for safe embedding in a script element.
 * Escapes `<` and `>` so user-controlled strings cannot close the script block.
 */
function toSafeJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}

/**
 * StructuredData component for JSON-LD schema markup
 * Minifies JSON to reduce HTML size
 * Accepts single schema object or array of schemas
 */
export default function StructuredData({ schema }: StructuredDataProps) {
  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((singleSchema, index) => (
        <script
          key={index}
          dangerouslySetInnerHTML={{ __html: toSafeJsonLd(singleSchema) }}
          type="application/ld+json"
        />
      ))}
    </>
  );
}

type StructuredDataProps = {
  schema: Record<string, unknown> | Record<string, unknown>[];
};

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(singleSchema) }}
          type="application/ld+json"
        />
      ))}
    </>
  );
}

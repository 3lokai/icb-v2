"use client";

type StructuredDataProps = {
  schema: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * StructuredData component for JSON-LD schema markup
 * Minifies JSON to reduce HTML size
 * Accepts single schema object or array of schemas
 */
export default function StructuredData({ schema }: StructuredDataProps) {
  // Normalize to array format for consistent handling
  const schemas = Array.isArray(schema) ? schema : [schema];

  // Minify JSON by stringifying (JSON.stringify already removes unnecessary whitespace)
  // Use array format if multiple schemas, single object if one
  const minifiedJson =
    schemas.length === 1 ? JSON.stringify(schemas[0]) : JSON.stringify(schemas);

  return (
    <script
      dangerouslySetInnerHTML={{ __html: minifiedJson }}
      type="application/ld+json"
    />
  );
}

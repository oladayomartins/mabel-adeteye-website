/**
 * Emits a JSON-LD document. Kept in one place so escaping is handled
 * consistently and every page uses the same shape.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Values come from our own content layer, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Renders one or more JSON-LD blocks. Server component — the script ships in
// the static HTML, which is exactly what crawlers read. Pass a single schema
// object or an array (each becomes its own <script>).
export function JsonLd({ data }: { data: object | ReadonlyArray<object> }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

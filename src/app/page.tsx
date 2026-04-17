import { routing } from "@/i18n/routing";

// `output: "export"` has no runtime redirects, so `/` emits a static HTML
// page that meta-refreshes to the default locale. Hosting-layer rewrites
// can override this with a proper 308 in production.
export default function RootPage() {
  const target = `/${routing.defaultLocale}/`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <noscript>
        <a href={target}>Перейти на сайт</a>
      </noscript>
    </>
  );
}

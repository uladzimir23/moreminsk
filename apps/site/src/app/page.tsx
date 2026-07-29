import { routing } from "@/i18n/routing";
import { LocaleRedirect } from "./_components/LocaleRedirect";

// `output: "export"` has no runtime redirects, so `/` emits a static HTML
// page that meta-refreshes to the default locale. Hosting-layer rewrites
// can override this with a proper 308 in production.
export default function RootPage() {
  return <LocaleRedirect to={`/${routing.defaultLocale}/`} />;
}

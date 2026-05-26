import { SERVICES } from "@/shared/content/services";
import { SITE, localeUrl } from "@/shared/lib/seo";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// One entry per locale-less path, with ru/en hreflang alternates (the i18n
// sitemap shape Google recommends). URLs are absolute on the canonical origin,
// so the basePath of the GitHub Pages preview doesn't leak in. Extend the
// path lists as fleet/info pages land.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/fleet", "/services", "/contacts", "/faq"];
  const servicePaths = SERVICES.map((s) => `/services/${s.slug}`);
  const now = new Date();

  return [...staticPaths, ...servicePaths].map((path) => ({
    url: localeUrl(SITE.defaultLocale, path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/services/") ? 0.8 : 0.7,
    alternates: {
      languages: {
        ru: localeUrl("ru", path),
        en: localeUrl("en", path),
      },
    },
  }));
}

import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { SITE, localeUrl } from "@/shared/lib/seo";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// One entry per locale-less path, with ru/en hreflang alternates (the i18n
// sitemap shape Google recommends). URLs are absolute on the canonical origin,
// so the basePath of the GitHub Pages preview doesn't leak in. Extend the
// path lists as info pages land.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/fleet",
    "/services",
    "/ceny",
    "/galereya",
    "/otzyvy",
    "/contacts",
    "/faq",
    "/sertifikaty",
  ];
  const yachtPaths = YACHTS.map((y) => `/fleet/${y.slug}`);
  const servicePaths = SERVICES.map((s) => `/services/${s.slug}`);
  const now = new Date();

  const priorityFor = (path: string) => {
    if (path === "/") return 1;
    if (path.startsWith("/fleet/")) return 0.9;
    if (path.startsWith("/services/")) return 0.8;
    return 0.7;
  };

  return [...staticPaths, ...yachtPaths, ...servicePaths].map((path) => ({
    url: localeUrl(SITE.defaultLocale, path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: priorityFor(path),
    alternates: {
      languages: {
        ru: localeUrl("ru", path),
        en: localeUrl("en", path),
      },
    },
  }));
}

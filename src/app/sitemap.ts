import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { SITE, localeUrl } from "@/shared/lib/seo";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// One entry per path under the single ru locale (en снят с роутинга, см.
// i18n/routing.ts). URLs are absolute on the canonical origin, so the basePath
// of the GitHub Pages preview doesn't leak in. Когда вернётся en — добавить
// языковые alternates обратно.
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
    "/documents",
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
  }));
}

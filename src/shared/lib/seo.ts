import type { Metadata } from "next";

// Canonical production origin. Overridable via env, but defaults to the real
// domain so canonicals/OG/sitemap always point at prod — even from the GitHub
// Pages preview (which lives under a /moreminsk basePath we deliberately omit
// here). No trailing slash.
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://moreminsk.by").replace(/\/+$/, ""),
  name: "Море Minsk",
  alternateName: "ЯхтыМинска",
  defaultLocale: "ru",
  // en снят с роутинга (см. i18n/routing.ts) — массив схлопывается до одного ru.
  locales: ["ru"] as const,
  // Fallback social card until per-page OG images are generated.
  defaultOgImage: "/fleet/eva/Frame_160.jpg",
} as const;

export type SeoLocale = (typeof SITE.locales)[number];

const OG_LOCALE: Record<string, string> = { ru: "ru_RU", en: "en_US" };

// `trailingSlash: true` (next.config) → every exported route ends with "/".
// Build a locale-prefixed absolute URL from a locale-less path ("/", "/fleet",
// "/fleet/eva"). Keep canonical/hreflang/sitemap in lockstep with the files.
export function localeUrl(locale: string, path = "/"): string {
  const clean = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${SITE.url}/${locale}${clean}/`;
}

// Absolute URL for an asset/OG image on the canonical origin.
export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

type BuildMetaInput = {
  /** Keyword part only — the root layout appends " | Море Minsk" via title.template. */
  title: string;
  description: string;
  /** Locale-less path, leading slash. Defaults to home. */
  path?: string;
  locale: string;
  images?: string[];
  type?: "website" | "article";
  noindex?: boolean;
};

// Per-page Metadata factory implementing the doc's meta strategy: keyword-first
// title (+ brand via template), self-canonical, ru/en/x-default hreflang, and
// matching Open Graph + Twitter cards.
export function buildMetadata({
  title,
  description,
  path = "/",
  locale,
  images,
  type = "website",
  noindex,
}: BuildMetaInput): Metadata {
  const canonical = localeUrl(locale, path);
  const ogImages = (images ?? [SITE.defaultOgImage]).map(absoluteUrl);

  return {
    title,
    description,
    alternates: {
      canonical,
      // en снят с роутинга (см. i18n/routing.ts) → hreflang только ru +
      // x-default. Когда вернём en — добавить здесь.
      languages: {
        ru: localeUrl("ru", path),
        "x-default": localeUrl(SITE.defaultLocale, path),
      },
    },
    openGraph: {
      type,
      url: canonical,
      siteName: SITE.name,
      title,
      description,
      locale: OG_LOCALE[locale] ?? "ru_RU",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

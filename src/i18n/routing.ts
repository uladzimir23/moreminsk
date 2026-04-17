import { defineRouting } from "next-intl/routing";

// MVP: ru + en. `be` deferred post-MVP.
// `localePrefix: "as-needed"` — default locale (ru) at `/`, others prefixed (`/en/...`).
// Static export will pre-render `/ru/...` + `/en/...`; hosting-layer rewrites
// will surface ru routes at root (configured at deploy time).
export const routing = defineRouting({
  locales: ["ru", "en"],
  defaultLocale: "ru",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

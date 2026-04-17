import { defineRouting } from "next-intl/routing";

// MVP: ru + en. `be` deferred post-MVP.
// `localePrefix: "always"` — `/ru/...` и `/en/...`. Под `output: "export"`
// middleware отсутствует, поэтому `as-needed` рушится в dev (`/fleet/` → 500).
// Статический экспорт всё равно кладёт страницы в `/ru/` и `/en/`, так что
// явный префикс совпадает с реальной файловой структурой; хостинг-rewrite
// на прод поверх по-прежнему может зеркалить `/ru/...` на `/`.
export const routing = defineRouting({
  locales: ["ru", "en"],
  defaultLocale: "ru",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

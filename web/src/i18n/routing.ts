import { defineRouting } from "next-intl/routing";

// MVP: только ru. `en` снят с роутинга — реальных переводов в messages/en.json
// нет (только два ключа-заглушки), Tilda-аналитика за год показала ~0% спроса
// на en. Под `output: "export"` middleware отсутствует, поэтому `as-needed`
// рушится в dev (`/fleet/` → 500) — оставляем `always`, пути остаются
// `/ru/...`, на проде хостинг-rewrite зеркалит `/ru/` на корень. `be` и `en`
// — пост-MVP, когда появится реальный спрос.
export const routing = defineRouting({
  locales: ["ru"],
  defaultLocale: "ru",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

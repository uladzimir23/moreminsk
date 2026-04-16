---
type: architecture
tags: [architecture, routing, i18n, nextjs]
updated: 2026-04-16
---

# Routing & i18n

## Локали

| Локаль | Код | URL-префикс | Статус |
|---|---|---|---|
| Русский (default) | `ru` | `/` (без префикса) | **MVP** |
| Английский | `en` | `/en/` | **MVP** |
| Белорусский | `be` | `/be/` | Post-MVP (если будет спрос) |

> Решение заказчика (2026-04-17): MVP запускается с `ru` + `en`. Английская версия рассчитана на туристов и иностранных клиентов в Минске.

## Стратегия next-intl

- `localePrefix: "as-needed"` — default locale без префикса, остальные с префиксом
- Все страницы внутри `app/[locale]/...`
- `setRequestLocale(locale)` в каждом page/layout
- Переводы — в `messages/{locale}.po` (PO-формат для переводчиков)
- HTML `lang` атрибут задаётся из локали: `<html lang={locale}>`

## Конфиг

`src/shared/i18n/config.ts`:

```typescript
export const locales = ['ru', 'en'] as const;
export const defaultLocale = 'ru';
export type Locale = typeof locales[number];
```

`src/shared/i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'as-needed',
});
```

## URL-структура

```
/                              → RU главная
/en                            → EN главная
/fleet/eva                     → RU карточка EVA
/en/fleet/eva                  → EN карточка EVA
/services/svadba               → RU страница услуги
/en/services/svadba            → EN страница услуги
```

## Static export и routing

Next.js `output: "export"`:
- Не поддерживает middleware → нельзя редиректить по `Accept-Language`
- Решение: `<RedirectToLocale />` клиентский компонент на `/` если нужно + кнопка переключения
- `generateStaticParams` на каждом `[slug]` → все страницы пре-рендерятся

Пример `generateStaticParams` для /services/[slug]:

```typescript
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}
```

## Hreflang

В `<head>` каждой страницы:

```html
<link rel="alternate" hreflang="ru" href="https://moreminsk.by/services/svadba" />
<link rel="alternate" hreflang="en" href="https://moreminsk.by/en/services/svadba" />
<link rel="alternate" hreflang="x-default" href="https://moreminsk.by/services/svadba" />
```

Генерируется утилитой `generatePageMetadata()` в `lib/seo.ts`.

## Canonical

- Canonical всегда на текущую локаль (не на default): `<link rel="canonical" href={currentUrl} />`.

## Slug-конвенция

- Транслит русских названий через латиницу, без диакритики:
  - ✅ `svadba`, `den-rozhdeniya`, `devichnik`, `fotosessiya`
  - ❌ `свадьба`, `den_rozhdeniya`, `denRozhdeniya`
- Правила:
  - Lowercase
  - Дефис как разделитель
  - Без суффиксов `-minsk` (локация подразумевается)

## Fallback/404

- `src/app/[locale]/not-found.tsx` — кастомная 404 на локаль
- Ссылка на главную + на 3 популярные услуги
- При деплое на nginx: `try_files $uri $uri.html $uri/index.html /404.html;`

## Связанные документы
- [[Architecture Overview]]
- [[Структура проекта]]
- [[Build & Deploy]]

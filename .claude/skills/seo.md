---
description: SEO правила проекта — generateMetadata, JSON-LD Schema.org, sitemap, meta title/description формулы. Активируется при работе со страницами, lib/seo.ts, generateMetadata, JsonLd, sitemap.ts, robots.ts.
---

# Skill: SEO

> SEO — главный приоритет заказчика. Нарушение этих правил = нарушение бизнес-требования.

## 5 жёстких правил

1. **Каждая страница имеет `generateMetadata()`** — без исключений.
2. **НЕТ `<meta keywords>`** — заказчик явно просил удалить.
3. **Уникальные title и description** на каждой странице (не копируются между).
4. **JSON-LD на каждой странице** — через `<JsonLd />`.
5. **Title и description проверять по формулам** ([[docs/30 - SEO/Meta-стратегия]]).

## Формулы

### Title (50–60 символов)

`{Ключ} — {УТП/уточнение} | Море Minsk`

- Ключ в начале
- Бренд в конце
- Цифры работают лучше («от 150 BYN»)
- Избегать `«» * ( ) —` (ломает парсеры)

### Description (140–160 символов)

`[Что] [для кого] [УТП] [CTA]`

- Содержит ключ + 1–2 LSI
- НЕ копия title
- CTA в конце: «Забронируйте онлайн», «Свободные даты в Telegram»

### Готовые заготовки

`docs/30 - SEO/Meta-стратегия.md` — 11 страниц с готовыми title/description.

## generateMetadata pattern

```typescript
// src/app/[locale]/services/svadba/page.tsx
import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/lib/seo";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Свадьба на яхте в Минске — от 1500 BYN",
    description: "Свадебная церемония и банкет на яхте в Минске...",
    path: "/services/svadba",
    ogImage: "/og/svadba.jpg",
  });
}
```

## Утилита `buildPageMetadata`

`src/shared/lib/seo.ts` собирает Metadata объект:

```typescript
import type { Metadata } from "next";
import { SITE_URL, BRAND } from "@/shared/config/site";

interface Args {
  title: string; // без "| Море Minsk"
  description: string;
  path: string; // "/services/svadba"
  ogImage?: string; // относительный путь
  noIndex?: boolean;
}

export function buildPageMetadata({ title, description, path, ogImage, noIndex }: Args): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = `${title} | ${BRAND}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: BRAND,
      locale: "ru_RU",
      type: "website",
      images: ogImage ? [{ url: `${SITE_URL}${ogImage}`, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [`${SITE_URL}${ogImage}`] : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
```

## JSON-LD Schema.org

**Компонент `<JsonLd />`** (в `src/shared/ui/json-ld/`):

```tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
```

**На каждой странице** — ставим нужные типы:

| Тип                       | Страницы                        |
| ------------------------- | ------------------------------- |
| `Organization`, `WebSite` | app/[locale]/layout.tsx (везде) |
| `LocalBusiness`           | главная, /kontakty              |
| `Service`                 | /services/\*                    |
| `Product`                 | /fleet/\*                       |
| `FAQPage`                 | /faq, каждая /services/\*       |
| `BreadcrumbList`          | все кроме главной               |

Готовые JSON-LD шаблоны — в `docs/30 - SEO/Schema.org разметка.md`.

## Builders для JSON-LD

```typescript
// src/shared/lib/seo.ts

export function buildLocalBusinessSchema() { ... }
export function buildServiceSchema(service: Service) { ... }
export function buildProductSchema(yacht: Yacht) { ... }
export function buildFaqSchema(qas: { q: string; a: string }[]) { ... }
export function buildBreadcrumbsSchema(trail: { name: string; path: string }[]) { ... }
```

## sitemap.ts

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/config/site";
import { services } from "@/shared/content/services";
import { yachts } from "@/shared/content/yachts";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: `${SITE_URL}/`, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/ceny`, priority: 0.9, changeFrequency: "weekly" as const },
    // ...
  ];
  const servicePages = services.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));
  const fleetPages = yachts.map((y) => ({
    url: `${SITE_URL}/fleet/${y.slug}`,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  }));
  return [...staticPages, ...servicePages, ...fleetPages];
}
```

## robots.ts

```typescript
// src/app/robots.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

## Hreflang (если EN локаль в MVP)

Генерируется в `buildPageMetadata`:

```typescript
alternates: {
  canonical: url,
  languages: {
    ru: `${SITE_URL}${path}`,
    en: `${SITE_URL}/en${path}`,
    'x-default': `${SITE_URL}${path}`,
  },
}
```

## Slug-конвенция

- Только lowercase
- Транслит через латиницу: `svadba`, `den-rozhdeniya`, `devichnik`
- Дефис, не подчёркивание, не camelCase
- Без `-minsk` суффиксов (гео подразумевается)

## Валидация перед релизом

- [Schema.org Validator](https://validator.schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Яндекс Валидатор микроразметки](https://webmaster.yandex.ru/tools/microtest/)

## Чек-лист для новой страницы

- [ ] `generateMetadata()` с title ≤ 60, description ≤ 160
- [ ] Title содержит ключ в начале + бренд в конце
- [ ] Description содержит ключ + CTA
- [ ] OG-картинка 1200×630
- [ ] `<JsonLd />` с подходящим типом
- [ ] `<JsonLd />` c BreadcrumbList (если не главная)
- [ ] Canonical URL верный
- [ ] Страница добавлена в `sitemap.ts`
- [ ] H1 на странице = title (без «| Море Minsk»)
- [ ] Alt на каждом `<img>` (с ключом)

## Связанные

- SEO стратегия: `docs/30 - SEO/SEO стратегия.md`
- Meta-стратегия: `docs/30 - SEO/Meta-стратегия.md`
- Schema.org: `docs/30 - SEO/Schema.org разметка.md`
- Карта страниц: `docs/30 - SEO/Карта страниц.md`
- Семантическое ядро: `docs/30 - SEO/Семантическое ядро.md`

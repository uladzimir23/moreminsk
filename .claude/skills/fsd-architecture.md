---
description: FSD-lite архитектура проекта — слои app/widgets/features/entities/shared и правила импорта. Активируется при создании новых компонентов, виджетов, сущностей, рефакторинге структуры папок.
---

# Skill: FSD-lite архитектура

## Слои (сверху вниз)

```
app          — страницы Next.js, layouts, sitemap, robots
  ↓
widgets      — крупные UI-блоки страниц (Hero, FleetGrid, FAQ)
  ↓
features     — интерактивные фичи (Booking wizard, YachtFilter, BookingCTA, ThemeToggle, LocaleSwitcher)
  ↓
entities     — бизнес-сущности с карточками (Yacht, Service, Review)
  ↓
shared       — атомарный UI, утилиты, типы, стили, контент, конфиг
```

## Правила импорта

**Золотое правило:** импорт **только сверху вниз**.

```
✅ widgets/hero → entities/yacht    (widget импортит entity)
✅ widgets/hero → shared/ui/Button   (widget импортит shared)
❌ shared/ui/Button → widgets/hero   (shared НЕ импортит widgets)
❌ widgets/hero → widgets/footer     (между сиблингами нельзя)
```

## Слой: app

Только Next.js конвенции. **Не содержит бизнес-логику.**

```
src/app/
├── [locale]/
│   ├── layout.tsx            # html+body, global styles, JsonLd Organization
│   ├── page.tsx              # главная — собирается из widgets
│   ├── fleet/
│   │   ├── page.tsx          # /fleet — хаб
│   │   └── [slug]/page.tsx   # /fleet/eva
│   └── services/[slug]/page.tsx
├── layout.tsx                # root (пустой)
├── not-found.tsx
├── sitemap.ts
└── robots.ts
```

Page-файл — только сборка виджетов + `generateMetadata`:

```tsx
// src/app/[locale]/services/svadba/page.tsx
import { Hero } from "@/widgets/hero";
import { PriceTable } from "@/widgets/price-table";
import { Gallery } from "@/widgets/gallery";
import { FAQ } from "@/widgets/faq";
import { BookingCTA } from "@/features/booking";
import { services } from "@/shared/content/services";

export function generateMetadata() {
  return buildMetadata({ page: "services/svadba" });
}

export default function SvadbaPage() {
  const service = services.find((s) => s.slug === "svadba")!;
  return (
    <>
      <Hero title={service.h1} lead={service.description} />
      <PriceTable packages={service.packages} />
      <Gallery images={service.gallery} />
      <BookingCTA source="service:svadba" />
      <FAQ scope="svadba" />
    </>
  );
}
```

## Слой: widgets

Крупные UI-блоки. **Не знает о конкретных страницах.** Принимает данные через пропсы.

```
src/widgets/hero/
├── Hero.tsx
├── Hero.module.scss
├── types.ts      # HeroProps
└── index.ts      # export { Hero } from './Hero'
```

**Пример:**

```tsx
// src/widgets/hero/Hero.tsx
import { Button } from "@/shared/ui/button";
import styles from "./Hero.module.scss";

export interface HeroProps {
  title: string;
  lead: string;
  primaryCta?: { label: string; href: string };
}

export function Hero({ title, lead, primaryCta }: HeroProps) {
  return (
    <section className={styles.root}>
      <h1>{title}</h1>
      <p>{lead}</p>
      {primaryCta && (
        <Button asChild>
          <a href={primaryCta.href}>{primaryCta.label}</a>
        </Button>
      )}
    </section>
  );
}
```

## Слой: features

Интерактивные фичи — форма, фильтр, кнопка с действием. Содержит state / effects.

```
src/features/booking/
├── BookingCTA.tsx          # кнопка-триггер, открывает AppPanel('order')
├── ui/
│   ├── BookingWizard.tsx   # 'use client' — контейнер 6 шагов
│   ├── steps/
│   │   ├── StepYacht.tsx
│   │   ├── StepDateTime.tsx
│   │   ├── StepPackage.tsx
│   │   ├── StepContact.tsx
│   │   ├── StepSummary.tsx
│   │   └── StepSuccess.tsx
│   └── *.module.scss
├── model/
│   ├── store.ts            # zustand + sessionStorage persist
│   ├── schema.ts           # zod per-step
│   ├── availability.ts     # pluggable AvailabilityProvider
│   ├── price.ts            # calcPrice()
│   ├── submit.ts           # Telegram + Resend через Promise.allSettled
│   └── format-telegram.ts
└── index.ts                # export { BookingCTA }
```

## Слой: entities

Бизнес-сущности + их «карточки» (UI-представление).

```
src/entities/yacht/
├── ui/
│   ├── YachtCard.tsx
│   └── YachtCard.module.scss
├── model/
│   └── types.ts            # export type Yacht
└── index.ts                # export { YachtCard, type Yacht }
```

**Тип сущности:**

```typescript
// src/entities/yacht/model/types.ts
export type YachtType = "sail" | "motor" | "sail-motor";

export interface Yacht {
  slug: string;
  name: string;
  type: YachtType;
  capacity: number;
  pricePerHour: number;
  // ...
}
```

## Слой: shared

Всё, что переиспользуется и не содержит бизнес-логики.

```
src/shared/
├── design-system/   # ТОКЕНЫ + МИКСИНЫ + БАЗА (по образцу flex-glass DS)
│                    # tokens/, mixins/, base/, primitives/, components/ (зарезервировано под flex-glass пакет)
├── ui/              # Атомарные компоненты ПРОЕКТА на DS-токенах:
│                    # Button, Input, Modal, Accordion, Container, Section, Heading, JsonLd
├── lib/             # cn, format, seo helpers
├── i18n/            # config, routing
├── content/         # yachts.ts, services.ts, faq.ts (контент-as-code)
├── hooks/
└── config/          # site.ts (SITE_URL, бренд)
```

> **Где живут UI-компоненты:** в `src/shared/ui/` (Button, Input, Modal и т.д.) — это наши атомарные компоненты ПРОЕКТА, построенные на DS-токенах. Папка `src/shared/design-system/components/` зарезервирована под прямой импорт из flex-glass пакета (когда он будет извлечён) — не дублируем.

## Публичный API через `index.ts`

Каждый модуль (widget, feature, entity) экспортирует только через свой `index.ts`:

```typescript
// src/widgets/hero/index.ts
export { Hero } from "./Hero";
export type { HeroProps } from "./types";
```

Импорт:

```typescript
// ✅
import { Hero } from "@/widgets/hero";

// ❌
import { Hero } from "@/widgets/hero/Hero";
```

## tsconfig paths

```json
{
  "compilerOptions": {
    "paths": {
      "@/app/*": ["./src/app/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/features/*": ["./src/features/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

## Когда создавать новый слой

| Создаю...                     | Куда                      | Пример                                   |
| ----------------------------- | ------------------------- | ---------------------------------------- |
| Страницу (URL)                | `app/`                    | /services/svadba                         |
| Блок страницы без состояния   | `widgets/`                | Hero, PriceTable                         |
| Интерактивная фича со state   | `features/`               | Booking wizard, YachtFilter, ThemeToggle |
| Бизнес-сущность и её карточку | `entities/`               | Yacht, Service                           |
| Атомарный UI (кнопка, инпут)  | `shared/ui/`              | Button, Input                            |
| Утилиту/хелпер                | `shared/lib/`             | cn, formatPrice                          |
| Тип/конфиг/контент            | `shared/{содержательно}/` | types, content                           |

## Когда НЕ создавать новый слой

- Новая страница похожа на существующую — **используй [slug]** в app
- Компонент используется в одном месте — оставь **inline** внутри widget'а
- «Может пригодится в будущем» — **не создавай** преждевременно

## Связанные

- ADR-003: `docs/40 - Architecture/42 - ADR/ADR-003 FSD-lite архитектура.md`
- Структура проекта: `docs/40 - Architecture/Структура проекта.md`

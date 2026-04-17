---
type: architecture
tags: [architecture, overview, modules, map]
updated: 2026-04-17
---

# Project Overview — module map

> Полная карта модулей проекта **moreminsk.by**: какие слои есть, какие виджеты/фичи внутри, кто чем владеет, как они общаются. Обновляется при добавлении/удалении значимых модулей.

> **Старт работ по проекту** — с чтения этого документа + [[Architecture Overview]] + [[../00 - Indexes/Dashboard]].

---

## TL;DR — одна картинка

```
┌─────────────────────────────────────────────────────────────────────┐
│  app/[locale]/...                                                   │
│  ├─ providers/  — ThemeProvider + PanelProvider + NextIntlClient    │
│  └─ pages       — page.tsx собирает widgets                         │
│         │                                                           │
│         ▼                                                           │
│  widgets/ — крупные блоки страницы                                  │
│  appbar · bottom-nav · app-panel · hero · fleet-grid                │
│  services-grid · price-table · gallery · reviews · faq              │
│  cta-form · why-us · contacts · footer                              │
│         │                                                           │
│         ▼                                                           │
│  features/ — интерактивные фичи (state/effects)                     │
│  booking (wizard) · yacht-filter · theme-toggle · locale-switcher   │
│  booking-cta                                                        │
│         │                                                           │
│         ▼                                                           │
│  entities/ — бизнес-сущности + карточки                             │
│  yacht (YachtCard) · service (ServiceCard) · review (ReviewCard)    │
│         │                                                           │
│         ▼                                                           │
│  shared/                                                            │
│  ├─ design-system/ — токены/миксины/база (из flex-glass)            │
│  ├─ ui/            — Button, Input, Card, Accent, Logo, Image, ... │
│  ├─ lib/           — seo, theme, panel, cn, format                  │
│  ├─ i18n/          — config, routing                                │
│  ├─ content/       — yachts.ts, services.ts, reviews.ts, faq.ts     │
│  ├─ hooks/         — useLockBodyScroll, useReducedMotion, ...       │
│  └─ config/        — site.ts (SITE_URL, бренд)                      │
└─────────────────────────────────────────────────────────────────────┘
```

Импорт строго **сверху вниз**. Виджет не импортит другой виджет напрямую.

---

## Слой `app/`

Слой Next.js — страницы, layouts, провайдеры, sitemap/robots. **Бизнес-логики не содержит** — только сборка виджетов и метаданные.

### `app/[locale]/`

| Маршрут | Что | Source data |
|---|---|---|
| `/` | Главная: hero + why-us + fleet-grid + services-grid + reviews + faq + cta-form | yachts.ts, services.ts, reviews.ts, faq.ts |
| `/fleet` | Хаб флота с фильтрами (`yacht-filter` через AppPanel) | yachts.ts |
| `/fleet/[slug]` | Карточка яхты: hero + gallery + price-table + reviews + cta-form | yachts.ts (find by slug) |
| `/services` | Хаб услуг | services.ts |
| `/services/[slug]` | Лендинг услуги: hero + price-table + gallery + cta-form + reviews + faq | services.ts (find by slug) |
| `/ceny` | Сводная прайс-таблица всех яхт × всех тарифов | yachts.ts |
| `/galereya` | Галерея с фильтром по событиям | gallery.ts |
| `/otzyvy` | Все отзывы с фильтром | reviews.ts |
| `/kontakty` | Адрес, карта, мессенджеры, форма | site.ts + cta-form |
| `/o-nas` | О компании, команда, история | content/team.ts |
| `/faq` | Полный FAQ (расширенный) | faq.ts |
| `/legal/politika`, `/legal/oferta` | Правовые документы | content/legal/ |

Каждая страница экспортирует:
- `default function Page({ params })` — JSX из виджетов
- `generateMetadata({ params })` — title/description/og/canonical/hreflang через `lib/seo.ts`
- `generateStaticParams()` — для динамических роутов (см. ADR-002)

### `app/providers/` — провайдер-стек

```tsx
// app/providers/index.tsx
<NextIntlClientProvider locale={locale} messages={messages}>
  <ThemeProvider initial={theme}>
    <PanelProvider>
      {children}
      <AppPanel />   {/* единственный экземпляр на всё дерево */}
    </PanelProvider>
  </ThemeProvider>
</NextIntlClientProvider>
```

| Провайдер | Что хранит | Где лежит логика |
|---|---|---|
| `NextIntlClientProvider` | Локаль + словарь | `shared/i18n/` |
| `ThemeProvider` | `'light' \| 'dark' \| 'system'` + sync с `localStorage` ('moreminsk-theme') и `StorageEvent` | `shared/lib/theme/` |
| `PanelProvider` | `{ isOpen, mode, payload }` + `open(mode, payload)` / `close()` | `shared/lib/panel/` |

> **Anti-FOUC inline-script** в `<head>` (ADR-006) выставляет класс темы **до** hydration — иначе мерцание при загрузке.

### Технические файлы

- `app/sitemap.ts` — итерирует по `yachts/services` и локалям, отдаёт массив URL
- `app/robots.ts` — `User-agent: * / Allow: /` + `Sitemap: https://moreminsk.by/sitemap.xml`
- `app/opengraph-image.tsx` — динамический OG главной (через `@vercel/og` или `satori`)
- `app/not-found.tsx` — кастомная 404 на каждую локаль

---

## Слой `widgets/`

Крупные UI-блоки страниц. Не содержат своего бизнес-state (используют контексты или принимают данные пропсами).

### Навигационные

#### `widgets/appbar/` (ADR-004, 005)
- **Что:** top-навигация во всех локалях, на mobile и desktop
- **Mobile:** `[Logo] _____ [ThemeToggle] [LocaleSwitcher] [✈ Telegram]` — лого слева, три icon-button по 40×40 справа (без бургера — нав в bottom-nav)
- **Desktop (≥ lg):** `[Logo + tagline] [Главная Флот Услуги Цены Контакты] [ThemeToggle] [LocaleSwitcher] [Заказать]` — лого слева, horizontal nav в центре, theme + lang + primary CTA справа
- **ThemeToggle и LocaleSwitcher всегда в Appbar** на всех breakpoints — глобальные настройки UI, доступ в один клик
- **Scroll-state:** при `scroll > 20px` — `backdrop-filter: blur(20px) saturate(180%)` + полупрозрачный фон + hairline-бордер снизу (iOS thin material через `mx.material('thin')`)
- **Высота:** `--appbar-height: 56px` mobile, `80px` desktop
- **Использует:** `shared/ui/logo`, `features/theme-toggle`, `features/locale-switcher`, `shared/ui/button` (CTA на desktop)

#### `widgets/bottom-nav/` (ADR-004, mobile only)
- **Что:** Fixed bottom-нав, 5 пунктов, центральный — accent CTA
- Учитывает `env(safe-area-inset-bottom)` через `mx.safe-area-padding`
- Активный пункт — `--color-primary`
- Иконки Lucide 16-20px, лейбл 11px

| # | Иконка | Лейбл | Действие |
|---|---|---|---|
| 1 | `Home` | Главная | `<Link href="/">` |
| 2 | `Sailboat` | Флот | `<Link href="/fleet">` |
| 3 | `Plus` | **Заказать** | `usePanel().open('order')` (центр, accent, чуть выше) |
| 4 | `Sparkles` | Услуги | `<Link href="/services">` |
| 5 | `Menu` | Ещё | `usePanel().open('more')` |

#### `widgets/app-panel/` (ADR-007)
- **Что:** единый bottom-sheet (mobile) / floating side-drawer (desktop) — заменяет все модалки/sheet/drawer
- **Контекст:** `usePanel()` → `{ isOpen, mode, payload, open, close }`
- **Mobile (`< md`):** bottom-sheet с drag-handle (4×40px), `max-height: 92dvh`, drag-to-dismiss 120px+, backdrop `rgba(0,0,0,0.4)` + blur 8px
- **Desktop (`≥ md`):** floating side-drawer справа, ширина 27rem, начинается под appbar, backdrop `rgba(0,0,0,0.05)` + blur 3px
- **Easing:** `var(--ease-sheet)`, open `--duration-slow`, close `--duration-medium`
- **Закрытие:** ESC / тап backdrop / drag вниз 120px+ / кнопка X в header
- **Реализация:** портал в `<body>`, body scroll lock, focus trap, ARIA dialog

| Режим | Контент | Триггер |
|---|---|---|
| `'order'` | Wizard брони (`features/booking/BookingForm`) — 6 шагов | BottomNav центр / Appbar CTA / Hero / YachtCard «Забронировать» |
| `'fleet-filter'` | `features/yacht-filter` | Кнопка фильтров на `/fleet` |
| `'more'` | Вторичная нав (FAQ / Отзывы / Цены / О нас / Контакты) | BottomNav 5-я (mobile) |
| `'gallery'` | Lightbox со swipe (`widgets/gallery/Lightbox`) | Тап на фото в `widgets/gallery` |

### Контентные

| Виджет | Что | Ключевые детали |
|---|---|---|
| `widgets/hero` | Первый экран. Photo-first на mobile, split-screen на desktop. Glow-pseudoelement, floating-card («3 свободные даты»). Eyebrow → H1 (с одним `<Accent>`) → Lead → 2 CTA → 3 квик-стата. | `framer-motion` staggered fade-up; image без анимации (LCP) |
| `widgets/fleet-grid` | Сетка `<YachtCard />`. На mobile 1 колонка, `md` 2, `lg` 3. | Использует `entities/yacht/ui/YachtCard` |
| `widgets/services-grid` | Сетка `<ServiceCard />`. Аналогичная адаптивность. | `entities/service` |
| `widgets/price-table` | Сводная таблица цен (час/полдня/день/ночь × яхты). Tabular-nums (`.tabular`). | На mobile horizontal scroll с **sticky первой колонкой** (`position: sticky; inset-inline-start: 0`). CTA в каждой строке → `panel.open('order', { yachtSlug })` с предзаполнением |
| `widgets/gallery` | Galery grid → тап → `panel.open('gallery', { index })`. AVIF/WebP через `<Image />`. | LCP-фото `loading="eager"` |
| `widgets/reviews` | 3-5 карточек отзывов через `entities/review/ui/ReviewCard`. Кавычки `« »` через `<Accent italic={false}>`. | Snap-scroll на mobile, grid на desktop |
| `widgets/faq` | Аккордеон (Radix Accordion). JSON-LD FAQPage в `<JsonLd />`. | Свёрнут по умолчанию |
| `widgets/cta-form` | In-page inline-wizard (для `services/[slug]`). Альтернатива `panel.open('order')`. | Использует `features/booking` в inline-режиме |
| `widgets/why-us` | 3-4 «кита» (преимущества) с иконками Lucide. | На surface-alt фоне |
| `widgets/contacts` | Адрес + карта (Yandex/Google) + кликабельные `tel:` / `mailto:` / Telegram. | iframe карты только при clicked-to-load (perf) |
| `widgets/footer` | Контакты, юр.инфо, навигация, theme-toggle, lang-switcher | На surface-alt |

### Section-level конвенции

Все виджеты-секции:
- Используют `mx.section-rhythm` (padding-block через `--section-padding-mobile/desktop`)
- Обёрнуты в `shared/ui/container` с `--container-max: 75rem`
- Начинаются с `<SectionHeader eyebrow title subtitle />` (если нужен)
- Имеют entrance-анимацию (Framer Motion `useInView` с `once: true`, threshold 0.15)

См. подробности — [[../50 - Design/Hero & Section Rhythm]].

---

## Слой `features/`

Интерактивные фичи. Содержат state, effects, валидацию. **Используют widgets как обёртку**, не наоборот.

### `features/booking/`

> **Главная бизнес-фича проекта.** Полная спецификация — [[Booking Module]]. Здесь — структурный слой.

```
features/booking/
├── BookingForm.tsx           ('use client', root wizard)
├── BookingForm.module.scss
├── ui/
│   ├── steps/                # YachtStep, DateTimeStep, PackageStep, ContactStep, SummaryStep, SuccessStep
│   ├── StepIndicator.tsx
│   ├── Calendar.tsx          # Простой календарь (MVP — без busy-dates)
│   ├── DurationPicker.tsx    # 1/2/3/4h · 6h · день · ночь · multi-day
│   └── PackageOption.tsx
├── model/
│   ├── store.ts              # useBookingStore (zustand + sessionStorage persist)
│   ├── schema.ts             # zod per-step schemas
│   ├── submit.ts             # submitBooking() → Telegram + Resend (manager + client)
│   ├── availability.ts       # AvailabilityProvider interface (pluggable for Phase 2+)
│   ├── durations.ts          # DURATION_OPTIONS
│   ├── messages.ts           # Telegram HTML + React Email templates
│   └── types.ts
├── lib/
│   ├── price-calc.ts         # calcPrice() — 'on-request' для turnkey/multi-day
│   └── format-booking.ts
└── index.ts
```

- **UX:** 6-шаговый wizard (Яхта → Дата+длит. → Пакет → Контакты → Summary → Success). Триггеры: BottomNav «+», Appbar «Заказать», Hero CTA, YachtCard, `/fleet/[slug]`, in-page на `/services/[slug]` (inline-режим без AppPanel).
- **Календарь (MVP):** простой месячный, дисаблит только прошлые даты. `AvailabilityProvider` — pluggable interface для Phase 2 (Google Calendar iCal) / Phase 3 (Cal.com) без переписывания UI.
- **Submit:** `Promise.allSettled` параллельно в Telegram Bot API + Resend (manager) + Resend (client, если указан email). Success показывается если ≥1 из канала прошёл.
- **Без депозита.** Только заявка — оплата офлайн по согласованию с менеджером.
- **Политика конфиденциальности:** чекбокс в Step 5 со ссылкой на `/[locale]/legal/politika`. Шаблон текста — [[../60 - Content/Политика конфиденциальности (шаблон)]].
- **Пакеты «под ключ»:** цена не считается, показываем «По запросу», менеджер рассчитывает индивидуально.
- **Аналитика:** `booking_open/step_complete/abandon/submit/error` события в GA4 + Я.Метрика.
- **Используется в:** `widgets/app-panel` (mode='order'), `widgets/cta-form` (inline-режим).

### `features/yacht-filter/`

- **Параметры фильтрации (все из модели yacht):**
  - `type` — sail / motor / sail-motor
  - `capacity` — ≥ N чел (range или radio-ступени 2/4/6/8/12)
  - `priceRange` — `[min, max]` BYN/час (range slider)
  - `lengthMeters` — диапазон длины в метрах
  - `date` — свободность на конкретную дату (через `AvailabilityProvider` — MVP всегда `true`)
- **URL-state** — все фильтры синхронизируются с `?type=sail&capacity=6&price=100-300&date=2026-05-15` через `useSearchParams()` + `router.replace()`. Цели:
  1. Share-ссылки (отправить выборку другу)
  2. Back/forward браузера — возврат сохраняет фильтры
  3. Reload-safe — рефреш не сбрасывает
  4. SEO — возможность индексации популярных фильтр-комбинаций как посадочных
  5. Аналитика — видно какие фильтры применяют
- **Mobile:** рендерится в `<AppPanel mode='fleet-filter' />`, применение — по кнопке «Показать N яхт»
- **Desktop:** sidebar слева на `/fleet`, применяется в реальном времени (debounce 200ms)
- **«Очистить фильтры»** — reset query params, возврат к дефолту

### `features/theme-toggle/`

- **Размещение:** в Appbar (постоянно, на всех breakpoints), также в Footer как fallback
- Icon-button 40×40, циклическая смена через `useTheme()`: `system → light → dark → system`
- Иконка Lucide: `Monitor` (system) / `Sun` (light) / `Moon` (dark)
- Tooltip на hover (desktop) с текущим режимом

### `features/locale-switcher/`

- **Размещение:** в Appbar (постоянно, на всех breakpoints), также в Footer как fallback
- Кнопка `[RU/EN]` (текущая локаль крупнее, альтернатива приглушённая) → переход на ту же страницу в другой локали через `next-intl/navigation`
- На mobile — компактный icon-button 40×40 со сменой текста (`RU` ↔ `EN`)
- Не auto-detect (см. skill `nextjs-static-export`)

### `features/booking-cta/`

- Универсальная кнопка «Забронировать» — открывает `panel.open('order', { yachtSlug })` / `{ serviceSlug }`
- Используется в YachtCard, Hero, ServiceCard, Appbar (desktop), BottomNav (mobile)
- Логика предзаполнения payload → см. [[Booking Module#Точки-входа-(триггеры)]]

---

## Слой `entities/`

Бизнес-сущности + UI-карточки (минимальные, без бизнес-логики).

### `entities/yacht/`

```ts
// model/types.ts
export type YachtType = 'sail' | 'motor' | 'sail-motor';

export interface Yacht {
  slug: string;            // 'eva' | 'alfa' | 'mario' | 'bravo'
  name: string;            // 'EVA'
  type: YachtType;
  capacity: number;        // макс. гостей
  lengthMeters: number;
  pricePerHour: number;    // BYN
  pricePerHalfDay: number;
  pricePerDay: number;
  pricePerNight: number;
  description: string;
  features: string[];      // ['кают-компания', 'туалет', 'кухня', ...]
  photos: { src: string; alt: string }[];
  videoUrl?: string;
  available: boolean;
}
```

UI: `YachtCard.tsx` — фото 16:9 + 4 превью + имя (`<Accent weight={500}>`) + тип/чел/длина + цена с `.tabular` + кнопки [Подробнее] [Забронировать → `panel.open('order', { yachtSlug })`].

### `entities/service/`

```ts
export interface Service {
  slug: string;            // 'svadba' | 'den-rozhdeniya' | 'fotosessiya' | ...
  name: string;
  h1: string;              // SEO-оптимизированный
  description: string;
  packages: PriceLevel[];
  gallery: { src: string; alt: string }[];
  faq?: FaqItem[];
  yachtRecommendations?: string[]; // slugs
}
```

UI: `ServiceCard.tsx` — иллюстрация + название + 1 строка лида + «от X BYN» + кнопка «Подробнее».

### `entities/review/`

```ts
export interface Review {
  id: string;
  authorName: string;       // 'Анна К.'
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;             // ISO
  text: string;
  occasionType: ServiceSlug;
  yachtSlug?: string;
  sourceUrl?: string;       // ссылка на Instagram, etc.
  authorPhoto?: string;
}
```

UI: `ReviewCard.tsx` — avatar + имя + ★ + дата + цитата (`« »` через `<Accent italic={false}>`) + теги (event/yacht) + ссылка-источник.

---

## Слой `shared/`

### `shared/design-system/` — токены, миксины, база

> Архитектура целиком взята из `~/Documents/flex-glass/src/shared/design-system/` (ветка `feat/design-system`). См. [[../50 - Design/Design System]] и `.claude/skills/scss-modules.md`.

```
design-system/
├── index.scss              # Точка входа, импортится в app/[locale]/layout.tsx
├── tokens/
│   ├── _tokens.scss        # primitive + semantic + component CSS vars + cascade layers + @property + dark theme
│   ├── _variables.scss     # Sass-переменные (только $breakpoints map)
│   └── _index.scss
├── mixins/
│   ├── _mixins.scss        # respond-to, container-query, dark-mode, safe-area-padding, reduced-motion, ...
│   ├── _materials.scss     # @mixin material('thin'/'regular'/'thick')
│   ├── _animations.scss    # @mixin tap-scale, fade-in + keyframes
│   └── _index.scss
├── base/
│   ├── _reset.scss
│   ├── _typography.scss
│   ├── _layout.scss
│   └── _index.scss
├── primitives/             # (зарезервировано — будут импортироваться из @flex-glass пакета)
└── components/             # (зарезервировано — наши UI идут в shared/ui)
```

**Что переопределяем (moreminsk-специфика):**
- Бренд-палитра — sea-navy + sunset coral + warm sand (ADR-006)
- Шрифты — Manrope + Lora через `next/font/google` (ADR-008)
- Component-токены — `--appbar-height`, `--bottomnav-height`, `--sheet-radius`, и т.д.

### `shared/ui/` — атомарные компоненты

Полный inventory + спецификации — [[../50 - Design/Component Specs]].

| Компонент | Roli | Где используется |
|---|---|---|
| `Button` | 5 variants (primary/secondary/ghost/outline/icon) × 3 sizes (sm/md/lg). Capsule, tap-scale. | Везде |
| `Input`, `Textarea` | radius `--radius-md` (12px), `font-size: max(1rem, 1em)` anti-zoom iOS | BookingForm |
| `Select`, `Checkbox`, `Radio` | На Radix UI headless | BookingForm, YachtFilter |
| `Accordion` | Radix Accordion | FAQ widget |
| `Tooltip` | Radix Tooltip | Бейджи, info-icons |
| `Badge` | Capsule с pulse-dot (для «Свободно сегодня») | YachtCard, Hero floating-card |
| `Card` | Border-radius 24px (`--radius-2xl`), `--shadow-md` | YachtCard, ServiceCard, ReviewCard |
| `Container` | `inline-size: min(100% - 2 × var(--space-md), var(--container-max))` | Все секции |
| `Section` | Wrapper с `mx.section-rhythm` | Все виджеты-секции |
| `SectionHeader` | Eyebrow + Title + Subtitle, `align="left/center"` | Все секции |
| `Heading` | `<h1>..<h6>` через `level` prop, `as` для override | Везде |
| `Text` | Body variants (lg/md/sm/xs, weight) | Везде |
| `Accent` | `<Accent weight={400/500} italic={true/false}>` — Lora обёртка. Max 5/страница. | Hero H1, YachtCard name, ReviewCard quotes |
| `Logo` | Wordmark Manrope, 3 lockup (full/compact/mark). Единственная точка swap при появлении SVG-лого. | Appbar, Footer, OG-templates |
| `Image` | `<picture>` со `srcset` (640/1024/1920) WebP + AVIF из prebuild оптимизации | Везде |
| `JsonLd` | Server Component для рендера `<script type="application/ld+json">` | Все страницы |
| `Spinner`, `Skeleton` | Loading-states | BookingForm, dynamic content |

### `shared/lib/`

| Модуль | Что |
|---|---|
| `lib/seo.ts` | `generatePageMetadata()`, JsonLd builders (Organization, LocalBusiness, FAQPage, BreadcrumbList) |
| `lib/theme/` | `useTheme()` хук, `createThemeStore()` — sync с `localStorage` и `StorageEvent` (ADR-006) |
| `lib/panel/` | `usePanel()` хук, `PanelProvider` контекст (ADR-007) |
| `lib/cn.ts` | `className` helper (`(...classes) => filter(Boolean).join(' ')`) |
| `lib/format.ts` | `formatPrice(byn)`, `formatPhone(+375...)`, `formatDate(iso, locale)` |

### `shared/i18n/`

| Файл | Что |
|---|---|
| `i18n/config.ts` | `export const locales = ['ru', 'en'] as const; export const defaultLocale = 'ru';` |
| `i18n/routing.ts` | `defineRouting({ locales, defaultLocale, localePrefix: 'as-needed' })` |
| `i18n/request.ts` | `getRequestConfig` для server components |

### `shared/content/` — контент-as-code (MVP без CMS)

Все тексты яхт/услуг/отзывов/FAQ — в `.ts` файлах. Типизированы. После MVP — миграция на headless CMS (Sanity/Strapi).

### `shared/hooks/`

| Хук | Что |
|---|---|
| `useLockBodyScroll` | Блокирует scroll body при открытом AppPanel |
| `useReducedMotion` | Возврашает `prefers-reduced-motion` (Framer Motion имеет свой, но мы ещё проверяем для CSS-анимаций) |
| `useMediaQuery(bp)` | Для условного рендера зависящего от breakpoint |

### `shared/config/site.ts`

```ts
export const SITE = {
  url: 'https://moreminsk.by',
  name: 'Море Minsk',
  shortName: 'Море Minsk',
  tagline: 'Яхты для впечатлений на Минском водохранилище',
  phone: '+375 29 695 36 36',
  telegram: '@moreminsk',
  email: 'hello@moreminsk.by',
  address: 'Ждановичи, Минский район',
  coordinates: { lat: 53.957, lng: 27.421 },
} as const;
```

---

## Поток данных (data flow)

```
content/yachts.ts ──┐
content/services.ts ├──→ lib/seo.ts ──→ <JsonLd /> + generateMetadata
content/reviews.ts ─┘                       │
                                            ▼
                          [locale]/services/[slug]/page.tsx
                                            │
                  ┌─────────────────────────┼─────────────────────────┐
                  ▼                         ▼                         ▼
           widgets/appbar           widgets/hero              widgets/cta-form
                  +                         +                         │
           widgets/bottom-nav       widgets/price-table               ▼
                  +                         +                  features/booking
           widgets/app-panel  ◀──    widgets/gallery           (inline wizard)
                  ▲                         +                         │
                  │                  widgets/reviews            submitBooking()
                  │                         +                         │
                  │                  widgets/faq      ┌───────────────┼────────────────┐
                  │                                   ▼               ▼                ▼
                  │                          Telegram Bot API   Resend (manager)  Resend (client)
                  │                          (NEXT_PUBLIC_*)    NEXT_PUBLIC_*     — если email указан
                  │
        usePanel().open('order') ◀── BookingCTA / YachtCard / Hero CTA
        usePanel().open('gallery', { index }) ◀── Gallery thumb tap
        usePanel().open('fleet-filter') ◀── /fleet «Фильтры»
        usePanel().open('more') ◀── BottomNav 5-я кнопка
```

> **Нет внутренних API routes.** `output: "export"` запрещает их (ADR-002). Формы отправляются прямо из браузера в третьи сервисы. Read-only токены публикуются в `NEXT_PUBLIC_*` env vars.

---

## Внешние зависимости и интеграции

| Зависимость | Назначение | Где используется |
|---|---|---|
| `next` (16) | Framework | везде |
| `react`, `react-dom` (19) | UI runtime | везде |
| `next-intl` (4.7) | i18n | `app/[locale]/`, `shared/i18n/` |
| `next/font/google` | Manrope, Lora | `app/[locale]/layout.tsx` |
| `@radix-ui/*` | Headless UI primitives | `shared/ui/{accordion,select,checkbox,radio,tooltip,...}` |
| `lucide-react` | Иконки SVG | везде |
| `framer-motion` | Анимации | `widgets/hero`, `widgets/app-panel`, `shared/ui/accordion` |
| `react-hook-form` | Формы | `features/booking` (per-step) |
| `zod` | Schema-валидация | `features/booking/model/schema.ts` |
| `zustand` | Wizard state + sessionStorage persist | `features/booking/model/store.ts` |
| `libphonenumber-js` | Валидация телефонов (BY/RU/UA) | `features/booking/model/schema.ts` |
| `react-email` (devDep) | HTML-шаблоны для Resend | `features/booking/model/messages.ts` |
| `clsx` или ручной `cn` | className helper | `shared/lib/cn.ts` |
| `sharp` (devDep) | Prebuild оптимизация фото | `scripts/optimize-images.ts` |
| `@vercel/og` или `satori` (devDep) | Генерация OG-картинок на билде | `scripts/generate-og.ts` |

### Внешние сервисы (runtime)

| Сервис | Назначение | Доступ |
|---|---|---|
| **Telegram Bot API** | Получение лидов в Telegram-чат | `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN` + `NEXT_PUBLIC_TELEGRAM_CHAT_ID` |
| **Resend** | Email-копия лидов менеджеру | `NEXT_PUBLIC_RESEND_API_KEY` (restricted, send-only) |
| **Yandex.Метрика** | Аналитика RU | счётчик через `<Script>` |
| **Google Analytics 4** | Аналитика международная | gtag через `<Script>` |
| **Yandex Maps** или **Google Maps** | Карта в `widgets/contacts` | iframe (click-to-load) |

> Токены **публичные** (`NEXT_PUBLIC_*`) — выдаются с минимальными правами (read/send в один чат, send-only email на один адрес). При утечке — отзыв и ротация.

---

## Темы (light/dark) — что нужно знать

> Полная спецификация — ADR-006. Здесь — operational summary.

- Классы `.light-theme` / `.dark-theme` ставятся **на `<html>` И `<body>`** (для портал-компонентов)
- localStorage ключ — `'moreminsk-theme'` со значениями `'light' | 'dark' | 'system'`
- Default — `'system'` (читаем `prefers-color-scheme`)
- Anti-FOUC inline-script в `<head>` ставит класс **до** hydration
- Sync между вкладками — через `StorageEvent`
- **Каждый компонент проверяется в обоих темах перед merge** (включая floating элементы — popover, tooltip, sheet)
- Цвета только через `var(--color-*)` — никаких хардкод-гексов

---

## Анимации — операционный гайд

> Полная спецификация — ADR-006 + Design System.

- **Только Framer Motion** (~30kb). НЕ GSAP, НЕ Lottie.
- **Easings** (всё через токены): `--ease-spring` (default), `--ease-sheet` (Apple sheet), `--ease-out`, `--ease-bounce` (attention only), `--ease-linear` (skeleton)
- **Durations:** `--duration-instant` (50ms), `--duration-fast` (150ms — tap), `--duration-base` (200ms — default), `--duration-medium` (300ms — modal/page), `--duration-slow` (500ms — sheet open), `--duration-slower` (800ms)
- **Простые hover/tap** — чистый CSS через `mx.tap-scale`
- **Hero:** `framer-motion` staggered fade-up, image без анимации (LCP)
- **AppPanel:** Framer Motion slide через `var(--ease-sheet)` `var(--duration-slow)`
- **Section entrance:** `useInView({ once: true, threshold: 0.15 })`, `y: 32 → 0`, `opacity: 0 → 1`
- **prefers-reduced-motion:** `transform: scale/translate` → opacity-only, durations → 0

---

## Шрифты — операционный гайд

> Полная спецификация — ADR-008. Здесь — что нужно помнить ежедневно.

- **Manrope Variable** — UI/body/headings/всё функциональное. weights 300/400/500/600/700, latin+cyrillic
- **Lora Variable** — accent only. weights 400/500, normal+italic, latin+cyrillic, `preload: false`
- **Lora — только через `<Accent>` компонент или класс `.accent`**. Max **5 instances/страница**, **2/вьюпорт**
- **Где можно Lora:** названия яхт (italic 500), 1 accent-слово в Hero, кавычки `« »` в отзывах, eyebrow ключевой секции, citation source
- **Запрещено в:** кнопках, инпутах, нав, ценах, section titles
- **Цены — `.tabular`** (`font-feature-settings: "tnum" on, "lnum" on`)
- **Body на mobile ≥ 16px** (включая `<input>`) — анти-zoom iOS
- **Type scale — fluid `clamp()`** через токены `--text-xs..--text-6xl`

---

## SEO — операционный гайд

> Полная стратегия — [[../30 - SEO/SEO стратегия]].

На каждой странице обязательно:
- `generateMetadata({ params })` через `lib/seo.generatePageMetadata`
- Уникальный `<title>` и `<meta description>`
- `<link rel="canonical">` на текущую локаль
- `hreflang` для всех локалей + x-default
- Уникальный `og:image` (генерируется скриптом `scripts/generate-og.ts`)
- `<JsonLd />` со схемой:
  - Главная: `Organization` + `LocalBusiness`
  - `/services/[slug]`: `Service` + `Offer`
  - `/fleet/[slug]`: `Product` + `Offer`
  - FAQ: `FAQPage`
  - Crumbs: `BreadcrumbList`

`sitemap.xml` и `robots.txt` — через `app/sitemap.ts` / `app/robots.ts`.

---

## Build & Deploy — quick ref

> Полная спецификация — [[Build & Deploy]].

```bash
bun install            # установка
bun dev                # dev на localhost:3000
bun run prebuild       # sharp оптимизация фото + OG картинки
bun run build          # → ./out/ (HTML/JS/CSS статика)
bun run lint           # ESLint + Stylelint
bun run typecheck      # tsc --noEmit
```

`next.config.ts`:
```ts
{
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: false,
}
```

**Что НЕ работает (static export):** API routes, middleware, Server Actions, `next/image` optimizer, ISR/`revalidate`, `cookies()`/`headers()` в RSC, `rewrites/redirects` в next.config.

**Деплой MVP:** Vercel (1-click). После стабилизации — переезд на свой VPS (по образцу FlexGlass на Aeza), если будет смысл.

---

## Связанные документы

- [[Architecture Overview]] — tech stack + принципы
- ⭐ [[Booking Module]] — спецификация главной бизнес-фичи (wizard, pluggable availability, submit)
- [[Структура проекта]] — полное дерево файлов
- [[Routing & i18n]] — детали локализации
- [[Build & Deploy]] — хостинг, CI/CD, оптимизация
- [[../50 - Design/Design System]] — токены, шрифты, цвета
- [[../50 - Design/UX-паттерны]] — конкретные layout-паттерны
- [[../50 - Design/Hero & Section Rhythm]] — визуальный язык секций
- [[../50 - Design/Component Specs]] — спецификации UI-компонентов
- [[../50 - Design/Brand Identity]] — wordmark, lockups, OG, voice
- [[../30 - SEO/SEO стратегия]] — план SEO-работ
- ADR — `42 - ADR/ADR-001..008`
- Skills — `.claude/skills/{scss-modules,fsd-architecture,nextjs-static-export,mobile-first,ios-style}.md`
- CLAUDE.md — корневой контекст для Claude Code

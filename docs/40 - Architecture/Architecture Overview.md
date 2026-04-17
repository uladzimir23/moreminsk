---
type: architecture
tags: [architecture, overview, nextjs]
updated: 2026-04-17
---

# Architecture Overview

## Tech Stack

| Слой | Технология | Обоснование |
|---|---|---|
| Framework | **Next.js 16 (App Router, static export)** | SEO, скорость, статика на CDN |
| Язык | **TypeScript** (strict) | Надёжность, DX |
| Стили | **SCSS Modules** (`*.module.scss`) | См. [[42 - ADR/ADR-001 SCSS Modules вместо Tailwind]] |
| Дизайн-система | **Архитектура Flex Glass DS** (cascade layers, primitive→semantic→component токены, fluid clamp(), container queries, color-mix(in oklch), @property, logical properties, Safari/iOS hardening) | Готовая база, см. [[../50 - Design/Design System]] |
| UI-примитивы | **Radix UI** (headless) | Доступность из коробки, без Tailwind-зависимости |
| Иконки | **Lucide React** | Лёгкие SVG, tree-shakable |
| i18n | **next-intl v4.7** (`localePrefix: "as-needed"`, ru + en для MVP) | App Router совместимость, static export |
| Формы | **react-hook-form** + **zod** | Типобезопасная валидация |
| Анимации | **Framer Motion only** (~30kb) | Не GSAP, не Lottie. См. [[42 - ADR/ADR-006 Color Palette + Theme System + Animation Tokens]] |
| Темы | **light + dark в MVP**, классы `.light-theme`/`.dark-theme` на `<html>` И `<body>`, anti-FOUC inline-script | Архитектура из sync-brand-site-v2. См. ADR-006 |
| Шрифты | **Manrope Variable** (UI) + **Lora Variable** (accent only через `<Accent>`) | См. [[42 - ADR/ADR-008 Typography System — Manrope Variable]] |
| Менеджер | **Bun** | Быстрее npm/yarn, совместим с Node |
| Линт | **ESLint** + **Stylelint** + **Prettier** | Качество кода |
| Аналитика | **Я.Метрика** + **GA4** | Два трекера — RU + международный |

## Архитектурные принципы

1. **Static export > SSR** — весь сайт пре-рендерится в HTML на build-time. Деплой на любой CDN/VPS с nginx. **Нет API routes, middleware, server actions.** См. [[42 - ADR/ADR-002 Next.js Static Export]].
2. **FSD-lite** — слои: `app` / `widgets` / `features` / `entities` / `shared`. Правила импорта: верхний слой может импортить нижний, не наоборот. См. [[42 - ADR/ADR-003 FSD-lite архитектура]].
3. **Server Components по умолчанию** — `"use client"` только там, где нужно состояние/эффект.
4. **SCSS Modules + CSS custom properties** — дизайн-токены в `src/shared/design-system/tokens/`, миксины в `mixins/`, базовые стили в `base/`, компоненты — свой `.module.scss` рядом. Цвета только через `var(--color-*)` — никаких хардкод-гексов в компонентах.
5. **App-like навигация** — `<Appbar />` (top, frosted glass) + `<BottomNav />` (mobile only, 5 пунктов с центральным accent CTA). См. [[42 - ADR/ADR-004 Mobile App-style Navigation (Appbar + Bottom Nav)]].
6. **iOS 17–18 visual language** — Liquid Glass, capsule, hairline, multi-layer soft shadows, spring-easing. См. [[42 - ADR/ADR-005 iOS-style Design Language]].
7. **Adaptive Panel вместо отдельных модалок** — один `<AppPanel />` морфит геометрию по breakpoint (bottom-sheet на mobile, side-drawer на desktop). См. [[42 - ADR/ADR-007 Adaptive Panel — Bottom Sheet on Mobile, Side Drawer on Desktop]].
8. **Контент-as-code (MVP)** — тексты яхт/услуг лежат в `src/shared/content/` как TS-объекты. CMS — после MVP.
9. **Один источник правды на данные** — тип `Yacht`, `Service`, `Review` в `entities/*/model/types.ts`.

## Поток данных (MVP)

```
content/yachts.ts ──┐
content/services.ts ├──→ lib/seo.ts ──→ <JsonLd /> + generateMetadata
content/reviews.ts ─┘                       │
                                            ▼
                          [locale]/services/[slug]/page.tsx
                                            │
                                            ├──→ widgets/appbar
                                            ├──→ widgets/hero
                                            ├──→ widgets/price-table
                                            ├──→ widgets/gallery
                                            ├──→ widgets/faq
                                            ├──→ widgets/bottom-nav (mobile)
                                            └──→ widgets/app-panel  ◀──┐
                                                       │               │
                                                       ▼               │
                                          features/booking (wizard) ──┤
                                                       │               │
                                                       ▼               │
                                      submitBooking() (browser fetch)  │
                                                       │               │
                          ┌────────────────────────────┼──────────────┐│
                          ▼                            ▼              ▼│
                 Telegram Bot API              Resend (manager)  Resend (client)
              (NEXT_PUBLIC_TG_TOKEN)         (NEXT_PUBLIC_KEY)    if email given│
                                                                       │
                          usePanel() context ◀──────────────────────────┘
```

> **Нет внутренних API routes** — static export их игнорирует. Формы отправляются прямо из браузера в Telegram Bot API + Resend (read-only токены с минимальными правами в `NEXT_PUBLIC_*`). Подробнее — в [[Build & Deploy#API Routes + Static Export]] и skill `nextjs-static-export`.

## Слой `app/providers/` — провайдер-стек

```
<NextIntlClientProvider locale={locale}>
  <ThemeProvider>          {/* light/dark + localStorage 'moreminsk-theme' */}
    <PanelProvider>        {/* единый AppPanel, mode/payload/open/close */}
      {children}
    </PanelProvider>
  </ThemeProvider>
</NextIntlClientProvider>
```

`<PanelProvider />` рендерит единственный `<AppPanel />` в конце дерева — все вызовы `usePanel().open(mode, payload)` работают глобально.

## Модули-виджеты (переиспользуются)

По образцу `~/Documents/neuro-center/src/widgets/`, с учётом ADR-004/005/007:

| Виджет | Назначение | ADR |
|---|---|---|
| `appbar` | Top-навигация (frosted glass, scroll-state, RU/EN, Telegram-icon) | 004, 005 |
| `bottom-nav` | Mobile bottom-навигация (5 пунктов, центральный accent CTA) | 004 |
| `app-panel` | Универсальный bottom-sheet (mobile) / side-drawer (desktop) — режимы `order/fleet-filter/more/gallery` | 007 |
| `hero` | Первый экран (photo-first на mobile, split на desktop, glow-pseudoelement, floating-card) | 005 |
| `fleet-grid` | Сетка карточек яхт (`<YachtCard />` с `<Accent>` для имени) | — |
| `services-grid` | Сетка карточек услуг | — |
| `price-table` | Таблица цен с tabular-nums | 008 |
| `gallery` | Галерея фото/видео + триггер `panel.open('gallery')` | 007 |
| `reviews` | Отзывы с фото, кавычками `« »` через `<Accent italic={false}>` | 008 |
| `faq` | Аккордеон + JSON-LD FAQPage | — |
| `cta-form` | In-page форма заявки (для лендингов услуг) | — |
| `why-us` | Блок преимуществ | — |
| `contacts` | Адрес + карта + кликабельные мессенджеры | — |
| `footer` | Контакты, юр.инфо, навигация, theme-toggle | — |

## Связанные документы
- [[Структура проекта]]
- [[Project Overview]]
- [[Routing & i18n]]
- [[Build & Deploy]]
- [[42 - ADR/ADR-001 SCSS Modules вместо Tailwind]]
- [[42 - ADR/ADR-002 Next.js Static Export]]
- [[42 - ADR/ADR-003 FSD-lite архитектура]]
- [[42 - ADR/ADR-004 Mobile App-style Navigation (Appbar + Bottom Nav)]]
- [[42 - ADR/ADR-005 iOS-style Design Language]]
- [[42 - ADR/ADR-006 Color Palette + Theme System + Animation Tokens]]
- [[42 - ADR/ADR-007 Adaptive Panel — Bottom Sheet on Mobile, Side Drawer on Desktop]]
- [[42 - ADR/ADR-008 Typography System — Manrope Variable]]

---
type: architecture
tags: [architecture, overview, nextjs]
updated: 2026-04-16
---

# Architecture Overview

## Tech Stack

| Слой | Технология | Обоснование |
|---|---|---|
| Framework | **Next.js 16 (App Router, static export)** | SEO, скорость, статика на CDN |
| Язык | **TypeScript** (strict) | Надёжность, DX |
| Стили | **SCSS Modules** (`*.module.scss`) | См. [[42 - ADR/ADR-001 SCSS Modules вместо Tailwind]] |
| UI-примитивы | **Radix UI** (headless) | Доступность из коробки, без Tailwind-зависимости |
| Иконки | **Lucide React** | Лёгкие SVG, tree-shakable |
| i18n | **next-intl v4.7** | App Router совместимость, static export |
| Формы | **react-hook-form** + **zod** | Типобезопасная валидация |
| Анимации | **Framer Motion** (selective) | Только там, где ощутимо улучшает UX |
| Менеджер | **Bun** | Быстрее npm/yarn, совместим с Node |
| Линт | **ESLint** + **Stylelint** + **Prettier** | Качество кода |
| Аналитика | **Я.Метрика** + **GA4** | Два трекера — RU + международный |

## Архитектурные принципы

1. **Static export > SSR** — весь сайт пре-рендерится в HTML на build-time. Деплой на любой CDN/VPS с nginx.
2. **FSD-lite** — слои: `app` / `widgets` / `features` / `entities` / `shared`. Правила импорта: верхний слой может импортить нижний, не наоборот.
3. **Server Components по умолчанию** — `"use client"` только там, где нужно состояние/эффект.
4. **SCSS Modules + глобальные токены** — дизайн-токены в `src/shared/styles/tokens/`, миксины в `mixins/`, компоненты — свой `.module.scss`.
5. **Контент-as-code (MVP)** — тексты яхт/услуг лежат в `src/shared/content/` как TS-объекты. CMS — после MVP.
6. **Один источник правды на данные** — тип `Yacht`, `Service`, `Review` в `entities/*/model/types.ts`.

## Поток данных (MVP)

```
content/yachts.ts ──┐
content/services.ts ├──→ lib/seo.ts ──→ <JsonLd /> + generateMetadata
content/reviews.ts ─┘                       │
                                            ▼
                          [locale]/services/[slug]/page.tsx
                                            │
                                            ├──→ widgets/hero
                                            ├──→ widgets/price-table
                                            ├──→ widgets/gallery
                                            ├──→ widgets/faq
                                            └──→ widgets/contact-form
                                                        │
                                                        ▼
                                               API route /api/lead
                                                        │
                                                        ├──→ Resend (email)
                                                        └──→ Telegram Bot API
```

Формы — единственный runtime-элемент. Либо отдельный serverless (API route с `output: "export"` не работает — альтернативы см. [[Build & Deploy]]), либо внешний сервис (Formspree / FormKeep / SendGrid) для чистой статики.

## Модули-виджеты (переиспользуются)

По образцу `~/Documents/neuro-center/src/widgets/`:

- `header` — навигация
- `hero` — первый экран (лид + CTA + фото)
- `fleet-grid` — сетка карточек яхт
- `services-grid` — сетка карточек услуг
- `price-table` — таблица цен
- `gallery` — галерея фото/видео
- `reviews` — отзывы с фото
- `faq` — аккордеон
- `cta-form` — форма заявки
- `why-us` — блок преимуществ
- `contacts` — адрес + карта + мессенджеры
- `footer`

## Связанные документы
- [[Структура проекта]]
- [[Routing & i18n]]
- [[Build & Deploy]]
- [[42 - ADR/ADR-001 SCSS Modules вместо Tailwind]]
- [[42 - ADR/ADR-002 Next.js Static Export]]
- [[42 - ADR/ADR-003 FSD-lite архитектура]]

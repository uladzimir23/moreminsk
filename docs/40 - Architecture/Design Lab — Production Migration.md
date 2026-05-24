---
type: architecture
tags: [architecture, migration, design-system, design-lab, plan]
date: 2026-05-24
status: proposed
---

# Design Lab → Production Migration

Направление стиля выбрано (editorial minimalism + sky-500, [[42 - ADR/ADR-009 Editorial Minimalism + Sky-blue Accent|ADR-009]]) и спрототипировано в `src/app/(preview)/design-lab/` — три hero-варианта (horizon / scene / cinematic) + общий content-стек (флот / услуги / галерея / отзывы-stories / FAQ / бронирование / контакты / футер) + эффекты (water-backdrop, submerged-optics). Это **прототип в песочнице** (stylelint-exempt, вне i18n, хардкод-копирайт, хотлинк-фото, локальный submit). Документ — план переноса в прод-экосистему (FSD-lite + бизнес-логика) и список узких мест.

## 1. Аудит консистентности (на 2026-05-24)

Скан `(preview)/design-lab` (40 файлов):

| Метрика | Кол-во | Вывод |
| --- | --- | --- |
| Дубли `.eyebrow` | 12 | Каждая секция переопределяет editorial-примитивы → общий `<SectionHeader>` |
| Дубли `.title` | 9 | то же |
| Дубли `.accent` | 11 | то же |
| `rgba(...)` | 206 | Дарк-секции пишут `rgba(255,255,255,X)` вместо токенов → нужны on-media токены |
| Hardcoded hex | 51 | В песочнице ок; прод — только `var(--color-*)` |
| `px` | 836 | Песочница exempt; прод — rem/clamp/токены (ADR-001 unit-policy) |
| Inline `<svg>` | 42 | Заменить на `lucide-react` (ADR-005 §11) / общий `<Icon>` |
| `'use client'` | 11 | Проверить минимизацию (часть может быть server) |

**Повторяющиеся паттерны для извлечения в `shared/`:**
- **SectionHeader** — eyebrow (`NN · Раздел`) + title с Lora-accent. 9–12 копий.
- **AmbientBackdrop** — blurred-фото + dark-gradient + accent-radial. Во флоте/услугах/галерее/booking/contacts.
- **Carousel-логика** — fleet-showcase, services, gallery, stories: у каждого свой scroll/snap/active-index/keyboard код → `useCarousel()` хук.
- **Lightbox/zoom** — fleet (zoom) + stories (viewer): общий `<Lightbox>` (focus-trap, esc, swipe).
- **on-media токены** — `--color-on-media`, `--color-on-media-muted`, `--hairline-on-dark`, чтобы дарк-секции не хардкодили `rgba(255,255,255,…)`.

## 2. Карта миграции (lab → FSD-lite)

| Lab-компонент | Прод-локация | Заметка |
| --- | --- | --- |
| hero (horizon/scene/cinematic) | `widgets/hero/` | Выбрать раскладку: cinematic — home, scene/horizon — внутренние |
| fleet-showcase | `widgets/fleet-showcase/` | Заменяет/дополняет существующий `widgets/fleet-grid` |
| services-carousel | `widgets/services-carousel/` | |
| gallery (letterbox viewer) | `widgets/gallery/` | |
| reviews-stories | `widgets/reviews-stories/` + `entities/story/` | модель story-группы |
| faq (master/detail+accordion) | `widgets/faq/` | |
| booking form | `features/booking/` | **уже есть** wizard (6 шагов) — слить/выбрать |
| contacts + contact-map | `widgets/contacts/` | |
| footer | `widgets/footer/` | **уже есть** Footer — согласовать |
| header | `widgets/appbar/` | **уже есть** Appbar — конфликт, см. §3 |
| water-backdrop, submerged-optics | `shared/ui/effects/` | |
| SectionHeader, AmbientBackdrop, Lightbox | `shared/ui/` | новые |
| useCarousel | `shared/lib/` | новый хук |

## 3. Конфликты с принятой архитектурой ⚠️

Лаба упростила то, что в ADR уже решено иначе — это **развилки, требующие решения до P1**:

1. **Навигация (ADR-004).** Прод предполагает mobile `<BottomNav>` (5 пунктов: Главная/Флот/Заказать/Услуги/Ещё) + `<Appbar>`. Лаба сделала простой top-header без bottom-nav. → Решить: top-header (как в лабе) или вернуть app-like nav ADR-004?
2. **Бронирование (ADR-007 AppPanel).** Прод: bottom-sheet/side-drawer `<AppPanel>` + 6-шаговый wizard (`features/booking`). Лаба: inline-форма в секции. → Решить: inline-форма vs AppPanel-визард (или оба: inline на странице услуги, AppPanel из bottom-nav «Заказать»).
3. **i18n (ru/en, ADR + правило 10).** Лаба вне `[locale]/`, весь текст — хардкод по-русски. → Вся копирайт-строка → `messages/{locale}.po`, компоненты через `next-intl`.
4. **Тёмная тема.** Лаба-секции сделаны «always-dark» (хардкод rgba-white), это не реагирует на `.light/.dark-theme`. → On-media токены, чтобы dark-секции жили в обеих темах (или явно зафиксировать, что эти секции всегда тёмные — тоже валидно, но через токены).

## 4. Бизнес-логика и узкие места (что упустили)

- **Submit формы.** Сейчас локальный success. Static export = нет API routes. Варианты: **Telegram Bot API** с клиента (заказчик уже в TG — рекоменд) / Resend / Formspree. + zod-валидация (в стеке) + honeypot/таймер анти-спам + чекбокс согласия (текст есть, чекбокса/ссылки на политику нет).
- **Реальные фото.** Хотлинк с `tildacdn` (старый сайт) — **риск 404/смены**. → Скачать в `public/fleet`, `public/gallery`, оптимизировать (sharp на билде, responsive `srcset`, AVIF/WebP), ~30 шт. Запросить у Павла свежие сезон-2026.
- **Видео hero.** 1.33 MB (720p) ок для MVP, но нет WebM/poster-preload-стратегии; на 4G тяжеловат. При росте трафика — Cloudflare Stream/Mux. Нужен свежий горизонтальный кадр без людей-в-фокусе.
- **Отзывы-stories.** Сейчас наши фото + синтетические стикеры. Реальные сторис IG: статичные скриншоты (MVP) или IG Graph API (нужен бизнес-аккаунт + токен, сложно для static).
- **Карта.** Click-to-load Яндекс работает; координаты 54.0011/27.4032 — **сверить с Павлом** (сейчас примерные).
- **Availability.** Wizard в ADR закладывал pluggable provider занятости дат. Форма лабы не знает занятых слотов. Post-MVP, но заложить интерфейс.
- **Аналитика.** ADR: инфраструктура без подключения. Перед запуском — Я.Метрика + GA4, цель = submit формы.
- **Юр.** Политика конфиденциальности (стаб) + Публичная оферта + рабочий чекбокс согласия в форме.
- **Производительность.** Много `backdrop-filter: blur`, по 3–4 ambient-фото на секцию, видео, SVG-фильтры (turbulence/displacement/specular). На среднем Android риск jank. → бюджет: `content-visibility: auto` на секциях, lazy-секции, ограничить одновременные backdrop-filter, измерить LCP/INP/CLS. SVG-фильтры (water, optics) на mobile — рассмотреть отключение/упрощение.
- **Доступность.** Stories-viewer — focus-trap + screenreader-объявления слайдов; карусели — `aria-roledescription="carousel"`; `prefers-reduced-motion` (частично есть, доделать везде); контраст sky-500 на белом для inline-текста → sky-600 (`--color-accent-text`, уже заведён).
- **`backdrop-filter: url(#svg)` в Safari** (submerged-optics) — не поддерживается → graceful degradation (просто blur-стекло). Проверить.

## 5. Фазы

- **P0 — Решения.** Закрыть развилки §3 (nav / booking UX / какой hero где / тёмная тема политика). Написать ADR-010 «Lab → Prod», обновить [[../00 - Indexes/Dashboard]].
- **P1 — Shared foundation.** On-media токены; `SectionHeader`, `AmbientBackdrop`, `Lightbox`, `useCarousel`, `<Icon>` (lucide). Скачать+оптимизировать фото в `public/`.
- **P2 — Widgets.** Промотить секции в `widgets/` на токенах + i18n-строки + lucide. Убрать хардкоды.
- **P3 — Pages.** Собрать `[locale]/` (home + 5 страниц услуг), `generateMetadata` + JSON-LD (Organization / Product+Offer для яхт / FAQPage / Review+AggregateRating), sitemap, OG-генерация.
- **P4 — Booking.** Telegram submit + zod + анти-спам + согласие. (Опц. AppPanel-визард.)
- **P5 — Полиш.** Перф-бюджет (content-visibility, lazy, blur-лимиты), a11y-аудит, dark-mode, мобайл-проход.
- **P6 — Деплой.** Домен `moreminsk.by`, видео-хостинг, Я.Метрика+GA4, Search Console + sitemap submit. Лабу `(preview)/` удалить или оставить noindex как референс-музей.

## Связанные

- [[42 - ADR/ADR-009 Editorial Minimalism + Sky-blue Accent]]
- [[42 - ADR/ADR-004 Mobile App-style Navigation (Appbar + Bottom Nav)]]
- [[42 - ADR/ADR-007 Adaptive Panel — Bottom Sheet on Mobile, Side Drawer on Desktop]]
- [[42 - ADR/ADR-008 Typography System — Manrope Variable]]
- [[Booking Module]]
- [[../00 - Indexes/Dashboard]]

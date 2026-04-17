# moreminsk.by — Project context for Claude Code

Сайт аренды парусных и моторных яхт на Минском водохранилище. Бренд **Море Minsk / ЯхтыМинска**. Заказчик — Pavel Tsarenok.

## Принцип принятия решений

> Заказчик **не разбирается в IT/web**. Все технические и архитектурные решения — стек, фреймворки, хостинг, библиотеки, паттерны, инструменты, оптимизации — принимаем **сами**, исходя из best practices и современных технологий.
>
> **У клиента спрашиваем только бизнес/контент-вопросы:** цены, фото, тексты услуг, согласование макета, бренд-атрибуты, контактные данные, юридические нюансы. Технический язык в общении с ним избегаем — переводим в бизнес-результат («быстрее загружается → больше заявок», «правильная SEO-разметка → выше позиции в Google»).
>
> Если в ходе работы возникает развилка типа «Tailwind или SCSS», «Vercel или CF Pages», «monorepo или single repo» — решаем сами, документируем как ADR с обоснованием, клиенту не выносим. Спрашиваем клиента только если выбор реально влияет на бизнес-показатели (бюджет, сроки, фичи MVP).

## Tech Stack

| Слой           | Технология                                                      |
| -------------- | --------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router, `output: "export"`)                     |
| Язык           | TypeScript (strict)                                             |
| Стили          | **SCSS Modules** (не Tailwind — см. ADR-001)                    |
| UI             | Radix UI (headless) + свои компоненты на SCSS Modules           |
| Иконки         | Lucide React                                                    |
| i18n           | next-intl v4.7 (`localePrefix: "as-needed"`) — **MVP: ru + en** |
| Формы          | react-hook-form + zod                                           |
| Анимация       | Framer Motion (selective)                                       |
| Пакет-менеджер | **Bun**                                                         |
| Линтеры        | ESLint + Stylelint + Prettier                                   |

## Архитектура

**FSD-lite** — 5 слоёв, импорт только сверху вниз:

```
app → widgets → features → entities → shared
```

Полное дерево — в `docs/40 - Architecture/Структура проекта.md`.

## Структура репо

```
.
├── docs/                 # Obsidian vault с документацией (Johnny Decimal)
├── src/                  # (TBD — инициализируется следующим шагом)
├── public/               # (TBD)
├── .claude/
│   ├── skills/           # Проектные скиллы для Claude Code
│   └── settings.local.json  # Локальные permissions (gitignored)
├── CLAUDE.md             # Этот файл
├── README.md
└── .gitignore
```

## Ключевые документы (читать перед работой)

- **Start here:** `docs/00 - Indexes/Dashboard.md` — текущий статус и ссылки
- ⭐ **Module map:** `docs/40 - Architecture/Project Overview.md` — описание всех модулей, провайдеров, потока данных
- ⭐ **Booking Module:** `docs/40 - Architecture/Booking Module.md` — главная бизнес-фича (wizard, availability, submit)
- **Brief:** `docs/10 - Brief & Requirements/Бриф клиента.md` — дословное ТЗ от заказчика
- **Архитектура:** `docs/40 - Architecture/Architecture Overview.md`
- **Структура проекта:** `docs/40 - Architecture/Структура проекта.md`
- **SEO стратегия:** `docs/30 - SEO/SEO стратегия.md`
- **Карта страниц:** `docs/30 - SEO/Карта страниц.md`
- **Meta-стратегия:** `docs/30 - SEO/Meta-стратегия.md`
- **Schema.org:** `docs/30 - SEO/Schema.org разметка.md`
- **Design System:** `docs/50 - Design/Design System.md`
- **UX-паттерны:** `docs/50 - Design/UX-паттерны.md`
- **Brand Identity:** `docs/50 - Design/Brand Identity.md`
- **Hero & Section Rhythm:** `docs/50 - Design/Hero & Section Rhythm.md`
- **Component Specs:** `docs/50 - Design/Component Specs.md`
- **Анимации:** `docs/50 - Design/Анимации.md` — Framer Motion пресеты
- **Scraping plan:** `docs/40 - Architecture/Scraping plan.md` — миграция фото/текста с moreminsk.by
- **Контент-план:** `docs/60 - Content/Контент-план текстов.md` — Hero H1, lead-абзацы, мета
- **Tone of voice:** `docs/20 - Market/Позиционирование.md#Tone-of-Voice`
- **Конкуренты:** `docs/20 - Market/Конкурентный анализ.md`

## Ключевые ADR

- `docs/40 - Architecture/42 - ADR/ADR-001 SCSS Modules вместо Tailwind.md`
- `docs/40 - Architecture/42 - ADR/ADR-002 Next.js Static Export.md`
- `docs/40 - Architecture/42 - ADR/ADR-003 FSD-lite архитектура.md`
- `docs/40 - Architecture/42 - ADR/ADR-004 Mobile App-style Navigation (Appbar + Bottom Nav).md`
- `docs/40 - Architecture/42 - ADR/ADR-005 iOS-style Design Language.md`
- `docs/40 - Architecture/42 - ADR/ADR-006 Color Palette + Theme System + Animation Tokens.md`
- `docs/40 - Architecture/42 - ADR/ADR-007 Adaptive Panel — Bottom Sheet on Mobile, Side Drawer on Desktop.md`
- `docs/40 - Architecture/42 - ADR/ADR-008 Typography System — Manrope Variable.md`

## Базовые правила

1. **SCSS Modules, не Tailwind.** На каждый компонент — `Component.module.scss` рядом. Архитектура DS — копия паттерна **Flex Glass** (`~/Documents/flex-glass/src/shared/design-system/`, ветка `feat/design-system`): cascade layers, primitive→semantic→component токены через CSS custom properties, fluid `clamp()`, container queries, `color-mix()`, `@property`, logical properties, Safari/iOS hardening, stylelint-enforced rules. Токены — `src/shared/design-system/tokens/`, миксины — `mixins/`. Переопределяем только бренд-палитру и шрифты. shadcn/ui не используем (он на Tailwind).
2. **Server Components по умолчанию.** `"use client"` только там, где нужно состояние или эффект.
3. **Static export — нет API routes и middleware.** Формы — через внешний сервис (Telegram Bot API / Resend / Formspree).
4. **SEO на каждой странице.** `generateMetadata()` + JSON-LD через компонент `<JsonLd />`.
5. **Контент-as-code (MVP).** Тексты яхт/услуг — в `src/shared/content/*.ts`. CMS — после MVP.
6. **Slug — транслит латиницей.** `svadba`, `den-rozhdeniya`, без подчёркиваний и camelCase.
7. **Без штампов в текстах.** «Незабываемые впечатления», «команда профессионалов», «индивидуальный подход» — запрещены. См. `docs/50 - Design/UX-паттерны.md` и skill `content-writing`.
8. **Цены — всегда на виду.** Никаких «звоните уточнить».
9. **Mobile-first.** UI/UX-логика по образцу `~/Documents/neuro-center` и `~/Documents/wedding/wedding-app`. Стили пишем от mobile к desktop через `mx.respond-to('md')`, touch-target ≥ 44px, сетка стекается вертикально, hero-картинка сверху на mobile. См. `docs/50 - Design/UX-паттерны.md#Базовый-принцип-—-Mobile-first`.
10. **Локализация — ru/en (MVP).** `be` — post-MVP. Все страницы внутри `app/[locale]/...`, переводы в `messages/{locale}.po`.
11. **App-like навигация (ADR-004).** На mobile — `<Appbar />` (top, frosted glass) + `<BottomNav />` (5 пунктов: Главная / Флот / **Заказать** / Услуги / Ещё). Sticky CTA-bar отменён. На desktop bottom-nav скрыт, appbar с horizontal nav.
12. **iOS-style визуальный язык (ADR-005).** Liquid Glass / capsule buttons / hairline borders / multi-layer soft shadows / spring-easing. См. skill `ios-style` для конкретных паттернов и токенов.
13. **Палитра + темы — морская navy + sunset coral, light+dark в MVP (ADR-006).** Primary `#0A4D7A` (light) / `#5BA8D6` (dark). Accent / CTA `#E2956A`. Классы `.light-theme` / `.dark-theme` на `<html>` и `<body>` (sync-pattern). Каждый компонент проверяем в обоих темах. Anti-FOUC inline-script в `<head>` обязателен. Цвета только через `var(--color-*)` — никаких хардкод-гексов в компонентах.
14. **Анимации — только Framer Motion (ADR-006).** Не GSAP, не Lottie. Easings и durations — из `tokens/_motion.scss` (`--ease-spring/sheet/bounce/out`, `--duration-fast/base/medium/slow`). Простые hover/tap — чистый CSS через токены. См. таблицу «Кейс → Duration+Easing» в Design System.
15. **Adaptive Panel вместо отдельных модалок (ADR-007).** Один компонент `<AppPanel />` с глобальным контекстом `usePanel()`. На mobile — bottom-sheet с drag-to-dismiss. На desktop — floating side-drawer справа (430px). Режимы: `'order' | 'fleet-filter' | 'more' | 'gallery'`. Заменяет `<OrderSheet />` / `<MoreSheet />` из ADR-004.
16. **Шрифты — Manrope (UI) + Lora (accent only) (ADR-008).** Manrope Variable через `next/font/google` (`subsets: ['latin', 'cyrillic']`, weight 300/400/500/600/700) — для всего UI. Lora Variable (weight 400/500, italic+normal, `preload: false`) — **только** через компонент `<Accent>` или класс `.accent`. Применение Lora строго селективное: названия яхт (italic 500), 1 accent-слово в Hero, кавычки `« »` в отзывах, eyebrow ключевой секции. **Max 5 instances/страница, 2/вьюпорт.** Запрещено в кнопках/инпутах/нав/ценах. Body на mobile ≥ 16px (анти-zoom iOS).

## Что НЕ делать

- Не предлагать Tailwind, shadcn/ui, styled-components для стилизации
- Не создавать middleware (не работает с static export)
- Не использовать `next/image` optimizer (при `output: "export"` — `images: { unoptimized: true }`, оптимизация через sharp на билде)
- Не пушить `.env` или `.claude/settings.local.json`
- Не создавать документацию по `*.md` вне `docs/` — всё идёт в vault

## Команды (когда будет инициализирован Next.js)

```bash
bun install            # установка
bun dev                # разработка на localhost:3000
bun run build          # prod-билд → ./out/
bun run lint           # ESLint + Stylelint
bun run typecheck      # tsc --noEmit
```

## Git

- Ветка по умолчанию: `main` (force-push запрещён).
- Remote: `https://github.com/uladzimir23/moreminsk`
- Commit-стиль: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`, `perf:`, `test:`, `ci:`, `build:`, `i18n:`, `content:`).
- Пре-коммит: lint + typecheck + stylelint через lefthook. **Никогда `--no-verify`.**
- **Фазовый коммит обязателен** — каждая завершённая фаза из [[docs/00 - Indexes/Dashboard]] закрывается серией коммитов (3–8 шт.), не копим работу между фазами.
- Полная таксономия scope'ов + план коммитов по фазам + правила amend/force — в skill `.claude/skills/git-workflow.md`.
- Коммиты от ассистента — с footer `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` и только по явному запросу пользователя.

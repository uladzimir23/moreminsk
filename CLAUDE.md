# moreminsk.by — Project context for Claude Code

Сайт аренды парусных и моторных яхт на Минском водохранилище. Бренд **Море Minsk / ЯхтыМинска**. Заказчик — Pavel Tsarenok.

## Tech Stack

| Слой | Технология |
|------|------------|
| Framework | Next.js 16 (App Router, `output: "export"`) |
| Язык | TypeScript (strict) |
| Стили | **SCSS Modules** (не Tailwind — см. ADR-001) |
| UI | Radix UI (headless) + свои компоненты на SCSS Modules |
| Иконки | Lucide React |
| i18n | next-intl v4.7 (`localePrefix: "as-needed"`) — **MVP: ru + en** |
| Формы | react-hook-form + zod |
| Анимация | Framer Motion (selective) |
| Пакет-менеджер | **Bun** |
| Линтеры | ESLint + Stylelint + Prettier |

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
- **Brief:** `docs/10 - Brief & Requirements/Бриф клиента.md` — дословное ТЗ от заказчика
- **Архитектура:** `docs/40 - Architecture/Architecture Overview.md`
- **Структура проекта:** `docs/40 - Architecture/Структура проекта.md`
- **SEO стратегия:** `docs/30 - SEO/SEO стратегия.md`
- **Карта страниц:** `docs/30 - SEO/Карта страниц.md`
- **Meta-стратегия:** `docs/30 - SEO/Meta-стратегия.md`
- **Schema.org:** `docs/30 - SEO/Schema.org разметка.md`
- **Design System:** `docs/50 - Design/Design System.md`
- **UX-паттерны:** `docs/50 - Design/UX-паттерны.md`
- **Tone of voice:** `docs/20 - Market/Позиционирование.md#Tone-of-Voice`
- **Конкуренты:** `docs/20 - Market/Конкурентный анализ.md`

## Ключевые ADR

- `docs/40 - Architecture/42 - ADR/ADR-001 SCSS Modules вместо Tailwind.md`
- `docs/40 - Architecture/42 - ADR/ADR-002 Next.js Static Export.md`
- `docs/40 - Architecture/42 - ADR/ADR-003 FSD-lite архитектура.md`

## Базовые правила

1. **SCSS Modules, не Tailwind.** На каждый компонент — `Component.module.scss` рядом. Токены в `src/shared/styles/tokens/`, миксины в `mixins/`. shadcn/ui не используем (он завязан на Tailwind).
2. **Server Components по умолчанию.** `"use client"` только там, где нужно состояние или эффект.
3. **Static export — нет API routes и middleware.** Формы — через внешний сервис (Telegram Bot API / Resend / Formspree).
4. **SEO на каждой странице.** `generateMetadata()` + JSON-LD через компонент `<JsonLd />`.
5. **Контент-as-code (MVP).** Тексты яхт/услуг — в `src/shared/content/*.ts`. CMS — после MVP.
6. **Slug — транслит латиницей.** `svadba`, `den-rozhdeniya`, без подчёркиваний и camelCase.
7. **Без штампов в текстах.** «Незабываемые впечатления», «команда профессионалов», «индивидуальный подход» — запрещены. См. `docs/50 - Design/UX-паттерны.md` и skill `content-writing`.
8. **Цены — всегда на виду.** Никаких «звоните уточнить».
9. **Mobile-first.** UI/UX-логика по образцу `~/Documents/neuro-center` и `~/Documents/wedding/wedding-app`. Стили пишем от mobile к desktop (`@include media('md')` для расширений), touch-target ≥ 44px, сетка стекается вертикально, hero-картинка сверху на mobile. См. `docs/50 - Design/UX-паттерны.md#Базовый-принцип-—-Mobile-first`.
10. **Локализация — ru/en (MVP).** `be` — post-MVP. Все страницы внутри `app/[locale]/...`, переводы в `messages/{locale}.po`.

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

- Ветка по умолчанию: `main`
- Remote: `https://github.com/uladzimir23/moreminsk`
- Commit-стиль: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`)
- Пре-коммит: lint + typecheck (настроится через Husky / lefthook на следующем шаге)

# moreminsk.by

Сайт аренды парусных и моторных яхт на Минском водохранилище.
Бренд: **Море Minsk / ЯхтыМинска**.

## Стек

Next.js 16 (App Router, static export) · Vite (админка) · TypeScript · SCSS Modules · next-intl · Radix UI · PocketBase (CMS) · Bun · Docker

## Структура

Монорепо на **Bun workspaces**:

```
.
├── apps/
│   ├── site/       # @moreminsk/site — Next.js сайт
│   └── admin/      # @moreminsk/admin — Vite SPA (CMS)
├── pocketbase/     # PB миграции + Dockerfile
├── infra/          # nginx vhosts + docker-compose для прод-VPS
├── docs/           # Obsidian vault (Johnny Decimal)
└── package.json    # root workspace + proxy-скрипты
```

## Разработка (всё из корня)

```bash
bun install          # hoisted install для всех workspaces
bun run dev:site     # сайт на :3000
bun run dev:admin    # админка на :5173
bun run typecheck    # оба апа параллельно
bun run build:site   # prod-билд сайта → apps/site/out/
```

## Документация

Начинать с [docs/00 - Indexes/Dashboard.md](./docs/00%20-%20Indexes/Dashboard.md).

Основные разделы (внутри `docs/`):

| #   | Раздел                                                 |
| --- | ------------------------------------------------------ |
| 00  | Indexes — Dashboard, Map of Content                    |
| 10  | Brief & Requirements — ТЗ, цели, KPI                   |
| 20  | Market — конкуренты, ЦА, позиционирование              |
| 30  | SEO — стратегия, ядро, карта страниц, meta, Schema.org |
| 40  | Architecture — Next.js, FSD, ADR                       |
| 50  | Design — дизайн-система, UX-паттерны, медиа            |
| 60  | Content — флот, услуги, FAQ, тексты                    |
| 70  | Meetings & Logs — сессии                               |
| 80  | Templates — шаблоны документов                         |
| 90  | Ideas & Backlog — идеи развития                        |
| 95  | Attachments — медиа, брифы, референсы                  |

## Ссылки

- **Живой сайт (текущий):** https://moreminsk.by
- **Главный конкурент-эталон:** https://yachtminsk.com
- **Референсы внутренние:** `~/Documents/neuro-center` (widgets), `~/Documents/wedding` (визуал), `~/Documents/clariva-spa-landing` (Next.js-скелет)

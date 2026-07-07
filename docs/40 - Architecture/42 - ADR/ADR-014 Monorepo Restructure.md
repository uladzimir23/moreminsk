---
date: 2026-07-05
status: proposed
tags: [adr, architecture, monorepo, structure, deploy]
---

# ADR-014 — Реструктуризация в мульти-апп репо (web / admin / pocketbase / shared)

## Контекст

Сейчас репо — одно Next.js-приложение: `src/` (FSD-lite, ADR-003) в корне,
`public/`, `next.config.ts`, единый `package.json`. С активацией CMS появляются
ещё два деплой-юнита: `admin/` (Vite SPA, [[ADR-013 Custom Admin SPA over PocketBase]])
и `pocketbase/` (бэкенд, [[ADR-012 PocketBase Backend + Static Rebuild]]). Плюс
общий контракт данных (Zod-схемы, design-system), который нужен и сайту, и
админке.

Держать три приложения в плоском `src/` нельзя — нужны раздельные `package.json`,
сборки и деплой-таргеты. Донор-паттерн `zavody-rb/istok` уже решил это: корневые
`web/ admin/ pocketbase/ shared/`, каждый собирается независимо, **без
monorepo-тулинга** (istok ADR-007 «flat repo»). Повторяем «единый паттерн».

## Варианты

### A. Мульти-апп репо в раскладке istok, без monorepo-тулинга (выбран)
- Раскладка: `web/` (текущий сайт) · `admin/` · `pocketbase/` · `shared/`
  (design-system + Zod-схемы) · `content/` (seed) · `infra/` · `docs/`.
- Каждый юнит — свой `package.json` и свой Docker/деплой; общий код — через
  `shared/` (относительные пути / `sassOptions.loadPaths`, как istok).
- **Плюсы:** совпадает с istok 1:1 (единый паттерн, переиспользуемые знания и
  конфиги); нет тяжёлого оркестратора; независимые сборки; чёткие границы.
- **Минусы:** одноразовая миграция `src/` → `web/`; правка путей в конфигах и
  `deploy.yml`.

### B. Monorepo с тулингом (Turborepo / bun workspaces / nx)
- **Плюсы:** общие зависимости, кэш сборок, единые команды.
- **Минусы:** лишняя сложность для 3 небольших юнитов; расходится с istok;
  усложняет per-app Docker. **Отвергнут** — defer-complexity.

### C. Отдельные репозитории (web / admin / pocketbase)
- **Минусы:** рассинхрон Zod-контракта и design-system между репо; тройной CI;
  сложнее атомарные изменения «схема + сайт + админка». **Отвергнут.**

## Решение

Выбираем **A. Мульти-апп репо в раскладке istok, без monorepo-тулинга.**

```
moreminsk/
├── web/              # текущий сайт: сюда переезжает src/, public/, next.config.ts
│   └── src/          # FSD-lite (ADR-003) — без изменений внутри
├── admin/            # Vite + React SPA (ADR-013)
├── pocketbase/       # PB binary + pb_migrations/ + pb_hooks/ (ADR-012)
├── shared/           # design-system (перенос из src/shared/design-system) + Zod-схемы
├── content/          # seed-данные (бывш. src/shared/content/*.ts)
├── infra/            # docker-compose + nginx vhosts (уже есть)
├── docs/             # Obsidian vault (без изменений)
└── .github/workflows/deploy.yml
```

Ключевые правки при миграции (по образцу istok `web/next.config.ts`):
- `turbopack.root` = корень репо (иначе Turborepo/Next инферит неверный watch-scope);
- `sassOptions.loadPaths` = корень, чтобы `@use "shared/design-system/..."` резолвился;
- `deploy.yml`: сборка идёт из `web/` (build → `web/out` → `lftp`); добавляются
  джобы для `admin/` и `pocketbase/`.

## Последствия

- **Ломающая одноразовая миграция:** `src/` → `web/src/`, `src/shared/design-system`
  → `shared/design-system`, `src/shared/content` → `content/`. Импорты и
  конфиги правятся под новые пути. Делать отдельной серией коммитов на своей ветке,
  с зелёным билдом до и после.
- `deploy.yml`, который мы завели под hoster.by, обновляется на путь `web/`.
- Дальнейшая работа над сайтом ведётся в `web/`; общий контракт (Zod,
  design-system) живёт в `shared/` и меняется в одном месте.
- Порядок реализации: сначала restructure (ADR-014) на зелёном билде, затем
  PocketBase (ADR-012), затем admin-SPA (ADR-013).

## Реализация (2026-07-07, фаза 8.1)

Первый шаг сделан **минимально-рискованно**: приложение перенесено в `web/`
целиком (`git mv`), внутренняя структура `src/` не тронута — `design-system` и
`content` пока остаются внутри `web/src/shared/*`, импорты `@/*` не менялись.

Извлечение `shared/` и `content/` в корень репо **отложено до фазы 8.3**, когда
их начнёт импортировать `admin/` (тогда появляется реальная причина для общего
слоя и path-alias `shared/*` → `../shared/*`, как в istok). До этого лишний
рефактор импортов не оправдан.

Сделанные правки конфигов:
- `web/next.config.ts` — `turbopack.root = web/` (пин watch-scope);
- `Dockerfile` (корень) — build-контекст `.`, `COPY web/`, `ENV NEXT_PUBLIC_SITE_URL`;
- `.dockerignore` — пути `web/.next`, `web/out`, задел под `admin/`, `pocketbase/`;
- `lefthook.yml` — команды `cd web && …`, глобы `web/**`;
- `web/package.json` — `name: moreminsk-web`, убран `prepare` (хуки ставятся из корня).

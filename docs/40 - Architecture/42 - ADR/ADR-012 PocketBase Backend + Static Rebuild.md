---
date: 2026-07-05
status: proposed
tags: [adr, backend, pocketbase, cms, content, deploy]
---

# ADR-012 — PocketBase как бэкенд + Static Rebuild (активация CMS)

## Контекст

MVP собран на **content-as-code**: тексты флота/услуг лежат в
`src/shared/content/*.ts` (`yachts.ts` — 4 яхты, `services.ts` — 8 услуг, плюс
`faq.ts`, `certificates.ts`, `documents.ts`, `contacts.ts`, `instagram-stories.ts`).
Правка контента = правка кода + коммит + деплой. CLAUDE.md фиксировал: «CMS —
после MVP».

**Триггер наступил:** заказчик (Pavel, не разбирается в IT) должен сам обновлять
флот, цены, услуги, фото и видеть заявки — **без git и без разработчика**. Значит
нужен человеческий backend с БД, авторизацией и API.

Донор-паттерн — соседний проект `zavody-rb/istok` (тот же владелец аккаунта
hoster.by), где это уже реализовано и работает: PocketBase + static rebuild
(istok ADR-010) + кастомная admin-SPA (istok ADR-011). Повторяем **единый
паттерн**, а не изобретаем свой.

Текущее состояние на момент решения:
- Хостинг публичного сайта — shared Unix-хостинг клиента (hoster.by, услуга
  128622, `more-minsk.by`), деплой статики через `lftp mirror`
  (`.github/workflows/deploy.yml`). Shared-хостинг **не может** запускать
  PocketBase (Go-демон) — см. «Инфраструктура».
- Сайт — `output: "export"` (ADR-002), полностью статический, SEO-критичный.

## Варианты

### A. Static export + PocketBase на билде + rebuild-webhook (выбран)
- **Плюсы:** сайт остаётся статическим (SEO/скорость не теряем); PocketBase даёт
  БД + REST API + auth + Admin UI из коробки, без своего рантайма; повторяет
  проверенный istok-паттерн; бэкап = `cp pb_data`; заявки с форм получают
  БД-инбокс (`leads`).
- **Минусы:** правки видны с задержкой ~1–3 мин (ребилд CI + редеплой);
  нужен PocketBase-сервер (не shared-хостинг) и webhook-секрет.

### B. Runtime SSR — Node читает PocketBase в рантайме
- **Плюсы:** мгновенные правки, ISR.
- **Минусы:** ломает ADR-002 (static export) и текущий shared-хостинг; лишний
  рантайм ради витрины, где контент меняется редко. **Отвергнут.**

### C. Headless SaaS CMS (Sanity / Contentful)
- **Плюсы:** managed, встроенное превью.
- **Минусы:** вендор-лок, ценник, SaaS-зависимость; дублирует то, что PocketBase
  даёт self-hosted и бесплатно. **Отвергнут.**

### D. Prisma + свой Node-бэкенд
- **Минусы:** PocketBase уже = БД + API + auth + rules; Prisma обходит PB-rules,
  дублирует слой доступа, требует свой рантайм. **Отвергнут** (см. ADR-013 §C).

## Решение

Выбираем **A. Static export + PocketBase на билде + rebuild-webhook.**

- **PocketBase** добавляется сервисом (`docker-compose`) с persistent-volume
  `pb_data` и cron-бэкапом. Reachable за `admin.more-minsk.by` → `/api/`, `/_/`.
- **Collections зеркалят** текущий content-as-code почти 1:1:
  `yachts`, `services`, `faq`, `certificates`, `documents`, `contacts`
  (singleton), `instagram_stories`, плюс новое: `leads` (заявки) и `users`
  (роль `editor`).
- **Разовый seed-скрипт** переносит записи из `src/shared/content/*.ts` в PB;
  фото из `public/` → PB file-поля.
- **Loader-ы** переписываются с `import` статических объектов на
  build-time-экспорт: `scripts/pb/export.ts` тянет PB → JSON-снапшот `.pb/*.json`
  + скачивает фото в `public/images/pb/`; лоадеры читают снапшот синхронно.
  `generateStaticParams` / SSG-логика **не меняются**.
- **API-rules:** контент — public read / editor write; `leads` — public create,
  editor read. Системные настройки PB редактору недоступны.
- **Rebuild-конвейер:** PB-хук (`pb_hooks/`) на изменение контентной коллекции →
  GitHub `repository_dispatch` → `deploy.yml` (export → `next build` → `lftp` на
  hoster.by). Задержка ~1–3 мин приемлема для витрины.

Admin-интерфейс — отдельным решением в [[ADR-013 Custom Admin SPA over PocketBase]].
Структура репо (monorepo) — в [[ADR-014 Monorepo Restructure]].

## Инфраструктура

PocketBase требует полноценный сервер (root + Docker) — shared-хостинг клиента
128622 не подходит.

**Решение (2026-07-07):** у клиента пока только shared-хостинг, поэтому **весь
стек временно на агентском VPS `89.169.54.11`** (рядом с `istok-*`) — один
`docker-compose` с тремя сервисами (site + admin + PB), как istok. Это
supersedes промежуточный hoster.by-деплой статики (`lftp` + `public/.htaccess`) —
он паркуется как готовый путь для **будущего переезда на клиентскую инфру**
(`pb_data` — папка, миграция тривиальна: перенос томов + repoint DNS).

Целевое (позже): весь стек на клиентском VPS, shared-хостинг 128622 выводится.

Раскладка на `89.169.54.11` (порты istok заняты 3008/3009/8093 — moreminsk берёт
следующие свободные, уточнить на сервере):

| Сервис | Контейнер | Порт (host) | Домен |
| --- | --- | --- | --- |
| `moreminsk` (site, static) | nginx:alpine | `127.0.0.1:30xx` | `more-minsk.by` |
| `moreminsk-admin` (SPA) | nginx:alpine | `127.0.0.1:30xx` | `admin.more-minsk.by/` |
| `moreminsk-pb` (PocketBase) | PB | `127.0.0.1:80xx` | `admin.more-minsk.by/api/ /_/` |

DNS (зона more-minsk.by): `more-minsk.by`, `www`, `admin` → `89.169.54.11`
(вместо Tilda `45.155.60.8` / shared `93.125.99.133`).

## Последствия

- Контент выходит из git в БД — источником правды по флоту/услугам становится PB,
  а `src/shared/content/*.ts` вырождается в seed/фолбэк.
- Появляется серверная зависимость (PB up) для **ребилда**, но не для отдачи
  сайта — упавший PB не роняет прод, только замораживает правки.
- Нужен мониторинг/бэкап `pb_data` и webhook-секрет в GitHub secrets.
- Открывается фича `leads`: заявки в БД-инбоксе дополнительно к Telegram-воркеру
  (`infra/booking-telegram-worker/`).

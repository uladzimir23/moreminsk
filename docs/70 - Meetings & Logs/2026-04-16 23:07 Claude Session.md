---
date: 2026-04-16
time: 23:07
type: session-log
topic: "Инициализация проекта moreminsk.by, анализ конкурентов, развёртывание документации"
tags: [session, claude-code, moreminsk]
---

# Сессия Claude Code — 2026-04-16 23:07

## Что обсуждали

- Новый проект на реализацию: **moreminsk.by** — сайт аренды яхт на Минском водохранилище.
- Заказчик (Pavel Tsarenok) прислал план работ через скриншот Telegram: SEO-фундамент (title/description/keywords), дописать тексты услуг, расширить сетку страниц по образцу yachtminsk, добавить продающую структуру (лид→прайс→галерея→CTA→отзывы), затем — формы и конверсионные блоки.
- Референсы подтверждены: **neuro-center** (структура виджетов), **wedding** (эмоциональный визуал), **clariva-spa-landing** (Next.js-скелет).
- Конкуренты проанализированы — 8 игроков рынка Минского моря.
- Договорились использовать **SCSS Modules** (не Tailwind — хотя в clariva-шаблоне Tailwind).

## Решения принятые

1. **Стек подтверждён:** Next.js 16 App Router + static export, TypeScript, next-intl, SCSS Modules, Radix UI, Bun. Hosting — Vercel (на старт), затем потенциально свой VPS.
2. **Архитектура:** FSD-lite (app → widgets → features → entities → shared), по образцу neuro-center.
3. **Документация** — отдельный vault `~/Documents/MoreMinsk-Docs` в паттерне FlexGlass-Docs (Johnny Decimal + Obsidian frontmatter).
4. **Позиционирование:** средний ценовой сегмент B2C + B2B-доп, фокус на «эмоция + прозрачность покупки».
5. **Рыночные дыры → УТП:** онлайн-бронирование с календарём, видео-обзоры яхт, пакеты «под ключ», mobile-first UX, SEO-кластер длинного хвоста.

## Изменения в коде / документации

Созданы каталоги и документы в `~/Documents/MoreMinsk-Docs/`:

- **README.md** + **00 - Indexes/Dashboard.md** + **Map of Content.md**
- **10 - Brief & Requirements/** — Бриф клиента, Цели и KPI, Объём работ MVP
- **20 - Market/** — Конкурентный анализ (8 игроков), Целевая аудитория (9 сегментов), Позиционирование
- **30 - SEO/** — SEO стратегия, Семантическое ядро, Карта страниц (28 страниц MVP), Meta-стратегия, Schema.org разметка
- **40 - Architecture/** — Architecture Overview, Структура проекта, Routing & i18n, Build & Deploy + **42 - ADR/** (ADR-001 SCSS Modules, ADR-002 Static Export, ADR-003 FSD-lite)
- **50 - Design/** — Design System (черновые токены), UX-паттерны, Медиа-стратегия
- **60 - Content/** — Флот яхт (4 яхты), Каталог услуг (15 услуг), FAQ, Тексты блоков (черновые)
- **80 - Templates/** — ADR Template, Idea, Service Page, Yacht Card, Claude Session, Bug
- **90 - Ideas & Backlog/** — Идеи развития (20 идей)
- **95 - Attachments/README.md**

Также обновлена auto-memory:
- Создан `project_moreminsk.md` (project-type)
- Добавлена запись в `MEMORY.md`
- Подтверждён `feedback_styling.md` (SCSS Modules)

## Следующие шаги

1. **От заказчика:**
   - Доступ к хостингу moreminsk.by (выгрузить контент/фото)
   - Доступ к Instagram @moreminsk.by (галерея)
   - Доступ к Я.Вебмастер / GSC / Метрике (SEO-позиции)
   - Подтверждение списка 15 услуг → [[../60 - Content/Каталог услуг]]
   - Параметры флота: длины, год, парус/мотор, каюты → [[../60 - Content/Флот яхт]]
   - Решение: нужна ли EN-локаль в MVP

2. **Техническое (после получения доступов):**
   - Инициализация Next.js репозитория от шаблона clariva с переписыванием стилей на SCSS Modules
   - Верстка главной + 1 эталонной страницы услуги (Свадьба) + прайса
   - Настройка SEO: sitemap.ts, robots.ts, lib/seo.ts, JsonLd компоненты
   - Dev-окружение: ESLint + Stylelint + Prettier + TypeScript strict

3. **Контент:**
   - Организовать съёмочный день (фото + видео по 4 яхтам)
   - Финализировать тексты всех 15 страниц услуг с копирайтером
   - Собрать отзывы (Instagram + Яндекс.Карты) с реальными именами/фото

## Ссылки

- [[../README]]
- [[../00 - Indexes/Dashboard]]
- [[../20 - Market/Конкурентный анализ]]
- [[../40 - Architecture/Architecture Overview]]

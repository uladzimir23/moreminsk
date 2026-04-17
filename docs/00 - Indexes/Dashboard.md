---
type: dashboard
tags: [dashboard, index]
updated: 2026-04-17
---

# Море Minsk — Dashboard

## Статус фаз

| Фаза | Описание | Статус |
|------|----------|--------|
| 0 | Документация и брифинг | ✅ done |
| 1 | Анализ рынка и SEO-семантика | ✅ done |
| 2 | Архитектура Next.js + дизайн-система (ADR-001..008) | ✅ done |
| 3.0 | Foundation (Next.js init, DS, шрифты, providers) | ⏳ next |
| 3.1 | Core widgets (Appbar + BottomNav + AppPanel + Theme/Locale toggles) | ⏳ planned |
| 3.2 | Home page MVP (Hero + FleetGrid + yachts content) | ⏳ planned |
| 3.3 | Первая страница услуги + PriceTable (sticky col) | ⏳ planned |
| 3.4 | Booking wizard (главная бизнес-фича) | ⏳ planned |
| 4 | Тиражирование услуг (15+ страниц) | ⏳ planned |
| 5 | Галерея + Reviews + FAQ | ⏳ planned |
| 6 | Online-бронирование — availability provider (post-MVP) | ⏳ planned |
| 7 | Деплой + Search Console + аналитика | ⏳ planned |

> **Правило коммитов:** каждая фаза закрывается серией из 3–8 коммитов (Conventional Commits). Не переходим к следующей фазе, пока текущая не закоммичена и запушена. Подробнее — `.claude/skills/git-workflow.md` → «Фазовые коммиты».

## Открытые вопросы (требуют решения заказчика)

- [ ] Доступ к текущему хостингу moreminsk.by (выгрузить контент/фото)
- [ ] Доступ к Instagram @moreminsk.by (галерея)
- [ ] Доступ к Google Search Console / Я.Метрике (текущие SEO-позиции)
- [ ] Подтверждение списка из 15+ страниц услуг ([[../30 - SEO/Карта страниц]])
- [ ] Политика конфиденциальности — финальный текст от юриста (пока стаб — [[../60 - Content/Политика конфиденциальности (шаблон)]])
- [ ] «Под ключ» — цены-ориентиры для менеджера ([[../40 - Architecture/Booking Module#Открытые-вопросы-к-заказчику]])
- [x] Локализация: **MVP — RU + EN**, BE — post-MVP (решено 2026-04-17)
- [x] Темы: **light + dark в MVP** (решено 2026-04-17, ADR-006)
- [x] Booking: **wizard + простой календарь (pluggable) + без депозита + email-подтверждение через Resend** (решено 2026-04-17, [[../40 - Architecture/Booking Module]])
- [x] Анимации: **рекомендованный набор** — staggered fade-up Hero, section fade-up, underline swipe accent, tap-scale, shimmer CTA, pulse-dot, floating bobbing, parallax desktop-only (решено 2026-04-17, [[../50 - Design/Анимации]])
- [x] Медиа: **парсим moreminsk.by + Instagram архив Павла**, видео — архитектурно заложено, реализация позже (решено 2026-04-17, [[../40 - Architecture/Scraping plan]])
- [x] Yacht Filter: **все параметры + URL-state** (тип, вместимость, цена, длина, дата через pluggable availability)
- [x] Price Table: **sticky первая колонка** на mobile horizontal scroll
- [x] Reviews: **5 заглушек на MVP**, замена реальными после запуска ([[../60 - Content/Reviews (заглушки)]])
- [x] Contacts: **Yandex Maps**, click-to-load
- [x] Analytics: **закладываем инфраструктуру, не подключаем в MVP**
- [x] Блог: **не в MVP, но SEO-инфраструктура под статьи**
- [x] 404: **CTA-карточки — главная / флот / форма**
- [x] OG-картинки: **генерация скриптом на билде** через `scripts/generate-og.ts` (satori/sharp)

## Быстрые ссылки

### 📍 Старт работ
- ⭐ [[../40 - Architecture/Project Overview]] — module map: **читать первым**
- ⭐ [[../40 - Architecture/Booking Module]] — главная бизнес-фича (wizard)
- [[../40 - Architecture/Architecture Overview]] — tech stack + принципы
- [[../40 - Architecture/Структура проекта]]

### Брифинг и рынок
- [[../10 - Brief & Requirements/Бриф клиента]]
- [[../20 - Market/Конкурентный анализ]]
- [[../20 - Market/Целевая аудитория]]
- [[../20 - Market/Позиционирование]]

### SEO
- [[../30 - SEO/SEO стратегия]]
- [[../30 - SEO/Карта страниц]]
- [[../30 - SEO/Семантическое ядро]]
- [[../30 - SEO/Meta-стратегия]]
- [[../30 - SEO/Schema.org разметка]]

### Архитектура
- [[../40 - Architecture/Routing & i18n]]
- [[../40 - Architecture/Build & Deploy]]
- [[../40 - Architecture/42 - ADR/ADR-001 SCSS Modules вместо Tailwind]]
- [[../40 - Architecture/42 - ADR/ADR-002 Next.js Static Export]]
- [[../40 - Architecture/42 - ADR/ADR-003 FSD-lite архитектура]]
- [[../40 - Architecture/42 - ADR/ADR-004 Mobile App-style Navigation (Appbar + Bottom Nav)]]
- [[../40 - Architecture/42 - ADR/ADR-005 iOS-style Design Language]]
- [[../40 - Architecture/42 - ADR/ADR-006 Color Palette + Theme System + Animation Tokens]]
- [[../40 - Architecture/42 - ADR/ADR-007 Adaptive Panel — Bottom Sheet on Mobile, Side Drawer on Desktop]]
- [[../40 - Architecture/42 - ADR/ADR-008 Typography System — Manrope Variable]]

### Дизайн
- [[../50 - Design/Design System]]
- [[../50 - Design/UX-паттерны]]
- [[../50 - Design/Hero & Section Rhythm]]
- [[../50 - Design/Component Specs]]
- [[../50 - Design/Brand Identity]]
- [[../50 - Design/Анимации]] — motion spec (Framer Motion пресеты)
- [[../50 - Design/Медиа-стратегия]]

### Контент
- [[../60 - Content/Флот яхт]]
- [[../60 - Content/Каталог услуг]]
- [[../60 - Content/FAQ драфт]] — 18 вопросов с ответами (на согласование)
- [[../60 - Content/Reviews (заглушки)]] — 5 шаблонных отзывов для MVP
- [[../60 - Content/Контент-план текстов]] — Hero H1, lead-абзацы, мета-теги
- [[../60 - Content/Политика конфиденциальности (шаблон)]] — юр.документ для `/legal/politika`
- [[../90 - Ideas & Backlog/Идеи развития]]

### Миграция / контент-старт
- [[../40 - Architecture/Scraping plan]] — как переносим фото и тексты с moreminsk.by

## Ключевые контакты

- **Заказчик:** Pavel Tsarenok (бизнес-владелец)
- **Передал ТЗ:** Рома
- **Телефон бизнеса:** +375 29 695 36 36, +375 29 6 109 107
- **Telegram:** @moreminsk · **Instagram:** @moreminsk.by · **Email:** 9797-7@mail.ru
- **Адрес:** Ждановичский с/с, р-н д. Качино, ул. Вокзальная 8а

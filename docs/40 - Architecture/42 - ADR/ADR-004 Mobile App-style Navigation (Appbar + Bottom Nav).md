---
date: 2026-04-17
status: accepted
tags: [adr, mobile, ux, navigation]
---

# ADR-004 — Mobile App-style Navigation (Appbar + Bottom Nav)

## Контекст

70%+ трафика на moreminsk.by — мобильный. Классический паттерн «fixed top header + бургер» (как у neuro-center) работает, но конкуренты (yachtminsk, arenda-yacht, zezet) используют именно его — мы не отстраиваемся. Booking-сценарий требует чтобы CTA «Заказать» **всегда был в одном клике**, без скролла к верху и без открытия меню.

Современные mobile-конверсионные продукты (Wolt, Yandex Go, Glovo, Telegram, Yango) используют **bottom-nav с центральной accent-кнопкой** — конверсия CTA выше на 15–30% против равномерных 5 кнопок.

## Решение

На мобильных вьюпортах (`< lg`) — **двухслойная app-like навигация**:

### Appbar (top, fixed)
- Высота 56px (3.5rem). На скролле > 20px — добавляется `backdrop-filter: blur(16px)` + полупрозрачный фон + hairline-бордер снизу.
- Слева: лого (иконка «волна»/«яхта» + текстовая марка, текст скрыт до `xs`).
- Справа: всегда — `<ThemeToggle />` (☀/🌙/💻) + `<LocaleSwitcher />` (RU/EN) + Telegram-иконка (deep-link). Размер icon-button 40×40, gap `var(--space-xs)`.
- НЕТ бургера — основная навигация ушла в bottom-nav, бургер избыточен.

> **Решение 2026-04-17:** ThemeToggle + LocaleSwitcher живут в Appbar на **всех** breakpoints (включая mobile) — это глобальные настройки UI, должны быть доступны без открытия панели. Из `<AppPanel mode='more' />` они убраны — там остаются только ссылки на вторичные страницы.

### Bottom-nav (fixed, 5 пунктов)
Высота 56px + `env(safe-area-inset-bottom)` (для home bar iPhone X+):

| # | Иконка | Лейбл | Поведение |
|---|---|---|---|
| 1 | `Home` | Главная | `<Link href="/">` |
| 2 | `Sailboat` | Флот | `<Link href="/fleet">` |
| 3 | **`Plus`** | **Заказать** | `open('order')` — открывает `<AppPanel />` в режиме формы брони (см. ADR-007). На mobile = bottom-sheet, на desktop = side-drawer. Кнопка: accent-цвет, чуть приподнята (-8px translateY), capsule |
| 4 | `Sparkles` | Услуги | `<Link href="/services">` |
| 5 | `Menu` | Ещё | `open('more')` — открывает `<AppPanel mode='more' />` (FAQ, Отзывы, Цены, О нас, Контакты, Блог) |

Активный пункт: цвет `--color-primary` + индикатор-точка под иконкой.

### Desktop (`lg+`)
- Bottom-nav **скрыт** (`display: none`).
- Appbar становится: `[Logo] [Главная Флот Услуги Цены Контакты] [☀/🌙] [RU/EN] [Заказать]` — те же right-side контролы (theme + lang) + добавляется horizontal nav в центре + primary CTA «Заказать» справа.
- Логика по образцу neuro-center header (см. UX-паттерны).

### Контент-отступы
- `<main>` имеет `padding-block-start: var(--appbar-height)` (под appbar).
- На mobile — `padding-block-end: calc(var(--bottomnav-height) + env(safe-area-inset-bottom))` (под bottom-nav).
- На desktop — `padding-block-end: 0`.

## Последствия

### Позитивные
- CTA «Заказать» **всегда в одном клике** — без скролла к топу, без открытия меню. Конверсия выше.
- Отстройка от конкурентов — никто из 8 проанализированных не использует app-like нав.
- Premium-ощущение «как приложение» — поддерживает позиционирование (см. ADR-005 iOS-style).
- 5 разделов вместо 8–10 в традиционном меню — заставляет приоритизировать. «Цены» / «О нас» / «FAQ» уходят в «Ещё» — это правильно (они не в каждой сессии).
- Удобно для возвратных визитов (повторный booking) — пользователь сразу попадает в нужный раздел.

### Негативные
- Вертикальное пространство уменьшается на ~112px на mobile (appbar + bottom-nav). Решение: контент-отступы учитываются автоматически, hero и секции масштабируются.
- На очень маленьких экранах (Galaxy Fold внешний экран ~280px) 5 иконок впритык — но реальный таргет ≥360px.
- Сложнее SEO crawling вторичных страниц (FAQ/о нас) — они не в primary nav. Решение: ссылки в `<Footer />` + sitemap.xml + внутренняя перелинковка из контента.

### Нейтральные
- Требуется 3 новых компонента: `<Appbar />` и `<BottomNav />` в `src/widgets/`, `<AppPanel />` в `src/widgets/app-panel/` (см. ADR-007).
- На desktop bottom-nav бесполезен — но это нормально, mobile-first проект.

## Альтернативы (отвергнутые)

1. **Классический бургер-меню (как neuro-center)** — работает, но не отстраивается, CTA уходит в 2-3 клика.
2. **Sticky CTA-bar внизу (как было в первой редакции UX-паттернов)** — слабее: только 2 кнопки (TG + звонок), нет навигации, занимает место всегда. Bottom-nav решает обе задачи: и нав, и CTA.
3. **Drawer / off-canvas меню (Material)** — тяжелее визуально, конверсия ниже из-за двойного действия (открыть → выбрать).
4. **5 равных кнопок без accent-центра** — теряется конверсионный фокус. Wolt/Yandex Go/Telegram все используют визуальный центр.

## Связанные заметки

- [[../../50 - Design/UX-паттерны]] — паттерны Appbar/BottomNav/Sheet
- [[ADR-005 iOS-style Design Language]] — общий стиль интерфейса
- [[ADR-007 Adaptive Panel — Bottom Sheet on Mobile, Side Drawer on Desktop]] — заменяет OrderSheet/MoreSheet на единый AppPanel
- [[../Routing & i18n]] — все страницы локализованы под bottom-nav
- Skill: `.claude/skills/mobile-first.md`

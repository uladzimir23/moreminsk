---
type: brand
tags: [design, brand, wordmark, logo, favicon, og]
updated: 2026-04-17
---

# Brand Identity

> **Допущение:** существующие визуальные активы Pavel'а (если есть) пока нам не переданы. Этот документ описывает MVP-вариант идентичности «with what we have»: wordmark на Manrope, без отдельного лого-символа. Если Pavel пришлёт логотип — точка замены **одна**: компонент `<Logo />` в `src/shared/ui/logo/`. Макеты и токены менять не придётся.

## Naming hierarchy

| Контекст | Форма | Пример использования |
|---|---|---|
| **Primary brand** | **Море Minsk** | hero H1, footer signature, email |
| Domain / URL | moreminsk.by | favicon hover-title, schema.org, ссылки |
| Social handle | @moreminsk | TG, IG, ссылки в footer |
| Technical / code | `moreminsk` | className, repo, env vars |
| Old/legacy | ЯхтыМинска | **не используем** в новом сайте, только в SEO как keyword (alt в schema) |

**Правило:** в копирайтинге всегда **«Море Minsk»** с пробелом и заглавной М. Не «moreminsk», не «Море минск», не «MoreMinsk». Это первое касание бренда — ошибки тут хуже всего.

## Tagline / one-liner

> **Море Minsk — яхты для впечатлений на Минском водохранилище.**
> Прозрачные цены. Онлайн-бронирование. Видео каждой яхты до брони.

(Из [[../20 - Market/Позиционирование#Кратко-one-liner]]. Не меняется.)

## Wordmark — MVP

**Подход:** type-first identity. Шрифт Manrope (см. ADR-008) делает большую часть работы — он узнаваемый, тёплый, премиум-modern. Custom-treatment добавляет owned character.

### Lockups

```
1. Full lockup (header desktop, footer):
   ┌─────────────────────────┐
   │  Море Minsk             │  ← Manrope Bold, --text-2xl, tracking-tight
   │  яхты на Минском море   │  ← Manrope Medium, --text-xs, tracking-wide,
   │                            color-mix(--color-foreground 60%)
   └─────────────────────────┘

2. Compact lockup (header mobile, appbar):
   ┌──────────────┐
   │ Море Minsk   │  ← одна строка, --text-lg
   └──────────────┘

3. Mark-only (favicon, app-icon, OG-bottom-corner):
   ┌────┐
   │ М  │  ← Manrope Bold, kapital-M, центрирован,
   │    │     радиус контейнера = --radius-2xl,
   └────┘     bg = --color-primary, fg = --color-on-primary
```

### Custom treatment (опционально, фаза 2)

Два возможных приёма (выбираем один на этапе визуала, **не оба сразу**):

**Вариант А — порт-холл вместо «о»:**
```
М • р е   M i n s k     ← подмена «о» в Море на •
```
- Не меняет шрифт (всё ещё Manrope) → не нарушает токены
- Ownable visual quirk: иллюминатор / порт-холл / точка-якорь
- Реализуется простым SVG/inline-CSS

**Вариант Б — italic accent на «Море» через Lora:**
```
Море Minsk     ← «Море» в Lora italic 500, «Minsk» в Manrope semibold
```
- Использует наш accent-шрифт (Lora, ADR-008) → консистентно с UI
- Создаёт изящный type-mix: italic serif + upright sans = классический wordmark-приём
- Кириллический «Море» — там где Lora красивее всего (italic м/о/р/е)

В MVP делаем **без custom-treatment** (чистая Manrope везде в wordmark) — чтобы не блокировать запуск и не зацикливаться. После первого месяца аналитики А/Б-тестим оба варианта.

### Размеры (минимальные)

| Lockup | Min width | Min height |
|---|---|---|
| Full | 11rem (~176px) | — |
| Compact | 6rem (~96px) | 1.25rem |
| Mark-only | 1.75rem (~28px) | 1.75rem |

Меньше — нечитаемо.

### Clear space (защитное поле)

Вокруг wordmark — `1ch` (ширина одного символа) свободного пространства со всех сторон. Никаких других элементов внутри этой зоны.

### Цветовые применения

| Фон | Wordmark color | Tagline color |
|---|---|---|
| Light theme `--color-background` | `--color-foreground` (#1B2230) | `--color-foreground-muted` |
| Dark theme `--color-background` | `--color-foreground` (#E8EEF3) | `--color-foreground-muted` |
| `--color-primary` (любая тема) | `--color-on-primary` | `--color-on-primary` 80% |
| `--color-accent` (CTA-зоны) | `--color-on-accent` | — |
| Фото / hero | `#FFFFFF` + drop-shadow `0 2px 4px rgba(0,0,0,0.4)` | `#FFFFFF` 90% |

**Никогда:** не наносим wordmark на сложный фон без shadow/scrim. Не используем `--color-accent` (sunset coral) для самого wordmark — это цвет CTA, не бренда.

## `<Logo />` — компонент

```tsx
// src/shared/ui/logo/Logo.tsx
type LogoProps = {
  variant?: 'full' | 'compact' | 'mark'   // default 'compact'
  inverted?: boolean                       // для тёмных секций / hero поверх фото
  href?: string                            // если задан — оборачивается в <Link>; default '/'
}
```

`<Logo />` — единственное место, где бренд-визуал хардкодится. Если Pavel пришлёт SVG-лого:
1. Кладём в `src/shared/ui/logo/assets/logo.svg` (с правильными `currentColor` для темизации)
2. Внутри `Logo.tsx` свитчим: если есть SVG-asset — рендерим его, иначе fallback на wordmark
3. Макеты/токены не трогаем

## Favicon system

```
public/favicons/
├── favicon.ico            ← 32×32, fallback для старых браузеров
├── favicon.svg            ← вектор, mask-icon, единственный «настоящий» файл
├── favicon-16.png         ← 16×16
├── favicon-32.png         ← 32×32
├── apple-touch-icon.png   ← 180×180, iOS home-screen, без скруглений (iOS сам скруглит)
├── android-chrome-192.png ← 192×192
├── android-chrome-512.png ← 512×512
└── manifest.webmanifest   ← PWA basics
```

**Дизайн favicon:** буква **М** (заглавная Manrope Bold) в **круге** `--color-primary`, белым `--color-on-primary`. Минимализм — на 16×16 любой детальный лого превращается в кашу.

```html
<!-- в app/[locale]/layout.tsx -->
<link rel="icon" href="/favicons/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicons/favicon.ico" sizes="any" />
<link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
<link rel="manifest" href="/favicons/manifest.webmanifest" />
<meta name="theme-color" content="#0A4D7A" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#0E1620" media="(prefers-color-scheme: dark)" />
```

`manifest.webmanifest`:
```json
{
  "name": "Море Minsk — аренда яхт",
  "short_name": "Море Minsk",
  "icons": [
    { "src": "/favicons/android-chrome-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/favicons/android-chrome-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#0A4D7A",
  "background_color": "#FAF7F2",
  "display": "standalone",
  "start_url": "/"
}
```

## OG-image templates

> Полный список нужных OG-картинок (21 шт.) — в [[Медиа-стратегия#OG-картинки]].

### Базовый шаблон (1200×630)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   [фото яхты на воде, full-bleed, dark scrim снизу]    │
│                                                         │
│                                                         │
│  ┌────────────────────────────────────────┐             │
│  │ EVA · 6 человек · 150 BYN/ч            │  ← H1       │
│  │ Свободна 12 июля                       │  ← lead     │
│  └────────────────────────────────────────┘             │
│                                                         │
│  Море Minsk · moreminsk.by              [М]             │  ← brand row
└─────────────────────────────────────────────────────────┘
```

**Спецификация:**
- Размер: **1200×630** (Facebook/Twitter/Telegram canonical)
- Фото: full-bleed, реальное (не сток)
- Scrim: `linear-gradient(transparent 40%, rgba(14,22,32,0.85) 100%)` снизу для читаемости текста
- Текст:
  - Title: Manrope Bold, 64px, white, tracking-tight
  - Subtitle: Manrope Medium, 28px, white 85%
- Brand row внизу: Manrope Medium, 24px, white 70%, плюс mark в правом нижнем
- Padding: 60px со всех сторон

### Вариации

| Тип | Title | Subtitle | Brand row | Источник фото |
|---|---|---|---|---|
| Главная | «Яхты на Минском море» | «Прозрачные цены. Видео каждой яхты.» | + URL | hero-фото |
| Yacht (`/fleet/[slug]`) | «{Имя} · {N} чел · {цена} BYN/ч» | «Свободна {дата}» | + | главное фото яхты |
| Service (`/services/[slug]`) | «Свадьба на яхте» | «от 1200 BYN · фото в подарок» | + | сценарное фото |
| Static (`/o-nas`, `/faq`) | название страницы | one-liner | + | универсальное фото |

### Генерация

OG-картинки **генерируем на билде** скриптом `scripts/generate-og.ts` через `@vercel/og` или `satori` (без Next.js Image API в static export). Шаблон — JSX, данные — из контента.

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="..." />  <!-- тот же URL что og:image -->
```

## Voice consistency

> Tone of voice финализирован в [[../20 - Market/Позиционирование#Tone-of-Voice]]. Здесь — visual-проекция тона.

**Микрокопия и UX-подписи** должны звучать так же как маркетинговые тексты:

| Контекст | ✅ Наш тон | ❌ Не наш тон |
|---|---|---|
| Кнопка | «Свободные даты» | «Узнать больше» |
| Empty state | «Пока нет отзывов на эту яхту. Будь первым.» | «Ой! Здесь пока ничего нет 😊» |
| Error | «Не удалось отправить. Напиши нам в Telegram.» | «Произошла ошибка. Попробуйте позже.» |
| Loader | (skeleton, без текста) | «Загружаем для вас лучшее предложение...» |
| Success после формы | «Спасибо! Менеджер ответит в Telegram за 30 мин.» | «Ваша заявка успешно принята!» |
| Date picker | «Выбери дату на воде» | «Выберите дату бронирования» |

**Глобальное правило:** «вы» **не используем** в копирайтинге. **Только «ты»** или **обезличенно**. Это идёт в paritet с Tone of voice — тёплый, не корпоративный.

## Что не делаем

- ❌ Не используем смайлы / emoji в UI и копирайтинге (даже в success-состояниях)
- ❌ Не пишем «инновационный», «уникальный», «эксклюзивный», «премиум-сервис» — пафос
- ❌ Не делаем gradient-fills на wordmark (плоский color-fill)
- ❌ Не наклоняем / не растягиваем wordmark
- ❌ Не используем accent (sunset coral) для самого wordmark — это CTA-цвет
- ❌ Не делаем hover-анимации на лого (rotate / scale / pulse) — лого статичен
- ❌ Не размещаем wordmark на дикий фоне без scrim/shadow

## Roadmap идентичности

| Фаза | Что | Когда |
|---|---|---|
| **MVP** | Wordmark Manrope + favicon-М-в-круге | сейчас |
| **2** | Custom treatment («М•ре Minsk» с иллюминатором) | после первого месяца аналитики, A/B-test |
| **3** | Полноценный логотип-символ (если бренд masштабируется) | после 6+ мес работы, с дизайнером |
| **4** | Brand book (полный гайд для подрядчиков) | если будет франшиза / партнёрка |

## Связанные документы

- [[../20 - Market/Позиционирование]] — naming, tone of voice, brand promise
- [[Design System]] — цвета, шрифт, токены
- [[Медиа-стратегия]] — OG-картинки источники, фото-направление
- [[../40 - Architecture/42 - ADR/ADR-006 Color Palette + Theme System + Animation Tokens]]
- [[../40 - Architecture/42 - ADR/ADR-008 Typography System — Manrope Variable]]

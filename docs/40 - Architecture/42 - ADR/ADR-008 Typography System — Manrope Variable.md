---
date: 2026-04-17
status: accepted
tags: [adr, typography, design-system, performance]
---

# ADR-008 — Typography System: Manrope Variable

## Контекст

В черновике Design System значились варианты «Unbounded + Manrope» или «Playfair + Inter» — без решения. Шрифт — фундамент дизайн-системы, от него зависят: type scale в `tokens/_typography.scss`, спецификации компонентов (Button/Card/Input/Heading), HTML-разметка `<h1>..<h6>`, бандл (LCP). Тянуть с решением до этапа кода = переделывать стили.

Контекст проекта:
- ru + en (MVP) — **обязательна** полноценная кириллица
- iOS-style визуальный язык (ADR-005) — пропорции близкие к SF Pro
- Морская navy + sunset coral палитра (ADR-006) — нужен **тёплый**, не холодный шрифт
- Static export, mobile 3G — критичен размер шрифтового файла
- Цены везде в формате чисел — нужны tabular numerals
- Один из UX-референсов (`~/Documents/neuro-center`) использует Manrope успешно

## Решение

**Один шрифт на весь проект — Manrope Variable** через `next/font/google`. Без отдельного display-шрифта в MVP.

### Конфигурация загрузки

```tsx
// src/app/fonts.ts
import { Manrope } from 'next/font/google'

export const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
})
```

`<body className={manrope.variable}>` в `app/[locale]/layout.tsx`.

### Token spec

```scss
// tokens/_typography.scss

// Family
--font-family-base: var(--font-manrope), system-ui, -apple-system, 'Segoe UI', sans-serif;

// Weights
--font-weight-light:    300;   // muted captions, disclaimers
--font-weight-regular:  400;   // body default
--font-weight-medium:   500;   // emphasis, button labels
--font-weight-semibold: 600;   // H4-H6, badges
--font-weight-bold:     700;   // H1-H3, key prices

// Type scale (fluid clamp — flex-glass pattern, mobile 360px → desktop 1440px)
--text-xs:   clamp(0.75rem,  0.7rem  + 0.2vw,  0.8125rem);  // 12-13  — micro-labels, legal
--text-sm:   clamp(0.875rem, 0.825rem + 0.25vw, 0.9375rem); // 14-15  — captions
--text-base: clamp(1rem,     0.95rem  + 0.25vw, 1.0625rem); // 16-17  — body
--text-lg:   clamp(1.125rem, 1.05rem  + 0.4vw,  1.25rem);   // 18-20  — lead, large body
--text-xl:   clamp(1.25rem,  1.15rem  + 0.5vw,  1.5rem);    // 20-24  — H4
--text-2xl:  clamp(1.5rem,   1.35rem  + 0.75vw, 1.875rem);  // 24-30  — H3
--text-3xl:  clamp(1.875rem, 1.6rem   + 1.4vw,  2.5rem);    // 30-40  — H2
--text-4xl:  clamp(2.25rem,  1.85rem  + 2vw,    3rem);      // 36-48  — H1 (subpages)
--text-5xl:  clamp(2.75rem,  2.2rem   + 2.75vw, 3.75rem);   // 44-60  — H1 (default)
--text-6xl:  clamp(3.5rem,   2.8rem   + 3.5vw,  4.5rem);    // 56-72  — Hero H1 only

// Line heights
--leading-tight:   1.1;     // H1, big numbers
--leading-snug:    1.2;     // H2-H3
--leading-base:    1.4;     // H4-H6, small text in cards
--leading-normal:  1.5;     // body
--leading-relaxed: 1.65;    // long-form (FAQ, blog)

// Letter spacing (Manrope screams a touch wide at large sizes — tighten H1-H3)
--tracking-tightest: -0.025em; // Hero H1 (--text-6xl)
--tracking-tight:    -0.015em; // H1-H2
--tracking-snug:     -0.005em; // H3-H4
--tracking-normal:   0;        // body
--tracking-wide:     0.02em;   // kickers, badge labels
--tracking-caps:     0.08em;   // SMALL CAPS LABELS / EYEBROW

// Numeric features
--font-feature-tabular: 'tnum' on, 'lnum' on;
--font-feature-default: 'kern' on, 'liga' on;
```

### Семантический mapping (HTML → token)

| Element | size | weight | leading | tracking | Where |
|---|---|---|---|---|---|
| Hero `<h1>` | `--text-6xl` | 700 | tight | tightest | / |
| Page `<h1>` | `--text-5xl` | 700 | tight | tight | /fleet, /services |
| `<h2>` | `--text-3xl` | 700 | snug | tight | section headings |
| `<h3>` | `--text-2xl` | 600 | snug | snug | sub-section, card titles |
| `<h4>` | `--text-xl` | 600 | base | snug | card subtitles |
| `<h5>` | `--text-lg` | 600 | base | normal | metadata heads |
| `<h6>` | `--text-base` | 600 | base | wide | rare, eyebrow-like |
| Lead `<p>` | `--text-lg` | 400 | normal | normal | hero subtitle |
| Body `<p>` | `--text-base` | 400 | normal | normal | default |
| Small | `--text-sm` | 400 | base | normal | captions, metadata |
| Caption | `--text-xs` | 400 | base | wide | legal, image credits |
| Button | `--text-base` | 500 | base | normal | default |
| Button (sm) | `--text-sm` | 500 | base | normal | compact |
| Price | `--text-2xl` | 700 | tight | tight | + tabular-nums |
| Price (small) | `--text-base` | 600 | base | normal | + tabular-nums |
| Eyebrow | `--text-xs` | 600 | base | caps | UPPERCASE secret-sauce labels |

Реализуется через `<Heading level={1..6}>` + `<Text variant="...">` компоненты в `src/shared/ui/`.

### Глобальные правила

1. **`font-family-base` на `<html>`**, не на `<body>` — наследование чистое
2. **`font-feature-settings: var(--font-feature-default)` на `<html>`** — kerning + лиги по дефолту
3. **Класс `.tabular`** для цен/чисел: добавляет `font-feature-settings: var(--font-feature-tabular)` (overrides)
4. **`text-rendering: optimizeLegibility` + `-webkit-font-smoothing: antialiased`** на `<body>` — стандартный setup
5. **Никаких `font-family` в компонентных стилях** — всё наследуется. Исключение: `<code>` (mono), но в проекте кода нет
6. **Минимальный размер body на mobile = 16px** (анти-zoom iOS Safari при focus на `<input>`)

### Что НЕ делаем

- ❌ Не подключаем второй шрифт «для display» в MVP — DRY, экономия 30+ kb
- ❌ Не используем `font-weight: 800/900` — Manrope теряет читаемость, для emphasis достаточно 700
- ❌ Не делаем letter-spacing > 0 на body (только на eyebrows/labels)
- ❌ Не используем `text-transform: uppercase` на длинных строках — только на коротких eyebrows
- ❌ Не подключаем больше 5 weight'ов (300/400/500/600/700) — больше = больше байт без выгоды

## Последствия

### Позитивные
- **Один шрифт-файл = ~28kb gzip** (с subset latin+cyrillic, 5 weight, variable axis). Против ~80kb если подключать display+body отдельно
- **Tabular nums встроены** — цены автоматически выравниваются вертикально (важно для прайс-таблиц)
- **`next/font` self-hosting** — нет внешних запросов к Google Fonts → нет CLS, нет GDPR-проблем, ноль третьих доменов
- **Полная кириллица** — ru+en MVP закрыт без warparound
- **Fluid type scale** — нет «прыжков» между breakpoint'ами, выглядит ровно на всех устройствах
- **Семантический mapping** — компоненты `<Heading>` и `<Text>` пишутся один раз, в дизайне и коде договорённость

### Негативные
- **Manrope менее «характерный» чем display-шрифты** — если на этапе визуала захочется wow-эффекта на названиях яхт, придётся добавлять второй шрифт (но это пост-MVP fix)
- **Кириллица в Manrope чуть слабее латиницы** — i, ы, я могут смотреться неровно в очень крупных размерах. Решение: tracking-tightest на Hero убирает большую часть проблем
- **Рендеринг variable font в Safari < 14** — fallback на system-ui без variable axis. Приемлемо

### Нейтральные
- Весь type scale — fluid `clamp()`, без attached breakpoint-overrides → если захотим резкий jump на десктопе, придётся переписывать (но это анти-паттерн mobile-first)

## Альтернативы (отвергнутые)

1. **Inter** — безопасно, нейтрально, но «Vercel/SaaS-default». Нет тёплости, плохо рифмуется с sand neutrals + sunset coral палитрой. Конкуренты узнают паттерн «как Linear/Stripe».
2. **Unbounded + Manrope** (черновой вариант) — Unbounded слишком display-ный, кириллица слабая, +30kb за второй шрифт. Эффект «модно» не оправдан.
3. **Playfair Display + Inter** — Playfair = «свадебный фотограф», конфликт с premium-modern iOS-feel. Морская тема ≠ wedding.
4. **SF Pro как primary** — нет direct-кириллицы (Apple отдаёт SF Pro Cyrillic только частично), лицензия Apple запрещает self-host. На non-Apple устройствах деградирует на fallback.
5. **Только system-ui** — самый быстрый вариант, но визуал отличается между OS (San Francisco на macOS, Segoe UI на Windows, Roboto на Android). Brand-консистентность теряется.
6. **Geist (Vercel)** — отличный шрифт, но узнаваемая Vercel-эстетика. Те же причины что Inter.

## Связанные

- [[ADR-005 iOS-style Design Language]] — пропорции и feel шрифта
- [[ADR-006 Color Palette + Theme System + Animation Tokens]] — палитра, к которой подбирается шрифт
- [[../../50 - Design/Design System]] — type scale, mapping
- Manrope: <https://github.com/sharanda/manrope>, демо <https://www.manropefont.com/>
- Reference: `~/Documents/neuro-center` — рабочий пример Manrope в продакшне

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

**Два шрифта** через `next/font/google`:
1. **Manrope Variable** — основной (UI, body, headings, всё функциональное)
2. **Lora Variable** — accent (только для декоративных слов, italic-первый)

> **Update 2026-04-17:** изначально планировали single-family, но передумали — добавили Lora как accent. Причина: Manrope один даёт «честно, но без характера»; небольшое вкрапление serif italic создаёт ownable visual quirk без шрифта на каждой кнопке. **Использование строго селективное** (см. раздел «Lora — правила»).

### Конфигурация загрузки

```tsx
// src/app/fonts.ts
import { Manrope, Lora } from 'next/font/google'

export const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
})

export const lora = Lora({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
  preload: false,                    // accent-only, не критичен для LCP
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})
```

`<body className={`${manrope.variable} ${lora.variable}`}>` в `app/[locale]/layout.tsx`.

### Token spec

```scss
// tokens/_typography.scss

// Family
--font-family-base:   var(--font-manrope), system-ui, -apple-system, 'Segoe UI', sans-serif;
--font-family-accent: var(--font-lora), Georgia, 'Times New Roman', serif;

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

## Lora — правила использования (accent-only)

> **Жёсткое правило:** Lora применяется **только** через компонент `<Accent>...</Accent>` или класс `.accent`. Никаких `font-family: var(--font-family-accent)` напрямую в стилях компонентов. Это защита от расползания шрифта по UI.

### Реализация

```tsx
// src/shared/ui/text/Accent.tsx
type AccentProps = {
  children: React.ReactNode
  italic?: boolean      // default true (italic — основной режим Lora у нас)
  weight?: 400 | 500    // default 400
  as?: 'span' | 'em'    // default 'em' (semantic emphasis)
}
```

```scss
.accent {
  font-family: var(--font-family-accent);
  font-style: italic;             // default — italic
  font-weight: 400;
  // Lora чуть «играет» с baseline — поджимаем к Manrope
  letter-spacing: -0.005em;
}

.accent--upright { font-style: normal; }
.accent--medium  { font-weight: 500; }
```

### Где использовать

| Кейс | Пример | Стиль |
|---|---|---|
| Названия яхт в карточках | *EVA*, *ALFA*, *MARIO*, *BRAVO* | italic 500 |
| Одно accent-слово в Hero H1 | «Яхты, на которых *возвращаются*» | italic 400 |
| Кавычки в отзывах | *« »* (open + close), оборачивает quoted-text | regular 400 |
| Eyebrow к ключевой секции (1 на странице max) | *Минское море* | italic 400, --text-sm |
| Citation source | — *Анна К., июль 2025* | italic 400 |

### Где НЕ использовать (строгий запрет)

- ❌ Любые UI-controls (кнопки, чипы, input, фильтры, dropdown)
- ❌ Body text, captions, microcopy
- ❌ Section titles (H2/H3) — остаются Manrope
- ❌ Цены и числа (всегда Manrope tabular)
- ❌ Empty states, errors, loading-text
- ❌ Footer, нав, breadcrumb

### Объём на странице

- **Max 5 instances** на одной странице. Чаще — теряется эффект акцента, превращается в «новостной портал».
- **Max 2 instances** в одном вьюпорте — не должны конкурировать друг с другом за внимание.

### Stylelint enforcement

В `.stylelintrc` добавить кастомное правило, запрещающее `font-family: var(--font-family-accent)` вне файлов `accent.module.scss` / `text/Accent*` (через `selector-disallowed-list` + `comment-disable-allowed`).

## Глобальные правила

1. **`font-family-base` на `<html>`**, не на `<body>` — наследование чистое
2. **`font-feature-settings: var(--font-feature-default)` на `<html>`** — kerning + лиги по дефолту
3. **Класс `.tabular`** для цен/чисел: добавляет `font-feature-settings: var(--font-feature-tabular)` (overrides)
4. **`text-rendering: optimizeLegibility` + `-webkit-font-smoothing: antialiased`** на `<body>` — стандартный setup
5. **Никаких `font-family` в компонентных стилях** — всё наследуется. Исключение: `<code>` (mono), но в проекте кода нет
6. **Минимальный размер body на mobile = 16px** (анти-zoom iOS Safari при focus на `<input>`)

### Что НЕ делаем

- ❌ Не подключаем третий шрифт (display sans, script, mono) — двух хватит
- ❌ Не используем `font-weight: 800/900` Manrope — теряет читаемость, для emphasis достаточно 700
- ❌ Не делаем letter-spacing > 0 на body (только на eyebrows/labels)
- ❌ Не используем `text-transform: uppercase` на длинных строках — только на коротких eyebrows
- ❌ Не подключаем больше 5 weight'ов Manrope (300/400/500/600/700) — больше = больше байт без выгоды
- ❌ Не используем Lora для weight > 500 (heavy serif выглядит editorial / wedding-magazine)
- ❌ Не миксуем Lora + Manrope в одном слове / название (только целое слово italic)

## Последствия

### Позитивные
- **Manrope: ~28kb gzip + Lora: ~25kb gzip = ~53kb total** (variable, subset latin+cyrillic). Lora с `preload: false` не блокирует LCP
- **Tabular nums встроены** — цены автоматически выравниваются вертикально (важно для прайс-таблиц)
- **`next/font` self-hosting** — нет внешних запросов к Google Fonts → нет CLS, нет GDPR-проблем, ноль третьих доменов
- **Полная кириллица в обоих** — ru+en MVP закрыт без warparound
- **Fluid type scale** — нет «прыжков» между breakpoint'ами, выглядит ровно на всех устройствах
- **Семантический mapping** — компоненты `<Heading>` / `<Text>` / `<Accent>` пишутся один раз, в дизайне и коде договорённость
- **Accent через `<Accent>` обёртку** — невозможно случайно расползание Lora по UI (защищено stylelint-правилом)

### Негативные
- **+25kb байт на Lora** — оправдано визуальным character'ом, не блокирует LCP (`preload: false`)
- **Кириллица в Manrope чуть слабее латиницы** — i, ы, я могут смотреться неровно в очень крупных размерах. Решение: tracking-tightest на Hero убирает большую часть проблем
- **Рендеринг variable font в Safari < 14** — fallback на system-ui без variable axis. Приемлемо
- **Lora требует дисциплины применения** — без правил легко превратить сайт в editorial-журнал. Решение: жёсткое ограничение «5 instances на странице max» + обёртка-компонент

### Нейтральные
- Весь type scale — fluid `clamp()`, без attached breakpoint-overrides → если захотим резкий jump на десктопе, придётся переписывать (но это анти-паттерн mobile-first)

## Альтернативы (отвергнутые)

### Для основного шрифта
1. **Inter** — безопасно, нейтрально, но «Vercel/SaaS-default». Нет тёплости, плохо рифмуется с sand neutrals + sunset coral палитрой. Конкуренты узнают паттерн «как Linear/Stripe».
2. **Unbounded + Manrope** (черновой вариант) — Unbounded слишком display-ный, кириллица слабая, +30kb за второй шрифт. Эффект «модно» не оправдан.
3. **Playfair Display + Inter** — Playfair = «свадебный фотограф», конфликт с premium-modern iOS-feel. Морская тема ≠ wedding.
4. **SF Pro как primary** — нет direct-кириллицы (Apple отдаёт SF Pro Cyrillic только частично), лицензия Apple запрещает self-host. На non-Apple устройствах деградирует на fallback.
5. **Только system-ui** — самый быстрый вариант, но визуал отличается между OS (San Francisco на macOS, Segoe UI на Windows, Roboto на Android). Brand-консистентность теряется.
6. **Geist (Vercel)** — отличный шрифт, но узнаваемая Vercel-эстетика. Те же причины что Inter.

### Для accent-шрифта (Lora vs alternatives)
7. **Fraunces** — превосходный variable serif, но **нет кириллицы** в Google Fonts. Disqualified для ru+en MVP.
8. **Cormorant Garamond** — есть кириллица, элегантный, но **не variable** (нужно подключать 2-3 weight'а × 2 style'а отдельно = +60kb). Дороже Lora за тот же эффект.
9. **Spectral (Adobe)** — есть кириллица, но editorial / news-magazine feel, не «морской premium». Не variable.
10. **Playfair Display (как accent only)** — есть кириллица, variable axis, но всё та же «wedding» ассоциация — даже в малых дозах прочитывается как «глянец».
11. **PT Serif** — full Cyrillic, но без характера; serif-аналог Inter — безопасно и пресно.
12. **Lora SC (small caps)** — добавить отдельный subfont только для small-caps efficient: но Lora regular + `font-variant-caps: small-caps` решает то же без +файла.

## Связанные

- [[ADR-005 iOS-style Design Language]] — пропорции и feel шрифта
- [[ADR-006 Color Palette + Theme System + Animation Tokens]] — палитра, к которой подбирается шрифт
- [[../../50 - Design/Design System]] — type scale, mapping
- Manrope: <https://github.com/sharanda/manrope>, демо <https://www.manropefont.com/>
- Lora: <https://fonts.google.com/specimen/Lora> (designer Cyreal, full Cyrillic)
- Reference: `~/Documents/neuro-center` — рабочий пример Manrope в продакшне

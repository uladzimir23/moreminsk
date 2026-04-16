---
type: component-specs
tags: [design, components, ui, specs]
updated: 2026-04-17
---

# Component Specs

> Финальные визуальные спецификации атомов из `src/shared/ui/`. Все размеры/цвета/радиусы — через токены ([[Design System]]). Все компоненты обязательно работают в light + dark темах. Реализация — SCSS Modules + iOS-style правила ([[../40 - Architecture/42 - ADR/ADR-005 iOS-style Design Language]]).

## Button

### Варианты

| Variant | Background | Foreground | Border | Где используется |
|---|---|---|---|---|
| `primary` | `--color-primary` | `--color-on-primary` | none | основной CTA на странице |
| `accent` | `--color-accent` | `--color-on-accent` | none | **«Заказать»**, единственный warm-CTA |
| `ghost` | `transparent` | `--color-foreground` | `var(--border-hairline)` | secondary действия, рядом с primary |
| `link` | `transparent` | `--color-primary` | none | inline-action, без bg |
| `danger` | `--color-error` | `#FFFFFF` | none | удаление, отмена брони |

### Размеры

| Size | Block-size | Padding-inline | Font | Использование |
|---|---|---|---|---|
| `sm` | `2rem` (32px) | `var(--space-md)` (16px) | `--text-sm`, weight 500 | в карточках, фильтрах, mobile-nav |
| `md` (default) | `2.75rem` (44px) | `var(--space-lg)` (24px) | `--text-base`, weight 500 | большинство кейсов |
| `lg` | `3.5rem` (56px) | `var(--space-xl)` (40px) | `--text-lg`, weight 600 | hero CTA, finale-section |

**Important:** `sm` это **44px touch-target минимум**, `block-size: 2rem` достигается за счёт `padding-block` в shadow-area (через `min-height: 44px` на кнопке). На desktop без touch-нужды можно меньше.

### Геометрия

```scss
.button {
  // Capsule всегда (iOS-style)
  border-radius: var(--radius-capsule);   // 999px

  // Spring tap-feedback
  @include mx.tap-scale;

  // Default transition
  transition:
    background var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out);

  // Focus-ring
  &:focus-visible {
    outline: 2px solid var(--color-ring);
    outline-offset: 2px;
  }

  // Disabled
  &:disabled,
  &[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}
```

### Состояния (для каждого variant)

| State | primary | accent | ghost |
|---|---|---|---|
| rest | bg-primary | bg-accent | hairline border |
| hover (desktop) | `--color-primary-hover` | `--color-accent-hover` | bg `color-mix(--color-foreground 5%, transparent)` |
| active (tap) | `scale(0.97)` + saturate(0.95) | same | same |
| focus | + ring | + ring | + ring |
| loading | spinner внутри, текст hidden | same | same |
| disabled | 50% opacity | same | same |

### С иконкой

```tsx
<Button variant="accent" size="lg" icon={<Anchor />} iconPosition="leading">
  Забронировать
</Button>
```

- Icon size = font-size компонента (16px / 20px / 24px)
- Gap между icon и label = `var(--space-sm)` (8px)
- `iconPosition`: `leading` (default) | `trailing` | `only` (icon-only — обязательно `aria-label`)

### Icon-only button → круглая

`variant + iconPosition="only"`:
- block-size = inline-size (квадрат) для размера `sm/md/lg`
- `border-radius: 50%`
- Используется для: close на sheet/modal, theme toggle, share

## Card

### Базовый Card

```scss
.card {
  background: var(--color-surface);
  border: var(--border-hairline);
  border-radius: var(--radius-2xl);   // 24px
  padding: var(--space-lg);            // 24px
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration-base) var(--ease-spring);

  // Interactive card (если кликабельная вся целиком)
  &.interactive {
    cursor: pointer;
    @include mx.tap-scale;

    @include mx.respond-to('lg') {
      &:hover {
        box-shadow: var(--shadow-md);
      }
    }
  }
}
```

### Yacht card (специализация)

```
┌─────────────────────────────────┐
│                                 │
│   [фото 16:9 — кликабельное     │  ← border-radius верх 24, низ 0
│    с 4 thumbnails внизу]        │     первое фото = aspect-ratio 16/9
│                                 │
├─────────────────────────────────┤
│  Яхта EVA          [● свободна] │  ← H3, имя яхты в <Accent weight={500}>
│  Парусная · 6 чел · 8м          │  ← --text-sm, muted, Manrope
│                                 │
│  150 BYN/час                    │  ← --text-2xl, weight 700, .tabular, Manrope
│                                 │
│  [Подробнее]    [Забронировать] │  ← ghost + accent, размер md
└─────────────────────────────────┘
```

**Имя яхты — единственное место accent-шрифта в карточке.** Всё остальное Manrope.

**CSS-структура:**
```scss
.yachtCard {
  @extend .card;
  padding: 0;                    // override — фото full-bleed
  overflow: clip;                // обрезает фото по border-radius

  &__media { /* aspect-ratio: 16/9 */ }
  &__body  { padding: var(--space-lg); }
  &__head  { display: flex; justify-content: space-between; align-items: start; }
  &__price { @include mx.tabular-nums; }
  &__cta   { display: flex; gap: var(--space-sm); margin-block-start: var(--space-md); }
}
```

### Service card

Аналогично Yacht card, но без price-блока и с **сценарным фото** вместо яхты.

### Testimonial card

```
┌─────────────────────────────────┐
│ ┌───┐ Анна К.       ★★★★★       │  ← avatar 40px, name medium 500
│ │ A │ 15 марта 2026             │     date small muted
│ └───┘                           │
│                                 │
│ « Отметили день рождения на     │  ← кавычки в <Accent italic={false}>
│   ALFA, всё было супер... »     │     текст внутри — Manrope --text-base
│                                 │
│ ┌─────────┐ ┌─────────┐         │  ← теги — capsule pills, --text-xs
│ │ Д.Р.    │ │ ALFA    │         │     bg surface-alt, weight 600, Manrope
│ └─────────┘ └─────────┘         │
│                                 │
│ Источник: [Instagram ↗]         │  ← --text-xs, link
└─────────────────────────────────┘
```

**Lora-применение:** только французские кавычки `« »` (через `<Accent italic={false}>`). Сам текст отзыва — Manrope.

## Input / Textarea

### Геометрия

```scss
.input {
  inline-size: 100%;
  min-block-size: 2.75rem;        // 44px touch-target
  padding-block: var(--space-sm);
  padding-inline: var(--space-md);

  background: var(--color-surface);
  color: var(--color-foreground);
  border: var(--border-hairline);
  border-radius: var(--radius-lg);   // 12px (НЕ capsule — input должен «вмещать» текст)

  font-size: max(1rem, 1em);          // ≥16px анти-zoom iOS
  font-family: inherit;
  font-feature-settings: var(--font-feature-default);

  transition:
    border-color var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out);

  &::placeholder {
    color: var(--color-foreground-subtle);
  }

  &:hover:not(:focus) {
    border-color: var(--color-foreground-muted);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-primary) 20%, transparent);
  }

  &[aria-invalid="true"] {
    border-color: var(--color-error);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-error) 15%, transparent);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--color-surface-alt);
  }
}

.textarea {
  @extend .input;
  min-block-size: 6rem;
  padding-block: var(--space-md);
  resize: vertical;
}
```

### С label + helper/error

```
[Label]                          ← --text-sm, weight 600, --space-xs ниже
[──── input ──── ]
[Helper text / Error]            ← --text-xs, mt --space-xs
                                    helper: muted, error: --color-error
```

Реализация: `<Field label="..." helper="..." error="..."><Input /></Field>` обёртка-компонент в `src/shared/ui/field/`.

## Badge / Tag / Pill

```scss
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding-block: 0.125rem;          // 2px
  padding-inline: var(--space-sm);  // 8px
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: var(--tracking-wide);
  border-radius: var(--radius-capsule);
  white-space: nowrap;
}

// Варианты
.badge--default  { background: var(--color-surface-alt);  color: var(--color-foreground); }
.badge--primary  { background: var(--color-primary-soft); color: var(--color-primary); }
.badge--accent   { background: var(--color-accent-soft);  color: var(--color-accent); }
.badge--success  { background: color-mix(in oklch, var(--primitive-color-success) 15%, transparent);
                   color: var(--primitive-color-success); }
.badge--warning  { background: color-mix(in oklch, var(--primitive-color-warning) 20%, transparent);
                   color: var(--primitive-color-warning); }
```

### С dot (live-индикатор)

```tsx
<Badge variant="success" dot pulse>Свободна</Badge>
```

— добавляется `<span class="badge__dot">` (6×6px circle, currentColor) с `@keyframes pulse` (opacity 0.4 ↔ 1, 1.5s ease-in-out infinite).

## Heading / Text / Accent

Реализация — три компонента, оборачивают семантический tag и применяют токены.

```tsx
<Heading level={1} size="hero">
  Яхты, на которых <Accent>возвращаются</Accent>
</Heading>

<Heading level={2}>Подзаголовок</Heading>     // дефолтный size = level

<Text size="lg" weight="medium" color="muted">Lead</Text>
<Text size="xs" weight="bold" tracking="caps" color="primary">EYEBROW</Text>

// Accent — только для декоративных слов, см. ADR-008 §«Lora — правила»
<Accent>EVA</Accent>                          // italic 400 default
<Accent weight={500}>ALFA</Accent>            // italic 500 для названий яхт
<Accent italic={false}>« текст отзыва »</Accent>  // upright Lora для кавычек
```

### Heading prop API

```ts
type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6
  size?: 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'  // default = match level
  align?: 'left' | 'center' | 'right'                       // default left
  balance?: boolean                                          // text-wrap: balance, default true для H1-H2
}
```

`balance` нужен для **избегания вдов в заголовках** — `text-wrap: balance` (Chromium 114+, Safari 17.4+).

### Text prop API

```ts
type TextProps = {
  as?: 'p' | 'span' | 'div'                                  // default 'p'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'                  // default 'base'
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold'  // default 'regular'
  color?: 'foreground' | 'muted' | 'subtle' | 'primary' | 'accent' | 'error' | 'inverse'
  tracking?: 'tight' | 'normal' | 'wide' | 'caps'
  leading?: 'tight' | 'snug' | 'base' | 'normal' | 'relaxed'
  align?: 'left' | 'center' | 'right'
  truncate?: boolean | number                                // true = 1 line, число = N lines (line-clamp)
  tabular?: boolean                                          // активирует tnum+lnum для цен
}
```

## Accordion (FAQ)

На Radix Accordion как primitive, кастомизируется через CSS.

```
┌─────────────────────────────────────┐
│ Вопрос про детей на яхте?       [▼] │  ← --text-lg, weight 600
├─────────────────────────────────────┤
│ Ответ — детям до 6 лет бесплатно... │  ← --text-base, leading-relaxed
└─────────────────────────────────────┘
```

**Стили:**
- Каждый item: `border-bottom: var(--border-hairline)`, padding-block `var(--space-md)`
- Trigger: full-width button, justify-content space-between, иконка chevron rotate 180° на open
- Анимация: `@keyframes` для `data-state="open"` через Radix custom-property `--radix-accordion-content-height`
- Открытый item не имеет background — отделение через hairline + chevron-state

## Spinner / Skeleton

### Spinner

```scss
.spinner {
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border: 2px solid color-mix(in oklch, currentColor 20%, transparent);
  border-block-start-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin { to { transform: rotate(360deg); } }
}
```

Используется **только** внутри Button loading-state и в `gallery` lightbox при загрузке. **Везде остально — Skeleton**.

### Skeleton

```scss
.skeleton {
  background: var(--color-surface-alt);
  border-radius: var(--radius-md);
  animation: pulse 1400ms ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50%      { opacity: 1; }
  }
}
```

Варианты: `<Skeleton.Text lines={3} />`, `<Skeleton.Card />`, `<Skeleton.Avatar />`, `<Skeleton.Image aspect="16/9" />`.

## Toast

На `sonner` или собственный (решение откладываем — `sonner` лёгкий, ~3kb, можно взять).

Позиция: `bottom-center` на mobile (выше bottom-nav), `top-right` на desktop.

Стили: `@include mx.material('thick')` + `var(--shadow-md)` + `var(--border-hairline)` + `var(--radius-2xl)`.

Длительность: `var(--duration-slower)` (800ms) для появления + 4s display + 200ms fade-out.

## Component checklist (для каждого нового компонента)

- [ ] Размеры/spacing — через `var(--space-*)`, **никаких хардкод-rem/px**
- [ ] Цвета — через semantic tokens (`--color-*`), не primitive
- [ ] Радиусы — `--radius-lg/2xl/3xl/capsule`
- [ ] Тени — `--shadow-sm/md/lg`
- [ ] Anim — `var(--duration-*) var(--ease-*)` сочетания из таблицы (Design System.md)
- [ ] Touch-target ≥ 44×44px на интерактивах
- [ ] Tap-scale для всего кликабельного
- [ ] Focus-ring видим и контрастен (`--color-ring`)
- [ ] `prefers-reduced-motion` уважается
- [ ] Проверен в **light + dark** (обязательно!)
- [ ] Проверен на 360px viewport
- [ ] A11y: правильные роли, `aria-*`, клавиатурная навигация
- [ ] Анти-zoom iOS: `font-size: max(1rem, 1em)` на input/textarea/select

## Связанные

- [[Design System]] — токены
- [[Hero & Section Rhythm]] — паттерны секций (использует эти атомы)
- [[UX-паттерны]] — конкретные сценарии применения
- [[../40 - Architecture/42 - ADR/ADR-005 iOS-style Design Language]]
- [[../40 - Architecture/42 - ADR/ADR-008 Typography System — Manrope Variable]]

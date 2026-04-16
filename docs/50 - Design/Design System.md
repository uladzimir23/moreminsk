---
type: design-system
tags: [design, tokens]
updated: 2026-04-17
---

# Design System (черновик)

> Конкретные значения (бренд-палитра, шрифты) — черновые, финализируются на этапе визуала.
>
> **Архитектурно** — берём готовый паттерн из **Flex Glass Design System** (`~/Documents/flex-glass/src/shared/design-system/`, ветка `feat/design-system`). Это активно разрабатываемая SCSS-DS с cascade layers, primitive→semantic→component токенами, fluid clamp(), container queries, color-mix() для state-вариантов, @property для анимации тем, Safari/iOS hardening и stylelint-enforced rules. Долгосрочно она будет извлечена в пакет `@flex-glass/design-system`.

## Что переиспользуем из Flex Glass DS

**Архитектуру (копируем целиком):**
1. **Cascade layers** — `@layer reset, tokens, base, primitives, components, utilities, overrides;` декларация в `tokens/_tokens.scss`
2. **Иерархию токенов** — primitive (`--primitive-color-blue-500`) → semantic (`--color-primary`) → component (`--btn-radius`)
3. **Fluid clamp()** для `--space-*` и `--text-4xl`..`--text-7xl` (плавные между 320–1280px viewport — mobile-up без breakpoint-ов)
4. **Logical properties** (`padding-inline`, `margin-block`, `inline-size`) — RTL/i18n-ready (актуально, у нас ru/en MVP)
5. **`color-mix(in oklch)` для state-вариантов** (active/disabled/subtle автовыводятся из base)
6. **`@property`** для анимируемых CSS-переменных
7. **Container queries** как default; media queries — только для root-level
8. **`:where()` для base-стилей** (specificity 0)
9. **`content-visibility: auto`** для длинных секций
10. **Safari/iOS hardening** — `color-scheme`, `100dvh` fallback, `font-size: max(1rem, 1em)` на инпутах, safe-area-insets миксины
11. **Stylelint конфиг** — `max-nesting-depth: 2`, `selector-max-specificity: 0,3,0`, no `!important`, no `px` (кроме разрешённого списка), layers-order

**Миксины (копируем как есть):**
- `respond-to($breakpoint)`, `respond-below($breakpoint)`
- `container-query($breakpoint, $name?)`, `container-root($name?, $type?)`
- `render-optimized($height)`, `contain-paint`, `gpu-promote`, `isolate`
- `reduced-motion`, `high-contrast`, `forced-colors`
- `dark-mode`, `safe-area-padding($axis?)`
- `viewport-fit`, `isolate-scroll`, `smooth-scroll`

**Базовые стили (копируем):** `_reset.scss`, `_typography.scss`, `_layout.scss` — внутри `@layer base`.

**Что переопределяем** (moreminsk-специфика):
- Бренд-палитра (морская: глубокий синий, песочный, закатный коралл — а не голубой/фиолетовый Flex Glass)
- Шрифты (Unbounded/Manrope или Playfair/Inter — не Manrope)
- Component-токены (`--card-padding`, `--btn-height-*`) — могут немного отличаться

## Способ переноса

На этапе инициализации `src/shared/design-system/` (имя папки как в flex-glass):
1. Скопировать структуру `tokens/`, `mixins/`, `base/` из flex-glass (текущая ветка `feat/design-system`)
2. Заменить значения `--color-*`, `--gradient-*`, `--font-*` на нашу палитру (см. ниже «Палитра»)
3. Сохранить ссылку на исходный коммит flex-glass в комментарии header'а `_tokens.scss` — для синка, когда они выпустят пакет
4. Папки `design-system/components/` и `design-system/primitives/` оставляем **пустыми** (зарезервированы под прямой импорт из flex-glass пакета `@flex-glass/design-system`, когда он будет извлечён). Не дублируем — наши собственные компоненты идут в `src/shared/ui/` (Button/Input/Modal/Accordion/Container/Section/Heading/JsonLd) и используют DS-токены оттуда.

## iOS-style надбавка (наши токены поверх flex-glass DS)

> Принято решение (ADR-005): общий визуальный язык — **iOS 17–18** (Liquid Glass / capsule / hairline / spring). Поверх flex-glass токенов добавляем следующие специфичные для iOS-стиля:

### Materials (frosted glass)

```scss
// добавляются в :root
--material-thin-bg:       rgba(255, 255, 255, 0.55);
--material-regular-bg:    rgba(255, 255, 255, 0.72);
--material-thick-bg:      rgba(255, 255, 255, 0.92);
--material-blur-thin:     blur(20px) saturate(180%);
--material-blur-regular:  blur(24px) saturate(180%);
--material-blur-thick:    blur(40px) saturate(180%);
```

В `.dark` — переопределяем на `rgba(20, 25, 41, 0.6/0.75/0.92)`.

Миксин `@mixin material($level: 'regular')` в `mixins/_materials.scss`:
```scss
@mixin material($level: 'regular') {
  background: var(--material-#{$level}-bg);
  backdrop-filter: var(--material-blur-#{$level});
  -webkit-backdrop-filter: var(--material-blur-#{$level});
}
```

### Capsule radius
```scss
--radius-capsule: 999px;   // полная капсула (кнопки, бейджи, теги)
```

### Hairline border
```scss
--color-border-hairline: color-mix(in oklch, var(--color-foreground) 8%, transparent);
--border-hairline:       1px solid var(--color-border-hairline);
```

### iOS-style shadows (multi-layer soft)
Перезаписываем стандартные:
```scss
--shadow-sm:           0 1px 0 rgba(0,0,0,0.04),
                       0 1px 2px rgba(0,0,0,0.04);

--shadow-md:           0 1px 0 rgba(0,0,0,0.04),
                       0 8px 24px rgba(0,0,0,0.08),
                       0 0 1px rgba(0,0,0,0.06);

--shadow-lg:           0 2px 0 rgba(0,0,0,0.04),
                       0 16px 48px rgba(0,0,0,0.12),
                       0 0 1px rgba(0,0,0,0.08);

--shadow-sheet:        0 -8px 32px rgba(0,0,0,0.12),
                       0 -1px 0 rgba(0,0,0,0.06);
```

### Component tokens (специфичные)
```scss
--appbar-height:       3.5rem;     // 56px
--bottomnav-height:    3.5rem;     // 56px
--sheet-radius:        var(--radius-3xl);   // 32px только сверху
--sheet-handle-w:      2.5rem;     // 40px
--sheet-handle-h:      0.25rem;    // 4px
```

### Tap-feedback
В `_animations.scss`:
```scss
@mixin tap-scale {
  transition: transform 150ms var(--ease-spring);
  &:active { transform: scale(0.97); }
  @include reduced-motion { &:active { transform: none; } }
}
```

### Шрифты — SF Pro stack
```scss
--font-display: -apple-system, 'SF Pro Display', 'Inter Display', system-ui, sans-serif;
--font-body:    -apple-system, 'SF Pro Text', Inter, system-ui, sans-serif;
```

`-apple-system` подхватит SF Pro нативно на iOS/macOS. На Android/Windows — fallback на Inter (загружаем через `next/font`).

### Tabular numerals для цен
```scss
.price { font-feature-settings: "tnum" on; }
```

## Философия (наша, поверх архитектуры)

## Философия

- **Минимализм + крупные фото.** Контент — это яхта, вода, люди. UI не должен отвлекать.
- **Читаемость > украшательство.** Типографика берёт большую роль.
- **Mobile-first.** Все токены масштабируются от mobile вверх.
- **Морская палитра с тёплыми акцентами** — не стереотипный «бирюзовый».

## Палитра (черновая)

```scss
// tokens/_colors.scss

// Нейтральные (серый с тёплым подтоном)
$color-bg:            #FAF7F2;   // песочный свет
$color-surface:       #FFFFFF;   // карточки
$color-surface-alt:   #F1ECE3;   // секции-разделители
$color-border:        #E4DFD5;
$color-text:          #1B2230;   // глубокий ночной
$color-text-muted:    #5C6270;
$color-text-inverse:  #FFFFFF;

// Бренд (морской глубокий + закатный)
$color-primary:       #1E3A5F;   // глубокий синий
$color-primary-dark:  #12253F;
$color-primary-soft:  #E6EDF5;

// Акцент (закат / тёплая медь)
$color-accent:        #E2956A;   // закатная медь
$color-accent-dark:   #C47A51;

// Сервисные
$color-success:       #4A7C59;
$color-warning:       #D4A84B;
$color-error:         #B24C4C;
```

## Типографика

**Основной шрифт:** одна из пар — финальный выбор с дизайнером.
- Вариант А: **Unbounded** (H1-H3) + **Manrope** (body) — современный контраст
- Вариант Б: **Playfair Display** (H1-H3) + **Inter** (body) — классический морской

```scss
// tokens/_typography.scss
$font-display: 'Unbounded', 'Playfair Display', serif;
$font-body:    'Manrope', 'Inter', sans-serif;

$fs-h1: clamp(2rem, 5vw, 3.5rem);       // 32–56px
$fs-h2: clamp(1.5rem, 4vw, 2.5rem);     // 24–40px
$fs-h3: clamp(1.25rem, 3vw, 1.75rem);   // 20–28px
$fs-body: 1rem;                          // 16px
$fs-small: 0.875rem;                     // 14px

$lh-tight: 1.1;
$lh-normal: 1.5;
$lh-relaxed: 1.7;
```

## Ритм (spacing)

Базовая единица — `0.25rem` (4px). 8-point grid.

```scss
$spacing-xs:  0.25rem;   // 4px
$spacing-sm:  0.5rem;    // 8px
$spacing-md:  1rem;      // 16px
$spacing-lg:  1.5rem;    // 24px
$spacing-xl:  2.5rem;    // 40px
$spacing-2xl: 4rem;      // 64px
$spacing-3xl: 6rem;      // 96px
$spacing-4xl: 8rem;      // 128px
```

## Брейкпоинты

```scss
$bp-sm:  480px;   // small phones
$bp-md:  768px;   // tablets
$bp-lg:  1024px;  // laptops
$bp-xl:  1280px;  // desktops
$bp-2xl: 1536px;  // big screens
```

Миксины:

```scss
@mixin mobile { @media (max-width: #{$bp-md - 1px}) { @content; } }
@mixin tablet-up { @media (min-width: #{$bp-md}) { @content; } }
@mixin desktop-up { @media (min-width: #{$bp-lg}) { @content; } }
```

## Радиусы и тени

```scss
$radius-sm: 0.25rem;
$radius-md: 0.75rem;
$radius-lg: 1.5rem;
$radius-full: 9999px;

$shadow-sm: 0 1px 2px rgba(27, 34, 48, 0.05);
$shadow-md: 0 4px 12px rgba(27, 34, 48, 0.08);
$shadow-lg: 0 12px 32px rgba(27, 34, 48, 0.12);
```

## Атомарные компоненты (`shared/ui`)

- `Button` — primary / secondary / ghost / outline; размеры sm/md/lg
- `Input` / `Textarea` — с label и error
- `Select` (кастомный на Radix Select)
- `Checkbox` / `Radio` (на Radix)
- `Accordion` (на Radix) — для FAQ
- `Dialog` (на Radix) — для модалок
- `Tooltip` (на Radix)
- `Toast` (на sonner или кастомный)
- `Tabs` (на Radix)
- `Badge` — цена, скидка, статус
- `Avatar` — для отзывов
- `Spinner` / `Skeleton`
- `Container` — max-width wrapper
- `Section` — вертикальный spacing
- `Heading` — H1/H2/H3 с пропсом `level`

## Паттерны-виджеты (`widgets/`)

См. [[../40 - Architecture/Architecture Overview#Модули-виджеты]].

## Иконки

Lucide React. Размеры: 16 / 20 / 24 / 32px. Заполнять `currentColor`, не фиксированный цвет.

## Анимации

- Hover: 150ms ease
- Enter/Leave: 300ms ease-out
- Framer Motion — **только** для Hero (parallax сдержанный), галереи (lightbox), аккордеона (если стандартного Radix мало). Остальное — CSS transitions.
- `prefers-reduced-motion` — уважаем, отключаем анимации.

## Dark mode

- MVP: только light mode.
- Post-MVP: через CSS custom properties с `[data-theme="dark"]`.

## Доступность (a11y)

- Контраст текста ≥ 4.5:1 (AA)
- Focus-ring видимый на всех интерактивных элементах
- `alt` на каждом `<img>`
- `<button>` для кнопок, `<a>` для ссылок — не взаимозаменяемы
- Клавиатурная навигация работает везде
- ARIA — только если нативный HTML не решает

## Связанные документы
- [[UX-паттерны]]
- [[Медиа-стратегия]]
- [[../20 - Market/Позиционирование]]
- [[../40 - Architecture/42 - ADR/ADR-001 SCSS Modules вместо Tailwind]]

## Внешние референсы

- **Flex Glass DS** — `~/Documents/flex-glass/src/shared/design-system/` (ветка `feat/design-system`). Источник архитектуры. README: `~/Documents/flex-glass/src/shared/design-system/README.md`. CLAUDE.md проекта: `~/Documents/flex-glass/CLAUDE.md` (раздел «Design System» — точный список enforced-правил).
- **FlexGlass-Docs** — `~/Documents/FlexGlass-Docs/20 - Architecture/Design System — Базовые компоненты и адаптивность.md` и `23 - Components/Design Tokens & Component System — Полная спецификация.md` — обоснование решений.

---
type: design-system
tags: [design, tokens]
updated: 2026-04-16
---

# Design System (черновик)

> Конкретные значения — черновые. Финализируются на этапе UI/визуала (после утверждения стиля дизайнером).

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

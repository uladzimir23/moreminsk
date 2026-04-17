---
description: SCSS Modules — правила стилизации проекта moreminsk. Активируется при редактировании *.module.scss, добавлении новых компонентов, изменении токенов в src/shared/design-system/.
---

# Skill: SCSS Modules

> Это единственный способ стилизации в проекте. Tailwind/styled-components/emotion — запрещены (см. ADR-001).
>
> **Архитектура DS — копия паттерна Flex Glass** (`~/Documents/flex-glass/src/shared/design-system/`, ветка `feat/design-system`). См. `docs/50 - Design/Design System.md` → раздел «Что переиспользуем».

## Расположение файлов

```
src/shared/design-system/         # имя папки как в flex-glass
├── README.md
├── index.scss                    # импортируется в app/layout.tsx (одна точка входа)
├── tokens/
│   ├── _tokens.scss              # primitive + semantic + component CSS vars + cascade layers + @property + dark theme
│   ├── _variables.scss           # Sass-переменные (только $breakpoints map для миксинов)
│   └── _index.scss               # @forward
├── mixins/
│   ├── _mixins.scss              # respond-to, container-query, render-optimized, reduced-motion, dark-mode, safe-area-padding, viewport-fit, smooth-scroll, ...
│   ├── _animations.scss          # keyframes + анимационные миксины
│   └── _index.scss
├── base/                         # @layer base
│   ├── _reset.scss
│   ├── _typography.scss
│   ├── _layout.scss
│   └── _index.scss
├── primitives/                   # Box, Stack, Cluster, Grid, Center, Frame (по мере надобности)
└── components/                   # Button, Card, Input, Modal, … (свои компоненты на DS)
```

> При инициализации — копируем `tokens/_tokens.scss`, `mixins/`, `base/` из `~/Documents/flex-glass/src/shared/design-system/` целиком, переопределяем только бренд-палитру и шрифты в `:root`.

## Правила

### 1. Один компонент = один `.module.scss` рядом

```
widgets/hero/
├── Hero.tsx
├── Hero.module.scss
└── index.ts
```

### 2. Токены — CSS custom properties, миксины — `@use`

Токены — `var(--color-primary)`, не Sass-переменные. Миксины — через `@use`.

```scss
@use '@/shared/design-system/mixins' as mx;

.root {
  padding-block: var(--space-2xl);
  padding-inline: var(--space-lg);
  background: var(--color-surface);
  color: var(--color-foreground);

  @include mx.respond-to('md') {
    padding-block: var(--space-3xl);
  }

  @include mx.dark-mode {
    background: var(--color-card);
  }
}
```

### 3. Никаких hardcoded значений и `px` в primitive-значениях

```scss
// ❌ НЕТ
.button {
  padding: 12px 20px;
  color: #0A4D7A;
  border-radius: 8px;
  width: 240px;
}

// ✅ ДА
.button {
  padding-block: var(--space-sm);
  padding-inline: var(--space-lg);
  color: var(--color-primary-foreground);
  background: var(--color-primary);
  border-radius: var(--radius-lg);
  inline-size: 15rem;
}
```

> `px` разрешены только для border / outline / box-shadow / contain-intrinsic-size — как в flex-glass stylelint конфиге.

### 4. Классы — camelCase, root-класс — `root`

```tsx
import styles from './Hero.module.scss';

export function Hero() {
  return (
    <section className={styles.root}>
      <h1 className={styles.title}>...</h1>
      <button className={styles.primaryCta}>...</button>
    </section>
  );
}
```

```scss
.root { ... }
.title { ... }
.primaryCta { ... }
```

### 5. Респонсив — mobile-first + container queries по умолчанию

Для **компонентной** адаптивности — container queries:

```scss
.root {
  @include mx.container-root;          // делаем родителем для child container queries
  display: grid;
  gap: var(--space-md);
  grid-template-columns: 1fr;

  @include mx.container-query('md') {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

Media queries — только для **root-level** (font-size, print, layout shell):

```scss
.root {
  padding-block: var(--space-lg);
  @include mx.respond-to('md') { padding-block: var(--space-xl); }
}
```

Многие fluid-токены (`--space-2xl`, `--text-5xl`) уже плавно адаптируются через `clamp()` — отдельные media queries для них не нужны.

### 6. Псевдоклассы — вложены через `&`

```scss
.button {
  background: var(--color-primary);
  color: var(--color-primary-foreground);

  &:hover { background: var(--color-primary-hover); }
  &:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 2px; }
  &:disabled { opacity: var(--opacity-disabled); pointer-events: none; }

  &.isLoading { cursor: wait; }
}
```

### 7. Модификаторы через классы, не через `data-*`

```tsx
<button className={cn(styles.button, isPrimary && styles.primary)}>
```

```scss
.button { background: var(--color-secondary); }
.button.primary { background: var(--color-primary); }
```

### 8. Анимации — в том же модуле или в `_animations.scss`

Повторяющиеся — в `shared/design-system/mixins/_animations.scss`:

```scss
@mixin fade-in($duration: var(--duration-base)) {
  animation: fadeIn $duration var(--ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 9. CSS custom properties — основа всей системы

Все цвета/spacing/radius/shadow — только через `var(--token)`. Sass-переменные используем **только** для `$breakpoints` map в миксинах. Это позволяет:
- Менять тему в runtime (light/dark) без перекомпиляции
- Анимировать смену темы через зарегистрированные `@property`
- Переопределять токены в любой части дерева через override-классы (`.dark`, `.theme-marine`)

### 10. Глобальные селекторы — через `:global()`

Только если реально нужно (напр. для стилизации стороннего виджета):

```scss
.root {
  :global(.swiper-slide) {
    padding: var(--space-md);
  }
}
```

## cn() helper

`src/shared/lib/cn.ts`:

```typescript
export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

Использование:

```tsx
<div className={cn(styles.root, isActive && styles.active, className)}>
```

## Stylelint

`.stylelintrc.json` с правилами как в flex-glass:
- `max-nesting-depth: 2`
- `selector-max-specificity: 0,3,0`
- `declaration-no-important: true` — **строгий запрет**, без exceptions
- `unit-disallowed-list: [px]` с allow для border/outline/box-shadow/contain-intrinsic-size
- Layers-order check — порядок `@layer` должен совпадать с декларацией в `_tokens.scss`
- camelCase для класс-имён (CSS Modules convention)

## Что НЕ делать

- ❌ Tailwind-утилиты
- ❌ styled-components / emotion / vanilla-extract
- ❌ Глобальные классы без `:global()`
- ❌ Хардкод цветов и размеров; `px` за пределами border/outline/shadow
- ❌ `width` / `height` (использовать `inline-size` / `block-size`)
- ❌ `!important` (стайлайнт упадёт)
- ❌ Глубокая вложенность (`max-nesting-depth: 2`)
- ❌ Inline-стили `style={{ ... }}` (кроме динамических вычислений)
- ❌ shadcn/ui компоненты (они на Tailwind)
- ❌ Изобретать токен-архитектуру с нуля — взять её из flex-glass

## Связанные

- ADR-001: `docs/40 - Architecture/42 - ADR/ADR-001 SCSS Modules вместо Tailwind.md`
- Design System: `docs/50 - Design/Design System.md`
- Skill: `mobile-first` — паттерны разметки и компонентов
- Reference: `~/Documents/flex-glass/src/shared/design-system/` — источник архитектуры
- Reference: `~/Documents/flex-glass/CLAUDE.md` → раздел «Design System» — точный список stylelint правил

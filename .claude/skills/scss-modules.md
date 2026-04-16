---
description: SCSS Modules — правила стилизации проекта moreminsk. Активируется при редактировании *.module.scss, добавлении новых компонентов, изменении токенов в src/shared/styles/.
---

# Skill: SCSS Modules

> Это единственный способ стилизации в проекте. Tailwind/styled-components/emotion — запрещены (см. ADR-001).

## Расположение файлов

```
src/shared/styles/
├── tokens/
│   ├── _colors.scss        # цветовая палитра
│   ├── _typography.scss    # шрифты, размеры, line-height
│   ├── _spacing.scss       # 8-point grid
│   ├── _radius.scss        # радиусы скругления
│   ├── _shadows.scss       # тени
│   ├── _breakpoints.scss   # брейкпоинты
│   └── _index.scss         # @forward всё
├── mixins/
│   ├── _responsive.scss    # @mixin mobile / tablet-up / desktop-up
│   ├── _typography.scss    # @mixin heading / body-text
│   └── _index.scss
└── globals.scss            # reset + base (импортится в app/layout.tsx)
```

## Правила

### 1. Один компонент = один `.module.scss` рядом

```
widgets/hero/
├── Hero.tsx
├── Hero.module.scss
└── index.ts
```

### 2. Импорт токенов и миксинов — `@use`, не `@import`

```scss
@use '@/shared/styles/tokens' as t;
@use '@/shared/styles/mixins' as m;

.root {
  padding: t.$spacing-xl;
  background: t.$color-surface;

  @include m.mobile {
    padding: t.$spacing-md;
  }
}
```

### 3. Никаких hardcoded значений

```scss
// ❌ НЕТ
.button {
  padding: 12px 20px;
  color: #1E3A5F;
  border-radius: 8px;
}

// ✅ ДА
.button {
  padding: t.$spacing-sm t.$spacing-lg;
  color: t.$color-primary;
  border-radius: t.$radius-md;
}
```

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

### 5. Респонсив — mobile-first

```scss
.root {
  // mobile стили — базовые
  padding: t.$spacing-md;

  @include m.tablet-up {
    padding: t.$spacing-lg;
  }

  @include m.desktop-up {
    padding: t.$spacing-xl;
  }
}
```

### 6. Псевдоклассы — вложены через `&`

```scss
.button {
  background: t.$color-primary;

  &:hover { background: t.$color-primary-dark; }
  &:focus-visible { outline: 2px solid t.$color-accent; }
  &:disabled { opacity: 0.5; pointer-events: none; }

  &.isLoading { cursor: wait; }
}
```

### 7. Модификаторы через классы, не через `data-*`

```tsx
<button className={cn(styles.button, isPrimary && styles.primary)}>
```

```scss
.button { ... }
.button.primary { background: t.$color-primary; }
```

### 8. Анимации — в том же модуле или в `_animations.scss`

Повторяющиеся — в `shared/styles/mixins/_animations.scss`:

```scss
@mixin fade-in($duration: 300ms) {
  animation: fadeIn $duration ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 9. CSS custom properties — только для темизации

Обычные токены — sass-переменные (`t.$color-primary`). Для переключаемых тем (light/dark post-MVP) — CSS переменные в `:root` / `[data-theme="dark"]`.

### 10. Глобальные селекторы — через `:global()`

Только если реально нужно (напр. для стилизации стороннего виджета):

```scss
.root {
  :global(.swiper-slide) {
    padding: t.$spacing-md;
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

`.stylelintrc.json` с правилами для SCSS Modules (camelCase, порядок свойств, запрет `!important` без комментария).

## Что НЕ делать

- ❌ Tailwind-утилиты
- ❌ styled-components / emotion / vanilla-extract
- ❌ Глобальные классы без `:global()`
- ❌ Хардкод цветов и размеров
- ❌ Inline-стили `style={{ ... }}` (кроме динамических вычислений)
- ❌ shadcn/ui компоненты (они на Tailwind)

## Связанные

- ADR-001: `docs/40 - Architecture/42 - ADR/ADR-001 SCSS Modules вместо Tailwind.md`
- Design System: `docs/50 - Design/Design System.md`

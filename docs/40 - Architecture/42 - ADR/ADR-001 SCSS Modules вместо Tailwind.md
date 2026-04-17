---
date: 2026-04-16
status: accepted
tags: [adr, styling]
---

# ADR-001 — SCSS Modules вместо Tailwind

## Контекст

Референс-шаблон `~/Documents/clariva-spa-landing` использует Tailwind CSS v3.4. Соблазн скопировать — большой: он уже настроен, shadcn/ui завязан на Tailwind, быстрый старт.

Заказчик явного требования по стилизации не давал. Однако у Vladimir (исполнитель) существует стойкое предпочтение, подтверждённое в нескольких сессиях (память: `feedback_styling.md`): для новых проектов — **SCSS Modules**, не Tailwind.

## Решение

Используем **SCSS Modules** (`*.module.scss`) для стилизации компонентов + глобальные токены/миксины/база в `src/shared/design-system/` (имя папки — как в flex-glass DS, который мы переиспользуем как архитектуру).

Tailwind — **не используем**.

shadcn/ui — **не используем** напрямую (он завязан на Tailwind). Берём только Radix UI (headless-примитивы без стилей) и стилизуем через SCSS Modules.

> **Update 2026-04-17:** архитектура DS финализирована. Смотри:
> - **ADR-006** — палитра, темы (light+dark), animation-токены
> - **ADR-008** — типографика (Manrope + Lora через `next/font/google`)
> - **scss-modules skill** (`.claude/skills/scss-modules.md`) — конкретные правила для AI-помощника
> - **Design System.md** — структура `src/shared/design-system/`, перечень переиспользуемого из flex-glass

## Последствия

### Позитивные

- Консистентность с другими проектами исполнителя.
- Отсутствие рантайм-стоимости utility-классов (все стили скомпилированы).
- Лёгкая переиспользуемость через миксины/placeholder'ы.
- Локальная область видимости классов (module.scss) предотвращает конфликты.
- Легко выносить в дизайн-систему — токены SCSS → CSS custom properties.
- Дизайнеры-верстальщики ближе к SCSS, чем к Tailwind-классам.

### Негативные

- Нельзя скопипастить компоненты из shadcn — придётся переписывать стили.
- Больше кода (vs utility-first подхода).
- Нет авто-purge неиспользуемых стилей (но с Modules это и не нужно — модули подключаются только импортом).
- Возможны дубликаты стилей в компонентах (митигируется миксинами).

### Нейтральные

- Нужен стилелинт с правилами для SCSS.
- Темизация — через CSS custom properties в `:root` + `[data-theme="dark"]`.

## Альтернативы (отвергнутые)

1. **Tailwind CSS v3/v4** — быстрее стартует, но противоречит установке исполнителя.
2. **styled-components / emotion** — рантайм-стоимость, хуже для SEO/SSR.
3. **CSS Modules (чистый CSS)** — нет переменных/миксинов, хуже DX.
4. **Vanilla Extract / Panda CSS** — современно, но ещё нишево и зависит от плагинов сборки.

## Реализация

- `package.json`: `sass` в `devDependencies`
- `next.config.ts`: Next.js нативно поддерживает `.module.scss` — дополнительной настройки не нужно
- `src/shared/design-system/` — структура копируется из `~/Documents/flex-glass/src/shared/design-system/`:
  - `tokens/_tokens.scss` — primitive + semantic + component CSS custom properties; cascade layers; `@property` для анимируемых; dark theme overrides
  - `tokens/_variables.scss` — Sass-переменные (только `$breakpoints` map для миксинов)
  - `mixins/_mixins.scss` — `respond-to`, `container-query`, `dark-mode`, `safe-area-padding`, `reduced-motion`...
  - `mixins/_materials.scss` — frosted glass mixin (ADR-005)
  - `mixins/_animations.scss` — `tap-scale`, `fade-in` миксины + keyframes
  - `base/` — `_reset.scss`, `_typography.scss`, `_layout.scss` (внутри `@layer base`)
  - `index.scss` — точка входа, импортится в `app/[locale]/layout.tsx`
- Цвета/spacing/radius/shadow — **только через `var(--token)`**, никаких Sass-переменных вне `$breakpoints`. Это позволяет менять тему в runtime без перекомпиляции.
- Компонент:

  ```tsx
  // src/widgets/hero/Hero.tsx
  import styles from './Hero.module.scss';
  export function Hero() { return <section className={styles.root}>...</section>; }
  ```

  ```scss
  // src/widgets/hero/Hero.module.scss
  @use '@/shared/design-system/mixins' as mx;

  .root {
    padding-block: var(--space-xl);
    padding-inline: var(--space-lg);
    background: var(--color-surface);
    color: var(--color-foreground);

    @include mx.respond-to('md') {
      padding-block: var(--space-2xl);
    }

    @include mx.dark-mode {
      background: var(--color-card);
    }
  }
  ```

## Связанные заметки
- Memory: `feedback_styling.md`
- [[../Architecture Overview]]
- [[../../50 - Design/Design System]]
- [[ADR-006 Color Palette + Theme System + Animation Tokens]]
- [[ADR-008 Typography System — Manrope Variable]]
- Skill: `.claude/skills/scss-modules.md`
- Reference: `~/Documents/flex-glass/src/shared/design-system/` — источник архитектуры

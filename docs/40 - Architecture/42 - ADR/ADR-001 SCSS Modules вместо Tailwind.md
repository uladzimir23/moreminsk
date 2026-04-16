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

Используем **SCSS Modules** (`*.module.scss`) для стилизации компонентов + глобальные токены/миксины в `src/shared/styles/`.

Tailwind — **не используем**.

shadcn/ui — **не используем** напрямую (он завязан на Tailwind). Берём только Radix UI (headless-примитивы без стилей) и стилизуем через SCSS Modules.

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
- `src/shared/styles/tokens/` — `_colors.scss`, `_typography.scss`, `_spacing.scss`, `_breakpoints.scss`, `_index.scss` (@forward)
- `src/shared/styles/mixins/` — `_responsive.scss`, `_typography.scss`
- `src/shared/styles/globals.scss` — reset + base + импорт токенов
- Компонент:

  ```tsx
  // src/widgets/hero/Hero.tsx
  import styles from './Hero.module.scss';
  export function Hero() { return <section className={styles.root}>...</section>; }
  ```

  ```scss
  // src/widgets/hero/Hero.module.scss
  @use '@/shared/styles/tokens' as t;
  @use '@/shared/styles/mixins' as m;

  .root {
    padding: t.$spacing-xl;
    background: t.$color-surface;
    @include m.mobile { padding: t.$spacing-md; }
  }
  ```

## Связанные заметки
- Memory: `feedback_styling.md`
- [[../Architecture Overview]]
- [[../../50 - Design/Design System]]

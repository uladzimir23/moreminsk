---
description: iOS-style визуальный язык — Liquid Glass, capsule, hairline, multi-layer shadows, spring-easing. Активируется при создании компонентов в src/shared/ui/, виджетов, sheets, кнопок, карточек, форм, всего что имеет визуальное представление.
---

# Skill: iOS-style Design Language

> Решено в ADR-005: общий стиль UI — iOS 17–18 (Liquid Glass / capsule / hairline / spring).

## Жёсткие правила

### 1. Buttons → capsule
```scss
.button {
  border-radius: var(--radius-capsule);   // 999px
  padding-block: var(--space-sm);
  padding-inline: var(--space-lg);
  font-weight: 600;
  @include mx.tap-scale;
}
```

### 2. Cards → 24px radius, hairline + soft shadow
```scss
.card {
  border-radius: var(--radius-2xl);       // 24px
  border: var(--border-hairline);
  background: var(--color-card);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration-base) var(--ease-spring);
  &:hover { box-shadow: var(--shadow-md); }
}
```

### 3. Sheets → bottom sheet с drag-handle
```scss
.sheet {
  border-radius: var(--sheet-radius) var(--sheet-radius) 0 0;
  @include mx.material('regular');
  box-shadow: var(--shadow-sheet);
  padding-block-end: env(safe-area-inset-bottom);
}
.handle {
  inline-size: var(--sheet-handle-w);
  block-size: var(--sheet-handle-h);
  background: var(--color-foreground-subtle);
  border-radius: var(--radius-capsule);
  margin-inline: auto;
  margin-block-start: var(--space-sm);
}
```

### 4. Appbar / Bottom-nav → frosted glass
```scss
.appbar {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  block-size: var(--appbar-height);
  z-index: var(--primitive-z-sticky);
  &.scrolled {
    @include mx.material('thin');
    border-block-end: var(--border-hairline);
  }
}

.bottomNav {
  position: fixed;
  inset-block-end: 0;
  inset-inline: 0;
  z-index: var(--primitive-z-sticky);
  @include mx.material('regular');
  border-block-start: var(--border-hairline);
  padding-block-end: env(safe-area-inset-bottom);
  display: none;
  @include mx.respond-below('lg') { display: flex; }
}
```

### 5. Modals → backdrop с blur
```scss
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: var(--primitive-z-overlay);
}
```

### 6. Inputs → 12px radius, без heavy borders
```scss
.input {
  border-radius: var(--radius-lg);        // 12px
  border: var(--border-hairline);
  padding-block: var(--space-sm);
  padding-inline: var(--space-md);
  block-size: var(--input-height-md);
  &:focus-visible {
    outline: 2px solid var(--color-ring);
    outline-offset: 2px;
    border-color: transparent;
  }
}
```

### 7. Tap-scale на всех интерактивах
Любая кнопка/ссылка/кликабельная карточка — `@include mx.tap-scale;`. Скейл `0.97`, easing `spring`, 150ms.

### 8. Spring easing — единый
- `--ease-spring: cubic-bezier(0.22, 1, 0.36, 1)` — для всех state-переходов
- `--ease-out` — для одиночных fade-in
- Никаких `linear`, никаких `ease-in-out` для UI (только для loading-pulse)

### 9. Tabular nums на ценах
```scss
.price {
  font-feature-settings: "tnum" on, "lnum" on;
  font-variant-numeric: tabular-nums lining-nums;
}
```

### 10. Photography → full-bleed + 32px radius
```scss
.heroImage {
  inline-size: 100%;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-3xl);       // 32px
  object-fit: cover;
  @include mx.respond-to('lg') {
    aspect-ratio: 16 / 9;
  }
}
```

## Inset grouped lists (FAQ, прайс, контакты)

```scss
.list {
  border-radius: var(--radius-2xl);
  border: var(--border-hairline);
  background: var(--color-card);
  overflow: clip;
}
.row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  min-block-size: 3rem;
  &:not(:last-child) {
    border-block-end: var(--border-hairline);
  }
}
```

## Микроанимации

| Жест | Эффект | Длительность |
|---|---|---|
| Tap (кнопка/карточка) | `scale(0.97)` + spring | 150ms |
| Hover (desktop only) | `box-shadow` rest → md | 250ms spring |
| Sheet open | `translateY(100%) → 0` + backdrop fade-in | 350ms spring |
| Sheet close | reverse | 250ms spring |
| Modal fade | `opacity 0 → 1` | 200ms ease-out |
| Page transition (mobile) | fade 200ms | — |
| Skeleton pulse | `opacity 0.6 → 1` infinite | 1400ms ease-in-out |

`prefers-reduced-motion: reduce` — все scale/translate заменяются на opacity-only, длительности → 0.

## Что НЕ делать

- ❌ `border-radius: 4px` или менее на кнопках/карточках (плоский Bootstrap-вид)
- ❌ Тяжёлые drop-shadow (`0 25px 50px rgba(0,0,0,0.5)`) — это Material/Web-1.0
- ❌ Толстые 2-3px бордеры
- ❌ `linear-gradient` фоны на больших площадях (бэкграунд секций — solid или material)
- ❌ Спиннеры везде где есть skeleton
- ❌ `ease-in-out` для UI-переходов (используй spring)
- ❌ Backdrop-filter без fallback solid-цвета (на старом Android не работает)
- ❌ Карусели с пагинацией-точками внизу — снап-скролл лучше

## Чек-лист компонента

- [ ] Все радиусы из токенов (`--radius-lg/2xl/3xl/capsule`)
- [ ] Тени из новых iOS-токенов (`--shadow-sm/md/lg/sheet`)
- [ ] Если есть фон поверх контента — `@include mx.material(...)`
- [ ] Hairline-бордеры через `var(--border-hairline)`, не `1px solid var(--color-border)`
- [ ] Tap-scale на всём интерактивном
- [ ] Цены — с `tabular-nums`
- [ ] Анимации — spring или ease-out, длительность 150–350ms
- [ ] `prefers-reduced-motion` уважается
- [ ] Safe-area-insets для нижних/верхних fixed-элементов

## Связанные

- ADR-005: `docs/40 - Architecture/42 - ADR/ADR-005 iOS-style Design Language.md`
- ADR-004: `docs/40 - Architecture/42 - ADR/ADR-004 Mobile App-style Navigation (Appbar + Bottom Nav).md`
- Design System: `docs/50 - Design/Design System.md` → раздел «iOS-style надбавка»
- Skill: `mobile-first` — паттерны breakpoints и hero-инверсии
- Skill: `scss-modules` — синтаксис, токены
- Apple HIG: https://developer.apple.com/design/human-interface-guidelines/

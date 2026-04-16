---
date: 2026-04-17
status: accepted
tags: [adr, ux, mobile, panel, sheet]
supersedes-parts-of: [ADR-004]
---

# ADR-007 — Adaptive Panel: Bottom Sheet on Mobile, Side Drawer on Desktop

## Контекст

В ADR-004 были запланированы отдельные компоненты `<OrderSheet />` и `<MoreSheet />` — оба только bottom-sheet. На desktop они не имели смысла (там есть полноценная нав в appbar), но нужен механизм показа форм бронирования и фильтров.

В sync-brand-site-v2 (`src/shared/ui/side-panel/`) реализован элегантный паттерн: **один компонент, который морфит свою геометрию по breakpoint**:
- mobile (`< 768px`) — bottom-sheet с drag-to-dismiss
- tablet+ (`≥ 768px`) — floating side-drawer справа

Это решает проблему дублирования компонентов и даёт консистентный API: одно состояние на всё приложение, любая кнопка из любого места открывает нужный режим.

## Решение

### Один компонент — `<AppPanel />`

**Файл:** `src/widgets/app-panel/AppPanel.tsx`
**Контекст:** `src/shared/lib/panel/PanelContext.tsx`
**Хук:** `src/shared/lib/panel/usePanel.ts`

### API

```ts
type PanelMode =
  | 'order'         // главный CTA «Заказать» — форма брони
  | 'fleet-filter'  // фильтры на /fleet (тип яхты, вместимость, дата)
  | 'more'          // mobile-only: вторичная нав (FAQ, Отзывы, О нас, Блог, Контакты)
  | 'gallery'       // lightbox для фото яхты с свайпом

interface PanelContextValue {
  isOpen: boolean
  mode: PanelMode | null
  payload?: unknown               // напр. { yachtId: 'eva' } для gallery
  open: (mode: PanelMode, payload?: unknown) => void
  close: () => void
}

const usePanel = (): PanelContextValue
```

### Использование

```tsx
// Любая кнопка
const { open } = usePanel()
<button onClick={() => open('order')}>Заказать</button>

// Карточка яхты
<button onClick={() => open('gallery', { yachtId: 'eva', startIndex: 0 })}>
  Посмотреть фото
</button>
```

### Геометрия — два режима по breakpoint

#### Mobile (`< md`, < 768px / 48rem)

**Bottom sheet:**
- `position: fixed; inset: auto 0 0 0;` (низ экрана, на всю ширину)
- `border-radius: var(--radius-3xl) var(--radius-3xl) 0 0` (32px только сверху)
- `max-height: 92dvh` (динамические vh — учитывают iOS toolbar)
- Drag-handle сверху (40×4px, `var(--color-foreground-subtle)`)
- Open: `transform: translateY(105%) → 0` за `var(--duration-slow) var(--ease-sheet)` (Apple's `cubic-bezier(0.32, 0.72, 0, 1)` — «весомый» feel)
- Close: тот же easing, `var(--duration-medium)`
- **Drag-to-dismiss:** touch-handlers (`touchstart/move/end`), порог 120px вертикального drag → close. На время drag — отключаем transition (`transition: none`)
- `padding-block-end: max(var(--space-lg), env(safe-area-inset-bottom))` — учитывает home bar
- **Body scroll lock** на время открытия (`document.body.style.overflow = 'hidden'`)

#### Tablet + Desktop (`≥ md`)

**Side drawer (справа):**
- `position: fixed; top: calc(var(--appbar-height) + var(--space-lg)); right: var(--space-md); bottom: var(--space-md); left: auto;`
- `inline-size: 27rem` (~430px)
- `border-radius: var(--radius-3xl)` (32px со всех сторон — floating)
- Open: `transform: translateX(100%) → 0` за `var(--duration-slow) var(--ease-sheet)`
- Drag-handle **скрыт** (`display: none`)
- Backdrop опционально приглушённее (`rgba(0,0,0,0.05)` против `0.4` mobile) — desktop оставляет видимым основной контент

#### Backdrop (общий)

```scss
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);            // mobile
  backdrop-filter: blur(8px);
  z-index: var(--z-backdrop);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-medium) var(--ease-out);

  &.visible {
    opacity: 1;
    pointer-events: auto;
  }

  @include mx.respond-to('md') {
    background: rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(3px);
  }
}
```

### Внутренняя структура

```tsx
<>
  <Backdrop visible={isOpen} onClick={close} />
  <aside
    className={clsx(s.panel, isOpen && s.open)}
    role="dialog"
    aria-modal="true"
    aria-label={ariaLabel(mode)}
    onTouchStart={...}
    onTouchMove={...}
    onTouchEnd={...}
  >
    <div className={s.dragHandle} aria-hidden />     {/* mobile only */}
    <header className={s.header}>
      <h2>{title(mode)}</h2>
      <button onClick={close} aria-label="Закрыть">
        <X size={20} />
      </button>
    </header>
    <div className={s.content}>
      {mode === 'order'        && <OrderForm />}
      {mode === 'fleet-filter' && <FleetFilter />}
      {mode === 'more'         && <MoreNav />}
      {mode === 'gallery'      && <Gallery payload={payload} />}
    </div>
  </aside>
</>
```

### Что берём из sync (буквально)

- Структура `panel + backdrop + drag-handle + header + content`
- Touch-handlers с порогом 120px и `setDragOffset` для realtime-перетаскивания
- `body.style.overflow = 'hidden'` при открытии (со cleanup в return)
- ESC → close
- `dvh` (динамические viewport units) для mobile — учитывают iOS toolbar
- Apple easing `cubic-bezier(0.32, 0.72, 0, 1)` для bottom-sheet

### Что меняем под наш стек

- **Все хардкод-значения → токены DS:** `2rem` → `var(--radius-3xl)`, `1px solid var(--border-color)` → `var(--border-hairline)`, `48dvh` → `92dvh` (sync был 92, ок)
- **Material вместо просто backdrop-filter:** `@include mx.material('regular')` вместо `backdrop-filter: blur(14px) saturate(180%)`
- **`useMediaQuery` оставляем** только для touch-handlers (нужно знать isMobile в JS). Геометрия — чистый CSS через `@include mx.respond-to('md')`
- **Контекст — внутри `app/providers/`** (рендерим `<PanelProvider>` в `app/layout.tsx`); сам компонент `<AppPanel />` рендерим один раз в `app/[locale]/layout.tsx`
- **A11y:** focus trap внутри панели (через `focus-trap-react` или нативно с `tabindex` + key handlers), возврат фокуса на trigger при закрытии

### Что отменяем из ADR-004

- ❌ Отдельный `<OrderSheet />` — заменён на `<AppPanel mode='order' />`
- ❌ Отдельный `<MoreSheet />` — заменён на `<AppPanel mode='more' />`
- ✅ Bottom-nav остаётся как в ADR-004; кнопки 3 «Заказать» и 5 «Ещё» дёргают `open('order')` / `open('more')`

## Последствия

### Позитивные
- **Один компонент вместо четырёх** (OrderSheet + MoreSheet + FleetFilter modal + Gallery lightbox) — DRY, меньше bundle, единый стиль
- **Десктопный UX лучше mobile-as-it-is:** боковой drawer не перекрывает контент полностью — пользователь видит карточку яхты слева и форму брони справа, может сравнивать
- **Глобальный API через контекст** — любая кнопка в любом месте кодовой базы открывает любой режим; не нужно пробрасывать стейт через props
- **Drag-to-dismiss на mobile** = native-feel, sync уже выверил 120px порог
- **Расширяемость:** добавить пятый режим = добавить case в switch + новый contentкомпонент. Никакой новой инфраструктуры

### Негативные
- **Один компонент = большой файл** — content-свитч раздувается. Решение: каждый mode-content в отдельной папке (`src/widgets/app-panel/contents/{order,fleet-filter,more,gallery}/`), `AppPanel.tsx` — только shell
- **A11y сложнее:** focus trap, `aria-labelledby`, key handlers — нужно покрыть тестами
- **Анимация на разных breakpoint'ах разная** (`translateY` vs `translateX`) — небольшой риск глитча на ресайзе во время открытия. Решение: при breakpoint-changeс открытым panel — instant-snap без transition
- **`useMediaQuery` SSR-проблема:** во время первого рендера `isMobile` неизвестен. Решение: touch-handlers no-op до hydration; геометрия CSS-only (всегда корректна)

### Нейтральные
- Backdrop на mobile более затемнённый (`0.4`), на desktop — еле заметный (`0.05`). Это интенсивное решение sync, его сохраняем — на mobile нужно отрезать внимание, на desktop нет
- iOS-style `dvh` (`92dvh`) — Safari ≥15.4. Fallback `92vh` для старых

## Альтернативы (отвергнутые)

1. **Отдельные компоненты `<BottomSheet />` + `<SideDrawer />`** — два набора touch-handlers, два z-index стека, два API. Дублирование без выгоды.
2. **Только bottom-sheet везде (включая desktop)** — на desktop bottom-sheet съедает половину экрана и неестественен (нет touch). Хуже UX.
3. **Только centered modal (как Radix Dialog)** — невозможен drag-to-dismiss, не «iOS-feel», не различает mobile/desktop потребности.
4. **Radix Dialog с custom-стилями под bottom-sheet** — Radix Dialog хорош для центрированных модалок, но для bottom-sheet с drag-handlers всё равно пишем custom-логику. Чистая реализация проще читается.
5. **Headless-UI библиотека `vaul`** — отличная либа для bottom-sheet, но добавляет dep + не решает desktop side-drawer. Логика sync укладывается в ~150 строк — пишем сами.

## Связанные

- [[ADR-004 Mobile App-style Navigation (Appbar + Bottom Nav)]] — bottom-nav триггерит этот panel
- [[ADR-005 iOS-style Design Language]] — материалы, тени, easings
- [[ADR-006 Color Palette + Theme System + Animation Tokens]] — `--ease-sheet`, `--duration-slow`
- [[../../50 - Design/UX-паттерны]] — паттерны использования
- Sync reference (буквальный): `~/Documents/sync-brand-site-v2/src/shared/ui/side-panel/SidePanel.tsx` + `.module.scss`, `src/shared/contexts/SidePanelContext.tsx`
- Skill: `.claude/skills/ios-style.md` (раздел Adaptive Panel)

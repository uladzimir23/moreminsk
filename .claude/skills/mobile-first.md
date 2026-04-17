---
description: Mobile-first UX/UI правила проекта. Активируется при создании компонентов, написании SCSS, layout-сетках, hero/header/sticky-CTA, медиа-квери, изображениях.
---

# Skill: Mobile-first UX/UI

> Решение заказчика: UI/UX по образцу **neuro-center** и **wedding** (`~/Documents/neuro-center`, `~/Documents/wedding/wedding-app`), строго **mobile-first**.

## 8 жёстких правил

1. **Базовые стили — для mobile.** Расширения через `@include mx.respond-to('md')` / `respond-to('lg')`. Никаких `max-width` медиа-запросов.
2. **Touch-target ≥ 44×44px** на всех кликабельных элементах (кнопки, иконки, чекбоксы, ссылки в навигации).
3. **Один колонок по умолчанию.** `grid` / `flex-row` появляется только с `md`+. На mobile всё стекается вертикально.
4. **Hero: фото сверху, текст снизу на mobile**, в desktop — текст слева, фото справа. Делаем через `order` в flex/grid.
5. **Заголовки — через семантические fluid-токены** `--text-4xl`..`--text-7xl` (они уже `clamp()`). Кастомный `clamp()` — только если стандартного не хватает.
6. **Spacing только из semantic-токенов** `--space-xs/sm/md/lg/xl/2xl/3xl/4xl/section`. Numeric-primitive (`--primitive-space-N`) — только когда нужен static rem без fluid.
7. **Изображения через `<picture>` со srcset** (mobile/tablet/desktop размеры). См. `nextjs-static-export` skill → `<Image />` компонент.
8. **Тестируем при ширине 360px** (iPhone SE / маленький Android). Если ломается — баг.

## Breakpoints (из flex-glass DS — `tokens/_variables.scss`)

| Имя | rem / px | Для чего |
|---|---|---|
| (base) | 0–479 | mobile |
| `xs` | 30rem / 480 | большой mobile |
| `sm` | 40rem / 640 | landscape mobile |
| `md` | 48rem / 768 | планшет |
| `lg` | 64rem / 1024 | desktop |
| `xl` | 80rem / 1280 | wide desktop |
| `2xl` | 96rem / 1536 | очень широкий |

> Брейкпоинты в **rem**, не px — масштабируются с user font-size (a11y). Не переопределять и не дублировать — `$breakpoints` map уже задан в `src/shared/design-system/tokens/_variables.scss`, миксин `respond-to` импортируется из `mixins/`.

Использование:

```scss
@use '@/shared/design-system/mixins' as mx;

.root {
  padding-block: var(--space-lg);
  @include mx.respond-to('md') { padding-block: var(--space-xl); }
  @include mx.respond-to('lg') { padding-block: var(--space-2xl); }
}
```

Многие fluid-токены (`--space-2xl`, `--text-5xl`) уже плавно растут — отдельные брейкпоинты для них не нужны.

## Header — паттерн (по neuro-center)

- `position: fixed; top: 0`, `z-index: 50`
- При `scroll > 20px` → добавить класс `.scrolled` с `backdrop-filter: blur(16px)` + полупрозрачный фон + нижний бордер
- На mobile: бургер 3 линии → крестик (rotate + opacity), меню разворачивается вниз
- Логотип с текстом: текст скрыт до `sm:`, виден только иконка
- Высота: `64px` mobile, `80px` `lg+`

## Hero — паттерн

```
[mobile, ширина 1 колонка]
┌─────────────────┐
│   ФОТО (4:5)    │  ← order: 1
│  + floating     │
│    карточка     │
├─────────────────┤
│  badge          │  ← order: 2
│  H1             │
│  лид            │
│  [CTA] [CTA-2]  │
│  ─── stats ───  │
└─────────────────┘

[desktop, 2 колонки]
┌──────────┬──────────┐
│  badge   │          │
│  H1      │   ФОТО   │
│  лид     │  (3:4)   │
│  [CTA]   │          │
│  stats   │          │
└──────────┴──────────┘
```

В коде: на mobile фото приходит первым по DOM, через `order` меняется на десктопе. **Не дублируем разметку**.

## Mobile bottom-навигация (вместо sticky CTA)

> Sticky CTA-bar **отменён** (ADR-004). Вместо него — `<BottomNav />` с 5 пунктами; центральный — accent CTA «Заказать», открывающий `usePanel().open('order')`.

См. `docs/50 - Design/UX-паттерны.md` → раздел «Mobile-нав: App-style» и ADR-004 / ADR-007.

## Анимации (framer-motion)

- Все hero-элементы — `fadeUp` со стаггером 0.12s между ними
- Easing: `[0.22, 1, 0.36, 1]` (smooth out-expo)
- Длительность: 0.6–0.9s
- На mobile анимации **не упрощаем** — но соблюдаем `prefers-reduced-motion`:

```typescript
const prefersReduced = useReducedMotion();
const variants = prefersReduced ? noopVariants : fadeUp;
```

## Smooth-scroll к якорям

Не через `<a href="#anchor">` (даёт jump), а через handler:

```typescript
const handleNav = (selector: string) => {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
};
```

## Чек-лист перед мерджем компонента

- [ ] Открыт DevTools, переключён на 360px ширину — всё читается, ничего не вылазит
- [ ] Все клик-таргеты ≥ 44px по диагонали
- [ ] Нет `max-width` медиа-запросов
- [ ] Шрифты не фиксированные `px` для H1/H2 — используется `clamp()` или токен
- [ ] Сетки: `grid-template-columns: 1fr` на mobile, `repeat(N, 1fr)` от `md+`
- [ ] Изображения через `<Image />` с srcset
- [ ] Если есть анимации — соблюдён `prefers-reduced-motion`

## Связанные

- UX-паттерны: `docs/50 - Design/UX-паттерны.md`
- Design System: `docs/50 - Design/Design System.md`
- Skill: `scss-modules` (для синтаксиса, токенов, миксина `respond-to`)
- Skill: `nextjs-static-export` (для `<Image />` и srcset)
- Референс: `~/Documents/neuro-center/src/widgets/`
- Референс: `~/Documents/wedding/wedding-app/src/components/`
- Референс: `~/Documents/flex-glass/src/shared/design-system/tokens/_variables.scss` — источник `$breakpoints`

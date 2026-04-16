---
description: Mobile-first UX/UI правила проекта. Активируется при создании компонентов, написании SCSS, layout-сетках, hero/header/sticky-CTA, медиа-квери, изображениях.
---

# Skill: Mobile-first UX/UI

> Решение заказчика: UI/UX по образцу **neuro-center** и **wedding** (`~/Documents/neuro-center`, `~/Documents/wedding/wedding-app`), строго **mobile-first**.

## 8 жёстких правил

1. **Базовые стили — для mobile.** Расширения через `@include media('md')` / `media('lg')`. Никаких `max-width` медиа-запросов.
2. **Touch-target ≥ 44×44px** на всех кликабельных элементах (кнопки, иконки, чекбоксы, ссылки в навигации).
3. **Один колонок по умолчанию.** `grid` / `flex-row` появляется только с `md`+. На mobile всё стекается вертикально.
4. **Hero: фото сверху, текст снизу на mobile**, в desktop — текст слева, фото справа. Делаем через `order` в flex/grid.
5. **Шрифты через `clamp()`** или responsive токены. H1 = `clamp(2rem, 5vw, 4.5rem)`, не фиксированный `64px`.
6. **Spacing только из токенов** `--space-*`. Никаких `padding: 47px`.
7. **Изображения через `<picture>` со srcset** (mobile/tablet/desktop размеры). См. `nextjs-static-export` skill → `<Image />` компонент.
8. **Тестируем при ширине 360px** (iPhone SE / маленький Android). Если ломается — баг.

## Breakpoints (договорённость)

| Имя | Px | Для чего |
|---|---|---|
| (base) | 0–639 | mobile |
| `sm` | 640+ | большой mobile |
| `md` | 768+ | планшет |
| `lg` | 1024+ | desktop |
| `xl` | 1280+ | wide desktop |

Миксин в `src/shared/styles/mixins/_media.scss`:

```scss
$breakpoints: (
  sm: 640px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
);

@mixin media($name) {
  $bp: map-get($breakpoints, $name);
  @if $bp {
    @media (min-width: $bp) { @content; }
  }
}
```

Использование:

```scss
.root {
  padding: var(--space-4);
  @include media('md') { padding: var(--space-8); }
  @include media('lg') { padding: var(--space-12); }
}
```

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

## Sticky bottom-CTA на mobile

Для страниц яхт/услуг — снизу всегда виден тонкий бар:

```
┌─────────────────────────────────┐
│ Контент страницы…              │
└─────────────────────────────────┘
┌─────────────────────────────────┐  ← position: fixed; bottom: 0
│ [💬 Telegram] [☎️ Позвонить]   │     показывается только на mobile
└─────────────────────────────────┘
```

Скрывается с `lg+` (там есть desktop-CTA в хедере).

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
- Skill: `scss-modules` (для синтаксиса и токенов)
- Skill: `nextjs-static-export` (для `<Image />` и srcset)
- Референс: `~/Documents/neuro-center/src/widgets/`
- Референс: `~/Documents/wedding/wedding-app/src/components/`

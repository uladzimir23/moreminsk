---
type: visual-patterns
tags: [design, hero, sections, layout]
updated: 2026-04-17
---

# Hero & Section Rhythm

> Визуальные паттерны первого экрана + ритма секций. Для конкретных layouts/проп — см. [[UX-паттерны]]. Здесь — **визуальный язык** (фоны, glow, дивайдеры, анимации появления).

## Hero — финальный паттерн (решено)

### Композиция: photo-first на mobile, split-screen на desktop

Решено в пользу **media-first** подачи. Причина: продаёт визуал (см. [[Медиа-стратегия]]); текстовый hero без крупного фото на яхт-сайте — провал доверия.

```
─── Mobile (< md) ──────────────────────
┌─────────────────────────────────┐
│ [Appbar 56px — over-photo]      │  ← appbar полу-прозрачный, blur при scroll
├─────────────────────────────────┤
│                                 │
│   [фото яхты, full-bleed,       │  ← aspect-ratio 4/5
│    aspect 4/5, dark scrim       │     scrim: gradient
│    снизу]                       │     transparent → rgba(14,22,32,0.8)
│                                 │
│   [floating-card поверх фото    │     внизу-слева: «3 свободные даты в июле»
│    нижний-левый угол]           │
│                                 │
├─────────────────────────────────┤
│                                 │  ← background = --color-background
│  [Eyebrow: «Минское море»]      │
│                                 │
│  H1: Яхты, на которых           │  ← --text-6xl, weight 700, tracking-tightest
│  *возвращаются*                 │     leading-tight; «возвращаются» — <Accent>
│                                 │     (Lora italic 400) — единственный accent в hero
│                                 │
│  Lead: Прозрачные цены,         │  ← --text-lg, weight 400, leading-relaxed
│  онлайн-бронирование, видео     │     color --color-foreground-muted
│  каждой яхты до брони.          │
│                                 │
│  [CTA: Свободные даты]          │  ← primary capsule, full-width на mobile
│  [CTA-2: Посмотреть флот]       │  ← ghost capsule
│                                 │
│  [3 квик-стата в строку]        │  ← число + подпись, разделитель hairline
│  4 яхты · 200+ гостей · 5 лет  │
│                                 │
└─────────────────────────────────┘

─── Desktop (≥ lg) ──────────────────────
┌──────────────────────────────────────────────────────────────────┐
│ [Appbar 80px — frosted glass over hero photo]                    │
├─────────────────────────────────┬────────────────────────────────┤
│                                 │                                │
│  [Eyebrow]                      │                                │
│                                 │                                │
│  H1: Яхты, на которых           │   [фото, aspect 4/5,           │
│  возвращаются                   │    floating-card нижний-       │
│                                 │    левый «3 свободные даты»]   │
│  Lead text                      │                                │
│                                 │                                │
│  [CTA primary] [CTA ghost]      │                                │
│                                 │                                │
│  [3 квик-стата]                 │                                │
│                                 │                                │
└─────────────────────────────────┴────────────────────────────────┘
   ↑ 50% viewport, max 36rem        ↑ 50% viewport, sticky-friendly
```

### Hero-фон

- **Базовый:** `--color-background` (warm sand на light, deep navy на dark)
- **Glow-pseudoelement** в правом верхнем углу: blurred круг радиуса 24rem, `background: var(--color-primary-soft)`, `opacity: 0.6`, `filter: blur(120px)`. Не отвлекает, добавляет атмосферу.
- **На dark theme:** glow меняется на `--color-accent-soft` (тёплый закатный отсвет на ночной воде).

### Hero — entrance animation

Через Framer Motion, **staggered fade-up**:

```ts
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }  // --ease-spring
  }
}
```

Порядок: Eyebrow → H1 → Lead → CTAs → Stats → Floating-card. Image — без анимации (LCP).

`prefers-reduced-motion` — отключаем `y`, оставляем opacity.

### Hero — floating-card

Маленькая карточка поверх фото в нижнем углу:

```
┌──────────────────────────┐
│ ● Сегодня свободно       │  ← пульсирующая зелёная точка
│   3 яхты на 14 июля      │
│   [Посмотреть →]         │
└──────────────────────────┘
```

**Стили:**
- `@include mx.material('regular')` — frosted glass
- `border-radius: var(--radius-2xl)` — 24px
- `border: var(--border-hairline)`
- `box-shadow: var(--shadow-md)`
- Padding `var(--space-md) var(--space-lg)`
- На mobile — внутри блока с фото, нижний-левый
- На desktop — over photo, нижний-левый (внутри photo-блока)
- Idle micro-animation: `translateY(-4px)` + 2.5s ease-in-out infinite (имитация покачивания)

## Ритм секций

### Вертикальный padding (block)

Стандарт через mixin `@include mx.section-rhythm`:

```scss
@mixin section-rhythm {
  padding-block: var(--section-padding-mobile);

  @include mx.respond-to('md') {
    padding-block: var(--section-padding-desktop);
  }
}

:root {
  --section-padding-mobile:  4rem;     // 64px
  --section-padding-desktop: 6rem;     // 96px

  // Большие секции (ZIP-секции, hero-blocks)
  --section-padding-large-mobile:  6rem;
  --section-padding-large-desktop: 9rem;

  // Компактные (CTA-strip, footer-prelude)
  --section-padding-tight-mobile:  2rem;
  --section-padding-tight-desktop: 3rem;
}
```

### Секции — типы фонов

Чередуем 4 типа — для зрительного ритма. Не более 2 одинаковых подряд.

| Тип | Background | Когда использовать |
|---|---|---|
| **Plain** | `--color-background` | default, hero, нейтральные секции |
| **Surface** | `--color-surface-alt` | "акцент" разделитель, отзывы, FAQ |
| **Glow** | plain + blurred glow в углу | hero, CTA-секции, finale |
| **Photo-bg** | full-bleed фото + scrim 60% | drama-секция (одна на странице max) |

### Glow-pseudoelements (рецепт)

```scss
.section--glow {
  position: relative;
  isolation: isolate;
  overflow: clip;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    inline-size: 30rem;
    block-size: 30rem;
    inset-block-start: -10rem;
    inset-inline-end: -10rem;
    background: var(--color-primary-soft);
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.5;
    pointer-events: none;
  }

  // На dark — тёплый glow вместо холодного
  @include mx.dark-mode {
    &::before {
      background: var(--color-accent-soft);
      opacity: 0.35;
    }
  }
}
```

### Section heading (стандарт)

Каждая секция начинается с одинакового блока заголовка:

```
┌────────────────────────────────┐
│ [Eyebrow] FAQ                  │  ← --text-xs, weight 600, tracking-caps,
│                                │     color --color-primary, UPPERCASE
│ Что чаще всего спрашивают      │  ← --text-3xl, weight 700, tracking-tight
│                                │
│ Если не нашёл ответа —         │  ← --text-lg, weight 400,
│ напиши в Telegram.             │     color --color-foreground-muted
│                                │
│  ────────────────────          │  ← опциональный hairline divider
│                                │
│ ... контент секции ...         │
└────────────────────────────────┘
```

Реализация через компонент `<SectionHeader eyebrow="..." title="..." subtitle="..." align="left|center" />` в `src/shared/ui/section-header/`.

### Дивайдеры между секциями

**По умолчанию — нет дивайдера**, секции отделяются `padding-block`.

**Если нужен явный разделитель** (визуальная пауза между крупными блоками):
```scss
.divider {
  block-size: 1px;
  inline-size: 100%;
  background: linear-gradient(
    to right,
    transparent,
    var(--color-border) 20%,
    var(--color-border) 80%,
    transparent
  );
}
```

### Container (max-width)

```scss
.container {
  inline-size: min(100% - 2 * var(--space-md), var(--container-max));
  margin-inline: auto;

  @include mx.respond-to('md') {
    inline-size: min(100% - 2 * var(--space-xl), var(--container-max));
  }
}

:root {
  --container-max: 75rem;   // 1200px — основной контейнер
  --container-narrow: 48rem; // 768px — для длинных текстов (FAQ, blog)
  --container-wide: 90rem;   // 1440px — для галерей и hero-фото
}
```

## Порядок секций на главной (template)

```
1. Hero                          ← plain bg, glow в углу
2. Преимущества (3-4 кита)       ← surface-alt
3. Флот (4 карточки)             ← plain
4. Услуги (популярные пакеты)    ← surface-alt
5. Как это работает (3-4 шага)   ← plain + glow
6. Отзывы (3-5 карточек)         ← surface-alt
7. FAQ (4-6 свёрнутых)           ← plain
8. CTA-finale (Свободные даты)   ← photo-bg или glow
9. Footer                        ← surface-alt (отдельный паттерн)
```

Чередование plain/surface-alt создаёт ритм без агрессивных переходов.

## Анимации появления секций (scroll-triggered)

Используем Framer Motion `useInView` с `once: true`:

```ts
const sectionVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}
```

Триггер: при пересечении `0.15` viewport. После анимации — disable (не повторяется при scroll вверх-вниз).

`prefers-reduced-motion` — все секции просто появляются opacity 1, без `y`.

## Photography integration

Все full-bleed фото:
- `aspect-ratio: 4 / 5` на mobile, `16 / 9` или `21 / 9` на desktop (через CSS `aspect-ratio` + `object-fit: cover`)
- `border-radius: var(--radius-3xl)` если в карточке/секции; `0` если full-bleed hero
- LCP-фото: `loading="eager"`, `fetchpriority="high"`
- Все остальные: `loading="lazy"`, `decoding="async"`
- Scrim сверху или снизу, если поверх — текст. Никогда — на чистом фото без текста

## Don't list

- ❌ Не делаем full-screen hero (`min-height: 100vh`) — съедает фон, мешает CTA-видимости
- ❌ Не делаем хедер с прозрачным фоном **поверх** контента после скролла — только over-hero
- ❌ Не используем больше **одного** glow-pseudoelement на секцию — каша
- ❌ Не миксуем 3+ типа фона на одной странице (plain + surface + photo-bg + glow + чтото ещё) — выбираем 2-3 максимум
- ❌ Не запускаем entrance-анимации одновременно для 6+ элементов — staggered, max 5-6 children
- ❌ Не используем parallax-эффекты на mobile (тяжело, jittery)
- ❌ Не делаем hover-эффекты на mobile (touch-устройства)
- ❌ Не центрируем длинные параграфы текста (нечитаемо) — left-align на ru/en

## Чек-лист готовности секции

- [ ] Padding-block через `--section-padding-*` или mixin
- [ ] Container с правильным max-width
- [ ] Background — один из 4 типов (plain / surface / glow / photo-bg)
- [ ] SectionHeader (eyebrow + title + subtitle) — если нужен
- [ ] Entrance-анимация на section-level, staggered children
- [ ] `prefers-reduced-motion` — отключает y-translate
- [ ] Проверено в light + dark темах
- [ ] Проверено на 360px viewport
- [ ] CTA в секции (если есть) — primary или ghost, capsule, tap-scale

## Связанные

- [[UX-паттерны]] — конкретные layout-паттерны (карточка яхты, формы, navigation)
- [[Design System]] — токены, шрифты, цвета
- [[Медиа-стратегия]] — фото/видео requirements
- [[Brand Identity]] — wordmark, tone, voice

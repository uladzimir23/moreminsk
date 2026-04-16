---
date: 2026-04-17
status: accepted
tags: [adr, design-system, theme, color, animation]
---

# ADR-006 — Color Palette + Theme System + Animation Tokens

## Контекст

Заказчик предложил взять цвета и анимации из `~/Documents/sync-brand-site-v2` («там голубой красивый»). Sync использует ярко-синий `#0C8CE9` (light) → `#56AAFE` (dark) — это узнаваемый, но **SaaS-tech blue**, ассоциируется с диджитал-агентствами, а не с премиум-яхтами.

Параллельно решаем:
- Темизация — **в MVP**, не post-MVP (раньше была отложена)
- Какую анимационную библиотеку использовать (sync = GSAP + Framer Motion + Lottie — слишком тяжело для статичного лендинга)

## Решение

### 1. Палитра — гибрид, не чистый sync

Берём **архитектуру и подход** sync (классы `.light-theme` / `.dark-theme` на `<html>`+`<body>`, токены через CSS custom properties), но **меняем ключевые значения** под морскую премиум-эстетику.

#### Primitive tokens (источник)

```scss
// tokens/_colors-primitive.scss

// Морской синий (premium navy, не SaaS-vibrant)
--primitive-color-sea-50:   #EFF5F9;
--primitive-color-sea-100:  #D6E4EF;
--primitive-color-sea-200:  #A8C4D8;
--primitive-color-sea-300:  #6EA0BE;
--primitive-color-sea-400:  #3F7DA1;
--primitive-color-sea-500:  #0A4D7A;   // ★ primary (light theme)
--primitive-color-sea-600:  #084064;
--primitive-color-sea-700:  #06324F;
--primitive-color-sea-800:  #04253B;
--primitive-color-sea-900:  #0E1620;   // surface dark theme

// Закатный коралл (warm CTA accent)
--primitive-color-sunset-50:  #FBF1EA;
--primitive-color-sunset-100: #F5DCC9;
--primitive-color-sunset-300: #ECB593;
--primitive-color-sunset-500: #E2956A;   // ★ accent / CTA
--primitive-color-sunset-600: #C47A51;
--primitive-color-sunset-700: #A26240;

// Песочные нейтральные (тёплый off-white вместо чисто-белого)
--primitive-color-sand-50:   #FAF7F2;
--primitive-color-sand-100:  #F1ECE3;
--primitive-color-sand-200:  #E4DFD5;
--primitive-color-sand-700:  #5C6270;
--primitive-color-sand-900:  #1B2230;

// Сервисные
--primitive-color-success:   #4A7C59;
--primitive-color-warning:   #D4A84B;
--primitive-color-error:     #B24C4C;
```

#### Semantic tokens — light theme (default)

```scss
:root,
.light-theme {
  color-scheme: light;

  --color-background:        var(--primitive-color-sand-50);     // #FAF7F2
  --color-surface:           #FFFFFF;
  --color-surface-alt:       var(--primitive-color-sand-100);
  --color-foreground:        var(--primitive-color-sand-900);
  --color-foreground-muted:  var(--primitive-color-sand-700);
  --color-foreground-subtle: color-mix(in oklch, var(--color-foreground) 40%, transparent);

  --color-primary:           var(--primitive-color-sea-500);     // #0A4D7A
  --color-primary-hover:     var(--primitive-color-sea-600);
  --color-primary-soft:      var(--primitive-color-sea-50);
  --color-on-primary:        #FFFFFF;

  --color-accent:            var(--primitive-color-sunset-500);  // #E2956A
  --color-accent-hover:      var(--primitive-color-sunset-600);
  --color-accent-soft:       var(--primitive-color-sunset-50);
  --color-on-accent:         #FFFFFF;

  --color-border:            var(--primitive-color-sand-200);
  --color-border-hairline:   color-mix(in oklch, var(--color-foreground) 8%, transparent);
  --color-ring:              var(--primitive-color-sea-400);

  // Materials (light)
  --material-thin-bg:    rgba(255, 255, 255, 0.55);
  --material-regular-bg: rgba(255, 255, 255, 0.72);
  --material-thick-bg:   rgba(255, 255, 255, 0.92);
}
```

#### Semantic tokens — dark theme

```scss
.dark-theme {
  color-scheme: dark;

  --color-background:        var(--primitive-color-sea-900);     // #0E1620
  --color-surface:           #16202E;                            // чуть светлее
  --color-surface-alt:       #1D2A3B;
  --color-foreground:        #E8EEF3;
  --color-foreground-muted:  #94A3B8;
  --color-foreground-subtle: color-mix(in oklch, var(--color-foreground) 35%, transparent);

  --color-primary:           #5BA8D6;     // светлее для контраста на тёмном
  --color-primary-hover:     #7DBCE0;
  --color-primary-soft:      color-mix(in oklch, var(--color-primary) 15%, transparent);
  --color-on-primary:        var(--primitive-color-sea-900);

  --color-accent:            #EBA77E;     // чуть светлее коралл
  --color-accent-hover:      #F0B89A;
  --color-accent-soft:       color-mix(in oklch, var(--color-accent) 15%, transparent);
  --color-on-accent:         var(--primitive-color-sea-900);

  --color-border:            #2A3A4F;
  --color-border-hairline:   color-mix(in oklch, var(--color-foreground) 12%, transparent);
  --color-ring:              #7DBCE0;

  // Materials (dark) — на «вечерней яхте»
  --material-thin-bg:    rgba(14, 22, 32, 0.55);
  --material-regular-bg: rgba(14, 22, 32, 0.72);
  --material-thick-bg:   rgba(14, 22, 32, 0.92);
}
```

#### Mental model палитры

| Slot | Назначение | Light | Dark |
|---|---|---|---|
| `--color-primary` | Навигация, ссылки, основные кнопки | `#0A4D7A` deep navy | `#5BA8D6` sea blue |
| `--color-accent` | **CTA «Заказать»**, badges «свободно», важные акценты | `#E2956A` sunset coral | `#EBA77E` |
| `--color-background` | Холст | `#FAF7F2` warm off-white | `#0E1620` deep navy |
| `--color-surface` | Карточки | `#FFFFFF` | `#16202E` |

**Почему именно так:**
- **Navy ≠ sync** — отстраиваемся от диджитал-агентства, ассоциация «премиум-яхта» / «глубокая вода» вместо «SaaS»
- **Coral CTA на cool-фоне** — warm-on-cool максимизирует attention к кнопке «Заказать» (конверсия)
- **Тёплые песочные нейтральные** — палитра «закат на воде», а не безжизненный серый
- **Single warm accent** — единственный тёплый цвет в палитре, поэтому глаз ловит его моментально

### 2. Theme System — архитектура

**Скопирована из sync, адаптирована под наш стек:**

- Два класса на `<html>` И `<body>`: `light-theme` / `dark-theme`
- Дублирование на `<body>` — необходимо для портал-компонентов (модалки/sheet'ы рендерятся в `body`, не наследуют от `<html>`)
- `localStorage` ключ — `moreminsk-theme` (значения `'light' | 'dark' | 'system'`)
- Default — `'system'` (читаем `prefers-color-scheme`)
- Синхронизация между вкладками через `StorageEvent`
- SSR-safe: до hydration рендерим `light` (избегаем FOUC через `<script>` в `<head>` который выставляет класс до React)

**Хук:** `useTheme()` в `src/shared/lib/theme/useTheme.ts`
**Контекст:** `ThemeProvider` в `src/app/providers/ThemeProvider.tsx`

**Anti-FOUC inline-script** в `app/layout.tsx`:
```tsx
<head>
  <script
    dangerouslySetInnerHTML={{ __html: `
      (function() {
        var stored = localStorage.getItem('moreminsk-theme');
        var theme = stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.classList.add(theme + '-theme');
        document.documentElement.style.colorScheme = theme;
      })();
    ` }}
  />
</head>
```

### 3. Animation tokens — берём structure из sync, корректируем easings

Sync использует много вариантов; мы берём только нужные и стандартизируем имена:

```scss
// tokens/_motion.scss

// Easings
--ease-linear:  linear;                                 // только для loading/skeleton pulse
--ease-out:     cubic-bezier(0.4, 0, 0.2, 1);           // одиночный fade-in, hover-shadows
--ease-spring:  cubic-bezier(0.22, 1, 0.36, 1);         // ★ default UI transitions (no overshoot)
--ease-sheet:   cubic-bezier(0.32, 0.72, 0, 1);         // ★ Apple bottom-sheet/drawer (heavy-feel)
--ease-bounce:  cubic-bezier(0.34, 1.56, 0.64, 1);      // overshoot — для attention/celebration

// Durations (ladder из sync)
--duration-instant: 50ms;     // мгновенный отклик (state-вспышка)
--duration-fast:    150ms;    // tap-scale, hover на mobile
--duration-base:    200ms;    // ★ default UI
--duration-medium:  300ms;    // page-transitions, modal fade
--duration-slow:    500ms;    // sheet open/close
--duration-slower:  800ms;    // hero parallax, орнамент-анимации
```

**Какие комбинации использовать:**

| Кейс | Duration + Easing |
|---|---|
| Tap (button/card scale 0.97) | `var(--duration-fast) var(--ease-spring)` |
| Hover (desktop) | `var(--duration-base) var(--ease-out)` |
| Sheet open (mobile bottom / desktop side) | `var(--duration-slow) var(--ease-sheet)` |
| Sheet close | `var(--duration-medium) var(--ease-sheet)` |
| Modal/backdrop fade | `var(--duration-medium) var(--ease-out)` |
| Theme switch | `var(--duration-medium) var(--ease-spring)` |
| Page transition (mobile) | `var(--duration-medium) var(--ease-out)` |
| Loading skeleton | `1400ms var(--ease-linear) infinite` |

### 4. Animation library — только Framer Motion (НЕ GSAP)

**Sync использует** GSAP + Framer Motion + Lottie — для агентского сайта с богатыми анимациями оправдано (~100kb gzip overhead).

**Для moreminsk** — статический лендинг с конверсионной задачей. Используем **только Framer Motion** (~30kb gzip) для:
- Hero (fade-up со staggered children при загрузке)
- Adaptive Panel (slide animations, см. ADR-007)
- Accordion (FAQ)
- Lightbox-галерея

**GSAP, Lottie — НЕ устанавливаем.** Если в будущем понадобится сложная scroll-анимация — пересмотрим (ADR).

**Простые анимации (hover/tap/transition)** — чистый CSS через токены `--duration-* var(--ease-*)`. Без JS.

`prefers-reduced-motion: reduce` — все `transform: scale/translate` заменяются на opacity-only, длительности → 0. Реализуется через миксин `mx.reduced-motion` (есть в flex-glass).

## Последствия

### Позитивные
- **Узнаваемость без вторичности** — палитра морская, премиум, не клон sync и не клон конкурентов (yachtminsk использует бирюзовый, arenda-yacht — голубой)
- **Сильный конверсионный CTA** — warm coral на cool-фоне = глаз ловит моментально
- **Тёмная тема в MVP** — сейчас закладываем токены, потом не переделываем dual-стек
- **Anti-FOUC решён** — пользователи с тёмной системной темой не видят вспышку белого
- **Лёгкий бандл** — Framer Motion only ≈ 30kb против ~120kb с GSAP+Lottie. Критично для static export (LCP, mobile 3G)
- **Анимации унифицированы** — таблица «Кейс → Duration+Easing» исключает разнобой между компонентами

### Негативные
- Тёмная тема **удваивает работу по визуалу** — каждый компонент проверяем в обоих режимах. Решение: stylelint правило, проверка в Storybook (если будет) и обязательный pass в обоих темах при code review
- `color-mix(in oklch)` — Safari ≥16.4. Для старых браузеров — graceful degradation (цвет всё равно читаемый, просто без полупрозрачных state-вариантов)
- Без GSAP scroll-анимаций (parallax, pinned sections) — если потребуется wow-эффект, нужен будет ADR на расширение

### Нейтральные
- Палитра **черновая, финализируется на этапе визуала** — гексы могут сместиться на ±5% после теста на реальных фото яхт
- Клиенту показываем не «navy + coral», а **3 моck-ап скриншота** (hero + карточка яхты + bottom-nav) — пусть выберет ощущение, не цифры

## Альтернативы (отвергнутые)

1. **Чистый sync `#0C8CE9` без модификаций** — узнаваемо, но «мы — клон диджитал-агентства». Не подходит премиум-яхтам.
2. **Тёплая coral-доминанта (`#E2956A` как primary)** — слишком эмоционально/freelance-portfolio. Для премиум-сервиса нужна сдержанность primary + энергия в accent.
3. **Бирюзово-морской (как yachtminsk/arenda-yacht)** — категорическое нет, не отстраиваемся от конкурентов.
4. **Только light theme в MVP** (как было) — даёт быстрый старт, но переделка архитектуры под dark позже = больше работы и риск регрессий. Дешевле сразу.
5. **GSAP + Framer Motion** (как sync) — overkill для лендинга, бандл +90kb, не оправдано.
6. **Только CSS-анимации (без Framer Motion)** — упирается в координацию stagger-анимаций при загрузке секций; чистый CSS не даёт enter/exit для unmount-компонентов. FM решает оба.

## Связанные

- [[ADR-001 SCSS Modules вместо Tailwind]]
- [[ADR-005 iOS-style Design Language]]
- [[ADR-007 Adaptive Panel]]
- [[../../50 - Design/Design System]]
- Sync reference: `~/Documents/sync-brand-site-v2/src/app/styles/main.scss`, `src/shared/abstracts/_tokens.scss`
- Memory: `reference_flex_glass_design_system.md`

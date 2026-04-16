---
date: 2026-04-17
status: accepted
tags: [adr, design, ds, ios]
---

# ADR-005 — iOS-style Design Language

## Контекст

Заказчик попросил «общий стиль интерфейса как новый iOS». Это согласуется с уже принятыми решениями:
- mobile-first (ADR-004 + skill mobile-first)
- app-like навигация (ADR-004 — appbar + bottom-nav)
- premium-позиционирование (yacht rental — премиальная услуга)
- целевая аудитория Минска статистически тяготеет к iOS (платежеспособные сегменты)

«Новый iOS» — это iOS 17–18 visual language: **Liquid Glass / frosted materials, capsule controls, generous whitespace, soft layered shadows, hairline borders, spring-easing micro-interactions**.

## Решение

Принимаем iOS 17–18 как **общий визуальный язык** интерфейса. Конкретные реализации в DS:

### 1. Surfaces / Materials — frosted glass
Три уровня «материалов» по образцу iOS UIBlurEffect:

```scss
--material-thin:    backdrop-filter: blur(20px) saturate(180%);
                    background: rgba(255,255,255,0.55);
--material-regular: backdrop-filter: blur(24px) saturate(180%);
                    background: rgba(255,255,255,0.72);
--material-thick:   backdrop-filter: blur(40px) saturate(180%);
                    background: rgba(255,255,255,0.92);
```

Используем для: appbar (`thin` при scroll), bottom-nav (`regular`), modal-overlay (`thick`), floating-cards над фото.

В dark mode значения адаптируются автоматически через `.dark` override.

### 2. Geometry — capsule + rounded
- **Кнопки:** `border-radius: 999px` (полная капсула, как iOS) для primary/secondary/ghost. Размер = высота кнопки.
- **Карточки:** `border-radius: var(--radius-2xl)` (24px) — мягкие, не острые.
- **Sheets / modals:** `border-radius: var(--radius-3xl) var(--radius-3xl) 0 0` (32px только сверху) — bottom-sheet с rounded top corners.
- **Inputs:** `border-radius: var(--radius-lg)` (12px) — спокойные.
- **Tags / badges:** `border-radius: 999px` — мини-капсулы.
- **Hero-фото:** `border-radius: var(--radius-3xl)` (32px) на mobile — как iOS App Store cards.

### 3. Borders — hairline
`border: 1px solid var(--color-border-hairline)` где hairline = `color-mix(in oklch, var(--color-foreground) 8%, transparent)`. Никаких толстых 2px. Где возможно — `0.5px` (на retina выглядит резкой линией).

### 4. Shadows — multi-layer soft
Тени строим в 2-3 слоя для «depth as material thickness» (а не «drop shadow»):

```scss
--shadow-card-rest:   0 1px 0   rgba(0,0,0,0.04),
                      0 1px 2px rgba(0,0,0,0.04),
                      0 0   1px rgba(0,0,0,0.06);

--shadow-card-hover:  0 1px 0   rgba(0,0,0,0.04),
                      0 8px 24px rgba(0,0,0,0.08),
                      0 0   1px rgba(0,0,0,0.06);

--shadow-sheet:       0 -8px 32px rgba(0,0,0,0.12),
                      0 -1px 0    rgba(0,0,0,0.06);
```

Никаких heavy `0 25px 50px rgba(0,0,0,0.5)` — это Material, не iOS.

### 5. Typography — SF Pro vibe через Inter / SF Pro Display
- **Display (H1, hero):** SF Pro Display fallback `Inter Display`, `font-weight: 600`, `letter-spacing: -0.025em` (tight tracking — iOS large titles).
- **Body:** SF Pro Text fallback `Inter`, `400`/`500`. Line-height 1.45–1.5.
- **Numerals:** `font-feature-settings: "tnum" on` (tabular nums для цен — выравниваются в столбик).
- Шрифт-стек:

```css
--font-display: -apple-system, 'SF Pro Display', 'Inter Display', system-ui, sans-serif;
--font-body:    -apple-system, 'SF Pro Text', Inter, system-ui, sans-serif;
```

`-apple-system` подхватит SF Pro нативно на Apple-устройствах (≈40% трафика). Остальные получат Inter (визуально близок).

### 6. Color — light mode default, opt-in dark
- **Светлый фон с warm tint** (не чисто белый). Песочно-морская палитра (см. Design System).
- **Дип-навигейшн bar:** не чёрный (#000), а **deep navy** `#0d0f17` (как в Apple Maps dark).
- **Vibrant accent:** один яркий бренд-цвет (закатный коралл) — для CTA, активного состояния, фокус-ринга.
- **Tinted text:** `--color-foreground` это не чёрный (#000), а deep slate `#1B2230` — Apple HIG.
- Dark mode — отдельная палитра, не invert. Готовим архитектурно через `.dark { }` override (см. flex-glass _tokens.scss), но в MVP не активируем (toggle добавим post-MVP).

### 7. Micro-interactions — spring + tap-scale
- **Tap feedback:** на `:active` — `transform: scale(0.97)` + `transition: transform 150ms cubic-bezier(0.22, 1, 0.36, 1)`. Лёгкий «отклик» как iOS haptic-эквивалент.
- **Spring easing**: единый easing для перехода состояний — `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-spring` уже в flex-glass DS).
- **Sheet open/close:** spring 350ms, `bottom: -100% → 0`.
- **Page transitions:** на mobile fade 200ms (без сложных переходов, чтобы не мешать SEO crawling).
- **`prefers-reduced-motion`** — все scale/spring заменяются на opacity-only.

### 8. Sheets — primary modal pattern
По образцу iOS UISheetPresentationController:
- Bottom-sheet с **drag-handle** (4×40px серая капля сверху).
- Снапы: `medium` (50vh) и `large` (90vh). Можно перетягивать.
- Закрытие: тап вне или свайп вниз.
- Поверх — `backdrop-filter: blur` + затемнение `rgba(0,0,0,0.4)`.
- Используем для: `OrderSheet`, `MoreSheet` (из ADR-004), фильтры флота, форма заявки, lightbox-галерея.

### 9. Lists — grouped / inset (iOS Settings style)
Для FAQ, прайс-листа, контактов — паттерн «inset grouped list»:
- Карточка с `--radius-2xl`
- Внутри — строки разделены hairline-бордером
- Иконка слева, контент в центре, chevron-стрелка справа
- Тап → расширение / переход

### 10. Photography — full-bleed, slight grade
- Hero-фото — full-bleed (от края до края), `aspect-ratio` 4/5 на mobile / 16/9 на desktop.
- Лёгкий warm grade (не сепия) — теплее на 5–10% saturation, blacks lifted на 3–5%.
- Никакого карусель-слайдера на hero. Если несколько фото — горизонтальный snap-scroll внизу секции (как iOS Photos).

### 11. Iconography — SF Symbols vibe через Lucide
Lucide React визуально близок к SF Symbols (тонкие 1.5–2px линии). Размеры: 16/20/24/28px. Цвет — `currentColor`.

### 12. Loading — skeletons + subtle pulse
- Skeleton-блоки с `border-radius` соответствующим контенту (карточка → 24px).
- Pulse-анимация: `opacity: 0.6 → 1.0`, 1.4s, ease-in-out, infinite. Не shimmer (Material), не spinner.
- Spinner — только если действие точно > 1с (отправка формы).

## Последствия

### Позитивные
- Premium-восприятие (визуально — как платное приложение). Психологически оправдывает цены 150–1500 BYN.
- Хорошо ложится на mobile-first и app-like nav (ADR-004) — единый язык.
- iOS-аудитория получает нативное ощущение; Android получает modern minimalist (всё ещё хороший UX).
- Почти все паттерны уже технически поддержаны в flex-glass DS (cascade layers, color-mix, fluid clamp, container queries).
- Frosted glass + hairline + capsule — отстройка от конкурентов (у всех 8 — устаревший Bootstrap-вид).

### Негативные
- `backdrop-filter` слабее на старых Android (< Android 9, Chrome < 76) — fallback solid-цвет.
- SF Pro Display только нативно на Apple — fallback Inter не идентичен (но достаточно близок).
- Сложнее писать кастомные иллюстрации в этом стиле — нужна рука дизайнера / стоковые AI-render. Но иллюстраций у нас почти не будет (продаём фото).
- Spring-анимации требуют дисциплины — везде один easing, иначе UX рассыпается.

### Нейтральные
- Нужно держать DS-токены в актуальном состоянии (radius/material/shadow).
- Шрифты: SF Pro лицензируется только для веба через `system-ui` стек — но это работает.

## Альтернативы (отвергнутые)

1. **Material 3 (Google)** — слишком знакомо, ассоциация с Android-приложениями (e-commerce/utility). Не премиум-вибра.
2. **Neo-brutalism / hard-edge** — модно, но не подходит для luxury-сервиса (создаёт «модный молодёжный» а не «аккуратный премиум»).
3. **Glass-morphism «как везде»** — переборщить с blur и transparency = читабельность падает. Берём только в определённых местах (appbar/bottomnav/sheets).
4. **Skeuomorphic (старый iOS до iOS 7)** — устарело.
5. **Flat 2D (типа Stripe / Linear)** — корректно, но скучно. iOS добавляет тактильности через materials и spring.

## Связанные заметки

- [[ADR-004 Mobile App-style Navigation (Appbar + Bottom Nav)]]
- [[../../50 - Design/Design System]] — токены, материалы, тени, capsule-radius
- [[../../50 - Design/UX-паттерны]] — паттерны компонентов
- [[ADR-001 SCSS Modules вместо Tailwind]] — техническая база
- Reference: `~/Documents/flex-glass/src/shared/design-system/` — большая часть архитектуры готова
- Apple HIG: https://developer.apple.com/design/human-interface-guidelines/

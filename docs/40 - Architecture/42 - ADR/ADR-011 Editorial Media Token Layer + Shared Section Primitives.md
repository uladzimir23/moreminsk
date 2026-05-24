---
date: 2026-05-24
status: accepted
tags: [adr, design-system, tokens, editorial]
extends: ADR-009
---

# ADR-011 — Editorial Media Token Layer + Shared Section Primitives

## Контекст

После промоушена «cinematic» лендинга в прод ([[../Design Lab — Production Migration]]) аудит выявил: дарк-секции (флот / услуги / галерея / отзывы / FAQ / booking / contacts), которые лежат поверх фото / видео / эффектов, хардкодят белый-на-тёмном (206 `rgba(255,255,255,X)`), глубокие фоны (`#0a0f16`), hairlines, glass и blur-значения. Плюс editorial-«шапка» секции (eyebrow + title + Lora-accent) продублирована **12 раз** (`.eyebrow` ×12, `.title` ×9, `.accent` ×11). Всё это в `src/widgets/landing/**`, временно вынесенном из stylelint.

[[42 - ADR/ADR-009 Editorial Minimalism + Sky-blue Accent|ADR-009]] задал light/dark семантические токены, но **не покрыл «always-dark» media-секции** (они тёмные независимо от темы сайта).

## Решение

### 1. «Media» token layer (theme-independent)

Добавлен слой токенов в `tokens/_tokens.scss` (`:root`, не зависит от light/dark — media-секции всегда тёмные):

```
--media-bg / --media-bg-deep / --media-bg-elevated   // тёмные холсты
--on-media / --on-media-strong / --on-media-muted /
--on-media-subtle / --on-media-faint                 // белая шкала текста
--media-hairline / --media-hairline-strong           // разделители на тёмном
--media-glass-bg / --media-glass-bg-hover / --media-glass-border
--on-media-accent                                    // sky, светлее для тёмного
--blur-ambient(70) / --blur-frame(40) / --blur-glass(12) / --blur-edge(5)
--media-scrim                                        // dark overlay wash
--eyebrow-size / --eyebrow-tracking / --eyebrow-weight
--section-pad-block / --section-gutter / --section-max(90rem)
```

Дарк-секции переходят с `rgba(255,255,255,…)` / хексов на эти токены → редактируются из одного места, согласованы.

### 2. Shared section primitives

- **`SectionHeader`** (`shared/ui/section-header`) расширен аддитивно:
  - `tone: "surface" | "media"` (default surface — старое поведение не меняется),
  - `accent` — Lora-italic слово в конце заголовка (editorial-подпись),
  - `framed` — оборачивает в общий гаттер (`--section-max` + `--section-gutter`), чтобы заголовки **всех** секций вставали на один левый край (160px @1600).
  - DS-conformant (токены, rem) → проходит stylelint.
- Дальше извлекаем: **`AmbientBackdrop`** (blurred-фото + scrim), **`Lightbox`** (zoom/stories), **`useCarousel`** (флот/услуги/галерея/stories).

## Последствия

### Позитивные
- Один источник правды для dark-секций: поменять `--on-media-muted` → меняется везде.
- Убирается 12-кратный дубль шапки; выравнивание гаттера автоматическое (`framed`).
- Постепенный выход из stylelintignore: по мере перевода секции на токены + примитивы она становится DS-чистой и выводится из исключений.

### Негативные / в работе
- Конверсия 17 SCSS-файлов лендинга (836 px → rem, 206 rgba → токены) — инкрементальная (P2). Пока `widgets/landing/**` остаётся в `.stylelintignore`.
- «always-dark» media-токены не реагируют на `.dark-theme` (это намеренно — секции дизайнятся тёмными). Если позже захотим light-вариант media-секций — добавим оверрайды.

## Имплементация (статус)

- ✅ Media token layer в `_tokens.scss`.
- ✅ `SectionHeader` tone/accent/framed (DS-clean).
- ✅ Пруф: `gallery-section` шапка переведена на `<SectionHeader tone="media" framed>` — рендерится идентично, выровнено 160px, stylelint green.
- ⏳ Перевести остальные 6 шапок (флот/услуги/отзывы/faq/booking/contacts) на `SectionHeader`.
- ⏳ `AmbientBackdrop`, `Lightbox`, `useCarousel`.
- ⏳ Конверсия SCSS на токены → снять `widgets/landing/**` из stylelintignore.

## Связанные

- [[42 - ADR/ADR-009 Editorial Minimalism + Sky-blue Accent]]
- [[../Design Lab — Production Migration]]
- [[../../50 - Design/Design System]]

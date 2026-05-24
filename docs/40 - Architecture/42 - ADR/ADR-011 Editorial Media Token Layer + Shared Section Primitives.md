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
- ✅ **5/7 шапок** на `SectionHeader tone="media"`: gallery (framed), services
  (framed), faq (внутри `.inner`), fleet + reviews (внутри 1280-центр. `.head`).
  Все выровнены на 160px @1600. Осталось: **contacts** (нужен editorial-on-light
  тон — отложено до ре-скина внутренних страниц) + **booking** (шапка вшита в
  pitch-колонку, не standalone).
- ✅ **`AmbientBackdrop`** (`shared/ui`) — извлечён, заменил 3 копии `.backdrop*`
  (gallery/services/fleet), blur через `--blur-ambient`, wash через
  `--media-scrim`. DS-clean, вне stylelintignore. −105 строк нетто.
- ⏳ `Lightbox`, `useCarousel` — механики у секций разные (paging+swipe / scroll-snap+IO
  / fullscreen stories), чистая единая абстракция не очевидна; извлекать точечно.
- ✅ **SCSS px → rem** (527 значений, 1rem = 16px → pixel-identical; px оставлен
  только в border/outline/box-shadow/text-shadow). `unit-disallowed-list` был
  единственным нарушением → `widgets/landing/**` **снят из stylelintignore**,
  lint теперь его энфорсит. Билд static-export зелёный.
- ✅ **Удалён мёртвый код** миграции: horizon-hero, scene-hero, submerged-optics,
  старый fleet-section (только preview-копии использовались).
- ✅ **Тёмные канвасы секций** (`#0a0f16/#0a0a0a/#0c1620`) → `--media-bg*` токены.
- ⏳ **Рационализация цветов**: 29 различных white-opacity + 14 black-opacity
  (текст/бордеры/glass) оставлены литералами — снэп к 5-ступенчатой `--on-media`
  шкале изменит выверенный вид. Это осознанный дизайн-проход, не механический.
- ⏳ Уборка мёртвого `.head/.eyebrow/.title/.accent` CSS в переведённых секциях.

## Связанные

- [[42 - ADR/ADR-009 Editorial Minimalism + Sky-blue Accent]]
- [[../Design Lab — Production Migration]]
- [[../../50 - Design/Design System]]

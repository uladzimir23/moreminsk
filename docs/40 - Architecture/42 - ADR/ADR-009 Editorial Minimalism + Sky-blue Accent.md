---
date: 2026-05-23
status: accepted
tags: [adr, design, ds, minimalism, editorial]
supersedes:
  - ADR-005 (iOS-style Design Language)
  - ADR-006 (Color Palette — Navy + Coral)
---

# ADR-009 — Editorial Minimalism + Sky-blue Accent

## Контекст

Заказчик после первой итерации с iOS Liquid Glass (ADR-005) + navy/coral палитрой (ADR-006) попросил пивот:

> «Минимализм с прямыми линиями. Акцентный — голубой как цвет моря.»

Это сильное смещение визуальной системы:
- iOS-эстетика (frosted glass, capsule controls, multi-layer shadows, generous radii) ↔ editorial minimalism (плоско, прямые углы, hairline borders, без теней)
- Тёплая warm-fluid палитра (`#FAF7F2` фон + `#E2956A` coral CTA) ↔ холодная монохром-палитра (`#FFFFFF` фон + `#0EA5E9` sky CTA)

При согласовании направления (см. диалог 2026-05-23) выбрана пара:
- **Стиль:** «Швейцарский editorial» (референсы — aesop.com, muji.com, cos.com)
- **Акцент:** `#0EA5E9` — Tailwind sky-500 (серединный циан)

## Решение

Принимаем **editorial minimalism** как новый общий визуальный язык. Конкретные реализации:

### 1. Geometry — прямые линии и углы

**Заменяет ADR-005 §2 (capsule + rounded).**

| Объект | Было (ADR-005) | Стало |
|---|---|---|
| Buttons | `border-radius: 9999px` (capsule) | `border-radius: 0` (прямоугольник) |
| Cards | `var(--radius-2xl)` 24px | `var(--radius-sm)` 2px |
| Inputs | `var(--radius-lg)` 12px | `var(--radius-sm)` 2px |
| Sheets / panel | `var(--radius-3xl)` 32px top | `0` (sharp top edge) |
| Tags / badges | `9999px` mini-capsule | `0` / прямоугольная пометка |
| Hero-фото | `var(--radius-3xl)` 32px | `0` (full-bleed без рамки) |

Допустимо `--radius-sm` (2px) на полях ввода / hover-индикаторах — но это максимум. Никаких 8px / 12px / 16px / 24px радиусов.

### 2. Surfaces — flat, без frosted glass

**Заменяет ADR-005 §1 (frosted materials).**

- `backdrop-filter` снимается со всех слоёв
- `--material-thin/regular/thick` остаются как deprecated-токены (значение = solid background-color, для compat-слоя пока компоненты не переписаны)
- Appbar / bottom-nav / sheet — solid fill `var(--color-surface)` + 1px hairline разделитель (top или bottom)

### 3. Borders — hairline как основной визуал

1px solid `var(--color-border-hairline)` — становится первой опцией для разграничения. На retina может быть `0.5px` для ультра-тонкой линии.

- Cards: 1px hairline border + 0px radius
- Inputs: 1px hairline border + 2px radius, focus → 1px solid `var(--color-accent)`
- Section dividers: 1px hairline horizontal
- Lists: hairline между строками (как сейчас)

### 4. Shadows — почти нет

**Заменяет ADR-005 §4 (multi-layer soft).**

- В light theme — **shadow удалены** со всех permanent-компонентов. Editorial = плоско.
- Допустимо ОДНО elevation-shadow для floating sheet / dropdown / toast: `0 12px 24px -8px rgb(0 0 0 / 0.08)`. Лёгкая прозрачная подложка, без «depth».
- В dark theme — shadow остаются (для отделения surface от background), но тоже single-layer.

### 5. Color — белый + near-black + sky-500

**Заменяет ADR-006 §1 (navy + coral палитра).**

Меняем три фундаментальных оси:

| Slot | Было (ADR-006) | Стало |
|---|---|---|
| `--color-background` (light) | `#FAF7F2` warm sand | `#FFFFFF` чисто-белый |
| `--color-primary` (light) | `#0A4D7A` deep navy | `#0A0A0A` near-black |
| `--color-accent` (light) | `#E2956A` sunset coral | `#0EA5E9` sky-500 |
| `--color-background` (dark) | `#0E1620` deep navy | `#0A0A0A` near-black |
| `--color-primary` (dark) | `#5BA8D6` sea blue | `#FAFAFA` near-white |
| `--color-accent` (dark) | `#EBA77E` light coral | `#38BDF8` sky-400 (светлее для контраста) |

**Полная палитра в `src/shared/design-system/tokens/_tokens.scss`** (обновляется одновременно с этим ADR).

**Почему sky-500 а не coral:**
- «Голубой как море» — буквальный запрос заказчика
- Один холодный акцент на нейтральном фоне создаёт фокус без эмоционального шума
- Выделяет нас от конкурентов: yachtminsk использует бирюзу, arenda-yacht — выцветший голубой, никто не идёт в чистый cyan
- WCAG: `#0EA5E9` на `#FFFFFF` = 3.4:1 (AA для крупного текста), на 18px+ читается; для inline-текста используем `#0284C7` sky-600 = 4.6:1 (AA)

**Прежние slot'ы Sea-* и Sunset-* primitive-токены сохраняем в `_tokens.scss` как deprecated** до сметания всех компонентов — позволит staged migration без breakage.

### 6. Typography — Manrope + Lora с большей долей акцента

**Расширяет ADR-008 (Manrope + Lora).** ADR-008 не суперседится — шрифты те же, но раскладка контрастней:

- H1 уровень — fluid `clamp(2.5rem, 5vw + 1rem, 4.5rem)` (вместо текущего clamp до 4.5rem максимум). Editorial требует крупных заголовков.
- Tracking на H1/H2 — `-0.04em` (было `-0.025em`). Сильнее затяжка для редакционного ощущения.
- Lora-акцент **разрешён шире**:
  - Eyebrow секции (1–2 слова в italic, размер sm)
  - Названия яхт (italic 500) — как раньше
  - Один «герой-словокласс» в H1
  - Кавычки `« »` в цитатах/отзывах
  - Все «editorial pull-quotes» (если будут)
- Max 5 instances/страница, 2/viewport — **сохраняется**.
- Tabular numerals для цен — **сохраняется**.

### 7. Photography — full-bleed, без рамок

**Усиливает ADR-005 §10.**

- Hero-фото — full-bleed (от края до края), без borderradius
- Yacht / service hero — 16/9 или 21/9 на desktop, 4/5 на mobile
- НИКАКИХ соft-grade фильтров — фото идёт «как есть» (заказчик присылает обработанные кадры). Editorial = доверие к материалу.
- Подписи под фото — `var(--font-mono)` 10pt, uppercase, letter-spacing 0.2em (галерея/архив-стиль)

### 8. Layout — больше воздуха, asymmetric grid допустим

- Section spacing увеличен: `--space-section` поднят с `clamp(5rem, ..., 6rem)` до `clamp(6rem, ..., 9rem)`. Editorial = breathing room.
- Container max-width: 1280px → можем оставить, либо явный 1440px content + 1024px text-block для длинных абзацев
- Заголовок секции на отдельной линии слева, контент справа — на desktop (асимметричный «editorial» паттерн), на mobile — стек
- 1px hairline-разделители между секциями вместо большого padding

### 9. Micro-interactions — сокращаем spring

**Корректирует ADR-005 §7.**

- Tap feedback `transform: scale(0.97)` на кнопках — **сохраняется** (UX-affordance)
- Spring-easing `cubic-bezier(0.22, 1, 0.36, 1)` — **сохраняется** для UI transitions
- Hover effects — упрощаются: текст подчёркивается `text-decoration-thickness: 1px → 2px`, или фон меняется на `--color-surface-alt`. Никаких translateY-«подъёмов».
- Page transitions — fade-only 200ms, без slide

### 10. Bottom-nav и Appbar — flat вариант

**Корректирует ADR-004 (Mobile App-style Navigation).**

ADR-004 сохраняется как **паттерн** (top appbar + bottom nav 5 пунктов на mobile), но визуально:
- Appbar: solid `var(--color-background)` + 1px bottom hairline (вместо frosted glass)
- Bottom-nav: solid + 1px top hairline (вместо frosted glass + multi-layer shadow)
- Активный пункт: подчёркивание 2px sky-500 под иконкой (вместо bg-pill)
- Иконки Lucide — `currentColor`, активная — `--color-accent`

### 11. AppPanel (sheet / drawer) — sharp edges, hairline

**Корректирует ADR-007 (Adaptive Panel).**

ADR-007 сохраняется как **паттерн** (один компонент, морфинг по breakpoint), но визуально:
- Mobile bottom-sheet: верх **без скруглений** (0px радиус сверху), 1px hairline на верхней грани
- Drag-handle (была серая капсула 4×40px) — заменяется на 1px hairline + chevron-иконка слева (или удаляется совсем — пользователь свайпает по верхней зоне)
- Desktop side-drawer: правая полоса, 1px hairline слева, без border-radius
- Backdrop: `rgb(0 0 0 / 0.05)` без blur (вместо blur 8px)

### 12. Iconography — Lucide stroke 1.5px

**Сохраняется из ADR-005 §11.** Lucide React, тонкие линии, `currentColor`. Sizes 16/20/24.

## Что не меняется

Для ясности — что **остаётся** из ADR-005/006/007/008 после этой ADR:

- **ADR-008** (Manrope + Lora) — полностью в силе, шрифты те же, но Lora получает больше «эфирного времени»
- **ADR-007** (Adaptive Panel) — паттерн один компонент с морфингом — в силе; визуал в этой ADR §11
- **ADR-006 §2** (Theme System архитектура с `.light-theme` / `.dark-theme` на html+body, FOUC-script) — в силе
- **ADR-006 §3** (Animation tokens, ladder durations + easings) — в силе
- **ADR-006 §4** (Framer Motion only, без GSAP) — в силе
- **ADR-005 §11** (Lucide iconography) — в силе
- **ADR-005 §12** (Skeleton loading с pulse) — в силе

## Последствия

### Позитивные
- **Отстройка**: ни один конкурент в категории яхт-аренды Беларуси/России не использует editorial-minimal направление. Все идут в gold/navy/coral premium-классику или в bootstrap-utility flatness. Мы — единственные.
- **Премиум через сдержанность**, а не через визуальный «вес». Editorial читается как «дорого и не для всех».
- **Скорость**: убираются `backdrop-filter` (тяжёлый на старых Android), multi-layer shadows — снижение compositing-cost, лучше LCP/INP на mobile.
- **Доступность вырастает**: чёрный текст на белом + один высоконтрастный акцент = базовый contrast ratio безоговорочно AA+ почти везде.
- **Фото берёт на себя «эмоциональную работу»** — палитра намеренно нейтральна, чтобы фото яхт/закатов читались ярко.

### Негативные
- **Зависимость от качества фото**: editorial без хороших фото = пусто и скучно. Нужно настойчиво просить у Павла свежие 2026-сезонные кадры (открытый вопрос в Dashboard).
- **Sky-500 имеет коэффициент 3.4:1 на белом** — для inline-текста ссылок используем sky-600 (`#0284C7` = 4.6:1). Это решено через два token slot'a (`--color-accent` для крупных CTA + `--color-accent-text` для inline).
- **Переписывание визуала всех компонентов** — appbar, bottom-nav, sheet, кнопки, карточки, поля ввода, badge'ы. Объём — большой, но архитектура (cascade layers, semantic tokens) минимизирует risk через graduate migration.
- **Dark mode переосмысливается** — был navy с тёплым акцентом, станет near-black с холодным. Графика приходит другая.

### Нейтральные
- Прежние primitive-токены sea-*/sunset-*/sand-* **не удаляются** из `_tokens.scss` сразу — оставляем для compat-перехода. Постепенно убираем из компонентов, потом снимаем primitives.
- Микро-анимации сохраняются, но их меньше; некоторые `scale`-tap-эффекты заменим на `text-decoration` или `background-color` (быстрее, не requestAnimationFrame).

## Альтернативы (отвергнутые)

1. **Linear-style строгий минимализм** (тоньше captions, монохром + sky) — кандидат № 2 при выборе. Чуть слишком «продуктовый»/SaaS для luxury-сервиса. Aesop-edition лучше держит премиум-полку.
2. **Тёплый минимализм Notion / Attio** — softer (4-6px radii, subtle shadows) — отверг заказчик в пользу более радикального «прямые линии».
3. **Бирюзовый `#14B8A6`** (teal-500) — ближе к реальной воде Минского моря (пресноводное), но Tailwind teal читается как «спа/йога/трафики», уносит фокус с яхтенной премиум-эстетики.
4. **Глубокий циан `#0891B2`** (cyan-700) — мой recommend, ниже контраст-температурный, sky-500 заказчик выбрал — «более летне, активнее».
5. **Балтийский navy `#0A4D7A`** (текущий primary) — заказчик уточнил «голубой» а не «синий», navy уходит.
6. **Сохранить ADR-005/006 целиком, только перекрасить** — половинчатое решение: останутся capsule + материалы + multi-shadow, которые ломают «прямые линии». Меняем целиком.

## Имплементация

1. ✅ Этот ADR — документация
2. ⏳ `_tokens.scss` — обновление палитры, радиусов, теней, materials → solid. Старые sea-*/sunset-* primitive-токены оставлены deprecated.
3. ⏳ FleetCard — reference-рефакторинг, скриншот для согласования
4. ⏳ Сметание остальных компонентов (Button, Input, ServiceCard, Appbar, BottomNav, AppPanel, Hero, Footer)
5. ⏳ Перезахват скриншотов под новый стиль и второй review-pavel PDF

## Связанные

- [[ADR-005 iOS-style Design Language]] — superseded
- [[ADR-006 Color Palette + Theme System + Animation Tokens]] — superseded (палитра); архитектура темизации сохранена
- [[ADR-007 Adaptive Panel — Bottom Sheet on Mobile, Side Drawer on Desktop]] — visual §11 этого ADR
- [[ADR-008 Typography System — Manrope Variable]] — extended (Lora расширяется)
- [[../../50 - Design/Design System]] — обновляется параллельно
- Референсы: aesop.com, muji.com, cos.com, dezeen.com

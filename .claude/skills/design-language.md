---
description: Канон визуального стиля moreminsk. Активируется при создании/правке любых секций и компонентов (карточки, кнопки, страницы, виджеты). Исток стиля — ГЛАВНАЯ страница; не изобретать своё.
---

# Skill: Design Language

> **Исток стиля — главная страница.** Прежде чем рисовать новое — посмотри, как
> это решено на `/` (fleet-showcase, gallery-section, services-section) и в
> `FleetCatalog`. Не изобретай свой компонент, если есть канонный. Нарушение
> консистентности = переделка.

## Острые углы (ADR-009)

- **Кнопки — прямоугольные:** `border-radius: var(--btn-radius)` = **0**.
- Карточки — `--card-radius` = **4px** (editorial); галерея/флот/чипы — **0**.
- **Никаких капсул / `999px` / больших скруглений.** Единственное исключение —
  пилюля «Яхты» в хедере (бренд-элемент).

## Кнопки — только через миксины (`_mixins.scss`)

Плоская заливка `background: accent` — **запрещена** («слишком просто»). Берём:

| Миксин      | Когда                         | Эффект                                                                            |
| ----------- | ----------------------------- | --------------------------------------------------------------------------------- |
| `btn-cta`   | primary CTA («Забронировать») | шлюп-логотип плывёт по кромке + комета-кольцо + spotlight за курсором + 3D-наклон |
| `btn-fill`  | outline/ghost                 | акцент-заливка слева, текст → `--color-on-accent`                                 |
| `btn-tide`  | primary акцент                | «прилив» снизу                                                                    |
| `btn-press` | всегда добавлять              | scale 0.96 на :active                                                             |

## Цвета: accent ≠ primary

- `--color-accent` — **бренд-синий** (#246ed1): акценты, цена-хайлайт, бордеры,
  иконки-маркеры. Текст на нём — `--color-on-accent`.
- `--color-primary` — **near-black/near-white** (заливка primary-кнопок); текст
  на ней — `--color-primary-foreground`. **Не путать с accent.**
- Цена в карточках = `--on-media` (не синяя); accent — для мелких маркеров.

## Секции = media-зона, не плоский page-surface

Канон секции (как landing): `position:relative; isolation:isolate; overflow:hidden;`

- **`<AmbientBackdrop>`** (размытое фото) + **`<SectionHeader tone="media" framed>`**
  (mono-eyebrow + Lora-акцент) + поверхности на **media-токенах**
  (`--media-bg`, `--on-media*`, `--media-glass-*`, `@include media-glass`,
  `--media-hairline*`). Фон карточки = свой `<AmbientBackdrop>` внутри неё (как в
  `FleetCard`). Не использовать плоские `--color-surface/--color-foreground` для
  «богатых» секций.

## Типографика

- **Lora** (`<Accent>` / `.accent`): названия яхт (italic 500), 1 акцент-слово в
  заголовке, кавычки `« »`. **Не** в кнопках/инпутах/ценах. Max 5/страница,
  2/вьюпорт (ADR-008).
- **mono** (`--font-mono`): микролейблы — specs, eyebrow, counter, «от»/«BYN/ч».
- Body — Manrope, ≥16px на mobile.

## Фото

- Скрап-обложки **портретные 3:4** (936×1280). **Не кропать** в landscape
  (16:10/16:9 = режет яхту). Показывать целиком: `contain`/letterbox (как
  `YachtGallery`) или бокс `aspect-ratio: 3/4`.
- **Ken-Burns** — только на размытом фоне (`AmbientBackdrop`), не на чётком фото
  (зум = кроп). Уважать `@include reduced-motion`.

## Hover / движение

- **Без hover-лифта** (`translateY`/`scale` карточки). Вместо — `border-color`
  → accent + эффект кнопки.
- Тихие idle-анимации (ken-burns на блюре) — ок, через `reduced-motion`.

## Темы

Каждый компонент проверяем в **light + dark** (media/on-media флипаются). Не
хардкодить цвета — только `var(--color-*)` / `var(--*-media*)`.

## Переиспользуем (не плодим аналоги)

`SectionHeader` · `AmbientBackdrop` · `YachtGallery` · `FleetCard` · `<Accent>` ·
btn-миксины · `nav-arrow` (см. [[ui-primitives]]).

## Связанные

- ADR-005 iOS-style · ADR-006 палитра/темы · ADR-008 типографика · ADR-009 углы
- `src/widgets/fleet-catalog/FleetCatalog.module.scss` — эталон карточки
- `src/shared/design-system/mixins/_mixins.scss` — миксины кнопок
- skill `content-writing` — тексты · skill `ios-style` — паттерны

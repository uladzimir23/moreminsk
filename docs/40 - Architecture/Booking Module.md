---
type: architecture
tags: [architecture, booking, forms, wizard, business-logic]
updated: 2026-04-17
---

# Booking Module — спецификация

> Модуль бронирования — **главная бизнес-фича** сайта. Все CTA на сайте ведут сюда. От его конверсии зависит финансовый результат проекта. Этот документ — единственная точка истины по поведению, данным и интеграциям брони.

## Решения заказчика (2026-04-17)

| Вопрос | Решение |
|---|---|
| Формат формы | **Wizard** (6 шагов) |
| Календарь занятости | **Простой календарь без busy-dates в MVP**, НО с архитектурным заделом — `AvailabilityProvider` interface, чтобы потом подключить Cal.com / Google Calendar / собственный backend **без переписывания** |
| Депозит / предоплата | **Нет** — только заявка, оплата по согласованию с менеджером офлайн |
| Политика конфиденциальности | Нужна `/legal/politika` (стаб-шаблон на MVP) + чекбокс согласия в Step 5 |
| Пакеты «под ключ» | Цены **индивидуальные** — показываем «по запросу», менеджер рассчитывает |
| Длительность аренды | 1h / 2h / 3h / 4h + 6h / 8h (день) / ночь / «больше дня» (custom) |
| Email-подтверждение клиенту | **Да, через Resend** — архитектурно заложить с MVP (не откладывать в post-MVP) |

---

## Точки входа (триггеры)

| Источник | Компонент | Что открывает | Предзаполнение (payload) |
|---|---|---|---|
| BottomNav «+» (mobile) | `widgets/bottom-nav` | `panel.open('order')` | — |
| Appbar «Заказать» (desktop ≥ lg) | `widgets/appbar` | `panel.open('order')` | — |
| Hero CTA «Свободные даты» | `widgets/hero` | `panel.open('order')` | — |
| `YachtCard` «Забронировать» | `entities/yacht/ui/YachtCard` | `panel.open('order', { yachtSlug })` | Шаг 1 пропущен, яхта уже выбрана |
| `/fleet/[slug]` hero CTA | `widgets/hero` на странице яхты | `panel.open('order', { yachtSlug })` | Step 1 pre-filled |
| `/services/[slug]` in-page `cta-form` | `widgets/cta-form` | **inline-wizard** (без AppPanel) | `{ serviceSlug, packageSlug? }` |
| FloatingCard на hero | `widgets/hero` | `panel.open('order')` | — |

Везде — **одна и та же реализация формы** (`features/booking/ui/BookingForm.tsx`), с двумя режимами рендера: внутри `<AppPanel />` (дефолт) или inline в секции (`widgets/cta-form`).

---

## Структура папок

```
src/features/booking/
├── BookingForm.tsx                   # 'use client', root wizard component
├── BookingForm.module.scss
├── ui/
│   ├── steps/
│   │   ├── YachtStep.tsx             # Step 1 — выбор яхты
│   │   ├── DateTimeStep.tsx          # Step 2 — дата + длительность
│   │   ├── PackageStep.tsx           # Step 3 — услуга/пакет (optional)
│   │   ├── ContactStep.tsx           # Step 4 — контакты клиента
│   │   ├── SummaryStep.tsx           # Step 5 — сводка + политика (чекбокс)
│   │   └── SuccessStep.tsx           # Step 6 — успех + CTA в Telegram
│   ├── StepIndicator.tsx             # Прогресс 1/6 … 5/6 (на Success скрыт)
│   ├── Calendar.tsx                  # Простой календарь (MVP — без busy)
│   ├── DurationPicker.tsx            # Radio-group длительностей
│   └── PackageOption.tsx             # Карточка пакета / «по запросу»
├── model/
│   ├── store.ts                      # useBookingStore (zustand или useReducer)
│   ├── schema.ts                     # zod-схемы каждого шага
│   ├── submit.ts                     # submitBooking() — Telegram + Resend (manager + client)
│   ├── availability.ts               # AvailabilityProvider interface + MVP stub
│   ├── durations.ts                  # Константы DURATION_OPTIONS
│   ├── messages.ts                   # HTML-шаблон для Telegram + React Email
│   └── types.ts                      # Booking, BookingDraft, PackageRef, ...
├── lib/
│   ├── price-calc.ts                 # calcPrice({ yacht, duration, package }) → BYN | 'on-request'
│   └── format-booking.ts             # formatBookingForTelegram(), formatBookingForEmail()
└── index.ts
```

> **Было:** `features/lead-form/`. **Станет:** `features/booking/`. Lead-form упраздняется — `widgets/cta-form` теперь использует `BookingForm` в inline-режиме.

---

## Доменная модель

```ts
// features/booking/model/types.ts

export type YachtSlug = 'eva' | 'alfa' | 'mario' | 'bravo';
export type ServiceSlug = 'svadba' | 'den-rozhdeniya' | 'fotosessiya' | ...;

export type DurationOption =
  | { kind: 'hours'; hours: 1 | 2 | 3 | 4 | 6 }
  | { kind: 'day' }               // ~8h дневная
  | { kind: 'night' }             // вечер-ночь
  | { kind: 'multi-day' };        // «больше дня, обсудим» — open-ended

export type PackageRef =
  | { kind: 'none' }                                    // «просто аренда»
  | { kind: 'service'; serviceSlug: ServiceSlug }       // свадьба/ДР/фотосессия
  | { kind: 'turnkey'; serviceSlug: ServiceSlug };      // «под ключ» — цена индивидуальная

export interface ContactFields {
  name: string;                    // ≥2 символа
  phone: string;                   // +375..., валидация BY/RU/UA
  preferredContact: 'telegram' | 'phone' | 'whatsapp';
  email?: string;                  // опционально (но если указан — отправим confirmation)
  comment?: string;
}

export interface BookingDraft {
  yachtSlug?: YachtSlug;           // undefined = «без предпочтений»
  date?: string;                   // ISO yyyy-mm-dd, локальное время MSK/MSK+0
  timeSlot?: string;               // '10:00' | '14:00' | 'evening' — see DateTimeStep
  duration?: DurationOption;
  package: PackageRef;             // default { kind: 'none' }
  guests?: number;                 // 1..N, ≤ yacht.capacity
  contact: Partial<ContactFields>;
  policyAccepted: boolean;         // для Step 5
}

export interface Booking extends Required<Omit<BookingDraft, 'contact' | 'guests'>> {
  contact: ContactFields;
  guests: number;
  estimatedPrice: number | 'on-request';
  createdAt: string;               // ISO
  source: 'appbar' | 'bottom-nav' | 'yacht-card' | 'hero' | 'service-page' | 'inline-form';
}
```

### Константы длительностей

```ts
// features/booking/model/durations.ts

export const DURATION_OPTIONS: Array<{
  value: DurationOption;
  label: string;           // RU
  labelEn: string;
  note?: string;           // «минимум 2 часа» и т.п.
  icon: LucideIcon;        // Clock, Sun, Moon, CalendarDays
}> = [
  { value: { kind: 'hours', hours: 1 }, label: '1 час', labelEn: '1 hour', icon: Clock },
  { value: { kind: 'hours', hours: 2 }, label: '2 часа', labelEn: '2 hours', icon: Clock },
  { value: { kind: 'hours', hours: 3 }, label: '3 часа', labelEn: '3 hours', icon: Clock },
  { value: { kind: 'hours', hours: 4 }, label: '4 часа (полдня)', labelEn: 'Half-day (4h)', icon: Clock },
  { value: { kind: 'hours', hours: 6 }, label: '6 часов', labelEn: '6 hours', icon: Clock },
  { value: { kind: 'day' },             label: 'День (8 часов)', labelEn: 'Full day (8h)', icon: Sun },
  { value: { kind: 'night' },           label: 'Вечер / ночь', labelEn: 'Evening / night', icon: Moon },
  { value: { kind: 'multi-day' },       label: 'Больше дня (обсудим)', labelEn: 'Multi-day (custom)', note: 'Цена индивидуальная', icon: CalendarDays },
];
```

> Финальный список согласовать с Павлом: возможно «2 часа» — минимальный слот (убрать 1 час).

---

## Wizard — 6 шагов

### Общие UI-правила

- Рендерится в `<AppPanel mode='order' />` (mobile — bottom-sheet, desktop — side-drawer 27rem).
- В верху панели — `<StepIndicator current={1..5} total={5} />` (Success — без индикатора).
- Кнопки внизу — **sticky footer** панели с `safe-area-inset-bottom`: `[Назад]` (ghost) `[Далее]` (primary capsule). На шаге 5 — `[Назад] [Отправить заявку]`.
- Переходы между шагами — Framer Motion `fadeX` (slide `x: 16 → 0`), `--duration-base`, `--ease-out`.
- Валидация zod **только текущего шага** перед переходом (не всей схемы). Общая схема — на Submit.
- Черновик — в `useBookingStore` (persist в `sessionStorage` под ключом `moreminsk-booking-draft`, TTL 1 час).

### Step 1 — Яхта

```
┌─────────────────────────────────────────┐
│ ◀ Шаг 1/5                         [×]  │
│ Выберите яхту                           │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ [фото 4:3]  EVA                   │   │
│ │            Парусная · до 6 чел    │   │
│ │            от 150 BYN/ч           │   │
│ └───────────────────────────────────┘   │
│ … ALFA, MARIO, BRAVO …                  │
│ ┌───────────────────────────────────┐   │
│ │ 🎲  Без предпочтений              │   │
│ │    Подберём под дату и бюджет     │   │
│ └───────────────────────────────────┘   │
│                                         │
│          [Далее →]                      │
└─────────────────────────────────────────┘
```

- Если открыто с `{ yachtSlug }` — шаг **пропущен**, `yachtSlug` заполнен, wizard стартует с Step 2.
- Вариант «без предпочтений» — валиден, в Telegram уходит как `yacht: '—'`.

### Step 2 — Дата и длительность

```
┌─────────────────────────────────────────┐
│ ◀ Шаг 2/5                         [×]  │
│ Когда?                                  │
│                                         │
│ [← Апрель 2026 →]                       │
│ Пн Вт Ср Чт Пт Сб Вс                    │
│              1  2  3  4  5              │
│  6  7  8 [9]10 11 12                    │  ← выделена выбранная
│ 13 14 15 16 17 18 19                    │
│ ...                                     │
│                                         │
│ Длительность                            │
│ ◉ 2 часа       ○ 6 часов                │
│ ○ 3 часа       ○ День (8ч)              │
│ ○ 4 часа       ○ Вечер/ночь             │
│ ○ 1 час        ○ Больше дня (обсудим)   │
│                                         │
│ Время                                   │
│ [10:00] [14:00] [Вечер] [Обсудим]       │
│                                         │
│  [← Назад]        [Далее →]             │
└─────────────────────────────────────────┘
```

- **Календарь (MVP):** простой месячный grid, дисаблит только прошлые даты (`date < today`). **Без** проверки занятости.
- **Пока заглушка** `MvpAvailabilityProvider` возвращает `{ isBusy: false }` на любую дату.
- Через Pluggable Provider (см. раздел ниже) — потом подключаем реальный источник, дисабленные даты рендерятся с `opacity 0.3 + cursor: not-allowed`.
- **Длительность** — `DurationPicker` (radio-group в виде capsule-chips, 2 колонки на mobile).
- **Время** — 4 слота (ориентиры), уточняет менеджер. Для `multi-day` / `night` — блок времени скрыт.

### Step 3 — Пакет/услуга

```
┌─────────────────────────────────────────┐
│ ◀ Шаг 3/5                         [×]  │
│ Повод (опционально)                     │
│                                         │
│ ○ Просто аренда                         │
│ ○ Свадьба                               │
│ ○ День рождения                         │
│ ○ Фотосессия                            │
│ ○ Корпоратив                            │
│ ○ Романтический вечер                   │
│                                         │
│ ────────────                            │
│                                         │
│ ☐ Пакет «под ключ»                      │
│   Организация мероприятия полностью:    │
│   декор, кейтеринг, фото, музыка        │
│   Цена индивидуальная — обсудим         │
│                                         │
│  [← Назад]        [Далее →]             │
└─────────────────────────────────────────┘
```

- «Просто аренда» = `{ kind: 'none' }`. Остальные = `{ kind: 'service', serviceSlug }`.
- Чекбокс «под ключ» меняет `kind` на `'turnkey'` — цена **не считается**, в UI Summary пишем «по запросу».
- Если открыто с `{ serviceSlug }` с `/services/[slug]` — шаг предзаполнен, но всё ещё показываем для подтверждения.

### Step 4 — Контакты

```
┌─────────────────────────────────────────┐
│ ◀ Шаг 4/5                         [×]  │
│ Как с вами связаться?                   │
│                                         │
│ Имя *                                   │
│ [                              ]        │
│                                         │
│ Телефон *                               │
│ [+375 (__) ___-__-__           ]        │
│                                         │
│ Куда удобнее писать?                    │
│ ◉ Telegram  ○ Звонок  ○ WhatsApp        │
│                                         │
│ Email (если нужно подтверждение)        │
│ [                              ]        │
│                                         │
│ Количество гостей                       │
│ [  2  ▼]                                │
│                                         │
│ Комментарий                             │
│ [                              ]        │
│ [                              ]        │
│                                         │
│  [← Назад]        [Далее →]             │
└─────────────────────────────────────────┘
```

- Маска телефона — `libphonenumber-js` + `react-hook-form` `Controller`.
- Анти-zoom iOS: `font-size: max(1rem, 1em)` на инпутах.
- Количество гостей — select с диапазоном `1..yacht.capacity` (если яхта выбрана) или `1..12` (если «без предпочтений»).

### Step 5 — Подтверждение

```
┌─────────────────────────────────────────┐
│ ◀ Шаг 5/5                         [×]  │
│ Проверьте детали                        │
│                                         │
│ Яхта          EVA (парусная, до 6)      │
│ Дата          9 апреля 2026             │
│ Длительность  4 часа                    │
│ Время         14:00                     │
│ Повод         Фотосессия                │
│ Гостей        2                         │
│ Имя           Анна                      │
│ Телефон       +375 29 123-45-67         │
│ Связь         Telegram                  │
│ Email         anna@example.com          │
│                                         │
│ Ориентировочная стоимость               │
│        500 BYN                          │
│ Финальную цену подтвердит менеджер      │
│                                         │
│ ☐ Согласен(на) с [политикой             │
│   конфиденциальности]                   │
│                                         │
│  [← Назад]   [Отправить заявку →]       │
└─────────────────────────────────────────┘
```

- Сводка со всеми заполненными полями. Tap-to-edit → возврат на нужный шаг (не обязательно, но крутая фича — добавить если успеваем).
- **Ориентировочная цена:**
  - `PackageRef.kind === 'turnkey'` → **«По запросу»** (цифры нет)
  - `PackageRef.kind === 'none' | 'service'` + `duration.kind === 'hours'` → `yacht.pricePerHour * hours`
  - `duration.kind === 'day'` → `yacht.pricePerDay`
  - `duration.kind === 'night'` → `yacht.pricePerNight`
  - `duration.kind === 'multi-day'` → **«По запросу»**
  - Если яхта не выбрана → «По запросу»
- **Чекбокс политики** — обязателен, disable «Отправить» пока не поставлен.
- Ссылка «политикой конфиденциальности» → `/[locale]/legal/politika` (открывается в **новой вкладке**, не в панели).

### Step 6 — Успех

```
┌─────────────────────────────────────────┐
│                                     [×] │
│              ✓                          │
│        Заявка отправлена                │
│                                         │
│ Менеджер ответит в Telegram             │
│ в течение 30 минут.                     │
│                                         │
│ Если указали email — подтверждение      │
│ уже летит вам.                          │
│                                         │
│  [Открыть Telegram  ✈]                  │
│  [Закрыть]                              │
│                                         │
│ Номер заявки: #A4K-2026-04-17-1823      │
└─────────────────────────────────────────┘
```

- Кнопка «Открыть Telegram» → `https://t.me/moreminsk` (new tab).
- `sessionStorage` черновика — очищается.
- Автозакрытие панели через 30 секунд (если пользователь не действует) — опционально, обсудить.

---

## AvailabilityProvider — pluggable interface

> **Критичный архитектурный задел.** MVP запускаем без календаря занятости, но код пишем так, чтобы **подключение реального провайдера не требовало переписывания**.

### Interface

```ts
// features/booking/model/availability.ts

export interface AvailabilitySlot {
  date: string;               // ISO yyyy-mm-dd
  yachtSlug?: YachtSlug;      // undefined = все яхты
  timeSlot?: string;          // '10:00' | 'evening' — если провайдер даёт гранулярность
  status: 'available' | 'partial' | 'busy';
  reason?: string;            // 'техобслуживание', 'частное мероприятие', ...
}

export interface AvailabilityQuery {
  from: string;               // ISO yyyy-mm-dd
  to: string;                 // ISO yyyy-mm-dd
  yachtSlug?: YachtSlug;
}

export interface AvailabilityProvider {
  readonly name: string;
  readonly isRealtime: boolean;
  getSlots(query: AvailabilityQuery): Promise<AvailabilitySlot[]>;
}

// Default MVP — всегда available
export const mvpAvailabilityProvider: AvailabilityProvider = {
  name: 'mvp-stub',
  isRealtime: false,
  async getSlots({ from, to }) {
    return [];  // пустой массив = «никаких занятых слотов» = всё свободно
  },
};

// Post-MVP — реальные источники
// import { calComProvider } from './providers/cal-com';
// import { googleCalendarProvider } from './providers/google-calendar';
// import { supabaseProvider } from './providers/supabase';

// Активный провайдер выбирается через config/env
export function getAvailabilityProvider(): AvailabilityProvider {
  // const envProvider = process.env.NEXT_PUBLIC_AVAILABILITY_PROVIDER;
  // switch (envProvider) { ... }
  return mvpAvailabilityProvider;
}
```

### Использование в Calendar

```tsx
// features/booking/ui/Calendar.tsx
'use client';
import { useEffect, useState } from 'react';
import { getAvailabilityProvider, type AvailabilitySlot } from '../model/availability';

export function Calendar({ yachtSlug, value, onChange }: Props) {
  const [busySlots, setBusySlots] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    const provider = getAvailabilityProvider();
    if (!provider.isRealtime) return;                   // MVP — noop
    provider.getSlots({ from, to, yachtSlug }).then(setBusySlots);
  }, [from, to, yachtSlug]);

  const isDisabled = (date: string) =>
    busySlots.some(s => s.date === date && s.status === 'busy');
  // ...
}
```

### План post-MVP

| Фаза | Провайдер | Что нужно |
|---|---|---|
| Phase 1 (сейчас) | `mvp-stub` | Ничего — календарь просто «на глаз» |
| Phase 2 | **Google Calendar (read-only)** | Shared calendar у менеджера → публичный iCal URL → fetch + parse на клиенте. Бесплатно, 0 backend-кода |
| Phase 3 | **Cal.com self-hosted** | Полноценный booking backend, webhooks, Telegram-нотификации, iCal sync |
| Phase 4 | **Own backend** | Supabase / PlanetScale / pocketbase + admin UI для менеджера |

Переключение — через env var + реестр провайдеров. **Никаких правок в UI-компонентах.**

---

## Submit flow

```
User: Submit button in Step 5
         │
         ▼
submitBooking(booking: Booking)
         │
         ├──► formatBookingForTelegram(booking) → HTML string
         │           │
         │           ▼
         │    fetch('https://api.telegram.org/bot<TOKEN>/sendMessage', {
         │      method: 'POST', body: { chat_id, text, parse_mode: 'HTML' }
         │    })
         │
         ├──► formatBookingForEmailManager(booking) → React Email HTML
         │           │
         │           ▼
         │    fetch('https://api.resend.com/emails', {
         │      method: 'POST',
         │      headers: { Authorization: 'Bearer <RESEND_KEY>' },
         │      body: { from: 'booking@moreminsk.by', to: ['hello@moreminsk.by'],
         │              subject: 'Новая заявка #...', html }
         │    })
         │
         ├──► IF booking.contact.email:
         │    formatBookingForEmailClient(booking) → React Email HTML
         │           │
         │           ▼
         │    fetch('https://api.resend.com/emails', {
         │      body: { from: 'hello@moreminsk.by', to: [booking.contact.email],
         │              subject: 'Ваша заявка на аренду яхты принята', html }
         │    })
         │
         └──► Promise.allSettled — любой из трёх может упасть, но хотя бы один должен пройти
                  │
                  ▼
          Success step (Step 6) показывается если:
             - Telegram OK, ИЛИ
             - Email manager OK
          Если оба упали — показываем ошибку + fallback: «Напишите нам в Telegram: @moreminsk»
```

### Env variables

```dotenv
# .env.local (не коммитим)
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=1234567890:AAAA...
NEXT_PUBLIC_TELEGRAM_CHAT_ID=-1001234567890
NEXT_PUBLIC_RESEND_API_KEY=re_XXXXXXXXXXXX
NEXT_PUBLIC_BOOKING_NOTIFY_EMAIL=hello@moreminsk.by
```

> Токены — публичные (`NEXT_PUBLIC_*`) с минимальными правами: бот может писать только в свой чат, Resend key — send-only, restricted к одному from-адресу.

### Telegram message — HTML template

```html
🆕 <b>Новая заявка на аренду яхты</b>
#A4K-2026-04-17-1823

<b>Яхта:</b> EVA (парусная, до 6 чел.)
<b>Дата:</b> 9 апреля 2026
<b>Длительность:</b> 4 часа
<b>Время:</b> 14:00
<b>Повод:</b> Фотосессия
<b>Гостей:</b> 2

👤 <b>Клиент</b>
<b>Имя:</b> Анна
<b>Телефон:</b> +375 29 123-45-67 (<a href="tel:+375291234567">позвонить</a>)
<b>Связь:</b> Telegram (<a href="https://t.me/+375291234567">открыть</a>)
<b>Email:</b> anna@example.com

💬 <i>"Хотим сделать сюрприз на годовщину"</i>

💰 Ориент. стоимость: 500 BYN
🔗 Источник: /fleet/eva

⏱ Отправлено: 17 апр 2026, 14:23 MSK
```

### React Email — client confirmation

```tsx
// features/booking/model/messages.ts — BookingConfirmationEmail
<Html>
  <Head />
  <Preview>Ваша заявка на аренду яхты принята</Preview>
  <Body style={{ backgroundColor: '#FAF7F2', fontFamily: 'Manrope, Arial' }}>
    <Container>
      <Heading>Спасибо, {name}!</Heading>
      <Text>Мы получили вашу заявку № <b>{id}</b>. Менеджер свяжется с вами в {contactChannel} в течение 30 минут.</Text>

      <Section>
        <Heading as="h2">Детали заявки</Heading>
        <Row><Column>Яхта</Column><Column>{yachtName}</Column></Row>
        <Row><Column>Дата</Column><Column>{dateFormatted}</Column></Row>
        <Row><Column>Длительность</Column><Column>{durationLabel}</Column></Row>
        <Row><Column>Ориент. стоимость</Column><Column>{priceLabel}</Column></Row>
      </Section>

      <Button href="https://t.me/moreminsk">Написать нам в Telegram</Button>

      <Text small>Если вы не отправляли заявку — проигнорируйте это письмо.</Text>
    </Container>
  </Body>
</Html>
```

> React Email компилируется **на билде** в static HTML, подставляется шаблонная строка с `{{...}}` → заменяется в браузере перед отправкой. Альтернатива: генерировать HTML прямо в `format-booking.ts` без React Email (минус — ручная вёрстка).

---

## /legal/politika — стаб-страница

> Нужна для юридической корректности (чекбокс в Step 5) и чтобы Google не штрафовал за отсутствие.

- Маршрут: `app/[locale]/legal/politika/page.tsx`
- Контент: статический MDX или `.ts` с текстом. Лежит в `src/shared/content/legal/politika.ts` (ru + en).
- **Шаблон** — в `docs/60 - Content/Политика конфиденциальности (шаблон).md`. Пока юрист не согласовал — используем шаблон с пометкой в футере «Уточнить у юриста до запуска».
- SEO: `robots: noindex, follow` (не хотим в выдаче, но ссылки пусть ходят).

### Содержание шаблона (минимум)

1. Кто мы (юрлицо / ИП, реквизиты)
2. Какие данные собираем (имя, телефон, email, IP через метрику)
3. Зачем (обработка заявок, связь, аналитика)
4. Как храним (defaults, сроки)
5. Кому передаём (никому; Telegram/Resend — технические процессоры)
6. Ваши права (удалить, запросить копию)
7. Контакт DPO (hello@moreminsk.by)
8. Cookie (метрика, сессия)
9. Дата вступления в силу

---

## Валидация (zod schemas)

```ts
// features/booking/model/schema.ts
import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const yachtStepSchema = z.object({
  yachtSlug: z.union([z.enum(['eva', 'alfa', 'mario', 'bravo']), z.literal('any')]),
});

export const dateTimeStepSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  duration: z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('hours'), hours: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(6)]) }),
    z.object({ kind: z.literal('day') }),
    z.object({ kind: z.literal('night') }),
    z.object({ kind: z.literal('multi-day') }),
  ]),
  timeSlot: z.string().optional(),    // required for hours/day, optional for night/multi-day
});

export const contactStepSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  phone: z.string().refine(val => {
    const parsed = parsePhoneNumberFromString(val, 'BY');
    return parsed?.isValid() ?? false;
  }, 'Телефон должен начинаться с +375 / +7 / +380'),
  preferredContact: z.enum(['telegram', 'phone', 'whatsapp']),
  email: z.string().email().optional().or(z.literal('')),
  guests: z.number().int().min(1).max(12),
  comment: z.string().max(500).optional(),
});

export const summaryStepSchema = z.object({
  policyAccepted: z.literal(true, { errorMap: () => ({ message: 'Нужно согласие' }) }),
});

export const fullBookingSchema = yachtStepSchema
  .merge(dateTimeStepSchema)
  .merge(contactStepSchema)
  .merge(summaryStepSchema)
  .extend({
    package: z.discriminatedUnion('kind', [
      z.object({ kind: z.literal('none') }),
      z.object({ kind: z.literal('service'), serviceSlug: z.string() }),
      z.object({ kind: z.literal('turnkey'), serviceSlug: z.string() }),
    ]),
  });
```

---

## State — useBookingStore

```ts
// features/booking/model/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookingStore {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  draft: BookingDraft;
  lastSubmittedId?: string;
  goNext(): void;
  goBack(): void;
  goToStep(step: 1 | 2 | 3 | 4 | 5): void;
  patch(patch: Partial<BookingDraft>): void;
  reset(payload?: Partial<BookingDraft>): void;
  submit(): Promise<{ ok: boolean; id?: string; error?: string }>;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({ ... }),
    {
      name: 'moreminsk-booking-draft',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ draft: s.draft, step: s.step }), // не сохраняем submit state
    }
  )
);
```

> **sessionStorage, не localStorage** — чтобы черновик не висел неделями после закрытия браузера. Живёт в пределах сессии, освобождается на закрытии вкладки.

---

## Price calculation

```ts
// features/booking/lib/price-calc.ts

export function calcPrice(input: {
  yacht: Yacht | undefined;
  duration: DurationOption;
  package: PackageRef;
}): number | 'on-request' {
  if (!input.yacht) return 'on-request';
  if (input.package.kind === 'turnkey') return 'on-request';
  if (input.duration.kind === 'multi-day') return 'on-request';

  if (input.duration.kind === 'hours') {
    const h = input.duration.hours;
    if (h === 4) return input.yacht.pricePerHalfDay;
    return input.yacht.pricePerHour * h;
  }
  if (input.duration.kind === 'day')   return input.yacht.pricePerDay;
  if (input.duration.kind === 'night') return input.yacht.pricePerNight;

  return 'on-request';
}
```

> **Formatting:** `formatPrice(price)` в `shared/lib/format.ts` → `'500 BYN'` либо `'По запросу'` (i18n через next-intl).

---

## Дизайн-токены модуля

```scss
// design-system/tokens/_tokens.scss (добавить секцию — booking)

:root {
  /* Wizard */
  --booking-step-indicator-height: 2.5rem;
  --booking-footer-height: 4.5rem;            /* sticky footer с кнопками */
  --booking-gap-field: var(--space-md);       /* между полями формы */

  /* Calendar */
  --booking-calendar-cell-size: 2.25rem;      /* ~36px touch-safe */
  --booking-calendar-cell-size-md: 2.75rem;   /* desktop */
  --booking-calendar-selected-bg: var(--color-primary);
  --booking-calendar-selected-fg: var(--color-primary-contrast);
  --booking-calendar-busy-opacity: 0.3;

  /* Duration picker chip */
  --booking-chip-radius: 999px;
  --booking-chip-bg: var(--color-surface-alt);
  --booking-chip-bg-selected: color-mix(in oklch, var(--color-primary) 12%, transparent);
  --booking-chip-border-selected: var(--color-primary);
}
```

---

## Аналитика — события (GA4 / Я.Метрика)

| Событие | Где | Параметры |
|---|---|---|
| `booking_open` | Open AppPanel mode='order' | `source` (appbar/bottom-nav/yacht-card/hero/service-page/inline) |
| `booking_step_complete` | Go Next | `step` (1..5), `yacht_slug`, `duration_kind` |
| `booking_abandon` | Close без submit | `step`, `source` |
| `booking_submit` | Submit ok | `yacht_slug`, `duration_kind`, `package_kind`, `price_or_on_request`, `has_email` |
| `booking_error` | Submit fail | `error` (telegram/email/both) |

---

## Контракт с менеджером (Павел)

1. Ежедневно к 10:00 Павел проверяет чат `@moreminsk_bookings` (бот-чат).
2. SLA ответа — 30 минут в рабочее время (10:00–22:00 MSK).
3. Если в Email-пуле от Resend заявки — проверять раз в 2 часа (email-уведомления подкрепляют Telegram, не заменяют).
4. **«Под ключ»** — персональный расчёт: согласовать цены-ориентиры с Павлом (custom packages), в UI показываем «по запросу», но в Telegram-сообщении можем указать ориентир из памятки.
5. При переходе на Phase 2 (Google Calendar) — Павел даёт менеджерский Google-аккаунт с календарём «moreminsk-bookings», расшариваем read-only на сайт через iCal URL.

---

## Roadmap

| Этап | Что | Сроки |
|---|---|---|
| **Phase 0 (MVP)** | Wizard с 6 шагами, простой календарь без busy, Telegram + Resend (manager + client), /legal/politika стаб | До лендинга |
| **Phase 1** | A/B тест формулировок CTA, analytics deep-dive | +2 недели после запуска |
| **Phase 2** | Google Calendar iCal integration (busy-dates) | +1 месяц |
| **Phase 3** | Cal.com self-hosted или аналог (real-time bookings, admin UI для Павла) | +3 месяца |
| **Phase 4** | Платежи (ЕРИП / карта через белорусский эквайринг) | по мере роста |

---

## Открытые вопросы к заказчику

1. ✅ Wizard vs single-form — **wizard** (решено)
2. ✅ Календарь занятости — **простой, pluggable потом** (решено)
3. ✅ Депозит — **нет** (решено)
4. ✅ Email confirmation — **да, через Resend** (решено)
5. Минимальное время аренды — 1 час или 2 часа? *(предложение: 2 часа, как у конкурентов)*
6. Список поводов в Step 3 — финальный? *(текущий: Свадьба / ДР / Фотосессия / Корпоратив / Романтический вечер + «Просто аренда»)*
7. «Под ключ» — цены-ориентиры (для внутренней памятки менеджера в Telegram-уведомлении)
8. Slug сайта для email — `booking@moreminsk.by` или `hello@moreminsk.by`?
9. Workdays / рабочие часы — дни недели и часы, когда реально можно заказать
10. Что делать с заявкой на уже прошедшую дату? *(предложение: в MVP календарь дисаблит прошлые даты, далее — не важно)*

---

## Связанные документы

- [[Project Overview]] — общая карта модулей
- [[Architecture Overview]] — принципы
- [[../50 - Design/UX-паттерны#Формы — правила]] — общие правила форм
- [[42 - ADR/ADR-007 Adaptive Panel — Bottom Sheet on Mobile, Side Drawer on Desktop]] — AppPanel для контейнера
- [[42 - ADR/ADR-004 Mobile App-style Navigation (Appbar + Bottom Nav)]] — триггер bottom-nav «+»
- [[../60 - Content/Политика конфиденциальности (шаблон)]] — шаблон `/legal/politika`
- Skill: `.claude/skills/nextjs-static-export.md` — формы без API routes (Telegram + Resend)

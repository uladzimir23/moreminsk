---
description: Ограничения и паттерны Next.js static export (output export). Активируется при работе с next.config.ts, API routes, middleware, next/image, динамическими роутами.
---

# Skill: Next.js Static Export

> Проект использует `output: "export"` — это накладывает важные ограничения (см. ADR-002).

## Конфиг

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }, // обязательно с static export
  trailingSlash: false,
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
```

Результат билда — в `./out/` (не `./build/`, не `./dist/`).

## Что работает

✅ React Server Components
✅ `generateStaticParams` для динамических роутов
✅ `generateMetadata`
✅ App Router
✅ Route groups `(folder)` и private folders `_folder`
✅ `sitemap.ts` / `robots.ts`
✅ `opengraph-image.tsx` (на момент билда)
✅ `next-intl` со static export

## Что НЕ работает

❌ **API routes** (`app/api/*/route.ts`) — игнорируются при export
❌ **Middleware** (`middleware.ts`) — игнорируется
❌ **Server Actions** (`"use server"`) — не экспортируются
❌ **Dynamic routes без `generateStaticParams`** — build fails
❌ **`next/image` optimizer** — нужен `unoptimized: true`
❌ **`revalidate`, ISR** — всё статика
❌ **`cookies()`, `headers()`** в RSC — нет запроса в runtime
❌ **`rewrites()` / `redirects()` в next.config** — не работают (нужно настраивать на уровне хостинга)

## Формы без API routes

### Вариант 1 — Telegram Bot напрямую из браузера

```typescript
// src/features/booking/model/submit.ts
import type { Booking } from "@/entities/booking";
import { formatBookingForTelegram } from "./format-telegram";

export async function submitBooking(data: Booking) {
  const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
  const text = formatBookingForTelegram(data);

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  if (!res.ok) throw new Error("TELEGRAM_FAIL");
}
```

⚠️ Токен будет в клиент-бандле. Используем **read-only бот с минимальными правами** (только send в один чат). При утечке — поменяем.

### Вариант 2 — Formspree / FormKeep

Внешний сервис, URL в env, POST с form-data. Без кода.

### Вариант 3 — Вынесенный API (Vercel Function / CF Worker)

Отдельный минимальный серверлес-проект, подключается через `NEXT_PUBLIC_API_URL`.

### Вариант 4 — Resend (email only)

Библиотека + API-ключ. Также публичный токен — используем **restricted API key** только на send.

**MVP решение:** все три канала параллельно через `Promise.allSettled` — Telegram Bot (уведомление менеджеру) + Resend (email-копия менеджеру) + Resend (confirmation клиенту). Детали — `docs/40 - Architecture/Booking Module.md#Submit`.

## Динамические роуты — обязательный generateStaticParams

```typescript
// src/app/[locale]/services/[slug]/page.tsx
import { services } from "@/shared/content/services";
import { locales } from "@/shared/i18n/config";

export function generateStaticParams() {
  return locales.flatMap((locale) => services.map((service) => ({ locale, slug: service.slug })));
}

export default function ServicePage({ params }: { params: { locale: string; slug: string } }) {
  // ...
}
```

## Изображения без next/image optimizer

### Pre-build optimization через sharp

```typescript
// scripts/optimize-images.ts
import sharp from "sharp";
import { readdir } from "fs/promises";
import { join } from "path";

const SIZES = [640, 1024, 1920];
const SRC = "raw-media/";
const OUT = "public/";

async function optimize() {
  // For each .jpg/.png in SRC → generate .webp + .avif в 3 размерах
}
```

Package.json:

```json
{
  "scripts": {
    "prebuild": "tsx scripts/optimize-images.ts",
    "build": "next build"
  }
}
```

### Использование в JSX

Создать компонент `src/shared/ui/image/Image.tsx`:

```tsx
import styles from "./Image.module.scss";

interface Props {
  src: string; // базовое имя, напр. "fleet/eva-01"
  alt: string;
  eager?: boolean;
  sizes?: string;
  className?: string;
}

export function Image({ src, alt, eager, sizes, className }: Props) {
  const base = src.replace(/\.(jpg|png|webp)$/, "");
  return (
    <picture>
      <source type="image/avif" srcSet={`/${base}.avif`} />
      <source
        type="image/webp"
        srcSet={`
          /${base}@640.webp 640w,
          /${base}@1024.webp 1024w,
          /${base}.webp 1920w
        `}
        sizes={sizes}
      />
      <img
        src={`/${base}.webp`}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
```

## Middleware → клиентский редирект

Поскольку middleware недоступно, для определения локали по `Accept-Language`:

```tsx
// src/shared/ui/redirect-to-locale/RedirectToLocale.tsx
"use client";
// ...выбирает локаль из navigator.language, делает router.replace
```

Но **лучше вообще не делать auto-detect** — пусть пользователь сам кликает на флаг в хедере.

## Редиректы и rewrites — на уровне хостинга

- **Vercel:** `vercel.json` с `redirects`
- **Netlify:** `_redirects`
- **Cloudflare Pages:** `_redirects`
- **Nginx (свой VPS):** `location` блоки

Пример `vercel.json`:

```json
{
  "redirects": [
    { "source": "/old-url", "destination": "/new-url", "permanent": true },
    {
      "source": "/((?!en).*)",
      "has": [{ "type": "host", "value": "www.moreminsk.by" }],
      "destination": "https://moreminsk.by/$1",
      "permanent": true
    }
  ]
}
```

## Триггеры пересмотра решения о static export

Если появится:

- Календарь занятости с real-time — понадобится SSR или internal API
- Личный кабинет — нужна авторизация с runtime
- A/B тесты на сервере

→ Переход на SSR на Vercel или гибрид.

## Чек-лист перед билдом

- [ ] `output: "export"` в next.config
- [ ] `images: { unoptimized: true }`
- [ ] Все динамические роуты имеют `generateStaticParams`
- [ ] Нет `app/api/**/route.ts`
- [ ] Нет `middleware.ts` на корне src
- [ ] Нет `"use server"`
- [ ] Изображения оптимизированы (`bun run prebuild`)
- [ ] `.env.production` имеет все `NEXT_PUBLIC_*` переменные

## Связанные

- ADR-002: `docs/40 - Architecture/42 - ADR/ADR-002 Next.js Static Export.md`
- Build & Deploy: `docs/40 - Architecture/Build & Deploy.md`
- Routing & i18n: `docs/40 - Architecture/Routing & i18n.md`

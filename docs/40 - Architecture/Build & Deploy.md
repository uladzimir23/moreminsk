---
type: architecture
tags: [architecture, build, deploy, devops]
updated: 2026-04-16
---

# Build & Deploy

## Варианты хостинга (ранжированы)

| # | Вариант | Плюсы | Минусы | Рекомендация |
|---|---|---|---|---|
| 1 | **Vercel** (free/pro) | 1-click deploy, preview-ветки, CDN, analytics | Зависимость от вендора | ✅ Рекомендовано для старта |
| 2 | **Netlify** | 1-click deploy, формы из коробки | Ограничения free-tier | 🟡 Альтернатива |
| 3 | **Cloudflare Pages** | Очень быстрый CDN, бесплатный | Меньше инструментов | 🟡 Альтернатива |
| 4 | **Собственный VPS + Nginx** | Полный контроль, свой домен, Hetzner/Aeza | Нужна настройка CI, SSL, мониторинг | 🟡 Если есть опыт |

**Рекомендация MVP:** Vercel → после стабилизации — переезд на свой VPS (по образцу FlexGlass на Aeza), если есть бюджет/желание.

## Build

```bash
# Установка
bun install

# Разработка
bun dev

# Прод-билд (static export)
bun run build
# → ./out/ — готовые HTML/JS/CSS файлы
```

`next.config.ts`:

```typescript
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },  // static export требует
  trailingSlash: false,
  eslint: { ignoreDuringBuilds: false },
};
```

## Оптимизация изображений

`output: "export"` отключает встроенный оптимизатор Next.js. Решения:

1. **Pre-build optimization** — скрипт `scripts/optimize-images.ts` через `sharp`:
   - Генерация WebP/AVIF
   - 3 размера: mobile (640px), tablet (1024px), desktop (1920px)
   - Plumb через `<picture>` и `srcSet`
2. **CDN с трансформацией** (Cloudinary / ImageKit) — upload, отдача через параметры
3. **Статические предзаготовленные** — дизайнер отдаёт готовые WebP в 3 размерах

**Выбор MVP:** pre-build через sharp (бесплатно, предсказуемо).

## API Routes + Static Export

Next.js static export **НЕ поддерживает** API routes. Варианты для формы заявки:

| Вариант | Сложность | Стоимость |
|---|---|---|
| **Formspree** / **FormKeep** | Низкая | 0–10$/мес |
| **Telegram Bot** (прямой submit из браузера) | Низкая | 0$ |
| **Vercel Functions** (вынесенный API) | Средняя | Free-tier |
| **Cloudflare Workers** | Средняя | Free-tier |
| **Свой VPS с Node/Fastify** | Высокая | 5$/мес VPS |

**Рекомендация MVP:** прямая отправка в Telegram Bot (токен в env, проверка через капчу) + дубль в email через Resend API (free-tier 100 писем/день).

## CI/CD

### Минимальный pipeline

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint
      - run: bun run typecheck
      - run: bun run build
      # Variant A: Vercel
      - uses: amondnet/vercel-action@v25
      # Variant B: rsync на VPS
      - run: rsync -avz ./out/ user@host:/var/www/moreminsk.by/
```

### Проверки

- [x] TypeScript strict
- [x] ESLint (error → fail)
- [x] Stylelint (error → fail)
- [x] Lighthouse CI (optional, but рекомендовано)

## Мониторинг

- **Uptime:** Uptime Kuma / StatusCake / бесплатный Better Uptime
- **Ошибки браузера:** Sentry (free-tier 5000 событий)
- **Перфоманс:** Vercel Analytics / Web Vitals через Я.Метрику

## Домены и DNS

- Primary: `moreminsk.by`
- www-redirect: `www.moreminsk.by` → `moreminsk.by` (301)
- SSL: Let's Encrypt (Vercel/CF даёт автоматически; nginx — certbot)

## Переезд со старого сайта

1. **301-редиректы** со старых URL на новые — критично для SEO
   - Если структура URL меняется — составить таблицу `old → new` в [[../30 - SEO/Карта страниц]]
   - Конфиг в `vercel.json` / `_redirects` / nginx
2. **Sitemap submit** в Яндекс.Вебмастер и Google Search Console после деплоя
3. **Мониторинг позиций** по топ-20 запросам первые 2 недели ежедневно

## Связанные документы
- [[Architecture Overview]]
- [[../30 - SEO/SEO стратегия]]

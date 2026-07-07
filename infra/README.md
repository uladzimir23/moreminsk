# Production infra — more-minsk.by

Прод-домен **more-minsk.by**. Сейчас весь стек живёт на **агентском Hetzner-боксе
`89.169.54.11`** (рядом с `istok-*`, `flex-glass`, `comforthotel`) — так решено
временно, потому что у клиента пока только shared-хостинг (не VPS), а PocketBase
требует полноценный сервер. Переезд на клиентскую инфру — позже (см. ADR-012).

Сайт — статический экспорт Next.js (`output: "export"`) в Docker-образе
`nginx:alpine`, за host-nginx (HTTPS + reverse proxy). Деплой: `push в main` →
GitHub Actions → GHCR → `ssh + docker compose up` на сервере.

## Files

| Path                              | Где живёт в проде                                                 |
| --------------------------------- | ----------------------------------------------------------------- |
| `Dockerfile`                      | Bun install → Node build (`next build`) → `nginx:alpine` с `out/` |
| `infra/nginx/container.conf`      | Внутри образа (`/etc/nginx/conf.d/default.conf`)                  |
| `infra/nginx/more-minsk.by.conf`  | На сервере: `/etc/nginx/sites-enabled/more-minsk.by.conf`         |
| `infra/server/docker-compose.yml` | На сервере: `/opt/moreminsk/docker-compose.yml`                   |
| `.github/workflows/deploy.yml`    | CI: build+push образа → ssh compose up                            |

Canonical-домен — `NEXT_PUBLIC_SITE_URL` (дефолт `https://more-minsk.by` в
`src/shared/lib/seo.ts`); питает sitemap/robots/OG/canonical.

## Целевая раскладка на 89.169.54.11 (с CMS, ADR-012..014)

Порты istok заняты 3008/3009/8093 — moreminsk берёт следующие свободные (уточнить
на сервере при подъёме):

| Сервис            | Роль                 | Порт (host)      | Домен                          |
| ----------------- | -------------------- | ---------------- | ------------------------------ |
| `moreminsk`       | сайт (static export) | `127.0.0.1:3004` | `more-minsk.by` (+www)         |
| `moreminsk-admin` | admin SPA (Vite)     | `127.0.0.1:30xx` | `admin.more-minsk.by/`         |
| `moreminsk-pb`    | PocketBase           | `127.0.0.1:80xx` | `admin.more-minsk.by/api/ /_/` |

Сейчас поднят только `moreminsk`; `-admin` и `-pb` добавятся в фазах 8.2–8.4.

## First-time server setup

### 1. DNS (зона more-minsk.by на hoster.by)

Удалить Tilda-записи `45.155.60.8` и указать на бокс:

```
more-minsk.by.        A  89.169.54.11
www.more-minsk.by.    A  89.169.54.11
admin.more-minsk.by.  A  89.169.54.11   # для админки/PB (фаза 8.4)
```

Проверка: `dig +short more-minsk.by` → `89.169.54.11`.

### 2. Каталог проекта на сервере

```bash
ssh deploy@89.169.54.11 'mkdir -p /opt/moreminsk'
scp infra/server/docker-compose.yml deploy@89.169.54.11:/opt/moreminsk/
```

### 3. nginx vhost + Let's Encrypt

```bash
scp infra/nginx/more-minsk.by.conf root@89.169.54.11:/etc/nginx/sites-enabled/
ssh root@89.169.54.11 '
  nginx -t && systemctl reload nginx &&
  certbot --nginx -d more-minsk.by -d www.more-minsk.by --redirect \
    --non-interactive --agree-tos -m vova9763@gmail.com
'
```

### 4. Первый деплой

Push в `main` (или Actions → Run) → CI соберёт образ и поднимет контейнер.

## CI secrets

| Secret           | Что                                  |
| ---------------- | ------------------------------------ |
| `DEPLOY_SSH_KEY` | Приватный ключ `deploy@89.169.54.11` |

GHCR — по `GITHUB_TOKEN` (встроенный).

## Запарковано: деплой на shared-хостинг клиента (hoster.by)

Для **будущего переезда** на клиентскую инфру подготовлено:

- `infra/hosting/.htaccess` — Apache-конфиг (HTTPS, www→apex, 404, кэш, gzip) для
  раздачи статики на shared-хостинге; при переезде копируется в `public/` (или
  postbuild) → попадает в `out/`.
- Вариант деплоя через `lftp mirror` по FTP(S) — в git history (ветка была).

Данные клиентского shared-хостинга (услуга hoster.by 128622): FTP `vh122.hoster.by`,
IPv4 `93.125.99.133`, SSH-порт 22, логин `xn80apgg`. Для PocketBase потребуется
клиентский **VPS** (hoster.by «Облачные решения»), а не shared — на shared PB не
запускается.

## Legacy

До 2026-07-02 сайт жил на этом же боксе под доменом `new.moreminsk.by`. Переезд на
`more-minsk.by` — переименование vhost + DNS, образ/compose те же.

# Production infra — new.moreminsk.by

Hetzner box `89.169.54.11`, домен `new.moreminsk.by`. Static export → Docker
nginx image → host nginx reverse proxy → HTTPS.

## Files

| Path | Where it lives in prod |
| --- | --- |
| `infra/nginx/container.conf` | Внутри Docker image (`/etc/nginx/conf.d/default.conf`) — копируется Dockerfile'ом |
| `infra/nginx/new.moreminsk.by.conf` | На сервере: `/etc/nginx/sites-enabled/new.moreminsk.by.conf` |
| `infra/server/docker-compose.yml` | На сервере: `/opt/moreminsk/docker-compose.yml` |

## First-time server setup

Один раз вручную. CI после этого подхватит и будет автоматически обновлять.

### 1. DNS

На Beget/hoster.by для `moreminsk.by`:

```
new IN A 89.169.54.11
```

Пропагация ~5–30 мин. Проверка: `dig +short new.moreminsk.by`.

### 2. Каталог проекта на сервере

```bash
ssh deploy@89.169.54.11 'mkdir -p /opt/moreminsk'
scp infra/server/docker-compose.yml deploy@89.169.54.11:/opt/moreminsk/
```

### 3. nginx vhost + Let's Encrypt cert

```bash
# Скопировать vhost (как root)
scp infra/nginx/new.moreminsk.by.conf root@89.169.54.11:/etc/nginx/sites-enabled/

ssh root@89.169.54.11 '
  nginx -t &&
  systemctl reload nginx &&
  certbot --nginx -d new.moreminsk.by --redirect --non-interactive --agree-tos -m vova9763@gmail.com
'
```

certbot перепишет `new.moreminsk.by.conf` — добавит 443 server + redirect 80→443.

### 4. Первый запуск контейнера

CI ещё ничего не пушил. Можно либо подождать первый push в main, либо запулить
существующий образ если он уже есть.

```bash
ssh deploy@89.169.54.11 '
  cd /opt/moreminsk &&
  docker login ghcr.io  # personal access token с read:packages scope
  docker compose pull &&
  docker compose up -d
'
```

После — push в `main` → CI build → push image → ssh + `docker compose pull && up -d`.

## CI secrets

Установлены через `gh secret set`:

| Secret | Что |
| --- | --- |
| `DEPLOY_SSH_KEY` | Приватный ключ для `deploy@89.169.54.11`. Pubkey в `/home/deploy/.ssh/authorized_keys`. |

GHCR использует `GITHUB_TOKEN` (автоматический) — отдельный токен не нужен,
package будет привязан к репо.

## Rollback

```bash
ssh deploy@89.169.54.11 '
  cd /opt/moreminsk &&
  docker pull ghcr.io/uladzimir23/moreminsk:<previous-sha> &&
  docker tag ghcr.io/uladzimir23/moreminsk:<previous-sha> ghcr.io/uladzimir23/moreminsk:latest &&
  docker compose up -d
'
```

CI тегает каждый push двумя тегами: `latest` и `<sha>` — для быстрого rollback.

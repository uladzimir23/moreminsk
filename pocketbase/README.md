# PocketBase — бэкенд more-minsk.by (ADR-012)

БД + REST API + auth + Admin UI для CMS. Схема — зеркало content-as-code
(`web/src/shared/content/*.ts`). Сложные вложенные поля хранятся как `json`,
валидирует их Zod на билде (loader). Бинарь и `pb_data` в репо не коммитим
(`.gitignore`); source of truth схемы — `pb_migrations/*.js` (бейкаются в образ).

## Структура

| Path | Что |
| --- | --- |
| `Dockerfile` | Образ PB 0.25.9 (linux/amd64) + `pb_migrations` + `pb_hooks` |
| `pb_migrations/*.js` | Схема коллекций (авто-сгенерированы PB, коммитим) |
| `pb_hooks/` | JS-хуки PB (rebuild-webhook — фаза 8.4) |
| `scripts/download-pb.sh` | Скачать бинарь под текущую ОС (локально) |
| `pocketbase` | Бинарь (gitignored) |
| `pb_data/` | SQLite + файлы (gitignored; на сервере — volume) |

## Коллекции

`yachts` · `services` · `faq` · `documents` · `instagram_stories` ·
`certificates` (singleton) · `contacts` (singleton) · `leads` (заявки) ·
`editors` (auth, роль редактора).

Правила: контент — публичный read / запись авторизованным; `leads` — публичный
create (сабмит формы) / read авторизованным (инбокс в админке).

## Локальный запуск (dev / генерация миграций)

```bash
# 1. Бинарь
bash pocketbase/scripts/download-pb.sh

# 2. Суперюзер (локальные данные)
./pocketbase/pocketbase superuser upsert admin@more-minsk.local <pass> --dir pocketbase/pb_data

# 3. Поднять PB (--migrationsDir → авто-генерация миграций при изменении схемы)
./pocketbase/pocketbase serve --http=127.0.0.1:8090 \
  --dir pocketbase/pb_data --migrationsDir pocketbase/pb_migrations --hooksDir pocketbase/pb_hooks

# 4. Схема + роли (в другом терминале, из web/)
cd web
PB_ADMIN_EMAIL=admin@more-minsk.local PB_ADMIN_PASS=<pass> bun run pb:setup
PB_ADMIN_EMAIL=admin@more-minsk.local PB_ADMIN_PASS=<pass> \
  EDITOR_EMAIL=editor@more-minsk.local EDITOR_PASS=<pass> bun run pb:roles
```

`setup.ts` / `roles.ts` идемпотентны. После изменения схемы PB кладёт новые
`pb_migrations/*.js` — их нужно закоммитить.

## Прод (89.169.54.11, фаза 8.4)

Docker-сервис `moreminsk-pb` в `/opt/moreminsk/docker-compose.yml`, volume
`pb_data`, за host-nginx `admin.more-minsk.by` (`/api/`, `/_/`). Bootstrap
суперюзера/редактора — одноразово на сервере (значения не в git):

```bash
docker exec -it moreminsk-pb /pb/pocketbase superuser upsert <email> <pass>
```

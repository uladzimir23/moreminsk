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
| `pb_hooks/*.pb.js` | JS-хуки PB (Telegram-уведомления о заявках, rebuild-webhook) |
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

### Telegram-уведомления о заявках

Хук `pb_hooks/leads-telegram.pb.js` шлёт сообщение в TG-группу на каждую
успешно созданную запись в `leads` (сайт + ручные вставки из админки). Секреты
кладём в `/opt/moreminsk/.env` (docker-compose подхватывает через `${...}`,
в git не коммитим):

```
TG_BOT_TOKEN=8991754440:AAF...           # токен @BotFather
TG_CHAT_IDS=-5192654444                  # chat_id группы (несколько — через запятую)
PB_PUBLIC_URL=https://admin.more-minsk.by
```

После правки `.env` — `docker compose up -d moreminsk-pb`, контейнер подхватит
переменные при рестарте. Хук находится в образе (COPY в Dockerfile), поэтому
после его изменений — `docker compose build moreminsk-pb && docker compose up -d
moreminsk-pb` (или пуш в main → CI ребилдит).

Проверить локально: `TG_BOT_TOKEN=... TG_CHAT_IDS=... ./pocketbase serve ...`,
затем `curl -X POST http://127.0.0.1:8090/api/collections/leads/records -H
'Content-Type: application/json' -d '{"source":"contact","name":"Test",
"phone":"+375291234567","comment":"тест"}'` — в чате должно упасть сообщение.

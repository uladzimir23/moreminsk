---
description: Git-дисциплина проекта moreminsk.by — Conventional Commits, scope-taxonomy, фазовые коммиты, бранч-политика, pre-commit hooks. Активируется перед `git add` / `git commit` / `git push` / созданием PR / завершением фазы работ.
---

# Skill: Git workflow

## Принципы

1. **Atomic commits** — один коммит = одна связная порция работы. Нельзя мешать `feat` + `refactor` + `docs` в одном коммите.
2. **Фазовый коммит обязателен** — после каждой завершённой фазы (см. Dashboard) делаем коммит. Не оставляем «половину фазы» без коммита.
3. **Ничего не пушим без прохождения pre-commit** — никогда `--no-verify`.
4. **main защищён** — force-push на `main` запрещён. Любые rewrite-операции (`rebase`, `reset --hard`, `push --force`) — только с явного разрешения пользователя.
5. **Commit message пишем осмысленно** — «что» очевидно из diff, в сообщении — «почему» или «что это меняет в поведении».

## Формат сообщения — Conventional Commits

```
<type>(<scope>): <subject>

[optional body — "почему", 72-char wrap]

[optional footer — refs, breaking change, co-author]
```

### Типы (используем)

| Type | Когда | Пример |
|---|---|---|
| `feat` | Новая фича / компонент / виджет / страница | `feat(booking): add wizard step 3 (package selection)` |
| `fix` | Баг-фикс | `fix(panel): restore focus on close` |
| `refactor` | Рефакторинг без смены поведения | `refactor(yacht-card): extract price formatter to shared/lib` |
| `perf` | Оптимизация | `perf(images): switch hero to AVIF with WebP fallback` |
| `style` | CSS/визуал без смены логики | `style(appbar): adjust hairline border opacity for dark theme` |
| `docs` | Документация в `docs/`, ADR, README, CLAUDE.md, skills | `docs(adr): add ADR-009 analytics deferred to post-MVP` |
| `chore` | Зависимости, конфиги, build-скрипты | `chore(deps): bump next to 16.0.3` |
| `test` | Только тесты | `test(booking): cover price calculation edge cases` |
| `ci` | GitHub Actions / workflows | `ci: add stylelint to pre-push hook` |
| `build` | Build-система, bundler, next.config | `build: enable turbopack for dev` |
| `i18n` | Переводы (кастомный, удобнее чем `chore`) | `i18n(ru): reword hero lead for tone-of-voice` |
| `content` | Изменения `shared/content/*.ts` (не код, а контент-as-code) | `content(yachts): update EVA price 150→160 BYN/h` |

### Scopes — фиксированная таксономия

> Scope = **модуль FSD-слой** или **раздел docs**. Если scope не подходит — опускаем (ок для root-level изменений).

**Код:**
- `app` — app/ (layouts, pages, sitemap, robots)
- `widgets` — общий для widgets/, или конкретный widget: `widgets/appbar`, `widgets/hero`, `widgets/fleet-grid`, `widgets/price-table`, `widgets/gallery`, `widgets/faq`, `widgets/reviews`, `widgets/bottom-nav`, `widgets/app-panel`
- `features` — общий, или: `booking`, `yacht-filter`, `theme-toggle`, `locale-switcher`, `booking-cta`
- `entities` — общий, или: `yacht`, `service`, `review`, `booking` (entity-type)
- `shared` — общий, или: `shared/ui`, `shared/lib`, `shared/content`, `shared/i18n`, `shared/hooks`, `shared/config`
- `ds` — `shared/design-system/` (tokens, mixins, base) — **отдельный scope**, чаще всего трогаем именно его
- `scripts` — `scripts/` (scrape, optimize-images, generate-og)

**Документация:**
- `docs` — любой `docs/**` (можно уточнить: `docs(adr)`, `docs(seo)`, `docs(design)`, `docs(content)`)
- `adr` — для новых ADR-файлов
- `claude` — CLAUDE.md, `.claude/skills/**`, `.claude/settings*.json`

**Инфраструктура:**
- `deps` — только package.json / bun.lock
- `config` — next.config, tsconfig, eslint, stylelint, prettier, lefthook
- `i18n` — `messages/{locale}.po`

### Subject (первая строка)

- **imperative mood**: `add`, `fix`, `rename` — НЕ `added`, `fixing`
- **lowercase** (кроме имён собственных и аббревиатур: `ADR-008`, `iOS`, `SEO`)
- **без точки в конце**
- **≤ 72 символа**
- конкретика > обтекаемость: `fix(panel): close on backdrop click` лучше чем `fix(panel): minor tweak`

### Body — когда писать

Пишем body когда **неочевидно почему** или когда меняется поведение, которое увидит пользователь/другой разработчик. Иначе — не пишем.

```
feat(booking): switch submit from Telegram-only to three-channel

Telegram-only давал 0 fallback если бот лёг. Теперь через
Promise.allSettled параллельно стреляем в Telegram + Resend(manager)
+ Resend(client). Частичный успех = успех для UX (клиент не видит
технических ошибок, менеджер получит хотя бы один канал).

Refs: docs/40 - Architecture/Booking Module.md#Submit
```

Body пишем **на русском** — проект русскоязычный, заказчик русскоязычный, нет смысла в английском.

**Subject тоже можно на русском**, если так яснее. Но глаголы Conventional Commits (`feat:`, `fix:`) оставляем как есть.

### Footer

- `Refs: <path>` — ссылка на ADR или раздел docs (Obsidian-vault синтаксис тоже ок: `[[../40 - Architecture/Booking Module]]`)
- `BREAKING CHANGE: <что сломалось>` — редко, но если API публичного модуля поменялся
- `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` — для коммитов, созданных ассистентом (см. CLAUDE.md root-level)

## Фазовые коммиты — привязка к Dashboard

Каждая фаза из Dashboard.md завершается **одним или несколькими коммитами с предсказуемым scope'ом**. Не дробим фазу мелко (1 коммит = 1 файл), но и не пакуем в один мега-commit. Ориентир — 1 фаза = 3–8 коммитов.

### Phase 3.0 — Foundation (Next.js init)
- `chore(init): scaffold next.js 16 app router with typescript strict` (bun create + очистка)
- `chore(deps): add core stack (next-intl, react-hook-form, zod, framer-motion, zustand, radix, lucide)`
- `chore(config): configure eslint + stylelint + prettier + lefthook`
- `feat(ds): import flex-glass design-system (tokens, mixins, base)`
- `feat(ds): override palette with navy + sunset coral (ADR-006)`
- `feat(ds): wire manrope + lora via next/font/google (ADR-008)`
- `feat(app): add providers (theme, panel, intl) + anti-FOUC script`

### Phase 3.1 — Core widgets (navigation + shell)
- `feat(widgets/appbar): implement mobile + desktop appbar (ADR-004)`
- `feat(widgets/bottom-nav): add 5-item bottom nav with accent CTA (ADR-004)`
- `feat(widgets/app-panel): adaptive panel — sheet on mobile, drawer on desktop (ADR-007)`
- `feat(features/theme-toggle): light/dark toggle with localstorage (ADR-006)`
- `feat(features/locale-switcher): ru/en switcher via next-intl`

### Phase 3.2 — Home page MVP
- `feat(widgets/hero): animated hero with accent typography (ADR-008)`
- `feat(entities/yacht): yacht card component`
- `feat(widgets/fleet-grid): fleet section on home`
- `content(yachts): add 4 yachts (EVA/ALFA/MARIO/BRAVO)`
- `feat(app): assemble home page /[locale]`
- `feat(app): add seo metadata + json-ld for home`

### Phase 3.3 — First service page + price table
- `feat(app): add services/[slug] dynamic route`
- `feat(widgets/price-table): sticky first column + per-row CTA`
- `content(services): add svadba service page content`

### Phase 3.4 — Booking wizard (главная бизнес-фича)
- `feat(entities/booking): types + schema (zod per-step)`
- `feat(features/booking): zustand store with sessionstorage persist`
- `feat(features/booking): step 1 — yacht selection`
- `feat(features/booking): step 2 — date + duration`
- `feat(features/booking): step 3 — package`
- `feat(features/booking): step 4 — contacts`
- `feat(features/booking): step 5 — summary + consent`
- `feat(features/booking): step 6 — success`
- `feat(features/booking): submit via telegram + resend (promise.allSettled)`
- `feat(features/booking): pluggable availability provider (mvp stub)`

### Phase 4 — Service pages tiraj (15+)
Один коммит на пачку из 3–5 страниц: `content(services): add den-rozhdeniya + korporativ + fotosessiya`.

### Phase 5 — Gallery / Reviews / FAQ
- `feat(widgets/gallery): lightbox via app-panel mode gallery`
- `feat(widgets/reviews): stub reviews + schema Review`
- `feat(widgets/faq): accordion + jsonld faqpage`

### Phase 6 — Booking availability (post-MVP)
- `feat(booking): wire google calendar ical availability provider` (и т.д.)

### Phase 7 — Deploy + SEO
- `build: enable static export (output: export)`
- `ci: add github actions build + deploy workflow`
- `feat(scripts): generate og images on build (satori)`
- `feat(app): add sitemap.ts + robots.ts`

## Правила перед коммитом

**Всегда:**
1. Запусти `bun run typecheck` — должно пройти
2. Запусти `bun run lint` — должно пройти (ESLint + Stylelint)
3. Прочитай `git status` + `git diff` — нет ли случайных файлов (`.env`, `raw-media/`, `out/`, `node_modules/`, `.DS_Store`)
4. Убедись что в staging только то, что относится к коммиту (не мешаем фичи)

**Если pre-commit hook упал:**
- **НЕ используем `--no-verify`**
- Исправляем причину (lint error, typecheck error)
- Создаём **новый** коммит (не amend — hook-fail означает что предыдущего коммита вообще нет)

## Стейджинг — точечно

Избегаем `git add .` / `git add -A` — случайно утянем `.env.local`, `raw-media/*`, сгенерированные файлы. Добавляем по имени или директории:

```bash
# хорошо
git add src/features/booking/ui/steps/StepYacht.tsx src/features/booking/ui/steps/StepYacht.module.scss

# приемлемо (папка фичи)
git add src/features/booking/

# плохо
git add .
```

## Бранч-политика

**MVP** — работаем на `main`. Feature-ветки не используем (избыточно для проекта с одним разработчиком + ассистентом).

**После запуска** — переходим на `main` + `feat/*` для крупных фич, через PR даже в одиночку (для review-discipline и CI-прогонов).

## Push-политика

- `git push origin main` — после каждой сессии с реальной работой (не держим локальные коммиты > 1 дня)
- `--force` / `--force-with-lease` на `main` — **запрещено**. Если нужно отменить — делаем `revert`, не переписываем историю.
- На фиче-ветках (после MVP) `--force-with-lease` ок.

## Стоп-слова в коммит-месседжах

❌ `fix stuff`, `wip`, `updates`, `asdf`, `final`, `finalfinal`
❌ `🚀 ship it`, эмодзи в subject
❌ Личные заметки: `TODO fix later`, `хак, потом поправлю`

✅ Конкретное действие: `fix(booking): prevent double submit on slow network`

## Коммиты от ассистента

Когда коммит делает Claude Code:
- Добавляем footer:
  ```
  Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
  ```
- **Перед коммитом всегда спрашиваем** пользователя подтверждение (если не было явной инструкции «коммить сам»).
- После успешного коммита делаем `git status` — убедиться что staging пустой.

### HEREDOC для многострочных сообщений

```bash
git commit -m "$(cat <<'EOF'
feat(booking): submit via three-channel with promise.allSettled

Параллельно стреляем в Telegram Bot + Resend(manager) + Resend(client).
Частичный успех считаем успехом для UX — клиент не видит технических
ошибок, менеджер получит хотя бы один канал.

Refs: docs/40 - Architecture/Booking Module.md#Submit

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

## .gitignore — что обязательно исключено

Проверить что эти паттерны в `.gitignore` до первого коммита:

```
# Dependencies
node_modules/
.pnp.*
.yarn/

# Build outputs
/out/
/.next/
/dist/

# Env
.env*
!.env.example

# Claude Code local
.claude/settings.local.json
.claude/hooks/*.local.*

# Scraped raw media (не пушим — большие, юридически серые)
raw-media/
scripts/scrape-output/

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Testing
/coverage/
/.nyc_output/

# Logs
*.log
npm-debug.log*
```

## Связанные

- `CLAUDE.md` — root-level правила проекта
- `docs/00 - Indexes/Dashboard.md` — фазы работ для привязки коммитов
- `docs/40 - Architecture/Build & Deploy.md` — CI/CD
- Глобальные правила безопасности git — system prompt Claude Code (force-push, --no-verify, amend-rules)

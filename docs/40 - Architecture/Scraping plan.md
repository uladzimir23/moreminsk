---
type: architecture
tags: [architecture, scraping, media, migration, content]
updated: 2026-04-17
---

# Scraping plan — миграция контента с действующего moreminsk.by

> Решение 2026-04-17: **фото и контент парсим с текущего сайта** `moreminsk.by` + Instagram `@moreminsk.by`. Видео — архитектурно закладываем, реализация позже.
>
> Цель — наполнить MVP реальным контентом без ожидания ручной выгрузки от Павла.

---

## Что парсим

### 1. Фото яхт — для `public/fleet/*`

**Источник:** `https://moreminsk.by/fleet/` (или аналогичный раздел на старом сайте).

**Что нужно:**
- По каждой яхте (EVA, ALFA, MARIO, BRAVO) — все фото в максимальном качестве (JPEG/PNG).
- Минимум: 1 hero-shot (16:9), 4–6 превью (3:4 или 4:3), 2–3 интерьерных.
- Имена файлов после парсинга: `eva-hero.jpg`, `eva-01.jpg`, ..., `eva-int-01.jpg`.

### 2. Галерея мероприятий — для `public/gallery/*`

**Источники:**
- Раздел «Галерея» / «Наши мероприятия» на moreminsk.by
- **Instagram `@moreminsk.by`** — последние 50–100 постов (если публичный аккаунт)

**Что нужно:**
- Фото разных мероприятий (свадьба, ДР, корпоратив, фотосессия, романтический вечер).
- Именование после парсинга: `gallery-wedding-2024-06-001.jpg`, `gallery-birthday-2024-08-003.jpg`. Если дата неизвестна — `gallery-wedding-001.jpg`.
- Теги: по типу мероприятия — для фильтрации в `widgets/gallery`.

### 3. Тексты — для `shared/content/*.ts`

**Источник:** страницы услуг и яхт на moreminsk.by.

**Что нужно:**
- Описания каждой яхты (тип, длина, вместимость, особенности) — в `content/yachts.ts`
- Цены (час / полдня / день / ночь) — в `content/yachts.ts`
- Описания услуг (свадьба, ДР, фотосессия и т.д.) — в `content/services.ts`
- FAQ — если есть на сайте — в `content/faq.ts`
- Контактные данные, расписание — в `shared/config/site.ts`

**НЕ копируем дословно** — переписываем под наш tone-of-voice (см. `docs/20 - Market/Позиционирование.md#Tone-of-Voice`), убираем штампы, оптимизируем под семантику (см. `docs/30 - SEO/Семантическое ядро.md`). Парсинг даёт **факты**, а не готовые тексты.

### 4. Видео — архитектура без реализации

**Решение:** видео закладываем в архитектуру, но **не парсим и не хостим в MVP**.

**Архитектурный задел:**
- Поле `videoUrl?: string` в `entities/yacht/model/types.ts` — уже есть
- `<VideoPlayer />` компонент в `shared/ui/` — **пока не делаем**, только забронировано место в `types.ts`
- `widgets/hero` может опционально принимать `videoSrc` — реализуем когда появятся видео

**Источники в будущем:**
- Instagram Reels @moreminsk.by
- YouTube-канал если заведётся
- Дроновые съёмки от фотографов-партнёров

---

## Инструменты

### Скрипт `scripts/scrape-moreminsk.ts`

**Технология:** **Playwright** (headless Chromium) — лучше чем cheerio/puppeteer для современных SPA.

**Почему Playwright:**
- JavaScript-rendering (если moreminsk.by на React/Vue — cheerio не увидит контент)
- Snapshot-mode для скачивания всей страницы целиком
- Удобный API для iteration по ссылкам
- TypeScript из коробки

**Альтернатива:** если moreminsk.by на чистом PHP/HTML — можно обойтись `cheerio` + `axios` (быстрее).

### Скрипт `scripts/scrape-instagram.ts`

**Технология:** **без официального API** (Facebook Graph API для бизнес-аккаунтов требует ревью приложения).

**Варианты:**
1. **instagram-private-api** (npm) — использует web-эндпоинты Instagram. Рискованно (ban-able), но работает.
2. **Ручной экспорт через Instagram Data Download** — Павел экспортирует свой архив через Instagram → Settings → Download Your Information, мы парсим `.zip` локально. **Безопаснее**, но требует действия от Павла.
3. **Apify Instagram Scraper** (платный, $5–10 за прогон) — самый надёжный, но требует аккаунт Apify.

**Решение на MVP:** предложим Павлу **ручной экспорт** (вариант 2). Один раз выгружает архив → мы парсим локально → фотки попадают в `public/gallery/`. Instagram-контент обновляется редко (раз в несколько месяцев) — ручной экспорт по запросу приемлем.

### Скрипт `scripts/optimize-images.ts`

**Технология:** **sharp** (уже в плане — см. `Структура проекта.md`).

**Что делает:**
- Читает из `raw-media/` (исходники с парсинга)
- Конвертирует в 3 размера (640 / 1024 / 1920 px по ширине)
- Генерирует WebP + AVIF + fallback JPEG
- Кладёт в `public/fleet/<yacht-slug>/`, `public/gallery/<category>/`
- Создаёт манифест `public/media-manifest.json` с размерами и путями

```ts
// Упрощённый pipeline
for (const file of glob('raw-media/**/*.{jpg,png}')) {
  for (const width of [640, 1024, 1920]) {
    await sharp(file)
      .resize({ width })
      .webp({ quality: 82 })
      .toFile(`public/${slug(file)}-${width}.webp`);
    await sharp(file)
      .resize({ width })
      .avif({ quality: 65 })
      .toFile(`public/${slug(file)}-${width}.avif`);
    await sharp(file)
      .resize({ width })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(`public/${slug(file)}-${width}.jpg`);
  }
}
```

**Запускается** через `bun run prebuild` перед `next build`. Не запускается при dev (dev режим использует `raw-media/` напрямую).

---

## Workflow

```
1. Павел отдаёт доступ к moreminsk.by (в т.ч. админка если есть)
   + запускает экспорт Instagram (Data Download)
          │
          ▼
2. bun run scrape:moreminsk
   → raw-media/scraped/fleet/*, raw-media/scraped/gallery/*
   → raw-media/scraped/texts.json (тексты + цены для review)
          │
          ▼
3. Ручной review:
   - отсеиваем дубли, размытые кадры, неудачные фото
   - переписываем тексты под tone-of-voice
   - заполняем src/shared/content/*.ts
          │
          ▼
4. bun run optimize-images
   → public/fleet/*, public/gallery/* (WebP + AVIF + JPEG × 3 размера)
          │
          ▼
5. git commit "content: migrate yacht photos + texts from moreminsk.by"
```

---

## Правовые аспекты

### Фото

**Риск:** на старом сайте могут быть фото фотографов-партнёров без явной передачи авторских прав.

**Решение:**
- Презюмируем что Павел владеет правами на фото его яхт (это его бизнес, он заказывал съёмку).
- Для фото с мероприятий — **спрашиваем Павла** у кого права (гости/фотографы мероприятия). Если сомневаемся — не используем без явного разрешения.
- Фото с Instagram — ручной архив Павла содержит только его посты. Безопасно.

### Тексты

**Риск:** тексты на moreminsk.by могут быть написаны копирайтером по договору с передачей прав Павлу.

**Решение:** мы **переписываем**, не копируем дословно. Новый текст — оригинальный, без риска.

### Instagram

**Риск:** scraping Instagram без разрешения пользователя нарушает их TOS.

**Решение:** используем **только архив Павла** через Data Download. Это его данные, legally clean.

---

## Fallback-план

**Если парсинг не удался или даёт плохое качество:**

1. **Просим Павла выгрузить фото** напрямую — через Google Drive / Dropbox / Telegram. Договариваемся о single shared folder `moreminsk-media` с подпапками `fleet/eva/`, `fleet/alfa/`, `gallery/weddings/`, и т.д.
2. **Стоковые фото временно** — на hero/illustrations используем Unsplash/Pexels (с атрибуцией), до получения реальных. В MVP это допустимо для hero-блоков «как может выглядеть ваше мероприятие».
3. **AI-upscaling** (Topaz Photo AI) — если фото с moreminsk.by в низком разрешении, апскейлим через AI. Осторожно с артефактами.

---

## Что я могу сделать сам

При доступе к URL `moreminsk.by` через `WebFetch`:

- [ ] Посмотреть структуру страниц флота/галереи/услуг
- [ ] Выгрузить все URL изображений
- [ ] Спарсить текстовый контент для анализа
- [ ] Сформировать `raw-media/urls.json` со списком URL

При этом **сам файлы качать не могу** (нет `fetch binary → disk` тула). Для этого нужен запуск `scripts/scrape-moreminsk.ts` локально — либо Павел даёт доступ к серверу, либо он сам запускает скрипт у себя (Node.js + Playwright не у всех установлены).

**Альтернатива — ручной approach:**
1. Я анализирую moreminsk.by через WebFetch
2. Составляю карту всех нужных URL изображений
3. Ты (или Павел) качаешь пачкой через `wget` или downloader-расширение Chrome
4. Кладёшь в `raw-media/` и запускаешь `bun run optimize-images`

---

## Implementation checklist

- [ ] Выяснить у Павла: есть ли доступ к админке moreminsk.by (FTP/CMS)?
- [ ] Выяснить: готов ли Павел сделать Instagram Data Download (10 минут, ничего не поломает)?
- [ ] Установить Playwright в devDependencies: `bun add -d playwright`
- [ ] Написать `scripts/scrape-moreminsk.ts` (первая версия — dump всех `<img>` URL)
- [ ] Создать `raw-media/.gitignore` (не коммитим исходники)
- [ ] Написать `scripts/optimize-images.ts` (sharp pipeline)
- [ ] Добавить в `package.json`:
  ```json
  "scripts": {
    "scrape:moreminsk": "bun scripts/scrape-moreminsk.ts",
    "scrape:instagram": "bun scripts/parse-instagram-archive.ts",
    "optimize-images": "bun scripts/optimize-images.ts",
    "prebuild": "bun run optimize-images"
  }
  ```
- [ ] Первый прогон + ручной review результата
- [ ] Заполнить `content/yachts.ts` реальными данными

---

## Связанные документы

- [[Структура проекта]] — где лежат скрипты и public/
- [[Project Overview]] — модуль Media pipeline в shared/
- [[../50 - Design/Медиа-стратегия]] — требования к фото/видео
- [[Build & Deploy]] — prebuild в CI/CD
- [[../30 - SEO/SEO стратегия]] — alt-теги, имена файлов для SEO

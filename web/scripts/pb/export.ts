/**
 * Prebuild-экспорт PocketBase → JSON-снапшот (ADR-012, static+rebuild). Лоадеры
 * читают снапшот синхронно на билде. Фото остаются в web/public/ (пути хранятся
 * в записях), поэтому здесь только дамп данных — без скачивания файлов.
 *
 * Запуск (PB на :8090): PB_URL=… bun scripts/pb/export.ts
 * Пишет в web/.pb/<collection>.json (gitignored — генерится на билде).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import PocketBase from "pocketbase";

const URL = process.env.PB_URL ?? "http://127.0.0.1:8090";
const OUT = path.resolve(process.cwd(), ".pb");

const pb = new PocketBase(URL);
pb.autoCancellation(false);

// PB-запись → чистый объект: убираем системные и служебные поля.
function clean(r: Record<string, unknown>): Record<string, unknown> {
  const out = { ...r };
  for (const k of [
    "id",
    "collectionId",
    "collectionName",
    "created",
    "updated",
    "expand",
    "order",
    "published",
  ]) {
    delete out[k];
  }
  return out;
}

const LISTS = ["yachts", "services", "faq", "documents", "instagram_stories"] as const;
const SINGLETONS = ["certificates", "contacts"] as const;

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const name of LISTS) {
    const raw = await pb
      .collection(name)
      .getFullList({ sort: "order", filter: "published = true" });
    const items = raw.map(clean);
    fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(items, null, 2));
    console.log(`✓ ${name}: ${items.length} → .pb/${name}.json`);
  }

  for (const name of SINGLETONS) {
    const raw = await pb.collection(name).getFullList();
    const obj = raw.length ? clean(raw[0]) : null;
    fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(obj, null, 2));
    console.log(`✓ ${name}: singleton → .pb/${name}.json`);
  }

  console.log("done");
}

main().catch((e) => {
  console.error("✗", e?.message ?? e);
  process.exit(1);
});

/**
 * Добавляет file-поле `photos` (множественное) в коллекцию yachts (ADR-013).
 * Идемпотентно — PB авто-генерирует incremental-миграцию. Запуск:
 *   PB_ADMIN_EMAIL=admin@more-minsk.local PB_ADMIN_PASS=… bun scripts/pb/add-photos-field.ts
 */
import PocketBase from "pocketbase";

const URL = process.env.PB_URL ?? "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL ?? "admin@more-minsk.local";
const PASS = process.env.PB_ADMIN_PASS ?? "";

const pb = new PocketBase(URL);
pb.autoCancellation(false);

async function main() {
  if (!PASS) throw new Error("PB_ADMIN_PASS не задан");
  await pb.collection("_superusers").authWithPassword(EMAIL, PASS);

  const col = await pb.collections.getOne("yachts");
  const fields = col.fields as Array<{ name: string }>;
  if (fields.some((f) => f.name === "photos")) {
    console.log("• photos уже есть");
    return;
  }
  await pb.collections.update("yachts", {
    fields: [
      ...fields,
      {
        name: "photos",
        type: "file",
        maxSelect: 12,
        maxSize: 5_242_880,
        mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
        thumbs: ["320x320"],
      },
    ],
  });
  console.log("✓ photos (file, до 12) добавлено в yachts");
}

main().catch((e) => {
  console.error("✗", e?.message ?? e);
  process.exit(1);
});

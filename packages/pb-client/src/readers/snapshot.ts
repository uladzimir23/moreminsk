import fs from "node:fs";
import path from "node:path";
import type { ZodType } from "zod";

// Путь до .pb — считаем от process.cwd() (внутри apps/site при билде/деве).
// Переопределяется через PB_SNAPSHOT_DIR (для тестов).
const SNAPSHOT_DIR = process.env.PB_SNAPSHOT_DIR
  ? path.resolve(process.env.PB_SNAPSHOT_DIR)
  : path.resolve(process.cwd(), ".pb");

/**
 * Синхронно читает `.pb/<collection>.json`, валидирует через zod-схему.
 * Кидает исключение если файл не найден — snapshot должен генерироваться
 * до билда (см. `bun run pb:export`).
 */
export function readSnapshot<T>(collection: string, schema: ZodType<T>): T {
  const file = path.join(SNAPSHOT_DIR, `${collection}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(
      `[pb-client] snapshot not found: ${file}. Run \`bun run pb:export\` before building.`,
    );
  }
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  return schema.parse(raw);
}

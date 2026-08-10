/**
 * prebuild-хук перед `next build`.
 *
 * Порядок fallback'ов:
 *   1. PB_URL задан → тянем свежий снапшот + кодогенерим content/*.ts.
 *   2. .pb/*.json уже есть → просто кодогенерим из cached снапшота.
 *   3. content/*.ts уже закоммичены → ничего не делаем, продолжаем билд.
 *   4. Ничего нет → ошибка.
 */
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(process.cwd());
const SNAP = path.join(ROOT, ".pb");
const CONTENT = path.join(ROOT, "src/shared/content");

const HAS_PB_URL = !!process.env.PB_URL;
const HAS_SNAPSHOT = fs.existsSync(SNAP) && fs.readdirSync(SNAP).some((f) => f.endsWith(".json"));
const HAS_CONTENT =
  fs.existsSync(CONTENT) &&
  fs
    .readdirSync(CONTENT)
    .some(
      (f) =>
        f.endsWith(".ts") &&
        fs.readFileSync(path.join(CONTENT, f), "utf8").includes("AUTO-GENERATED"),
    );

function run(cmd: string, args: string[]): void {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

if (HAS_PB_URL) {
  console.log(`▸ pb:export from ${process.env.PB_URL}`);
  run("bun", ["scripts/pb/export.ts"]);
  console.log("▸ pb:codegen");
  run("bun", ["scripts/pb/codegen.ts"]);
} else if (HAS_SNAPSHOT) {
  console.log("▸ pb:codegen из cached .pb/*.json (PB_URL не задан)");
  run("bun", ["scripts/pb/codegen.ts"]);
} else if (HAS_CONTENT) {
  console.log("▸ prebuild skipped: content/*.ts закоммичены, .pb/ и PB_URL отсутствуют");
} else {
  console.error(
    "✗ prebuild: ни PB_URL, ни .pb/, ни закоммиченные content/*.ts. Запусти `bun run pb:refresh` с PB_URL в .env.local.",
  );
  process.exit(1);
}

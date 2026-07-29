import type { CollectionCfg } from "./collections";
import { pb } from "./pb";

// Создаёт черновик (published:false) с плейсхолдерами под required-поля, чтобы
// сразу открыть редактор с id — тогда работает загрузка фото (PhotoUploader).
export async function createDraft(cfg: CollectionCfg): Promise<string> {
  const ts = Date.now().toString(36);
  const payload: Record<string, unknown> = { published: false };
  for (const f of cfg.fields) {
    if (!f.required) continue;
    if (f.name === "slug" || f.name === "key") payload[f.name] = `novyy-${ts}`;
    else if (f.type === "number") payload[f.name] = 0;
    else if (f.type === "select") payload[f.name] = f.options?.[0] ?? "";
    else payload[f.name] = "—";
  }
  const rec = await pb.collection(cfg.name).create(payload);
  return rec.id;
}

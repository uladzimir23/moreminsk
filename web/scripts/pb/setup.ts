/**
 * Создаёт коллекции PocketBase — зеркало content-as-code (ADR-012, фаза 8.2).
 * Идемпотентно: существующие пропускает. Сложные вложенные поля (specs, gallery,
 * features, address, …) — тип json; форму валидирует Zod на билде (loader), PB
 * хранит как JSON. Так схема PB простая и стабильная.
 *
 * Запуск (PB поднят на :8090):
 *   PB_ADMIN_EMAIL=admin@more-minsk.local PB_ADMIN_PASS=… bun scripts/pb/setup.ts
 *
 * После прогона PB (с --migrationsDir) авто-генерирует pb_migrations/*.js —
 * их коммитим (source of truth схемы, бейкается в образ). См. pocketbase/README.
 */
import PocketBase from "pocketbase";

const URL = process.env.PB_URL ?? "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL ?? "admin@more-minsk.local";
const PASS = process.env.PB_ADMIN_PASS ?? "";

const pb = new PocketBase(URL);
pb.autoCancellation(false);

const T = (name: string, extra: Record<string, unknown> = {}) => ({
  name,
  type: "text",
  ...extra,
});
const NUM = (name: string, extra: Record<string, unknown> = {}) => ({
  name,
  type: "number",
  ...extra,
});
const JSON_ = (name: string, required = false) => ({
  name,
  type: "json",
  required,
  maxSize: 2_000_000,
});
const BOOL = (name: string) => ({ name, type: "bool" });
const SELECT = (name: string, values: string[], required = true) => ({
  name,
  type: "select",
  required,
  maxSelect: 1,
  values,
});

// Контентные коллекции: публичный read (билд читает без авторизации), запись —
// суперюзер через API (write-правила навешивает roles.ts для editor). leads —
// особый случай: публичный create (сабмит формы), read — только авторизованным.
const COLLECTIONS = [
  {
    name: "yachts",
    type: "base",
    fields: [
      T("slug", { required: true }),
      T("name", { required: true }),
      SELECT("type", ["sail", "motor", "sail-motor"]),
      NUM("capacity", { required: true }),
      NUM("lengthMeters"),
      NUM("pricePerHour", { required: true }),
      NUM("minHours"),
      T("description"),
      JSON_("features"),
      JSON_("suitableFor"),
      JSON_("gallery"),
      T("mainImage"),
      T("video"),
      JSON_("specs"),
      SELECT("badge", ["flagship", "new"], false),
      NUM("order"),
      BOOL("published"),
    ],
    indexes: ["CREATE UNIQUE INDEX `idx_yachts_slug` ON `yachts` (`slug`)"],
  },
  {
    name: "services",
    type: "base",
    fields: [
      T("slug", { required: true }),
      T("h1", { required: true }),
      T("shortTitle"),
      T("utp"),
      T("icon"),
      NUM("fromPrice"),
      JSON_("suitableYachts"),
      NUM("order"),
      BOOL("published"),
    ],
    indexes: ["CREATE UNIQUE INDEX `idx_services_slug` ON `services` (`slug`)"],
  },
  {
    name: "faq",
    type: "base",
    fields: [
      T("key", { required: true }),
      T("question", { required: true }),
      T("answer", { required: true }),
      JSON_("bullets"),
      JSON_("tags"),
      NUM("order"),
      BOOL("published"),
    ],
    indexes: ["CREATE UNIQUE INDEX `idx_faq_key` ON `faq` (`key`)"],
  },
  {
    name: "documents",
    type: "base",
    fields: [
      T("slug", { required: true }),
      T("title", { required: true }),
      T("lead"),
      JSON_("paragraphs", true),
      NUM("order"),
      BOOL("published"),
    ],
    indexes: ["CREATE UNIQUE INDEX `idx_documents_slug` ON `documents` (`slug`)"],
  },
  {
    name: "instagram_stories",
    type: "base",
    fields: [
      T("key", { required: true }),
      T("cover"),
      T("caption"),
      T("author"),
      T("date"),
      T("url"),
      NUM("order"),
      BOOL("published"),
    ],
    indexes: ["CREATE UNIQUE INDEX `idx_ig_key` ON `instagram_stories` (`key`)"],
  },
  // Синглтоны — одна запись; редактор правит поля-группы (json).
  {
    name: "certificates",
    type: "base",
    fields: [
      NUM("priceFrom"),
      T("season"),
      T("lead"),
      JSON_("offer"),
      JSON_("photos"),
      JSON_("photoAlts"),
      JSON_("faq"),
    ],
    indexes: [],
  },
  {
    name: "contacts",
    type: "base",
    fields: [
      JSON_("phones"),
      JSON_("email"),
      JSON_("telegram"),
      JSON_("instagram"),
      JSON_("viber"),
      JSON_("address"),
      JSON_("legal"),
    ],
    indexes: [],
  },
] as const;

// leads: публичный create (сабмит формы), read/список — только авторизованным.
const LEADS = {
  name: "leads",
  type: "base",
  fields: [
    T("name"),
    T("phone"),
    T("service"),
    T("yacht"),
    T("date"),
    NUM("guests"),
    T("comment"),
    T("source"),
    SELECT("status", ["new", "contacted", "closed"], false),
  ],
  indexes: [],
} as const;

async function main() {
  if (!PASS) throw new Error("PB_ADMIN_PASS не задан");
  await pb.collection("_superusers").authWithPassword(EMAIL, PASS);
  console.log("✓ авторизован суперюзером");

  for (const col of COLLECTIONS) {
    const existing = await pb.collections.getList(1, 1, {
      filter: `name="${col.name}"`,
    });
    if (existing.totalItems > 0) {
      console.log(`• ${col.name} уже есть — пропускаю`);
      continue;
    }
    await pb.collections.create({
      ...col,
      listRule: "", // публичный read для билда
      viewRule: "",
      createRule: null, // запись — суперюзер/editor (roles.ts)
      updateRule: null,
      deleteRule: null,
    });
    console.log(`✓ создана коллекция ${col.name}`);
  }

  // leads — отдельные правила.
  const leadsExists = await pb.collections.getList(1, 1, {
    filter: `name="leads"`,
  });
  if (leadsExists.totalItems === 0) {
    await pb.collections.create({
      ...LEADS,
      createRule: "", // любой может оставить заявку
      listRule: null, // читать — только авторизованным (roles.ts откроет editor)
      viewRule: null,
      updateRule: null,
      deleteRule: null,
    });
    console.log("✓ создана коллекция leads");
  } else {
    console.log("• leads уже есть — пропускаю");
  }

  console.log("done");
}

main().catch((e) => {
  console.error("✗", e?.message ?? e);
  process.exit(1);
});

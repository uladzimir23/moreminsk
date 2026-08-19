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

// PB 0.23+: created/updated не автоматические — добавляем autodate явно, иначе
// sort по created/updated падает (напр. инбокс заявок sort "-created").
const AUTODATE = [
  { name: "created", type: "autodate", onCreate: true, onUpdate: false },
  { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
];

// File-поле для загрузки фото (ADR-013). thumbs — превью для админки.
const FILE = (name: string, maxSelect = 12) => ({
  name,
  type: "file",
  maxSelect,
  maxSize: 5_242_880,
  mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  thumbs: ["320x320"],
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
      FILE("photos"),
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

// bookings: занятость слотов (yacht × date × start-end). PII (телефон, имя)
// защищены: read/list закрыт для публики (только editor), сайт читает view
// `availability` без PII. Импорт xlsx-архива → source: "excel-2026", archived:
// true для прошедших дат.
const BOOKINGS = {
  name: "bookings",
  type: "base",
  fields: [
    {
      name: "yacht",
      type: "relation",
      required: true,
      maxSelect: 1,
      collectionId: "" /* заполним ниже — id коллекции yachts */,
      cascadeDelete: false,
    },
    T("date", { required: true }), // YYYY-MM-DD
    T("start", { required: true }), // HH:MM (30-min гранулярность)
    T("end", { required: true }),
    SELECT("status", ["booked", "blocked", "tentative"]),
    T("client_name"),
    T("client_phone"),
    NUM("guests"),
    NUM("price_total"),
    NUM("prepaid"),
    T("pay_note"),
    T("source"), // site / manual / import / referral
    T("source_agent"), // юность / сливки / рцоп / робинсон / …
    T("comment"),
    {
      name: "lead",
      type: "relation",
      required: false,
      maxSelect: 1,
      collectionId: "" /* заполним ниже — id коллекции leads */,
      cascadeDelete: false,
    },
    BOOL("archived"),
  ],
  indexes: [
    "CREATE INDEX `idx_bookings_yacht_date` ON `bookings` (`yacht`, `date`)",
    "CREATE INDEX `idx_bookings_date` ON `bookings` (`date`)",
  ],
} as const;

// availability: view (SQL SELECT) — публичный read БЕЗ PII. Сайт использует
// для отображения свободных слотов в форме бронирования.
const AVAILABILITY = {
  name: "availability",
  type: "view",
  viewQuery:
    "SELECT id, yacht, date, start, end, status, archived FROM bookings WHERE archived = false",
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
      fields: [...col.fields, ...AUTODATE],
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
      fields: [...LEADS.fields, ...AUTODATE],
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

  // bookings — read закрыт (PII), write — editor через roles.ts. Нужны
  // id-коллекции yachts + leads для relation-полей.
  const bookingsExists = await pb.collections.getList(1, 1, {
    filter: `name="bookings"`,
  });
  if (bookingsExists.totalItems === 0) {
    const yachtsCol = await pb.collections.getFirstListItem(`name="yachts"`);
    const leadsCol = await pb.collections.getFirstListItem(`name="leads"`);
    const fields = BOOKINGS.fields.map((f) => {
      if (f.name === "yacht") return { ...f, collectionId: yachtsCol.id };
      if (f.name === "lead") return { ...f, collectionId: leadsCol.id };
      return f;
    });
    await pb.collections.create({
      name: BOOKINGS.name,
      type: BOOKINGS.type,
      fields: [...fields, ...AUTODATE],
      indexes: [...BOOKINGS.indexes],
      listRule: null, // публично не читаем — PII; сайт читает view `availability`
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
    });
    console.log("✓ создана коллекция bookings");
  } else {
    console.log("• bookings уже есть — пропускаю");
  }

  // availability — view collection: публичный read без PII.
  const availExists = await pb.collections.getList(1, 1, {
    filter: `name="availability"`,
  });
  if (availExists.totalItems === 0) {
    await pb.collections.create({
      name: AVAILABILITY.name,
      type: AVAILABILITY.type,
      viewQuery: AVAILABILITY.viewQuery,
      listRule: "", // публично
      viewRule: "",
    });
    console.log("✓ создана view-коллекция availability");
  } else {
    console.log("• availability уже есть — пропускаю");
  }

  console.log("done");
}

main().catch((e) => {
  console.error("✗", e?.message ?? e);
  process.exit(1);
});

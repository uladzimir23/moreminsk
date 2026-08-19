/**
 * Роль «editor» (ADR-013): auth-коллекция `editors` для заказчика + write-правила
 * на контентные коллекции только для авторизованных. Публичный read для билда
 * сохраняется. leads — открываем read авторизованным (инбокс заявок в админке).
 *
 * Запуск (PB на :8090):
 *   PB_ADMIN_EMAIL=admin@more-minsk.local PB_ADMIN_PASS=… bun scripts/pb/roles.ts
 * Опционально создаёт editor-пользователя:
 *   … EDITOR_EMAIL=editor@more-minsk.local EDITOR_PASS=… bun scripts/pb/roles.ts
 */
import PocketBase from "pocketbase";

const URL = process.env.PB_URL ?? "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL ?? "admin@more-minsk.local";
const PASS = process.env.PB_ADMIN_PASS ?? "";
const EDITOR_EMAIL = process.env.EDITOR_EMAIL;
const EDITOR_PASS = process.env.EDITOR_PASS;

const pb = new PocketBase(URL);
pb.autoCancellation(false);

// Запись — авторизованным (editor или superuser-через-API); read — публичный.
const WRITE = '@request.auth.id != ""';

// Контентные коллекции — публичный read, запись авторизованным.
const CONTENT = [
  "yachts",
  "services",
  "faq",
  "documents",
  "instagram_stories",
  "certificates",
  "contacts",
];

// bookings — read закрыт (PII), write — editor. Сайт читает view `availability`.
const BOOKINGS_RULES = {
  listRule: WRITE,
  viewRule: WRITE,
  createRule: WRITE,
  updateRule: WRITE,
  deleteRule: WRITE,
};

async function main() {
  if (!PASS) throw new Error("PB_ADMIN_PASS не задан");
  await pb.collection("_superusers").authWithPassword(EMAIL, PASS);
  console.log("✓ авторизован");

  // 1. Коллекция editors (auth). Редактор не самрегистрируется — заводит админ.
  const exists = await pb.collections.getList(1, 1, {
    filter: 'name="editors"',
  });
  if (exists.totalItems === 0) {
    await pb.collections.create({
      name: "editors",
      type: "auth",
      fields: [{ name: "name", type: "text" }],
      createRule: null,
      listRule: "@request.auth.id = id",
      viewRule: "@request.auth.id = id",
      updateRule: "@request.auth.id = id",
      deleteRule: null,
      passwordAuth: { enabled: true, identityFields: ["email"] },
    });
    console.log("✓ коллекция editors создана");
  } else {
    console.log("• editors уже есть");
  }

  // 2. Write-правила на контент.
  for (const name of CONTENT) {
    await pb.collections.update(name, {
      listRule: "",
      viewRule: "",
      createRule: WRITE,
      updateRule: WRITE,
      deleteRule: WRITE,
    });
    console.log(`✓ ${name}: write-правила для авторизованных`);
  }

  // 3. leads — публичный create, read/апдейт статуса авторизованным.
  await pb.collections.update("leads", {
    createRule: "",
    listRule: WRITE,
    viewRule: WRITE,
    updateRule: WRITE,
    deleteRule: WRITE,
  });
  console.log("✓ leads: create public, read/update — авторизованным");

  // 3a. bookings — read закрыт (PII), CRUD — editor. Сайт читает view.
  try {
    await pb.collections.update("bookings", BOOKINGS_RULES);
    console.log("✓ bookings: CRUD — авторизованным");
  } catch (err) {
    console.log(`• bookings коллекции ещё нет (запусти setup.ts): ${(err as Error).message}`);
  }

  // 4. Опциональный editor-пользователь.
  if (EDITOR_EMAIL && EDITOR_PASS) {
    const has = await pb.collection("editors").getList(1, 1, { filter: `email="${EDITOR_EMAIL}"` });
    if (has.totalItems === 0) {
      await pb.collection("editors").create({
        email: EDITOR_EMAIL,
        password: EDITOR_PASS,
        passwordConfirm: EDITOR_PASS,
        name: "Редактор",
      });
      console.log(`✓ editor создан: ${EDITOR_EMAIL}`);
    } else {
      console.log(`• editor ${EDITOR_EMAIL} уже есть`);
    }
  }

  console.log("done");
}

main().catch((e) => {
  console.error("✗", e?.message ?? e);
  process.exit(1);
});

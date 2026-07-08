/**
 * Сидинг PocketBase из content-as-code (ADR-012, фаза 8.2) — одноразовый перенос
 * web/src/shared/content/*.ts в PB. Чистый reseed: чистит коллекцию и заливает
 * заново. Фото пока остаются в web/public/ — в PB кладём пути (json/text), file-
 * поля добавим отдельной фазой.
 *
 * Запуск (PB на :8090, коллекции созданы setup.ts):
 *   PB_ADMIN_EMAIL=admin@more-minsk.local PB_ADMIN_PASS=… bun scripts/pb/seed.ts
 */
import PocketBase from "pocketbase";
import { CERTIFICATE } from "../../src/shared/content/certificates";
import { CONTACTS } from "../../src/shared/content/contacts";
import { DOCUMENTS } from "../../src/shared/content/documents";
import { FAQ } from "../../src/shared/content/faq";
import { INSTAGRAM_STORIES } from "../../src/shared/content/instagram-stories";
import { SERVICES } from "../../src/shared/content/services";
import { YACHTS } from "../../src/shared/content/yachts";

const URL = process.env.PB_URL ?? "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL ?? "admin@more-minsk.local";
const PASS = process.env.PB_ADMIN_PASS ?? "";

const pb = new PocketBase(URL);
pb.autoCancellation(false);

// Убираем undefined-поля, чтобы PB не спотыкался на optional (video/badge/…).
function clean<T extends Record<string, unknown>>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}

async function clearCollection(name: string): Promise<number> {
  const all = await pb.collection(name).getFullList({ fields: "id" });
  for (const r of all) await pb.collection(name).delete(r.id);
  return all.length;
}

async function seedList(name: string, rows: Array<Record<string, unknown>>): Promise<void> {
  console.log(`× ${name}: удалено ${await clearCollection(name)}`);
  let ok = 0;
  for (let i = 0; i < rows.length; i++) {
    await pb.collection(name).create(clean({ ...rows[i], order: i, published: true }));
    ok++;
  }
  console.log(`✓ ${name}: залито ${ok}`);
}

async function main() {
  if (!PASS) throw new Error("PB_ADMIN_PASS не задан");
  await pb.collection("_superusers").authWithPassword(EMAIL, PASS);
  console.log("✓ авторизован");

  await seedList(
    "yachts",
    YACHTS.map((y) => ({
      slug: y.slug,
      name: y.name,
      type: y.type,
      capacity: y.capacity,
      lengthMeters: y.lengthMeters,
      pricePerHour: y.pricePerHour,
      minHours: y.minHours,
      description: y.description,
      features: y.features,
      suitableFor: y.suitableFor,
      gallery: y.gallery,
      mainImage: y.mainImage,
      video: y.video,
      specs: y.specs,
      badge: y.badge,
    })),
  );

  await seedList(
    "services",
    SERVICES.map((s) => ({
      slug: s.slug,
      h1: s.h1,
      shortTitle: s.shortTitle,
      utp: s.utp,
      icon: s.icon,
      fromPrice: s.fromPrice,
      suitableYachts: s.suitableYachts,
    })),
  );

  await seedList(
    "faq",
    FAQ.map((f) => ({
      key: f.id,
      question: f.question,
      answer: f.answer,
      bullets: f.bullets,
      tags: f.tags,
    })),
  );

  await seedList(
    "documents",
    DOCUMENTS.map((d) => ({
      slug: d.slug,
      title: d.title,
      lead: d.lead,
      paragraphs: d.paragraphs,
    })),
  );

  await seedList(
    "instagram_stories",
    INSTAGRAM_STORIES.map((s) => ({
      key: s.id,
      cover: s.cover,
      caption: s.caption,
      author: s.author,
      date: s.date,
      url: s.url,
    })),
  );

  // Синглтоны — одна запись.
  await seedList("certificates", [
    {
      priceFrom: CERTIFICATE.priceFrom,
      season: CERTIFICATE.season,
      lead: CERTIFICATE.lead,
      offer: CERTIFICATE.offer,
      photos: CERTIFICATE.photos,
      photoAlts: (CERTIFICATE as { photoAlts?: unknown }).photoAlts,
      faq: (CERTIFICATE as { faq?: unknown }).faq,
    },
  ]);

  await seedList("contacts", [
    {
      phones: CONTACTS.phones,
      email: CONTACTS.email,
      telegram: CONTACTS.telegram,
      instagram: CONTACTS.instagram,
      viber: CONTACTS.viber,
      address: CONTACTS.address,
      legal: CONTACTS.legal,
    },
  ]);

  console.log("done");
}

main().catch((e) => {
  console.error("✗", e?.message ?? e);
  process.exit(1);
});

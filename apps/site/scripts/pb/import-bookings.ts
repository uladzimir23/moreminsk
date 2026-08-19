/**
 * Импорт исторических броней из xlsx-календаря в PB `bookings`.
 * Идемпотентно: (yacht, date, start, client_phone|raw) — уникальный ключ.
 * Прошедшие даты помечаются archived=true, чтобы не мешали календарю.
 *
 * Флаги:
 *   --file <path>   путь к CSV (из scripts/pb/parse-bookings-xlsx.py)
 *   --dry           не пишем в PB, только считаем
 *
 * Запуск:
 *   PB_ADMIN_EMAIL=… PB_ADMIN_PASS=… bun scripts/pb/import-bookings.ts \
 *     --file /tmp/bookings-dryrun.csv [--dry]
 */
import { readFileSync } from "node:fs";
import PocketBase from "pocketbase";

const URL = process.env.PB_URL ?? "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL ?? "admin@more-minsk.local";
const PASS = process.env.PB_ADMIN_PASS ?? "";

const args = process.argv.slice(2);
const filePath = args[args.indexOf("--file") + 1];
const DRY = args.includes("--dry");

if (!filePath) {
  console.error("--file <path> обязателен");
  process.exit(1);
}

type Row = {
  date: string;
  yacht: string;
  start: string;
  end: string;
  name: string;
  phone: string;
  guests: string;
  price: string;
  prepaid: string;
  source_agent: string;
  pay_note: string;
  raw: string;
};

function parseCsv(text: string): Row[] {
  // Мини-парсер CSV с поддержкой кавычек — стандартной библиотеки нет в bun/node
  // среды одинаковой формы; берём простую реализацию для наших полей.
  const lines: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQ = false;
  let i = 0;
  const s = text;
  while (i < s.length) {
    const c = s[i];
    if (inQ) {
      if (c === '"' && s[i + 1] === '"') {
        field += '"';
        i += 2;
        continue;
      }
      if (c === '"') {
        inQ = false;
        i++;
        continue;
      }
      field += c;
      i++;
    } else {
      if (c === '"') {
        inQ = true;
        i++;
      } else if (c === ",") {
        cur.push(field);
        field = "";
        i++;
      } else if (c === "\n" || c === "\r") {
        cur.push(field);
        field = "";
        if (cur.length > 1 || cur[0] !== "") lines.push(cur);
        cur = [];
        if (c === "\r" && s[i + 1] === "\n") i += 2;
        else i++;
      } else {
        field += c;
        i++;
      }
    }
  }
  if (field || cur.length) {
    cur.push(field);
    lines.push(cur);
  }
  const [header, ...rest] = lines;
  return rest.map((cols) => {
    const r: Record<string, string> = {};
    header.forEach((h, idx) => (r[h] = cols[idx] ?? ""));
    return r as unknown as Row;
  });
}

// Стабильный ключ для дедупа: (yacht, date, start, phone-or-raw-hash-16)
function hashKey(r: Row): string {
  const tail = r.phone || r.raw.slice(0, 32);
  return `${r.yacht}|${r.date}|${r.start}|${tail}`;
}

async function main() {
  if (!PASS) throw new Error("PB_ADMIN_PASS не задан");
  const pb = new PocketBase(URL);
  pb.autoCancellation(false);
  await pb.collection("_superusers").authWithPassword(EMAIL, PASS);
  console.log(`✓ авторизован (${URL})`);

  const csv = readFileSync(filePath, "utf8");
  const rows = parseCsv(csv);
  console.log(`✓ CSV: ${rows.length} строк`);

  // yacht name → id
  const yachts = await pb.collection("yachts").getFullList({ fields: "id,slug,name" });
  const yMap: Record<string, string> = {};
  for (const y of yachts) {
    yMap[y.name.toUpperCase()] = y.id;
    yMap[y.slug.toUpperCase()] = y.id;
  }
  console.log(
    `✓ Яхты в PB: ${Object.keys(yMap).length / 2} (${yachts.map((y) => y.name).join(", ")})`,
  );

  // Существующие записи — для дедупа
  const existing = await pb.collection("bookings").getFullList({
    fields: "id,date,start,client_phone,comment,yacht",
  });
  const existingKeys = new Set(
    existing.map((e) => {
      const yn = yachts.find((y) => y.id === e.yacht)?.name?.toUpperCase() ?? "?";
      const tail = e.client_phone || (e.comment ?? "").slice(0, 32);
      return `${yn}|${e.date}|${e.start}|${tail}`;
    }),
  );
  console.log(`✓ Существует в PB: ${existing.length} (дедуп-ключей: ${existingKeys.size})`);

  const today = new Date().toISOString().slice(0, 10);

  let created = 0;
  let skippedDup = 0;
  let skippedNoYacht = 0;
  const noYachtSample: string[] = [];
  let archivedCount = 0;

  for (const r of rows) {
    const yUp = r.yacht.toUpperCase();
    const yachtId = yMap[yUp];
    if (!yachtId) {
      skippedNoYacht++;
      if (noYachtSample.length < 3) noYachtSample.push(r.yacht);
      continue;
    }
    const key = hashKey({ ...r, yacht: yUp });
    if (existingKeys.has(key)) {
      skippedDup++;
      continue;
    }
    const archived = r.date < today;
    if (archived) archivedCount++;

    const payload = {
      yacht: yachtId,
      date: r.date,
      start: r.start,
      end: r.end,
      status: "booked",
      client_name: r.name,
      client_phone: r.phone,
      guests: r.guests ? parseInt(r.guests) : 0,
      price_total: r.price ? parseInt(r.price) : 0,
      prepaid: r.prepaid ? parseInt(r.prepaid) : 0,
      pay_note: r.pay_note,
      source: "excel-2026",
      source_agent: r.source_agent,
      comment: r.raw,
      archived,
    };

    if (!DRY) {
      try {
        await pb.collection("bookings").create(payload);
      } catch (err) {
        console.error(`✗ ${r.date} ${r.yacht} ${r.start}: ${(err as Error).message}`);
        continue;
      }
    }
    created++;
    existingKeys.add(key);
  }

  console.log("\n=== ИТОГ ===");
  console.log(`создано:            ${created}${DRY ? " (DRY, ничего не записано)" : ""}`);
  console.log(`из них архивных:    ${archivedCount}`);
  console.log(`пропущено (дубль):  ${skippedDup}`);
  console.log(
    `пропущено (нет яхты): ${skippedNoYacht}${noYachtSample.length ? " — " + [...new Set(noYachtSample)].join(", ") : ""}`,
  );
}

main().catch((e) => {
  console.error("✗", e?.message ?? e);
  process.exit(1);
});

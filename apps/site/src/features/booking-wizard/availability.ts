// Availability helper для BookingWizard: fetch занятых слотов из PB view
// `availability` (публичный read без PII) + расчёт свободных интервалов.

const PB_URL = "https://admin.more-minsk.by";

export type SlotBusy = { start: string; end: string; status: string };

// Кэш yacht slug → PB id (не тянем яхты повторно).
let yachtIdCache: Record<string, string> | null = null;

export async function resolveYachtId(slug: string): Promise<string | null> {
  if (yachtIdCache && yachtIdCache[slug.toLowerCase()]) {
    return yachtIdCache[slug.toLowerCase()];
  }
  try {
    const res = await fetch(`${PB_URL}/api/collections/yachts/records?fields=id,slug&perPage=50`);
    const data = (await res.json()) as { items: Array<{ id: string; slug: string }> };
    yachtIdCache = Object.fromEntries(data.items.map((y) => [y.slug.toLowerCase(), y.id]));
    return yachtIdCache[slug.toLowerCase()] ?? null;
  } catch {
    return null;
  }
}

export async function fetchBusyForDay(yachtId: string, date: string): Promise<SlotBusy[]> {
  const filter = encodeURIComponent(`yacht="${yachtId}" && date="${date}"`);
  const res = await fetch(
    `${PB_URL}/api/collections/availability/records?filter=${filter}&fields=start,end,status&perPage=200`,
  );
  const data = (await res.json()) as { items: SlotBusy[] };
  return data.items ?? [];
}

// Занятые дни за диапазон [dateFrom..dateTo] (YYYY-MM-DD). Возвращает
// map date → занятые слоты. Используется на шаге календаря.
export async function fetchBusyForRange(
  yachtId: string,
  dateFrom: string,
  dateTo: string,
): Promise<Record<string, SlotBusy[]>> {
  const filter = encodeURIComponent(
    `yacht="${yachtId}" && date>="${dateFrom}" && date<="${dateTo}"`,
  );
  const res = await fetch(
    `${PB_URL}/api/collections/availability/records?filter=${filter}&fields=start,end,date,status&perPage=500`,
  );
  const data = (await res.json()) as {
    items: Array<SlotBusy & { date: string }>;
  };
  const byDate: Record<string, SlotBusy[]> = {};
  for (const s of data.items ?? []) {
    (byDate[s.date] ??= []).push({ start: s.start, end: s.end, status: s.status });
  }
  return byDate;
}

// Мин/макс часы дня для поиска слотов (10:00..22:00, часовая гранулярность).
export const DAY_START = 10;
export const DAY_END = 22;

// Проверяет: есть ли в дне свободный подряд-интервал длиной ≥ minHours,
// начинающийся с любого часа 10..(22-minHours).
export function hasFreeInterval(busy: SlotBusy[], minHours: number): boolean {
  for (let h = DAY_START; h <= DAY_END - minHours; h++) {
    if (isRangeFree(busy, h, h + minHours)) return true;
  }
  return false;
}

// Проверяет: свободен ли интервал [startHour, endHour) полностью.
export function isRangeFree(busy: SlotBusy[], startHour: number, endHour: number): boolean {
  const start = startHour * 60;
  const end = endHour * 60;
  for (const s of busy) {
    const [sh, sm] = s.start.split(":").map(Number);
    const [eh, em] = s.end.split(":").map(Number);
    const sStart = sh * 60 + sm;
    const sEnd = eh * 60 + em;
    if (sStart < end && sEnd > start) return false;
  }
  return true;
}

// Час занят если пересекается с любым busy-интервалом.
export function isHourBusy(busy: SlotBusy[], hour: number): boolean {
  return !isRangeFree(busy, hour, hour + 1);
}

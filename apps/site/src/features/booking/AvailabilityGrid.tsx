"use client";

import { useEffect, useState } from "react";
import styles from "./AvailabilityGrid.module.scss";

// Виджет доступности слотов: fetch (yachtSlug + date) → показывает часовые
// кнопки 10:00–22:00, занятые дизейблит. При выборе — вызывает onSelect(time).
//
// Читает публичную view-коллекцию `availability` (только yacht/date/start/end/
// status, без PII). Yacht ID резолвим из `yachts` при первой загрузке.

const PB_URL = "https://admin.more-minsk.by";
const HOURS = Array.from({ length: 13 }, (_, i) => `${String(10 + i).padStart(2, "0")}:00`);

type Slot = { start: string; end: string; status: string };

type Props = {
  yachtSlug: string; // slug яхты (eva/alfa/bravo/mario/…)
  date: string; // YYYY-MM-DD
  value: string; // выбранное время HH:MM
  onChange: (time: string) => void;
};

// Кэш маппинга slug → id, чтобы не тянуть яхты повторно на каждый рендер.
let yachtIdCache: Record<string, string> | null = null;

async function fetchYachtIdBySlug(slug: string): Promise<string | null> {
  if (yachtIdCache && yachtIdCache[slug]) return yachtIdCache[slug];
  try {
    const res = await fetch(`${PB_URL}/api/collections/yachts/records?fields=id,slug&perPage=50`);
    const data = (await res.json()) as { items: Array<{ id: string; slug: string }> };
    yachtIdCache = Object.fromEntries(data.items.map((y) => [y.slug.toLowerCase(), y.id]));
    return yachtIdCache[slug.toLowerCase()] ?? null;
  } catch {
    return null;
  }
}

async function fetchTakenSlots(yachtId: string, date: string): Promise<Slot[]> {
  const filter = encodeURIComponent(`yacht="${yachtId}" && date="${date}"`);
  const res = await fetch(
    `${PB_URL}/api/collections/availability/records?filter=${filter}&fields=start,end,status&perPage=200`,
  );
  const data = (await res.json()) as { items: Slot[] };
  return data.items ?? [];
}

// Слот занят, если попадает в любой busy-интервал.
function isHourTaken(hour: string, slots: Slot[]): boolean {
  const [h] = hour.split(":").map(Number);
  const hourStart = h * 60;
  const hourEnd = hourStart + 60;
  for (const s of slots) {
    const [sh, sm] = s.start.split(":").map(Number);
    const [eh, em] = s.end.split(":").map(Number);
    const sStart = sh * 60 + sm;
    const sEnd = eh * 60 + em;
    if (sStart < hourEnd && sEnd > hourStart) return true;
  }
  return false;
}

export function AvailabilityGrid({ yachtSlug, date, value, onChange }: Props) {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!yachtSlug || !date) return;
    let cancelled = false;
    (async () => {
      // setLoading в async — не sync-в-эффекте (react-hooks/set-state-in-effect).
      setLoading(true);
      const yachtId = await fetchYachtIdBySlug(yachtSlug);
      if (!yachtId) {
        if (!cancelled) {
          setSlots([]);
          setLoading(false);
        }
        return;
      }
      const list = await fetchTakenSlots(yachtId, date);
      if (!cancelled) {
        setSlots(list);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [yachtSlug, date]);

  if (!date) return null;

  return (
    <div className={styles.grid} role="radiogroup" aria-label="Свободное время">
      {HOURS.map((h) => {
        const taken = slots ? isHourTaken(h, slots) : false;
        const selected = value === h;
        return (
          <button
            key={h}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`${styles.slot} ${taken ? styles.taken : ""} ${selected ? styles.selected : ""}`}
            disabled={taken || loading}
            onClick={() => onChange(h)}
            title={taken ? "Занято" : "Свободно"}
          >
            {h}
          </button>
        );
      })}
      {loading && <span className={styles.hint}>Проверяем занятость…</span>}
    </div>
  );
}

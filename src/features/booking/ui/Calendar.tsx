"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAvailabilityProvider, isDateBusy, type AvailabilitySlot } from "../model/availability";
import type { YachtSlug } from "../model/types";
import styles from "./Calendar.module.scss";

type Props = {
  value?: string;
  onChange: (date: string) => void;
  yachtSlug?: YachtSlug;
};

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

const MONTHS = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
] as const;

function toISO(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function Calendar({ value, onChange, yachtSlug }: Props) {
  const today = useMemo(() => startOfToday(), []);
  const initial = useMemo(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      return { year: y, month: m - 1 };
    }
    return { year: today.getFullYear(), month: today.getMonth() };
  }, [value, today]);

  const [view, setView] = useState(initial);
  const [busySlots, setBusySlots] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    const provider = getAvailabilityProvider();
    if (!provider.isRealtime) return;
    const from = toISO(view.year, view.month, 1);
    const lastDay = new Date(view.year, view.month + 1, 0).getDate();
    const to = toISO(view.year, view.month, lastDay);
    let active = true;
    provider.getSlots({ from, to, yachtSlug }).then((slots) => {
      if (active) setBusySlots(slots);
    });
    return () => {
      active = false;
    };
  }, [view.year, view.month, yachtSlug]);

  const cells = useMemo(() => {
    const firstOfMonth = new Date(view.year, view.month, 1);
    // Convert Sun=0..Sat=6 → Mon=0..Sun=6 for Russian week layout.
    const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const list: Array<{ day: number | null; iso: string | null }> = [];
    for (let i = 0; i < leadingBlanks; i += 1) {
      list.push({ day: null, iso: null });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      list.push({ day: d, iso: toISO(view.year, view.month, d) });
    }
    return list;
  }, [view.year, view.month]);

  const canGoPrev = useMemo(() => {
    const firstOfMonth = new Date(view.year, view.month, 1);
    const firstOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstOfMonth > firstOfCurrentMonth;
  }, [view, today]);

  const isPast = (iso: string) => new Date(iso) < today;
  const isToday = (iso: string) =>
    iso === toISO(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className={styles.root} role="group" aria-label="Календарь дат">
      <div className={styles.header}>
        <button
          type="button"
          className={styles.nav}
          aria-label="Предыдущий месяц"
          disabled={!canGoPrev}
          onClick={() => {
            const m = view.month - 1;
            if (m < 0) setView({ year: view.year - 1, month: 11 });
            else setView({ ...view, month: m });
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <div className={styles.month} aria-live="polite">
          {MONTHS[view.month]} {view.year}
        </div>
        <button
          type="button"
          className={styles.nav}
          aria-label="Следующий месяц"
          onClick={() => {
            const m = view.month + 1;
            if (m > 11) setView({ year: view.year + 1, month: 0 });
            else setView({ ...view, month: m });
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={styles.weekdays} aria-hidden="true">
        {WEEKDAYS.map((w) => (
          <div key={w} className={styles.weekday}>
            {w}
          </div>
        ))}
      </div>

      <div className={styles.grid} role="grid">
        {cells.map((cell, i) => {
          if (!cell.iso || cell.day === null) {
            return <span key={`e-${i}`} className={`${styles.cell} ${styles.cellEmpty}`} />;
          }
          const past = isPast(cell.iso);
          const busy = isDateBusy(busySlots, cell.iso);
          const disabled = past || busy;
          const selected = value === cell.iso;
          const classes = [styles.cell];
          if (isToday(cell.iso)) classes.push(styles.cellToday);
          if (selected) classes.push(styles.cellSelected);
          return (
            <button
              key={cell.iso}
              type="button"
              className={classes.join(" ")}
              disabled={disabled}
              aria-pressed={selected}
              aria-label={cell.iso}
              onClick={() => onChange(cell.iso!)}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

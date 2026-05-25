"use client";

import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import styles from "./DatePicker.module.scss";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const parseYmd = (s: string): Date | null => {
  const [y, m, d] = s.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
};

type Props = {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  id?: string;
  ariaLabel?: string;
  placeholder?: string;
};

// Custom date picker — Radix Popover + a hand-built month grid (Mon-first, ru
// labels, past dates disabled). Theme-aware; replaces the native date input.
export function DatePicker({
  value,
  onChange,
  id,
  ariaLabel,
  placeholder = "Выберите дату",
}: Props) {
  const selected = parseYmd(value);
  const [open, setOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view, setView] = useState(() => {
    const base = selected ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7; // Mon-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: firstOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const label = selected
    ? selected.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
    : placeholder;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        id={id}
        aria-label={ariaLabel}
        className={clsx(styles.trigger, !selected && styles.placeholder)}
      >
        <span>{label}</span>
        <CalendarDays size={16} className={styles.icon} aria-hidden="true" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className={styles.content} sideOffset={6} align="start">
          <div className={styles.head}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setView(new Date(year, month - 1, 1))}
              aria-label="Предыдущий месяц"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <span className={styles.monthLabel}>
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setView(new Date(year, month + 1, 1))}
              aria-label="Следующий месяц"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.weekdays}>
            {WEEKDAYS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>

          <div className={styles.grid}>
            {cells.map((day, i) => {
              if (day === null) return <span key={`blank-${i}`} aria-hidden="true" />;
              const d = new Date(year, month, day);
              const past = d < today;
              const isSelected = selected != null && ymd(d) === ymd(selected);
              const isToday = ymd(d) === ymd(today);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={past}
                  aria-pressed={isSelected}
                  className={clsx(
                    styles.day,
                    isSelected && styles.daySelected,
                    isToday && !isSelected && styles.dayToday,
                  )}
                  onClick={() => {
                    onChange(ymd(d));
                    setOpen(false);
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

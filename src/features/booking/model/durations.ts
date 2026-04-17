import { CalendarDays, Clock, Moon, Sun, type LucideIcon } from "lucide-react";
import type { DurationOption } from "./types";

export type DurationItem = {
  value: DurationOption;
  label: string;
  labelEn: string;
  note?: string;
  icon: LucideIcon;
};

export const DURATION_OPTIONS: readonly DurationItem[] = [
  { value: { kind: "hours", hours: 2 }, label: "2 часа", labelEn: "2 hours", icon: Clock },
  { value: { kind: "hours", hours: 3 }, label: "3 часа", labelEn: "3 hours", icon: Clock },
  {
    value: { kind: "hours", hours: 4 },
    label: "4 часа (полдня)",
    labelEn: "Half-day (4h)",
    icon: Clock,
  },
  { value: { kind: "hours", hours: 6 }, label: "6 часов", labelEn: "6 hours", icon: Clock },
  { value: { kind: "day" }, label: "День (8 часов)", labelEn: "Full day (8h)", icon: Sun },
  { value: { kind: "night" }, label: "Вечер / ночь", labelEn: "Evening / night", icon: Moon },
  {
    value: { kind: "multi-day" },
    label: "Больше дня (обсудим)",
    labelEn: "Multi-day (custom)",
    note: "Цена индивидуальная",
    icon: CalendarDays,
  },
] as const;

export type TimeSlotItem = {
  value: string;
  label: string;
};

export const TIME_SLOTS: readonly TimeSlotItem[] = [
  { value: "10:00", label: "10:00" },
  { value: "14:00", label: "14:00" },
  { value: "evening", label: "Вечер" },
  { value: "custom", label: "Обсудим" },
] as const;

export function durationLabel(d: DurationOption): string {
  const match = DURATION_OPTIONS.find((opt) => isSameDuration(opt.value, d));
  return match?.label ?? "—";
}

export function isSameDuration(a: DurationOption, b: DurationOption): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "hours" && b.kind === "hours") return a.hours === b.hours;
  return true;
}

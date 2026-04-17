import { YACHTS } from "@/shared/content/yachts";
import type { BookingDraft, DurationOption } from "./types";

export type PriceEstimate =
  | { kind: "exact"; total: number; currency: "BYN"; breakdown: string }
  | { kind: "on-request"; reason: string };

const DAY_HOURS = 8;

function durationToHours(d: DurationOption): number | null {
  if (d.kind === "hours") return d.hours;
  if (d.kind === "day") return DAY_HOURS;
  return null;
}

export function calcPrice(draft: BookingDraft): PriceEstimate {
  if (draft.package.kind === "turnkey") {
    return { kind: "on-request", reason: "Пакет «под ключ» — цена индивидуальная" };
  }
  if (!draft.yachtSlug || draft.yachtSlug === "any") {
    return { kind: "on-request", reason: "Яхту подберёт менеджер" };
  }
  if (!draft.duration) {
    return { kind: "on-request", reason: "Укажите длительность" };
  }
  const hours = durationToHours(draft.duration);
  if (hours === null) {
    const label = draft.duration.kind === "night" ? "вечер/ночь" : "несколько дней";
    return { kind: "on-request", reason: `Формат «${label}» — обсудим с менеджером` };
  }
  const yacht = YACHTS.find((y) => y.slug === draft.yachtSlug);
  if (!yacht) return { kind: "on-request", reason: "Яхта не найдена" };
  const total = yacht.pricePerHour * hours;
  return {
    kind: "exact",
    total,
    currency: "BYN",
    breakdown: `${yacht.pricePerHour} BYN/ч × ${hours} ч`,
  };
}

export function formatPrice(estimate: PriceEstimate): string {
  if (estimate.kind === "on-request") return "Рассчитает менеджер";
  return `${estimate.total.toLocaleString("ru-RU")} ${estimate.currency}`;
}

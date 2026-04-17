import type { YachtSlug } from "./types";

// AvailabilityProvider — pluggable interface (см. Booking Module.md § AvailabilityProvider).
// MVP: stub, который не знает про занятость. Подключение реального провайдера
// (Google Calendar iCal → Cal.com → свой backend) не требует правок в UI.

export type AvailabilityStatus = "available" | "partial" | "busy";

export interface AvailabilitySlot {
  date: string;
  yachtSlug?: YachtSlug;
  timeSlot?: string;
  status: AvailabilityStatus;
  reason?: string;
}

export interface AvailabilityQuery {
  from: string;
  to: string;
  yachtSlug?: YachtSlug;
}

export interface AvailabilityProvider {
  readonly name: string;
  readonly isRealtime: boolean;
  getSlots(query: AvailabilityQuery): Promise<AvailabilitySlot[]>;
}

export const mvpAvailabilityProvider: AvailabilityProvider = {
  name: "mvp-stub",
  isRealtime: false,
  async getSlots() {
    return [];
  },
};

export function getAvailabilityProvider(): AvailabilityProvider {
  return mvpAvailabilityProvider;
}

export function isDateBusy(slots: readonly AvailabilitySlot[], date: string): boolean {
  return slots.some((s) => s.date === date && s.status === "busy");
}

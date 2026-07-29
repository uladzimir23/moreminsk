// Booking form submission → PocketBase `leads` collection на admin.more-minsk.by.
// Static export → API routes нет; шлём напрямую с клиента через @moreminsk/pb-client.
// createRule на коллекции — публичный (см. apps/site/scripts/pb/roles.ts).

import { submitLead } from "@moreminsk/pb-client/leads/submit";

export type BookingPayload = {
  yacht: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  /** Optional повод когда лид пришёл со страницы услуги (без калькулятора). */
  service?: string;
};

// Оставляем класс — существующие consumers ловят его для fallback-сообщения.
// Больше не бросается (PB endpoint встроен), но интерфейс сохраняем на случай
// сетевых ошибок в клиенте.
export class BookingNotConfiguredError extends Error {
  constructor() {
    super("Booking endpoint is not configured.");
    this.name = "BookingNotConfiguredError";
  }
}

export async function submitBooking(payload: BookingPayload): Promise<void> {
  const message = [
    `Яхта: ${payload.yacht}`,
    `Дата: ${payload.date || "—"}`,
    `Время: ${payload.time || "—"}`,
    ...(payload.service ? [`Повод: ${payload.service}`] : []),
  ].join("\n");

  await submitLead({
    source: "booking",
    name: payload.name,
    phone: payload.phone,
    message,
    date: payload.date || undefined,
    yachtSlug: payload.yacht,
    meta: {
      time: payload.time,
      ...(payload.service ? { service: payload.service } : {}),
    },
  });
}

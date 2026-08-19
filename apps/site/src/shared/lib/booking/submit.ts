// Booking form submission → PocketBase `leads` collection на admin.more-minsk.by.
// Static export → API routes нет; шлём напрямую с клиента через @moreminsk/pb-client.
// createRule на коллекции — публичный (см. apps/site/scripts/pb/roles.ts).
// PB-хук `pb_hooks/leads-telegram.pb.js` уведомляет группу в Telegram.

import { submitLead } from "@moreminsk/pb-client/leads/submit";

export type BookingPayload = {
  yacht: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  /** Optional повод когда лид пришёл со страницы услуги (без калькулятора). */
  service?: string;
  /** Wizard: длительность в часах (для расчёта end и total). */
  durationHours?: number;
  /** Wizard: кол-во гостей. */
  guests?: number;
  /** Wizard: рассчитанная итоговая цена BYN. */
  priceTotal?: number;
  /** Wizard: клиентский комментарий (особые пожелания). */
  comment?: string;
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
  // Собираем структурированный comment: время, длительность, цена и
  // клиентские заметки. PB-хук leads-to-booking.pb.js парсит эти поля
  // (Время / Длительность), TG-хук вставляет всё в сообщение как есть.
  const lines: string[] = [];
  if (payload.time) lines.push(`Время: ${payload.time}`);
  if (payload.durationHours) lines.push(`Длительность: ${payload.durationHours}ч`);
  if (payload.priceTotal) lines.push(`Итого: ${payload.priceTotal} BYN`);
  if (payload.comment?.trim()) lines.push(`Комментарий: ${payload.comment.trim()}`);

  await submitLead({
    source: "booking",
    name: payload.name,
    phone: payload.phone,
    yacht: payload.yacht,
    service: payload.service,
    date: payload.date || undefined,
    guests: payload.guests,
    comment: lines.join("\n"),
  });
}
